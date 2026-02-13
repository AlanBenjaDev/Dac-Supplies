"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePassword = exports.hashPassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const saltRounds = Number(process.env.SALT_ROUNDS) || 10;
const hashPassword = async (plainPassword) => {
    return await bcrypt_1.default.hash(plainPassword, saltRounds);
};
exports.hashPassword = hashPassword;
const comparePassword = async (plainPassword, hashedPassword) => {
    return await bcrypt_1.default.compare(plainPassword, hashedPassword);
};
exports.comparePassword = comparePassword;
