(function runDashboardApp() {
  const tabButtons = Array.from(document.querySelectorAll(".tab-btn"));
  const sections = Array.from(document.querySelectorAll(".section"));

  const menuInput = document.getElementById("m-menu");
  const rasaInput = document.getElementById("m-rasa");
  const qtyInput = document.getElementById("m-qty");
  const submitButton = document.getElementById("btn-kirim");

  const antrianList = document.getElementById("list-antrian");
  const riwayatList = document.getElementById("list-riwayat");

  function openTab(tabName) {
    sections.forEach((section) => section.classList.toggle("active", section.id === tabName));
    tabButtons.forEach((button) => {
      const isActive = button.dataset.tabTarget === tabName;
      button.classList.toggle("active", isActive);
    });
  }

  function createEmptyNote(text) {
    const note = document.createElement("p");
    note.className = "empty-note";
    note.textContent = text;
    return note;
  }

  function splitPortions(totalPortion, maxPortionPerOrder) {
    const chunks = [];
    let remaining = totalPortion;

    while (remaining > 0) {
      const chunk = Math.min(remaining, maxPortionPerOrder);
      chunks.push(chunk);
      remaining -= chunk;
    }

    return chunks;
  }

  function kirimKeDapur() {
    const menu = menuInput.value;
    const rasa = rasaInput.value;
    const qty = Number.parseInt(qtyInput.value, 10);

    if (!Number.isInteger(qty) || qty < 1) {
      alert("Isi jumlah porsi dengan angka minimal 1.");
      return;
    }

    const portions = splitPortions(qty, 5);

    portions.forEach((porsi) => {
      window.db.ref("antrian").push({
        menu,
        rasa,
        porsi,
        timestamp: Date.now(),
        status: "pending"
      });
    });

    alert("Pesanan masuk ke dapur.");
    qtyInput.value = "";
  }

  function renderAntrian(data) {
    antrianList.replaceChildren();

    if (!data || Object.keys(data).length === 0) {
      antrianList.appendChild(createEmptyNote("Belum ada antrian untuk dimasak."));
      return;
    }

    Object.entries(data).forEach(([id, item]) => {
      const card = document.createElement("article");
      card.className = `order-card ${item.rasa}`;

      const title = document.createElement("p");
      title.className = "order-title";
      title.textContent = item.menu.toUpperCase();

      const rasa = document.createElement("span");
      rasa.className = `order-rasa ${item.rasa}`;
      rasa.textContent = item.rasa;

      const porsi = document.createElement("h3");
      porsi.className = "order-porsi";
      porsi.textContent = `MASAK: ${item.porsi} PORSI`;

      const doneButton = document.createElement("button");
      doneButton.className = "btn-done";
      doneButton.textContent = "SELESAI / ANGKAT";
      doneButton.addEventListener("click", () => selesaiMasak(id));

      card.append(title, rasa, porsi, doneButton);
      antrianList.appendChild(card);
    });
  }

  function selesaiMasak(id) {
    window.db.ref(`antrian/${id}`).once("value", (snapshot) => {
      const data = snapshot.val();

      if (!data) {
        return;
      }

      window.db.ref("history").push({
        ...data,
        doneAt: new Date().toLocaleString("id-ID")
      });

      window.db.ref(`antrian/${id}`).remove();
    });
  }

  function renderRiwayat(data) {
    riwayatList.replaceChildren();

    if (!data || Object.keys(data).length === 0) {
      riwayatList.appendChild(createEmptyNote("Riwayat masih kosong."));
      return;
    }

    Object.values(data)
      .reverse()
      .forEach((item) => {
        const row = document.createElement("div");
        row.className = "riwayat-item";
        row.textContent = `✅ ${item.menu} (${item.porsi} porsi) - ${item.rasa} | ${item.doneAt}`;
        riwayatList.appendChild(row);
      });
  }

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      openTab(button.dataset.tabTarget);
    });
  });

  submitButton.addEventListener("click", kirimKeDapur);

  window.db.ref("antrian").on("value", (snapshot) => {
    renderAntrian(snapshot.val());
  });

  window.db.ref("history").limitToLast(30).on("value", (snapshot) => {
    renderRiwayat(snapshot.val());
  });
})();
