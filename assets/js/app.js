const ADMIN_WA = '6285182518826';
const MIN_FREE_ONGKIR = 50000;

const menuData = [
  { id: 1, name: 'Nasi Goreng', price: 10000, icon: '🍳', hasOptions: true, category: 'makanan' },
  { id: 2, name: 'Mie Goreng', price: 10000, icon: '🍜', hasOptions: true, category: 'makanan' },
  { id: 8, name: 'Mawut', price: 10000, icon: '🍳', hasOptions: true, category: 'makanan' },
  { id: 3, name: 'Es Teh', price: 3000, icon: '🍹', hasOptions: false, category: 'minuman' },
  { id: 4, name: 'Teh Panas', price: 3000, icon: '☕', hasOptions: false, category: 'minuman' },
  { id: 5, name: 'Es Jeruk', price: 3000, icon: '🥤', hasOptions: false, category: 'minuman' },
  { id: 6, name: 'Jeruk Panas', price: 3000, icon: '🍵', hasOptions: false, category: 'minuman' },
  { id: 7, name: 'Kerupuk', price: 1000, icon: '🍘', hasOptions: false, category: 'makanan' },
];

const state = {
  cart: [],
};

const elements = {
  menuGrid: document.getElementById('menuGrid'),
  cartItems: document.getElementById('cartItems'),
  cartTotal: document.getElementById('cartTotal'),
  cartCount: document.getElementById('cartCount'),
  shippingStatus: document.getElementById('shippingStatus'),
  cartSidebar: document.getElementById('cartSidebar'),
  overlay: document.getElementById('overlay'),
  checkoutModal: document.getElementById('checkoutModal'),
  custName: document.getElementById('custName'),
  custAddr: document.getElementById('custAddr'),
  custLoc: document.getElementById('custLoc'),
};

function formatRupiah(value) {
  return `Rp ${value.toLocaleString('id-ID')}`;
}

function renderMenu() {
  elements.menuGrid.innerHTML = menuData
    .map(
      (item) => `
        <article class="menu-card">
          <div class="menu-image">${item.icon}</div>
          <div class="menu-content">
            <h3 class="menu-name">${item.name}</h3>
            <div class="menu-price">${formatRupiah(item.price)}</div>

            ${
              item.hasOptions
                ? `
              <div class="menu-options">
                <div class="option-group">
                  <label for="pedas-${item.id}">Rasa:</label>
                  <select id="pedas-${item.id}" class="option-select">
                    <option value="Biasa">Biasa</option>
                    <option value="Pedas">Pedas</option>
                  </select>
                </div>
                <div class="option-group">
                  <label for="telur-${item.id}">Ekstra Telur (+3rb):</label>
                  <select id="telur-${item.id}" class="option-select">
                    <option value="Tidak">Tidak Pakai</option>
                    <option value="Ceplok">Telur Ceplok</option>
                    <option value="Dadar">Telur Dadar</option>
                  </select>
                </div>
              </div>
            `
                : '<div class="option-spacer"></div>'
            }

            <button class="add-btn" type="button" data-add-id="${item.id}">Tambah ke Keranjang</button>
          </div>
        </article>
      `,
    )
    .join('');
}

function addToCart(id) {
  const item = menuData.find((menu) => menu.id === id);
  if (!item) return;

  let finalPrice = item.price;
  let note = '';

  if (item.hasOptions) {
    const pedas = document.getElementById(`pedas-${id}`).value;
    const telur = document.getElementById(`telur-${id}`).value;

    note = `(${pedas}`;
    if (telur !== 'Tidak') {
      finalPrice += 3000;
      note += `, +Telur ${telur}`;
    }
    note += ')';
  }

  const cartKey = item.name + note;
  const existingItem = state.cart.find((cartItem) => cartItem.name + cartItem.note === cartKey);

  if (existingItem) {
    existingItem.qty += 1;
  } else {
    state.cart.push({ ...item, price: finalPrice, note, qty: 1 });
  }

  updateCart();
}

function changeQty(index, delta) {
  state.cart[index].qty += delta;
  if (state.cart[index].qty <= 0) {
    state.cart.splice(index, 1);
  }
  updateCart();
}

function updateCart() {
  let totalBelanja = 0;
  let totalQty = 0;

  if (state.cart.length === 0) {
    elements.cartItems.innerHTML = `
      <div class="empty-cart">
        <i class="fas fa-shopping-basket"></i>
        <p>Keranjang masih kosong</p>
      </div>
    `;
    elements.shippingStatus.innerHTML = '';
  } else {
    elements.cartItems.innerHTML = state.cart
      .map((item, index) => {
        totalBelanja += item.price * item.qty;
        totalQty += item.qty;

        return `
          <div class="cart-item">
            <div class="cart-item-row">
              <div>
                <strong class="cart-item-title">${item.name}</strong><br>
                <small class="cart-item-note">${item.note}</small><br>
                <span class="cart-item-price">${formatRupiah(item.price * item.qty)}</span>
              </div>
              <div class="qty-control">
                <button class="qty-button" type="button" data-qty-index="${index}" data-qty-delta="-1">-</button>
                <span class="qty-value">${item.qty}</span>
                <button class="qty-button" type="button" data-qty-index="${index}" data-qty-delta="1">+</button>
              </div>
            </div>
          </div>
        `;
      })
      .join('');

    if (totalBelanja >= MIN_FREE_ONGKIR) {
      elements.shippingStatus.innerHTML = `
        <div class="shipping-info shipping-free">
          <i class="fas fa-truck-moving"></i> Mantap! Anda dapat <b>GRATIS ONGKIR (Senduro)</b>
        </div>
      `;
    } else {
      const kurangnya = MIN_FREE_ONGKIR - totalBelanja;
      elements.shippingStatus.innerHTML = `
        <div class="shipping-info">
          Belanja <b>${formatRupiah(kurangnya)} lagi</b> untuk Gratis Ongkir
        </div>
      `;
    }
  }

  if (state.cart.length > 0 && totalBelanja === 0) {
    totalBelanja = state.cart.reduce((total, item) => total + item.price * item.qty, 0);
    totalQty = state.cart.reduce((qty, item) => qty + item.qty, 0);
  }

  elements.cartTotal.innerText = formatRupiah(totalBelanja);
  elements.cartCount.innerText = totalQty;
}

function toggleCart() {
  elements.cartSidebar.classList.toggle('open');
  elements.overlay.classList.toggle('show');
}

function openCheckout() {
  if (state.cart.length === 0) {
    alert('Pilih menu dulu ya!');
    return;
  }

  elements.checkoutModal.classList.add('show');
  elements.checkoutModal.setAttribute('aria-hidden', 'false');
}

function closeCheckout() {
  elements.checkoutModal.classList.remove('show');
  elements.checkoutModal.setAttribute('aria-hidden', 'true');
}

function getLocation() {
  if (!navigator.geolocation) {
    alert('Browser tidak mendukung fitur lokasi.');
    return;
  }

  elements.custLoc.value = 'Sedang mengambil lokasi...';

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      elements.custLoc.value = `https://www.google.com/maps?q=${latitude},${longitude}`;
      alert('Lokasi berhasil diambil!');
    },
    () => {
      alert('Gagal mengambil lokasi. Pastikan GPS aktif dan izin diberikan.');
      elements.custLoc.value = '';
    },
  );
}

function sendWhatsApp() {
  const name = elements.custName.value.trim();
  const addr = elements.custAddr.value.trim();
  const loc = elements.custLoc.value.trim();

  if (!name || !addr) {
    alert('Harap isi nama dan alamat pengiriman!');
    return;
  }

  const now = new Date();
  const jam = now.getHours().toString().padStart(2, '0');
  const menit = now.getMinutes().toString().padStart(2, '0');
  const detik = now.getSeconds().toString().padStart(2, '0');
  const noAntrian = `WD-${jam}${menit}${detik}`;

  let totalBelanja = 0;
  const makananArr = [];
  const minumanArr = [];

  state.cart.forEach((item) => {
    totalBelanja += item.price * item.qty;

    const formattedNote = item.note
      .replace(/Pedas/g, '*Pedas*')
      .replace(/Biasa/g, '*Biasa*')
      .replace(/Ceplok/g, '*Ceplok*')
      .replace(/Dadar/g, '*Dadar*');

    const itemString = `✅ ${item.qty}x ${item.name.toUpperCase()} ${formattedNote}`;

    if (item.category === 'makanan') {
      makananArr.push(itemString);
    } else {
      minumanArr.push(itemString);
    }
  });

  let msg = `*NOMOR ANTRIAN: ${noAntrian}*\n`;
  msg += '----------------------------------\n\n';
  msg += `*Nama:* ${name}\n`;
  msg += `*Alamat:* ${addr}\n`;
  if (loc) {
    msg += `*Maps:* ${loc}\n\n`;
  }

  msg += '*DAFTAR PESANAN*\n';

  if (makananArr.length > 0) {
    msg += `\n*--- MAKANAN ---*\n${makananArr.join('\n')}`;
  }

  if (minumanArr.length > 0) {
    msg += `\n\n*--- MINUMAN ---*\n${minumanArr.join('\n')}`;
  }

  msg += '\n\n----------------------------------\n';
  msg += `*TOTAL TAGIHAN: ${formatRupiah(totalBelanja)}*\n`;
  msg += `*ONGKIR:* ${totalBelanja >= MIN_FREE_ONGKIR ? '*GRATIS*' : 'BAYAR DI TEMPAT'}`;
  msg += '\n\n_Catatan: Saat pengambilan pesanan dimohon menyertakan Nomor Antrian._';

  const url = `https://wa.me/${ADMIN_WA}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');

  state.cart = [];
  updateCart();
  closeCheckout();
  toggleCart();
}

function setupEventListeners() {
  document.getElementById('cartButton').addEventListener('click', toggleCart);
  document.getElementById('closeCartButton').addEventListener('click', toggleCart);
  document.getElementById('overlay').addEventListener('click', toggleCart);

  document.getElementById('checkoutButton').addEventListener('click', openCheckout);
  document.getElementById('cancelCheckoutButton').addEventListener('click', closeCheckout);
  document.getElementById('locationButton').addEventListener('click', getLocation);
  document.getElementById('sendWaButton').addEventListener('click', sendWhatsApp);

  elements.menuGrid.addEventListener('click', (event) => {
    const button = event.target.closest('[data-add-id]');
    if (!button) return;
    addToCart(Number(button.dataset.addId));
  });

  elements.cartItems.addEventListener('click', (event) => {
    const button = event.target.closest('[data-qty-index]');
    if (!button) return;

    changeQty(Number(button.dataset.qtyIndex), Number(button.dataset.qtyDelta));
  });
}

function init() {
  renderMenu();
  updateCart();
  setupEventListeners();
}

init();
