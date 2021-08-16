const http = require('http');
const path = require('path');
const chalk = require('chalk');
const mime = require('mime');
const fs = require('fs-extra');
const childProcess = require('child_process');
const Url = require('url-parse');

class Server {
  constructor (config) {
    this.dir = config.dir;
    this.port = config.port;
    this.host = config.host;
  }

  async handleRequest (req, res) {
    this.req = req;
    this.res = res;

    // 通过url解析路径名
    const { pathname } = new Url(req.url);
    // 得到绝对路径，decodeURIComponent 防止中文符号无法识别
    const absPath = path.join(this.dir, decodeURIComponent(pathname));

    try {
      const statObj = await fs.stat(absPath);

      // 判断是文件还是文件夹
      if(statObj.isDirectory()) {
        const indexPath = `${absPath}/index.html`;
        // 如果文件夹下有 index.html，则进入
        fs.access(indexPath).then(this.sendFile.bind(this, indexPath));
      } else {
        this.sendFile(absPath);
      }
    } catch (err) {
      this.sendError(err);
    }
  }

  openBrowser (url) {
    let cmd;
    const args = [];
    if (process.platform === 'darwin') {
      try {
        childProcess.exec(
          `osascript openChrome.applescript "${encodeURI(url)}"`,
          {
            cwd: __dirname,
            stdio: 'ignore'
          }
        );
        return true;
      } catch (err) {
        console.log(err);
      }
      cmd = 'open';
    } else if (process.platform === 'win32') {
      cmd = 'cmd.exe';
      args.push('/c', 'start', '""', '/b');
      url = url.replace(/&/g, '^&');
    } else {
      cmd = 'xdg-open';
    }
    args.push(url);
    childProcess.spawn(cmd, args);
  }

  sendError (err) {
    this.res.statusCode = 404;
    this.res.end(err.toString());
  }

  sendFile (filePath) {
    this.res.setHeader(
      'Content-Type',
      mime.getType(filePath) + ';charset=utf-8'
    )
    // 创建可读流并返回
    fs.createReadStream(filePath).pipe(this.res);
  }

  start () {
    const url = `http://${this.host}:${this.port}`;
    const server = http.createServer(this.handleRequest.bind(this));

    server.listen(this.port, this.host, () => {
      console.log(
        chalk.yellow(`Starting up http-server,\r\nserving ${this.dir},\r\nAvailable on \r\n`)
      );
      console.log(chalk.green(url));
    })

    server.on('listening', () => {
      this.openBrowser(url);
      console.log('The port【' + this.port + '】is available.');
    })

    server.on('error', err => {
      if (err.code === 'EADDRINUSE') {
        server.close();
        console.log('The port【' + this.port + '】is occupied, please change other port.');
      }
    })
  }
}

module.exports = Server;