import addOnHandler from "./addOn.route";
import productHandler from "./product.route";
import orderHandler from "./order.route";
import Router from "express-promise-router";

const router = Router();

router.use("/addOn", addOnHandler);
router.use("/product", productHandler);
router.use("/order", orderHandler);

export default router;