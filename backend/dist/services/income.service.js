"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteIncomeService = exports.updateIncomeService = exports.createIncomeService = void 0;
const db_1 = __importDefault(require("../config/db"));
const category_service_1 = require("./category.service");
const createIncomeService = async (data) => {
    const { amount, description, category, userId } = data;
    const categoryId = await (0, category_service_1.getOrCreateCategory)({
        name: category,
        type: "income",
        userId,
    });
    const [result] = await db_1.default.query(`
    INSERT INTO incomes (amount, description, category_id, user_id)
    VALUES (?, ?, ?, ?)
    `, [amount, description || null, categoryId, userId]);
    const [rows] = await db_1.default.query(`
    SELECT id, amount, description, date, category_id, user_id
    FROM incomes
    WHERE id = ? AND user_id = ?
    `, [result.insertId, userId]);
    const income = rows[0];
    return {
        id: income.id,
        amount: income.amount,
        description: income.description,
        date: income.date,
        category: income.category_id,
        userId: income.user_id,
    };
};
exports.createIncomeService = createIncomeService;
const updateIncomeService = async (data) => {
    const { id, amount, description, category, userId } = data;
    const categoryId = await (0, category_service_1.getOrCreateCategory)({
        name: category,
        type: "income",
        userId,
    });
    return db_1.default.query(`
    UPDATE incomes
    SET amount = ?, description = ?, category_id = ?
    WHERE id = ? AND user_id = ?
    `, [amount, description || null, categoryId, id, userId]);
};
exports.updateIncomeService = updateIncomeService;
const deleteIncomeService = async (id, userId) => {
    return db_1.default.query(`
    DELETE FROM incomes
    WHERE id = ? AND user_id = ?
    `, [id, userId]);
};
exports.deleteIncomeService = deleteIncomeService;
