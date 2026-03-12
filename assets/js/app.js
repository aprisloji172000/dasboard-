const firebaseConfig = {
  databaseURL: "https://warungdigital-97318-default-rtdb.firebaseio.com/",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const PASS_ADMIN = "1973";
const STATUS_MANUAL = "habis";
const STATUS_AUTO = "auto";
const OPEN_HOUR = 17;
const CLOSE_HOUR = 23;

let currentManualStatus = STATUS_AUTO;

const clockElement = document.getElementById("clock");
const statusLabel = document.getElementById("status-label");

function updateDisplay() {
  const now = new Date();
  const hours = now.getHours();

  clockElement.innerText = now.toLocaleTimeString("id-ID");

  if (currentManualStatus === STATUS_MANUAL) {
    statusLabel.innerText = "Maaf, Sudah Habis";
    statusLabel.style.background = "#e67e22";
    return;
  }

  const isOpen = hours >= OPEN_HOUR && hours <= CLOSE_HOUR;
  statusLabel.innerText = isOpen ? "Buka Sekarang" : "Warung Tutup";
  statusLabel.style.background = isOpen ? "#27ae60" : "#e74c3c";
}

function setStatusWithAuth(mode) {
  const password = prompt("Masukkan Kode Admin untuk mengubah status:");

  if (password === PASS_ADMIN) {
    db.ref("warungStatus")
      .set(mode)
      .then(() => {
        alert("Status berhasil diperbarui di semua perangkat!");
      });
    return;
  }

  if (password !== null) {
    alert("Kode Salah!");
  }
}

function aksesDapur() {
  const password = prompt("Masukkan Kode Admin :");

  if (password === PASS_ADMIN) {
    window.location.href = "https://aprisloji172000.github.io/dapur_live_dashboard/";
    return;
  }

  if (password !== null) {
    alert("Kode Salah!");
  }
}

window.setStatusWithAuth = setStatusWithAuth;
window.aksesDapur = aksesDapur;

db.ref("warungStatus").on("value", (snapshot) => {
  currentManualStatus = snapshot.val() || STATUS_AUTO;
  updateDisplay();
});

setInterval(updateDisplay, 1000);
updateDisplay();
