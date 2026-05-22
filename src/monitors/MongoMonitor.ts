import { PulseMonitor, ServiceHealth } from '../config/types';

export class MongoMonitor implements PulseMonitor {
    private name: string;
    private client: any;

    constructor(name: string, client: any) {
        this.name = name;
        this.client = client;
    }

    // Your turn: add the async check() method here!

    async check(): Promise<ServiceHealth> {
        try {

            const startTime = performance.now();
            let db;
            if(this.client?.connection?.db) {
                db = this.client.connection.db;
            } else if (this.client?.db) {
                db = this.client.db();
            } else {
                throw new Error("Invalid MongoDB client");
            }

            await db.command({ ping: 1 });
            const latency = Math.round(performance.now() - startTime);  
            return {name: this.name, status: 'up', latency: latency};
        } catch (error) {
            return {name: this.name, status: 'down', latency: 0};
        }
    }
}