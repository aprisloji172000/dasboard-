# Warung Digital - Live Dashboard

Dashboard sederhana untuk operasional warung berbasis **Firebase Realtime Database**.
Aplikasi ini mendukung:
- Input pesanan dari admin.
- Monitoring antrian masak secara live.
- Riwayat pesanan yang sudah selesai dimasak.

## Tujuan Refactor
Kode awal berbentuk satu file HTML besar (inline CSS + inline JS). Struktur tersebut sudah dipisah agar:
- lebih mudah dirawat,
- lebih jelas tanggung jawab setiap file,
- lebih aman dari sisi rendering (mengurangi `innerHTML` dinamis),
- lebih rapi mengikuti etika coding (penamaan konsisten, fungsi kecil, pemisahan concerns).

## Struktur Folder

```bash
.
├── index.html
├── README.md
└── assets
    ├── css
    │   └── styles.css
    └── js
        ├── app.js
        └── firebase-config.js
```

## Penempatan Kode yang Disarankan

### 1) `index.html`
Fokus pada:
- struktur semantik (section, nav, button, form controls),
- elemen kontainer untuk rendering data,
- import stylesheet dan script.

### 2) `assets/css/styles.css`
Fokus pada:
- variabel tema warna,
- layout (tab, panel, card),
- komponen UI (button, input, status card),
- utilitas tampilan kosong.

### 3) `assets/js/firebase-config.js`
Fokus pada:
- inisialisasi Firebase satu kali,
- expose instance database (`window.db`) untuk dipakai modul lain.

### 4) `assets/js/app.js`
Fokus pada:
- logika tab,
- validasi input pesanan,
- pembagian porsi otomatis (maks 5 per item antrian),
- sinkronisasi realtime `antrian` dan `history`,
- render elemen DOM dengan `createElement`.

## Etika Coding yang Diterapkan

1. **Separation of concerns**: HTML/CSS/JS dipisah.
2. **Naming konsisten**: fungsi deskriptif (`renderAntrian`, `splitPortions`, `selesaiMasak`).
3. **Defensive coding**: validasi qty harus integer >= 1.
4. **Kurangi risiko XSS**: render menggunakan `textContent` + `createElement`.
5. **Single responsibility**: tiap fungsi punya tugas kecil yang jelas.
6. **Maintainability**: style terpusat di satu file CSS.

## Cara Menjalankan Lokal

Karena ini project statis, cukup jalankan web server lokal:

```bash
python3 -m http.server 8000
```

Lalu buka `http://localhost:8000`.

## Catatan Firebase

- Project ini menggunakan Firebase v8 CDN.
- Pastikan `databaseURL` di `assets/js/firebase-config.js` sesuai project Firebase Anda.
- Atur rule Realtime Database dengan benar agar tidak terbuka ke publik tanpa kontrol.

## Pengembangan Lanjutan (Opsional)

- Tambahkan autentikasi admin (Firebase Auth) agar tombol operasional tidak bebas akses.
- Tambahkan filter riwayat berdasarkan tanggal/menu.
- Tambahkan notifikasi suara saat order baru masuk.
- Tambahkan unit test untuk utilitas murni (misal `splitPortions`).
