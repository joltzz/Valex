import { Router } from "express";
import { validateSchema } from "../middlewares/validateSchema";
import rechargeSchema from "../schemas/rechargeSchema";
import { rechargeCard } from "../controllers/rechargeController"

const rechargeRouter = Router();

rechargeRouter.post("/recharge", validateSchema(rechargeSchema), rechargeCard);

export default rechargeRouter;