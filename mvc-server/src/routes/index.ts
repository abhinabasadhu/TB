// import addOnHandler from "./addOn.route";
import productHandler from "./product.route";
import orderHandler from "./order.route";
import ingredientHandler from "./ingredients.route";
import Router from "express-promise-router";

const router = Router();

// router.use("/addOn", addOnHandler);
router.use("/product", productHandler);
router.use("/order", orderHandler);
router.use("/ingredient", ingredientHandler);

export default router;