'use strict';

const fs = require('fs');
const path = require('path');
const revHash = require('rev-hash');

const CHECKSUM_LENGTH = 10;
const CHECKSUM_PATTERN = /^[0-9a-z]{10}$/;

class ChecksumProvider {
  constructor(root) {
    this.root_ = root;
  }

  get(assetPath) {
    const buffer = fs.readFileSync(path.join(this.root_, assetPath));
    return revHash(buffer);
  }
}

class AssetChecksum {
  constructor(checksumProvider) {
    this.checksumProvider_ = checksumProvider;
    this.checksumCache_ = {};
  }

  encode(assetPath) {
    if (!assetPath) {
      return assetPath;
    }
    let result = this.checksumCache_[assetPath];
    if (result) {
      return result;
    }
    const checksum = this.checksumProvider_.get(assetPath);
    const index = assetPath.lastIndexOf('.');
    if (index === -1) {
      return assetPath;
    }
    result =
      assetPath.substring(0, index) +
      '.' +
      checksum +
      assetPath.substring(index, assetPath.length);
    this.checksumCache_[assetPath] = result;
    return result;
  }

  decode(assetPath) {
    if (!assetPath) {
      return assetPath;
    }
    const fragments = assetPath.split('.');
    if (fragments.length <= 1) {
      return assetPath;
    }
    const checksumIndex = fragments.length - 2;
    if (!fragments[checksumIndex].match(CHECKSUM_PATTERN)) {
      return assetPath;
    }
    fragments.splice(checksumIndex, 1);
    return fragments.join('.');
  }
}

module.exports.asset = new AssetChecksum(new ChecksumProvider('public'));

// Exported for testing
module.exports.ChecksumProvider = ChecksumProvider;
module.exports.AssetChecksum = AssetChecksum;
module.exports.CHECKSUM_LENGTH = CHECKSUM_LENGTH;
