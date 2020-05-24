import babel from 'rollup-plugin-babel';
import replace from '@rollup/plugin-replace';
import { terser } from 'rollup-plugin-terser';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonsjs from 'rollup-plugin-commonjs';

export default {
  input: './sw.js',
  plugins: [
    replace({ 'process.env.NODE_ENV': JSON.stringify('production') }),
    babel({
      exclude: 'node_modules/**',
    }),
    terser(),
    nodeResolve(),
    commonsjs(),
  ],
  // Quiet warning: https://github.com/rollup/rollup/wiki/Troubleshooting#this-is-undefined
  context: 'window',
  output: [
    {
      file: './public/sw.js',
      // Fixes 'navigator' not defined when using Firebase and strict mode:
      // http://stackoverflow.com/questions/31221357/webpack-firebase-disable-parsing-of-firebase
      strict: false,
      format: 'iife',
      sourcemap: true,
    },
  ],
};
