const firebaseConfig = {
  databaseURL: "https://warungdigital-97318-default-rtdb.firebaseio.com/"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.database();
