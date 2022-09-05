import { Router } from "express";
import { validateSchema } from "../middlewares/validateSchema";
import cardSchema from "../schemas/cardSchema";
import activeSchema from "../schemas/activeSchema";
import blockAndUnblockSchema from "../schemas/blockAndUnblockSchema";
import { createCard, activeCard, getBalanceById, blockCard, unblockCard } from "../controllers/cardController";

const cardRouter = Router();

cardRouter.post("/card", validateSchema(cardSchema), createCard);
cardRouter.put("/card", validateSchema(activeSchema), activeCard);
cardRouter.put("/card/block", validateSchema(blockAndUnblockSchema), blockCard);
cardRouter.put("/card/unblock", validateSchema(blockAndUnblockSchema), unblockCard)
cardRouter.get("/card/:cardId", getBalanceById);

export default cardRouter;