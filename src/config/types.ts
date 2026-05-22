export interface ExpressPulseConfig {
    endpoint?: string;
    monitors?: PulseMonitor[]
}

export interface ServiceHealth{
    name: string;
    status: "up" | "down";
    latency: number
}

export interface PulseMonitor {
    check(): Promise<ServiceHealth>;
}