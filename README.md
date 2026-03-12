# Warung Digital (Dashboard Pemesanan)

Aplikasi web sederhana untuk pemesanan menu warung secara online, dilengkapi keranjang belanja, opsi menu (pedas/telur), cek gratis ongkir, pengambilan lokasi, dan checkout ke WhatsApp.

## Fitur Utama

- **Daftar menu dinamis** dari data JavaScript (`menuData`).
- **Keranjang belanja interaktif** (tambah item, ubah jumlah, hapus otomatis saat qty 0).
- **Kalkulasi total belanja otomatis** dengan format Rupiah.
- **Status ongkir** berdasarkan batas minimal belanja (`MIN_FREE_ONGKIR`).
- **Modal checkout** untuk input nama, alamat, dan link lokasi.
- **Ambil lokasi otomatis** via Geolocation API browser.
- **Generate pesan WhatsApp** terstruktur untuk admin warung.

## Struktur Proyek

```text
.
├── index.html
├── assets
│   ├── css
│   │   └── styles.css
│   └── js
│       └── app.js
└── README.md
```

## Penempatan Kode (Best Practice)

- `index.html`
  - Fokus pada **struktur semantik** halaman (header, main, section, aside, modal).
  - Tidak menyimpan CSS/JS besar secara inline.
- `assets/css/styles.css`
  - Seluruh styling dan design token (`:root`) ditempatkan di sini.
  - Gunakan class yang konsisten agar mudah dirawat.
- `assets/js/app.js`
  - Seluruh logika interaksi UI dan bisnis (cart, checkout, WhatsApp).
  - Event handling menggunakan `addEventListener` dan event delegation.

## Cara Menjalankan Lokal

### Opsi 1: Buka langsung

Cukup buka file `index.html` di browser.

### Opsi 2: Jalankan lewat local server (disarankan)

```bash
python3 -m http.server 4173 --bind 0.0.0.0
```

Lalu akses:

```text
http://127.0.0.1:4173/index.html
```

## Konfigurasi yang Bisa Diubah

Di `assets/js/app.js`:

- `ADMIN_WA`: nomor WhatsApp tujuan checkout.
- `MIN_FREE_ONGKIR`: batas minimal belanja untuk gratis ongkir.
- `menuData`: daftar produk/menu, harga, kategori, dan opsi tambahan.

## Etika Coding yang Diterapkan

- **Separation of Concerns**: HTML, CSS, JS dipisah jelas.
- **Readability**: penamaan variabel/class konsisten dan mudah dipahami.
- **Maintainability**: struktur folder sederhana, mudah dikembangkan.
- **Scalability**: mudah menambah menu/fitur tanpa mengubah seluruh file.

## Rencana Pengembangan Lanjutan (Opsional)

- Simpan keranjang ke `localStorage`.
- Tambahkan validasi form yang lebih ketat.
- Tambahkan filter kategori makanan/minuman.
- Pisahkan logic JS ke beberapa modul (cart, checkout, utils).
- Tambahkan unit test untuk fungsi utilitas.

---

Jika Anda ingin, saya juga bisa lanjutkan dengan membuat:

1. **CONTRIBUTING.md** (aturan kontribusi),
2. **CHANGELOG.md** (riwayat perubahan),
3. template issue/PR agar proyek lebih profesional.
