export class GraphQlMonitor {
  name: string;
  endpoint: string;

  constructor(name: string, endpoint: string) {
    this.name = name;
    this.endpoint = endpoint;
  }

  async check() {
    const start = Date.now();
    try {
      const response = await fetch(this.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: "{ __typename }" }),
      });

      const data = await response.json();
      const isUp = response.ok && !data.errors;

      return {
        service: this.name,
        status: isUp ? "up" : "down",
        latency: `${Date.now() - start}ms`,
      };
    } catch (error: any) {
      return { service: this.name, status: "down", error: error.message };
    }
  }
}