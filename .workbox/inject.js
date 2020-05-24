const { injectManifest } = require('workbox-build');
const workboxConfig = require('./config');

injectManifest(workboxConfig)
  .then(({ count, size }) => {
    console.log(
      `Generated ${workboxConfig.swDest}, which will precache ${count} files (${size} bytes)`,
    );
  })
  .catch((reason) => console.log(reason));
