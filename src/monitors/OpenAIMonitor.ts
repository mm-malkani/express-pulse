export class OpenAIMonitor {
  name: string;
  apiKey: string;

  constructor(name: string, apiKey: string) {
    this.name = name;
    this.apiKey = apiKey;
  }

  async check() {
    const start = Date.now();
    try {
      const response = await fetch("https://api.openai.com/v1/models", {
        method: "GET",
        headers: { Authorization: `Bearer ${this.apiKey}` },
      });

      return {
        service: this.name,
        status: response.ok ? "up" : "down",
        latency: `${Date.now() - start}ms`,
      };
    } catch (error: any) {
      return { service: this.name, status: "down", error: error.message };
    }
  }
}