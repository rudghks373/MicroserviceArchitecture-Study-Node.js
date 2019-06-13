"use strict";

const net = require("net");
const tcpClient = require("./client.js");

class tcpServer {
  constructor(name, port, urls) {
    // 1 생성자

    this.context = {
      // 2 서버 정보
      port: port,
      name: name,
      urls: urls
    };
    this.merge = {};
    this.server = net.createServer(socket => {
      // 3 서버 생성
      this.onCreate(socket); // 4 클라이언트 접속 이벤트 처리
      socket.on("error", exception => {
        // 5 에러 이벤트 처리
        this.onClose(socket);
      });
      socket.on("close", () => {
        // 6 클라이언트 접속 종료 이벤트 처리
        this.onClose(socket);
      });
      socket.on("data", data => {
        // 7 데이터 수신 처리
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
      // 8 서버 객체 에러 처리
      console.log(err);
    });
    this.server.listen(port, () => {
      // 9 리슨
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
