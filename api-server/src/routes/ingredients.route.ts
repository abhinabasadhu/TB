import Router from "express-promise-router";
import {
  getAllIngredients,
  getIngredient,
  createIngredient,
  deleteIngredient,
  editIngredient
} from "../controllers/ingredient.controller";

const router = Router();

router.get("/", [getAllIngredients]);
router.post("/", [createIngredient]);
router.delete("/:id", [deleteIngredient]);
router.get("/:id", [getIngredient]);
router.post("/:id", [editIngredient]);

export default router;