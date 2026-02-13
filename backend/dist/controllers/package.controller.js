"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardController = void 0;
const package_service_1 = require("../services/package.service");
const dashboardController = async (req, res) => {
    try {
        const dashboardData = await (0, package_service_1.dashboardService)();
        res.status(200).json(dashboardData);
    }
    catch (error) {
        console.error("Error en dashboardController:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.dashboardController = dashboardController;
