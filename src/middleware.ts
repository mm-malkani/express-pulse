import { Request, Response, NextFunction } from 'express';
import { ExpressPulseConfig, ServiceHealth } from './config/types';

export function expressPulse(config?: ExpressPulseConfig) {
    const targetEndpoint = config?.endpoint || '/health';
    return async function (req: Request, res: Response, next: NextFunction) {
        if(req.path === targetEndpoint && req.method === 'GET') {
            let servicesResults: ServiceHealth[] = [];  
            if(config?.monitors && config.monitors.length > 0) {
                const promises = config.monitors.map(monitor => monitor.check());
                servicesResults = await Promise.all(promises);
            }
            res.status(200).json({status: 'ok', timestamp: new Date().toISOString(), services: servicesResults});
        } else {
            next();
        }
    };
}