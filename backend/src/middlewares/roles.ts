import  Express  from "express";
import type { Request, Response, NextFunction } from "express";




export enum RoleEstatus {

  cliente = "cliente",
  admin = "admin"

}

export const authorizeRoles = (...allowedRoles: RoleEstatus[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
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


