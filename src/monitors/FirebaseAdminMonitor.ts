export class FirebaseAdminMonitor {
  name: string;
  app: any; // Using 'any' so we don't force firebase-admin types on all users

  constructor(name: string, app: any) {
    this.name = name;
    this.app = app;
  }

  async check() {
    const start = Date.now();
    try {
      // Validate that the object passed in is actually a Firebase app instance
      if (this.app && this.app.options) {
        return {
          service: this.name,
          status: "up",
          projectId: this.app.options.projectId || "unknown-project",
          latency: `${Date.now() - start}ms`,
        };
      } else {
        throw new Error("Invalid Firebase Admin App instance provided.");
      }
    } catch (error: any) {
      return { service: this.name, status: "down", error: error.message };
    }
  }
}