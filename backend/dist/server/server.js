"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// server.ts
const http_1 = __importDefault(require("http"));
const dotenv_1 = __importDefault(require("dotenv"));
const app_js_1 = __importDefault(require("./app.js"));
dotenv_1.default.config();
const PORT = process.env.PORT;
http_1.default.createServer(app_js_1.default).listen(PORT);
