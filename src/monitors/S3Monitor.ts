import { PulseMonitor, ServiceHealth } from '../config/types';


export class S3Monitor implements PulseMonitor {
    private name: string;
    private bucketUrl: string;

    constructor(name: string, bucketUrl: string) {
        this.name = name;
        this.bucketUrl = bucketUrl;
    }

    async check(): Promise<ServiceHealth> {
        try {
            const startTime = performance.now();
            const response = await fetch(this.bucketUrl, { method: 'HEAD' });
            if (response.status >= 500) {
                throw new Error(`S3 bucket returned status ${response.status}`);
            }

            const latency = Math.round(performance.now() - startTime);
            return { name: this.name, status: 'up', latency: latency };
        }
        catch (error) {
            return { name: this.name, status: 'down', latency: 0 };
        }
    }
}