import { Router } from "express";
import { validateSchema } from "../middlewares/validateSchema";
import paymentSchema from "../schemas/paymentSchema";
import { payment } from "../controllers/paymentController";

const paymentRouter = Router();

paymentRouter.post("/payment", validateSchema(paymentSchema), payment);

export default paymentRouter;