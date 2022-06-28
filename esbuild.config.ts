import path from 'path';

import sassPlugin from 'esbuild-plugin-sass';

const distDir = path.join(process.cwd(), 'dist');

export default {
  entryPoints: ['./src/index.tsx'],
  bundle: true,
  color: true,
  sourcemap: true,
  outdir: distDir,
  plugins: [sassPlugin()],
};
