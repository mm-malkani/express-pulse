"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = require("./src/index");
const app = (0, express_1.default)();
// A fake MongoDB client that simulates a 50ms ping
const mockMongoClient = {
    db: () => ({
        command: async () => new Promise(resolve => setTimeout(resolve, 50))
    })
};
app.use((0, index_1.expressPulse)({
    endpoint: '/api/health',
    monitors: [
        new index_1.MongoMonitor('Primary-MongoDB', mockMongoClient)
    ]
}));
app.listen(3000, () => {
    console.log('Test server running on port 3000...');
});
//# sourceMappingURL=server.js.map