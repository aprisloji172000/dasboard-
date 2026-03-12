const adminWhatsApp = "6281234567890";

const menuItems = [
  { id: "nasi-goreng-original", name: "Nasi Goreng Original", price: 18000 },
  { id: "nasi-goreng-seafood", name: "Nasi Goreng Seafood", price: 24000 },
  { id: "mie-goreng-spesial", name: "Mie Goreng Spesial", price: 20000 },
  { id: "kwetiau-goreng", name: "Kwetiau Goreng", price: 22000 },
  { id: "teh-manis", name: "Es/Teh Manis", price: 5000 },
  { id: "jeruk", name: "Es Jeruk", price: 7000 }
];

const cart = new Map();

function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
}

function renderMenu() {
  const container = document.getElementById("menuContainer");
  container.innerHTML = "";

  menuItems.forEach((item) => {
    const wrapper = document.createElement("article");
    wrapper.className = "card menu-item";
    wrapper.innerHTML = `
      <strong>${item.name}</strong>
      <span class="price">${formatRupiah(item.price)}</span>
      <div style="display:flex;gap:.4rem;">
        <button class="btn btn-outline" data-action="minus" data-id="${item.id}">-</button>
        <span id="qty-${item.id}" style="padding:.5rem 0.4rem;min-width:22px;text-align:center;">0</span>
        <button class="btn btn-primary" data-action="plus" data-id="${item.id}">+</button>
      </div>
    `;
    container.appendChild(wrapper);
  });

  container.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const action = target.dataset.action;
    const id = target.dataset.id;
    if (!action || !id) return;

    const current = cart.get(id) || 0;
    if (action === "plus") cart.set(id, current + 1);
    if (action === "minus" && current > 0) cart.set(id, current - 1);
    updateSummary();
  });
}

function getSelectedItems() {
  return menuItems
    .map((item) => ({ ...item, qty: cart.get(item.id) || 0 }))
    .filter((item) => item.qty > 0);
}

function updateSummary() {
  let total = 0;
  const selected = getSelectedItems();

  menuItems.forEach((item) => {
    const qty = cart.get(item.id) || 0;
    const qtyEl = document.getElementById(`qty-${item.id}`);
    if (qtyEl) qtyEl.textContent = String(qty);
  });

  if (selected.length === 0) {
    document.getElementById("orderSummary").textContent = "Belum ada item dipilih.";
    document.getElementById("totalPrice").textContent = "Total: Rp0";
    return;
  }

  const lines = selected.map((item) => {
    const subtotal = item.price * item.qty;
    total += subtotal;
    return `${item.name} x${item.qty} = ${formatRupiah(subtotal)}`;
  });

  document.getElementById("orderSummary").innerHTML = lines.join("<br>");
  document.getElementById("totalPrice").textContent = `Total: ${formatRupiah(total)}`;
}

function currentWarungStatus() {
  const hour = new Date().getHours();
  return hour >= 17 && hour <= 23 ? "buka" : "tutup";
}

function setupWarungStatusRealtime() {
  const statusLabel = document.getElementById("statusLabel");
  db.ref("warungStatus").on("value", (snapshot) => {
    const manualStatus = snapshot.val() || "auto";
    const isOpen = manualStatus === "habis" ? false : currentWarungStatus() === "buka";

    statusLabel.textContent = isOpen ? "Warung Buka" : "Warung Tutup / Habis";
    statusLabel.style.background = isOpen ? "#16a34a" : "#dc2626";
  });
}

function submitOrder() {
  const name = document.getElementById("customerName").value.trim();
  const phone = document.getElementById("customerPhone").value.trim();
  const address = document.getElementById("customerAddress").value.trim();
  const deliveryType = document.getElementById("deliveryType").value;
  const selectedItems = getSelectedItems();

  if (!name || !phone || selectedItems.length === 0) {
    alert("Isi nama, WA, dan pilih minimal 1 menu.");
    return;
  }

  const total = selectedItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  const order = {
    customerName: name,
    customerPhone: phone,
    customerAddress: address,
    deliveryType,
    items: selectedItems,
    total,
    status: "Menunggu",
    createdAt: Date.now()
  };

  db.ref("orders").push(order).then(() => {
    const lines = selectedItems.map((item) => `- ${item.name} x${item.qty}`).join("%0A");
    const message = `Halo Admin, saya ingin pesan:%0A%0ANama: ${encodeURIComponent(name)}%0AWA: ${encodeURIComponent(phone)}%0AMetode: ${encodeURIComponent(deliveryType)}%0AAlamat: ${encodeURIComponent(address || "-")}%0A%0AItem:%0A${lines}%0A%0ATotal: ${encodeURIComponent(formatRupiah(total))}`;
    window.open(`https://wa.me/${adminWhatsApp}?text=${message}`, "_blank");
    alert("Pesanan tersimpan. Anda akan diarahkan ke WhatsApp admin.");
  });
}

renderMenu();
updateSummary();
setupWarungStatusRealtime();
document.getElementById("submitOrderBtn").addEventListener("click", submitOrder);
