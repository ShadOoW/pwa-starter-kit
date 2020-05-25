import babel from 'rollup-plugin-babel';
import replace from '@rollup/plugin-replace';
import { terser } from 'rollup-plugin-terser';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonsjs from 'rollup-plugin-commonjs';
import del from 'rollup-plugin-delete';

const input = './public/sw.es6.js';
const output = './public/sw.js';
const outputMap = './public/sw.js.map';

export default (CLIArgs) => {
  const env = CLIArgs['config-env'] || 'dev';

  const bundle = {
    input: input,
    output: [
      {
        file: output,
        format: 'iife',
        sourcemap: true,
      },
    ],
    watch: {
      include: [input],
    },
  };
  bundle.plugins = getPluginsConfig(env);
  return bundle;
};

const getPluginsConfig = (env) => {
  const sortie = [
    del({
      targets: [output, outputMap],
      verbose: true,
      runOnce: true,
    }),
    nodeResolve(),
    replace({
      'process.env.NODE_ENV': JSON.stringify(
        env === 'prod' ? 'production' : 'development',
      ),
    }),
    commonsjs(),
    babel({
      exclude: 'node_modules/**',
    }),
  ];

  if (env === 'prod') {
    sortie.push(terser());
  }

  return sortie;
};
