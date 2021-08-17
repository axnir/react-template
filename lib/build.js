const esBuild = require('esbuild');
const fs = require('fs-extra');
const path = require('path');
const Server = require('./Server');

const esbuildConfig = require('../esbuild.config');

const cwd = process.cwd();
const distDir = path.join(cwd, 'dist');
const publicDir = path.join(cwd, 'public');

const type = process.argv.slice(2)[0];

// server 配置
const serverConfig = {
  port: 3000,
  host: 'localhost',
  dir: distDir
};

// 复制 html 文件
const copyHtml = () => {
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir)
  }

  const sourceFile = path.join(publicDir, 'index.html');
  const targetFile = path.join(distDir, 'index.html');
  fs.copyFileSync(sourceFile, targetFile);
}

// 启动本地服务器
const startServer = () => {
  const server = new Server(serverConfig);
  server.start();
}

const serve = () => {
  const watchConfig = {
    watch: {
      onRebuild(err, res) {
        if (err) {
          console.err('watch build failed', err)
        } else {
          console.log('watch build succeeded', res);
        }
      }
    }
  }

  esBuild.build({...esbuildConfig, ...watchConfig}).then(() => {
    startServer();
  });
}

const build = () => {
  esBuild.buildSync(esbuildConfig);
};

const init =(type) => {
  type === 'serve' ? serve() : build();
  copyHtml();
}

init(type);