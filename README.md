# Dashboard Nasi & Mie Goreng Cak Kapit

Landing dashboard sederhana untuk menampilkan status warung **buka/tutup/habis** secara realtime menggunakan **Firebase Realtime Database**.

## Tujuan Perapihan
Kode awal masih bercampur dalam satu file (`index.html`) dengan CSS/JS inline. Struktur sekarang dipisah agar:
- lebih mudah dipelihara,
- lebih rapi untuk kolaborasi,
- mengikuti etika coding dasar (separation of concerns).

## Struktur Folder

```text
.
├── index.html
├── README.md
└── assets
    ├── css
    │   └── style.css
    └── js
        └── app.js
```

## Penempatan Kode yang Disarankan

### 1) `index.html`
Berisi:
- struktur markup utama,
- pemanggilan CDN eksternal (Font Awesome, Firebase),
- pemanggilan file lokal `assets/css/style.css` dan `assets/js/app.js`.

### 2) `assets/css/style.css`
Berisi seluruh styling:
- variabel warna,
- layout header, card, grid menu,
- style tombol admin,
- class utilitas tampilan dashboard.

### 3) `assets/js/app.js`
Berisi seluruh logika interaktif:
- inisialisasi Firebase,
- sinkronisasi status warung dari database,
- update jam realtime,
- validasi password admin,
- aksi tombol `SET HABIS`, `MODE OTOMATIS`, dan `Dapur Live`.

## Cara Menjalankan Lokal
Karena ini proyek static, cukup gunakan HTTP server sederhana.

### Opsi Python
```bash
python3 -m http.server 8080
```
Lalu buka: `http://localhost:8080`

## Etika Coding yang Diterapkan

1. **Pisahkan tanggung jawab file**
   - HTML untuk struktur,
   - CSS untuk presentasi,
   - JS untuk logika.

2. **Penamaan konsisten**
   - class CSS menggunakan gaya deskriptif (`.admin-panel`, `.grid-menu`).

3. **Hindari inline style dan inline script panjang**
   - memudahkan debugging & scaling.

4. **Gunakan konstanta untuk nilai penting**
   - contoh: jam buka, status mode, password admin.

5. **Akses elemen DOM secara terpusat**
   - agar kode lebih jelas dan mudah diubah.

6. **Perhatikan keamanan dasar**
   - link eksternal baru menggunakan `target="_blank"` + `rel="noopener noreferrer"`.

## Catatan Lanjutan (Opsional)
- Pindahkan password admin dari frontend ke backend agar lebih aman.
- Tambahkan `.env` dan build tool (Vite/Parcel) jika project mulai besar.
- Tambahkan folder `assets/images/` jika nanti logo dipindahkan dari URL eksternal ke file lokal.
