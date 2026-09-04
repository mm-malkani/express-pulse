import WebSocket from "ws";

export class WsMonitor {
  name: string;
  url: string;

  constructor(name: string, url: string) {
    this.name = name;
    this.url = url;
  }

  async check() {
    const start = Date.now();
    return new Promise((resolve) => {
      const ws = new WebSocket(this.url);
      
      // If the socket opens successfully, we immediately close it and report 'up'
      ws.on("open", () => {
        ws.close();
        resolve({
          service: this.name,
          status: "up",
          latency: `${Date.now() - start}ms`,
        });
      });

      ws.on("error", (error: any) => {
        resolve({ service: this.name, status: "down", error: error.message });
      });
    });
  }
}