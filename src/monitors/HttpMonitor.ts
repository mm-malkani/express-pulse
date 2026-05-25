import { PulseMonitor, ServiceHealth } from '../config/types';

export class HttpMonitor implements PulseMonitor {
    private name: string;
    private url: string;

    constructor(name: string, url: string) {
        this.name = name;
        this.url = url;
    }

    async check(): Promise<ServiceHealth> {
        try {
            const startTime = performance.now();
            const response = await fetch(this.url);
            if (!response.ok) {
                throw new Error(`HTTP monitor returned status ${response.status}`);
            }
            const latency = Math.round(performance.now() - startTime);
            return { name: this.name, status: 'up', latency: latency };
        }
        catch (error) {
            return { name: this.name, status: 'down', latency: 0 };
        }
    }
}