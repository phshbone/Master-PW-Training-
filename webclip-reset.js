(() => {
  'use strict';

  // TEST-APP-2 installed on iOS as an Apple web clip without a web app
  // manifest or service worker. Remove stale registrations/caches left by
  // earlier PWA experiments so Safari sees the same proven install shell.
  window.addEventListener('load', async () => {
    try {
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map(registration => registration.unregister()));
      }
      if ('caches' in window) {
        const keys = await caches.keys();
        await Promise.all(keys.filter(key => key.startsWith('mpw-clean-')).map(key => caches.delete(key)));
      }
    } catch (error) {
      console.warn('Legacy PWA cleanup:', error);
    }
  });
})();
