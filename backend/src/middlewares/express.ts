import { RoleEstatus } from "../middlewares/roles.js";

declare global {
  namespace Express {
    interface UserPayload {
      id: number;
      email: string;
      username: string;
      role: RoleEstatus;
    }

    interface Request {
      user?: UserPayload;
    }
    interface Request {
      exportData?: any[];
    }
  }
}
