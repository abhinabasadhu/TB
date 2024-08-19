import Router from "express-promise-router";
import {
  getAllProducts,
  createProduct,
  editProduct,
  deleteProduct,
} from "../controllers/product.controller";

const router = Router();

router.get("/", [getAllProducts]);
router.post("/", [createProduct]);
router.delete("/:id", [deleteProduct]);
router.get("/:id", [deleteProduct]);
router.post("/:id", [editProduct]);

export default router;