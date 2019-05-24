"use strict";

const net = require("net");
const tcpClient = require("./client.js");

class tcpServer {
  constructor(name, port, urls) {
    // ➊ 생성자

    this.context = {
      // ➋ 서버 정보
      port: port,
      name: name,
      urls: urls
    };
    this.merge = {};
    this.server = net.createServer(socket => {
      // ➌ 서버 생성
      this.onCreate(socket); // ➍ 클라이언트 접속 이벤트 처리
      socket.on("error", exception => {
        // ➎ 에러 이벤트 처리
        this.onClose(socket);
      });
      socket.on("close", () => {
        // ➏ 클라이언트 접속 종료 이벤트 처리
        this.onClose(socket);
      });
      socket.on("data", data => {
        // ➐ 데이터 수신 처리
        var key = socket.remoteAddress + ":" + socket.remotePort;
        var sz = this.merge[key]
          ? this.merge[key] + data.toString()
          : data.toString();
        var arr = sz.split("¶");
        for (var n in arr) {
          if (sz.charAt(sz.length - 1) != "¶" && n == arr.length - 1) {
            this.merge[key] = arr[n];
            break;
          } else if (arr[n] == "") {
            break;
          } else {
            this.onRead(socket, JSON.parse(arr[n]));
          }
        }
      });
    });

    this.server.on("error", err => {
      // ➑ 서버 객체 에러 처리
      console.log(err);
    });
    this.server.listen(port, () => {
      // ➒ 리슨
      console.log("listen", this.server.address());
    });
  }

  onCreate(socket) {
    console.log("onCreate", socket.remoteAddress, socket.remotePort);
  }

  onClose(socket) {
    console.log("onClose", socket.remoteAddress, socket.remotePort);
  }
}
module.exports = tcpServer;
