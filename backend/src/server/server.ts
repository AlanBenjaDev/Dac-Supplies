// server.ts
import http from "http";
import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();

const PORT = process.env.PORT;
http.createServer(app).listen(PORT);
