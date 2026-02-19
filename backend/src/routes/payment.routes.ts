import { Router } from "express";
import { checkoutController } from "../controllers/payment.controller";
import { autenticarToken } from "../middlewares/token";
import { dashboardController } from "../controllers/package.controller";
import { authorizeRoles, RoleEstatus } from "../middlewares/roles";

const router = Router();

router.post("/checkout",  checkoutController);
router.get("/dashboard",autenticarToken, authorizeRoles(RoleEstatus.admin), dashboardController);

export default router;
