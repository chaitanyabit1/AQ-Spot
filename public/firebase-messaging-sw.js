importScripts("https://www.gstatic.com/firebasejs/7.21.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/7.21.0/firebase-messaging.js"
);

const config = {
  apiKey: "AIzaSyCxU6nMkRvUr5fPM2_D7uqwHdt9v_5QpLA",
  authDomain: "notifications-a69e0.firebaseapp.com",
  databaseURL: "https://notifications-a69e0.firebaseio.com",
  projectId: "notifications-a69e0",
  storageBucket: "notifications-a69e0.appspot.com",
  messagingSenderId: "946441351209",
  appId: "1:946441351209:web:be27c81b2c778c07276c38",
};

firebase.initializeApp(config);
const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function (payload) {
  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.data.body,
    icon: "/logo64.png",
  };
  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});

self.addEventListener("notificationclick", (event) => {
  return event;
});
