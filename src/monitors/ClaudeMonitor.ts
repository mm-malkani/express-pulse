export class ClaudeMonitor {
  name: string;
  apiKey: string;

  constructor(name: string, apiKey: string) {
    this.name = name;
    this.apiKey = apiKey;
  }

  async check() {
    const start = Date.now();
    try {
      // We ping the messages endpoint with a malformed/empty body. 
      // If we get a 401, the key is dead. If we get a 400 (Bad Request), the key works but our body was empty!
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": this.apiKey,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json"
        },
        body: JSON.stringify({}) 
      });

      return {
        service: this.name,
        status: response.status !== 401 ? "up" : "down",
        latency: `${Date.now() - start}ms`,
      };
    } catch (error: any) {
      return { service: this.name, status: "down", error: error.message };
    }
  }
}