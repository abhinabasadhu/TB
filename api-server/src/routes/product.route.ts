import Router from "express-promise-router";
import {
  getAllProducts,
  createProduct,
  editProduct,
  deleteProduct,
  addAddOnsToProduct,
  removeAddOnsFromProduct
} from "../controllers/product.controller";

const router = Router();

router.get("/", [getAllProducts]);
router.post("/", [createProduct]);
router.delete("/:id", [deleteProduct]);
router.get("/:id", [deleteProduct]);
router.post("/:id", [editProduct]);
router.post('/:productId/addons/:ingredientId', addAddOnsToProduct);
router.delete('/:productId/addons/:ingredientId', removeAddOnsFromProduct);

export default router;