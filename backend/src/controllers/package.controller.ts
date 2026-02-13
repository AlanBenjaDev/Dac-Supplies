import { Request,Response } from "express";
import { dashboardService } from "../services/package.service";

export const dashboardController = async (req: Request, res: Response) => {
  try {


    const dashboardData = await dashboardService();

    res.status(200).json(dashboardData);


  }


  catch(error) {
    console.error("Error en dashboardController:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}