const CACHE_NAME = "askrefer-cache";
const urlsToCache = ["/"];

self.addEventListener("install", function (event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", function (event) {
  // caches.match(event.request).then((response) => {
  //   return response || fetch(event.request);
  // });
});

self.addEventListener('push', event => {
  const data = event.data.json();
  console.log('New notification', data);
  const options = {
    body: data.body,
    icon: 'icons/android-icon-36x36.png',
    vibrate: [100, 50, 100],
  };
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});


self.addEventListener('notificationclick', function(e) {
  var notification = e.notification;
  var action = e.action;
  console.log('Notification Clicked');

  if (action === 'close') {
    notification.close();
  } else {
    clients.openWindow('URL');
    notification.close();
  }
});