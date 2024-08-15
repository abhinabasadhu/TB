import Router from "express-promise-router";
import {
  getAllAddOns,
  createAddOn,
  editAddOn,
  deleteAddOn,
  getAddOn
} from "../controllers/addOn.controller";

const router = Router();

router.get("/", [getAllAddOns]);
router.post("/", [createAddOn]);
router.delete("/:id", [deleteAddOn]);
router.get("/:id", [getAddOn]);
router.post("/:id", [editAddOn]);

export default router;