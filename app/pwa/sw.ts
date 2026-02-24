// filepath: app/pwa/sw.ts
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';

precacheAndRoute(self.__WB_MANIFEST);

registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images-cache',
    plugins: [
      {
        handlerDidGenerateResponse({ response }) {
          const ttl = 60 * 60 * 24; // 1 day
          response.headers.append('Cache-Control', `max-age=${ttl}`);
          return response;
        },
      },
    ],
  })
);

registerRoute(
  ({ request }) => request.destination === 'script' || request.destination === 'style',
  new StaleWhileRevalidate({
    cacheName: 'static-resources-cache',
  })
);