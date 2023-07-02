'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"version.json": "d2b68671f22e076e3bf21eb2cb054619",
"favicon.ico": "8920337b5cf4096dad5db264a6a5c9da",
"index.html": "67f819c94f03490ce7c3dee9b760b603",
"/": "67f819c94f03490ce7c3dee9b760b603",
"main.dart.js": "cc121107852febdb214e2688cd7dc86c",
"flutter.js": "6fef97aeca90b426343ba6c5c9dc5d4a",
"favicon.png": "20780ec3413275ca07f51e176840f8fe",
"icons/Icon-192.png": "30bbe918c54774425eef9f4e4b3755e4",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"icons/Icon-512.png": "67321e7d7ababd32135d597c10c9a887",
"manifest.json": "6eedc5b8dbcc7373ef264a73909e257b",
"assets/AssetManifest.json": "9ac5cea5588781954898d27064faeefc",
"assets/NOTICES": "a10b0f3b286075ecf54a94fb864af724",
"assets/FontManifest.json": "3ddd9b2ab1c2ae162d46e3cc7b78ba88",
"assets/packages/font_awesome_flutter/lib/fonts/fa-solid-900.ttf": "efc6c90b58d765987f922c95c2031dd2",
"assets/packages/font_awesome_flutter/lib/fonts/fa-regular-400.ttf": "01bb14ae3f14c73ee03eed84f480ded9",
"assets/packages/font_awesome_flutter/lib/fonts/fa-brands-400.ttf": "0db203e8632f03baae0184700f3bda48",
"assets/shaders/ink_sparkle.frag": "f8b80e740d33eb157090be4e995febdf",
"assets/AssetManifest.bin": "5b60d04d88c7bfb3eec9862623582f1a",
"assets/fonts/MaterialIcons-Regular.otf": "5c8054b3ee879bb3409cfff03f8b0254",
"assets/assets/images/website.png": "d651ebfd7c7527d9181cb9723b692353",
"assets/assets/images/getOnAppStore.png": "4ee16ec34963c66f9f566cc87f9cd948",
"assets/assets/images/github.png": "2051f52ff70514982a50b76877bdd74f",
"assets/assets/images/google-play-badge.png": "93e5efd4c554f48ca0156ece74aa6ac5",
"assets/assets/images/back4.jpg": "a6d9945714796d481338ed49b1b383b6",
"assets/assets/images/programming.png": "65beefa152a6bcf67ce1a251a6592473",
"assets/assets/images/pak.svg": "e6e8e1287074cf9442bf022443da31b4",
"assets/assets/images/getApps_badge.png": "9acea595ddcdd2b3e122dd8075e3465c",
"assets/assets/images/my_pic.png": "fcf357dda0446ee082a3f56e9d3bf39e",
"assets/assets/icons/xd.png": "63c16b3e95841b22f574288c210ba55c",
"assets/assets/icons/dark.png": "7a9a99a00e299a294697bf3711643afc",
"assets/assets/icons/flutter.png": "09c44f12e948ba9193426dcc4aed3e5b",
"assets/assets/icons/database.png": "4300ae129e77dec1dcab109564f43ffa",
"assets/assets/icons/github.png": "fb4f48eb7b08b8dee3e7c37610684a9b",
"assets/assets/icons/java.png": "8fec706f0779e8aa1ec514b684af36ae",
"assets/assets/icons/figma.png": "c4e5dc676628e6f2c4fa8037e3ee2c15",
"assets/assets/icons/light.png": "f1c850e21ddb0677235efc3a75ef081b",
"assets/assets/icons/coding.svg": "4c4956d85cb93df21b06b2db2c4b4a8b",
"assets/assets/icons/logo.png": "81baede04c19876489a98715dd4895d1",
"assets/assets/icons/html.png": "10aeaa8c8d84886c84095fcfa68d2326",
"assets/assets/icons/programming.svg": "f9b9c8c01fac775ebbf4f04b92fbaa51",
"assets/assets/icons/api.png": "3d057850e31c09ab6b51dff3ddd7c667",
"assets/assets/icons/css.png": "9919f777d2a351faf4404fcff8fa4dd8",
"assets/assets/icons/dart.png": "4aacfec51c9a096a1b757ba1dc1c933d",
"canvaskit/skwasm.js": "1df4d741f441fa1a4d10530ced463ef8",
"canvaskit/skwasm.wasm": "6711032e17bf49924b2b001cef0d3ea3",
"canvaskit/chromium/canvaskit.js": "8c8392ce4a4364cbb240aa09b5652e05",
"canvaskit/chromium/canvaskit.wasm": "fc18c3010856029414b70cae1afc5cd9",
"canvaskit/canvaskit.js": "76f7d822f42397160c5dfc69cbc9b2de",
"canvaskit/canvaskit.wasm": "f48eaf57cada79163ec6dec7929486ea",
"canvaskit/skwasm.worker.js": "19659053a277272607529ef87acf9d8a"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
