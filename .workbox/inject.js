const { injectManifest } = require('workbox-build');

injectManifest({
  globDirectory: './public',
  globPatterns: [
    './images/**',
    './manifest.json',
    './favicons/android-chrome-72x72.png',
  ],
  globIgnores: ['favicons/*'],
  swSrc: 'src/sw.js',
  swDest: 'public/sw.js',
})
  .then(({ count, size }) => {
    console.log(
      `Generated a service worker, which will precache ${count} files, totaling ${size} bytes.`,
    );
  })
  .catch((reason) => console.log(reason));
