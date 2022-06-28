import fs from 'fs-extra';
import path from 'path';
import { Server } from './Server';
import * as esBuild from 'esbuild';
import { BuildOptions } from 'esbuild';
import esbuildConfig from '../esbuild.config';

const cwd = process.cwd();
const distDir = path.join(cwd, 'dist');
const publicDir = path.join(cwd, 'public');

const type = process.argv.slice(2)[0];

// server 配置
const serverConfig = {
  port: 3000,
  host: 'localhost',
  dir: distDir,
};

// 复制 html 文件
const copyHtml = () => {
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir);
  }

  const sourceFile = path.join(publicDir, 'index.html');
  const targetFile = path.join(distDir, 'index.html');
  fs.copyFileSync(sourceFile, targetFile);
};

// 启动本地服务器
const startServer = () => {
  const server = new Server(serverConfig);
  server.start();
};

const serve = () => {
  const watchConfig: BuildOptions = {
    watch: {
      onRebuild(err, res) {
        if (err) {
          console.error('watch build failed', err);
        } else {
          console.log('watch build succeeded', res);
        }
      },
    },
  };

  esBuild.build({ ...esbuildConfig, ...watchConfig }).then(() => {
    startServer();
  });
};

const build = () => {
  esBuild.build(esbuildConfig);
};

const init = (type: string) => {
  type === 'serve' ? serve() : build();
  copyHtml();
};

init(type);
