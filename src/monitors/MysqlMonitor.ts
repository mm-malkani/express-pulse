import {PulseMonitor, ServiceHealth} from '../config/types';

export class MysqlMonitor implements PulseMonitor {
    private name: string;
    private client: any;

    constructor(name: string, client: any) {
        this.name = name;
        this.client = client;
    }

    async check(): Promise<ServiceHealth> {
        try {
            const startTime = performance.now();
            await this.client.query('SELECT 1');
            const latency = Math.round(performance.now() - startTime);
            return {name: this.name, status: 'up', latency: latency};
        } catch (error) {
            return {name: this.name, status: 'down', latency: 0};
        }
    }
}