const path = require('path');

const sassPlugin = require('esbuild-plugin-sass')

const distDir = path.join(process.cwd(), 'dist');

module.exports = {
  entryPoints: ['./src/index.tsx'],
  bundle: true,
  color: true,
  sourcemap: true,
  outdir: distDir,
  plugins: [sassPlugin()]
};