import Router from "express-promise-router";
import {
  getAllOrders,
  getOrder,
  createOrder,
  deleteOrder,
  completeOrder
} from "../controllers/order.controller";

const router = Router();

router.get("/", [getAllOrders]);
router.post("/", [createOrder]);
router.delete("/:id", [deleteOrder]);
router.get("/:id", [getOrder]);
router.post("/:id", [completeOrder]);

export default router;