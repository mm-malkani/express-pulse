import http from "http";

export class DockerMonitor {
  name: string;
  socketPath: string;

  constructor(name: string, socketPath = "/var/run/docker.sock") {
    this.name = name;
    this.socketPath = socketPath;
  }

  async check() {
    const start = Date.now();
    return new Promise((resolve) => {
      const req = http.request({
        socketPath: this.socketPath,
        path: "/_ping",
        method: "GET",
      }, (res) => {
        resolve({
          service: this.name,
          status: res.statusCode === 200 ? "up" : "down",
          latency: `${Date.now() - start}ms`,
        });
      });

      req.on("error", (error: any) => {
        resolve({ service: this.name, status: "down", error: error.message });
      });

      req.end();
    });
  }
}