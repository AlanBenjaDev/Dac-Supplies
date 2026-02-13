"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportToExcel = void 0;
const xlsx_1 = __importDefault(require("xlsx"));
const exportToExcel = async (req, res, next) => {
    try {
        if (!req.exportData || req.exportData.length === 0) {
            return res.status(400).json({ message: "No hay datos para exportar" });
        }
        const fileName = typeof req.query.filename === "string"
            ? `${req.query.filename}.xlsx`
            : "movimientos.xlsx";
        const safeData = req.exportData.map((row) => ({
            ...row,
            Fecha: new Date(row.Fecha).toISOString().split("T")[0],
        }));
        const worksheet = xlsx_1.default.utils.json_to_sheet(safeData);
        const workbook = xlsx_1.default.utils.book_new();
        xlsx_1.default.utils.book_append_sheet(workbook, worksheet, "Movimientos");
        const buffer = xlsx_1.default.write(workbook, {
            bookType: "xlsx",
            type: "buffer",
        });
        res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.send(buffer);
    }
    catch (error) {
        console.error("Error exportando Excel:", error);
        next(error);
    }
};
exports.exportToExcel = exportToExcel;
