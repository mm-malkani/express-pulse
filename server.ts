import express from 'express';
import { expressPulse, MongoMonitor } from './src/index';

const app = express();

// A fake MongoDB client that simulates a 50ms ping
const mockMongoClient = {
    db: () => ({
        command: async () => new Promise(resolve => setTimeout(resolve, 50))
    })
};

app.use(expressPulse({
    endpoint: '/api/health',
    monitors: [
        new MongoMonitor('Primary-MongoDB', mockMongoClient)
    ]
}));

app.listen(3000, () => {
    console.log('Test server running on port 3000...');
});