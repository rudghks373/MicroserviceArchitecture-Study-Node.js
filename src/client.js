"use strict";

const net = require("net");

class tcpClient {
  constructor(host, port, onCreate, onRead, onEnd, onError) {
    this.options = {
      host: host,
      port: port
    };
    this.onCreate = onCreate;
    this.onRead = onRead;
    this.onEnd = onEnd;
    this.onError = onError;
  }

  connect() {
    // (1)접속 처리 함수
    this.client = net.connect(this.options, () => {
      if (this.onCreate) this.onCreate(this.options); // (2)속 완료 이벤트 콜백
    });

    this.client.on("data", data => {
      // (3)데이터 수신 처리
      var sz = this.merge ? this.merge + data.toString() : data.toString();
      var arr = sz.split("¶");
      for (var n in arr) {
        if (sz.charAt(sz.length - 1) != "¶" && n == arr.length - 1) {
          this.merge = arr[n];
          break;
        } else if (arr[n] == "") {
          break;
        } else {
          this.onRead(this.options, JSON.parse(arr[n]));
        }
      }
    });

    this.client.on("close", () => {
      // ➍ 접속 종료 처리
      if (this.onEnd) this.onEnd(this.options);
    });

    this.client.on("error", err => {
      // ➎ 에러 발생 처리
      if (this.onError) this.onError(this.options, err);
    });
  }
}

module.exports = tcpClient;
