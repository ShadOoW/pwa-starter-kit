module.exports = {
  globDirectory: './public',
  globPatterns: [
    './images/**',
    './manifest.json',
    './favicons/android-chrome-16x16.png',
    './favicons/android-chrome-32x32.png',
    './favicons/android-chrome-72x72.png',
  ],
  globIgnores: ['favicons/*'],
  swSrc: 'public/sw.js',
  swDest: 'public/sw.js',
  globStrict: true,
  maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB
  globFollow: true,
};
