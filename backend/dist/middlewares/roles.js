"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = exports.RoleEstatus = void 0;
var RoleEstatus;
(function (RoleEstatus) {
    RoleEstatus["cliente"] = "cliente";
    RoleEstatus["admin"] = "admin";
})(RoleEstatus || (exports.RoleEstatus = RoleEstatus = {}));
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (!allowedRoles.includes(user.role)) {
            console.log("→ Rol recibido:", user.role);
            return res.status(403).json({
                message: "Access denied: insufficient permissions"
            });
        }
        next();
    };
};
exports.authorizeRoles = authorizeRoles;
