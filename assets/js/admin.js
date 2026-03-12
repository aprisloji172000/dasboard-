const adminPassword = "1973";

function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
}

function askAuth() {
  const pass = prompt("Masukkan kode admin:");
  return pass === adminPassword;
}

function setWarungStatus(mode) {
  if (!askAuth()) {
    alert("Kode admin salah.");
    return;
  }

  db.ref("warungStatus").set(mode).then(() => {
    alert("Status warung berhasil diperbarui.");
  });
}

function markDone(orderId) {
  if (!askAuth()) {
    alert("Kode admin salah.");
    return;
  }

  db.ref(`orders/${orderId}/status`).set("Selesai");
}

function renderOrders(snapshotValue) {
  const tbody = document.getElementById("ordersTableBody");
  tbody.innerHTML = "";

  const entries = Object.entries(snapshotValue || {}).reverse();
  let totalOrders = 0;
  let pendingOrders = 0;
  let omzet = 0;

  entries.forEach(([id, order]) => {
    totalOrders += 1;
    if (order.status !== "Selesai") pendingOrders += 1;
    omzet += order.total || 0;

    const tr = document.createElement("tr");
    const items = (order.items || []).map((item) => `${item.name} x${item.qty}`).join("<br>");
    const badgeClass = order.status === "Selesai" ? "done" : "pending";

    tr.innerHTML = `
      <td>${new Date(order.createdAt).toLocaleString("id-ID")}</td>
      <td>
        <strong>${order.customerName || "-"}</strong><br>
        <span class="muted">${order.customerPhone || ""}</span><br>
        <span class="muted">${order.deliveryType || ""}</span>
      </td>
      <td>${items || "-"}<br><span class="muted">${order.customerAddress || ""}</span></td>
      <td>${formatRupiah(order.total || 0)}</td>
      <td><span class="badge ${badgeClass}">${order.status || "Menunggu"}</span></td>
      <td>${order.status === "Selesai" ? "-" : `<button class="btn btn-primary" data-id="${id}">Tandai Selesai</button>`}</td>
    `;
    tbody.appendChild(tr);
  });

  document.getElementById("totalOrder").textContent = `Total pesanan: ${totalOrders}`;
  document.getElementById("pendingOrder").textContent = `Menunggu: ${pendingOrders}`;
  document.getElementById("omzet").textContent = `Omzet: ${formatRupiah(omzet)}`;

  tbody.querySelectorAll("button[data-id]").forEach((btn) => {
    btn.addEventListener("click", () => markDone(btn.dataset.id));
  });
}

document.getElementById("setAuto").addEventListener("click", () => setWarungStatus("auto"));
document.getElementById("setHabis").addEventListener("click", () => setWarungStatus("habis"));

// realtime order listener
db.ref("orders").on("value", (snapshot) => {
  renderOrders(snapshot.val());
});
