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

onClose(socket) {
  console.log("onClose", socket.remoteAddress, socket.remotePort);
}
  
connectToDistributor(host, port, onNoti) {    // ➊ Distributor 접속 함수
var packet = {                            // ➋ Distributor에 전달할 패킷 정의
  uri: "/distributes",
  method: "POST",
  key: 0,
  params: this.context
};
var isConnectedDistributor = false;       // ➌ Distributor 접속 상태
  
this.clientDistributor = new tcpClient(   // ➍ Client 클래스 인스턴스 생성
  host
  , port
  , (options) => {                      // ➎ 접속 이벤트
      isConnectedDistributor = true;
      this.clientDistributor.write(packet);
  }
  , (options, data) => { onNoti(data); }             // ➏ 데이터 수신 이벤트
  , (options) => { isConnectedDistributor = false; } // ➐ 접속 종료 이벤트
  , (options) => { isConnectedDistributor = false; } // ➑ 에러 이벤트
  );

  setInterval(() => {                       // ➒ 주기적인 Distributor 접속 시도
      if (isConnectedDistributor /= true) {
          this.clientDistributor.connect();
      }
  }, 3000);
}
}


module.exports = tcpServer;
