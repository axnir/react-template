import http, { IncomingMessage, ServerResponse } from 'http';
import path from 'path';
import chalk from 'chalk';
import mime from 'mime';
import fs from 'fs-extra';
import childProcess from 'child_process';
import Url from 'url-parse';

class Server {
  dir: string;
  port: number;
  host: string;
  req: IncomingMessage;
  res: ServerResponse;

  constructor(config: { port: number; host: string; dir: string }) {
    this.dir = config.dir;
    this.port = config.port;
    this.host = config.host;
    this.req = {} as IncomingMessage;
    this.res = {} as ServerResponse;
  }

  async handleRequest(req: IncomingMessage, res: ServerResponse) {
    this.req = req;
    this.res = res;

    // 通过url解析路径名
    const { pathname } = new Url(req.url ?? '');
    // 得到绝对路径，decodeURIComponent 防止中文符号无法识别
    const absPath = path.join(this.dir, decodeURIComponent(pathname));

    try {
      const statObj = await fs.stat(absPath);

      // 判断是文件还是文件夹
      if (statObj.isDirectory()) {
        const indexPath = `${absPath}/index.html`;
        // 如果文件夹下有 index.html，则进入
        fs.access(indexPath).then(this.sendFile.bind(this, indexPath));
      } else {
        this.sendFile(absPath);
      }
    } catch (err) {
      this.sendError(err as Error);
    }
  }

  openBrowser(url: string) {
    let cmd: string | undefined;
    const args: string[] = [];
    if (process.platform === 'darwin') {
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

  sendError(err: Error) {
    this.res.statusCode = 404;
    this.res.end(err.toString());
  }

  sendFile(filePath: string) {
    this.res.setHeader(
      'Content-Type',
      mime.getType(filePath) + ';charset=utf-8'
    );
    // 创建可读流并返回
    fs.createReadStream(filePath).pipe(this.res);
  }

  start() {
    const url = `http://${this.host}:${this.port}`;
    const server = http.createServer(this.handleRequest.bind(this));

    server.listen(this.port, this.host, () => {
      console.log(
        chalk.yellow(
          `Starting up http-server,\r\nserving ${this.dir},\r\nAvailable on \r\n`
        )
      );
      console.log(chalk.green(url));
    });

    server.on('listening', () => {
      this.openBrowser(url);
      console.log('The port【' + this.port + '】is available.');
    });

    server.on('error', (err) => {
      if (err.name === 'EADDRINUSE') {
        server.close();
        console.log(
          'The port【' + this.port + '】is occupied, please change other port.'
        );
      }
    });
  }
}

export { Server };
