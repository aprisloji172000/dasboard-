# Web Warung Nasi Goreng (Struktur Rapi)

Project ini sudah dipisah menjadi beberapa folder agar mudah dikembangkan:

```text
.
├── index.html                 # Portal utama (pilih pelanggan/admin + QR)
├── pelanggan/
│   └── index.html             # Halaman pemesanan pelanggan
├── admin/
│   └── index.html             # Dashboard admin realtime
└── assets/
    ├── css/
    │   └── styles.css         # Gaya umum responsif
    └── js/
        ├── firebase-config.js # Konfigurasi Firebase Realtime DB
        ├── pelanggan.js       # Logic pemesanan pelanggan
        └── admin.js           # Logic dashboard admin
```

## Fitur utama

- **Pelanggan**: pilih menu, isi data, checkout, lalu diarahkan ke WhatsApp admin.
- **Admin**: lihat pesanan realtime, ubah status warung, tandai pesanan selesai.
- **Responsif**: bisa dipakai di HP dan komputer.
- **QR Code**: tersedia di halaman utama sebagai contoh untuk ditempel di warung.

## Konfigurasi yang perlu Anda ubah

1. **Nomor WhatsApp admin**
   - File: `assets/js/pelanggan.js`
   - Ubah nilai `adminWhatsApp` sesuai nomor WA admin Anda.

2. **Link QR code pelanggan**
   - File: `index.html`
   - Ubah URL pada gambar QR agar mengarah ke domain website Anda.

3. **Keamanan admin**
   - File: `assets/js/admin.js`
   - Ubah nilai `adminPassword`.

4. **Firebase Rules (disarankan)**
   - Saat ini contoh memakai akses Realtime Database sederhana.
   - Untuk produksi, gunakan aturan keamanan Firebase yang lebih ketat.

## Cara jalankan lokal

Karena ini web statis, bisa langsung dibuka di browser. Jika mau lebih aman (menghindari batasan browser), pakai server lokal:

```bash
python3 -m http.server 8080
```

Lalu buka:

- `http://localhost:8080/`
- `http://localhost:8080/pelanggan/`
- `http://localhost:8080/admin/`
