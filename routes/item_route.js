import express from "express";
import {
  createItem,
  getAllItems,
  getOneItem,
  deleteItem,
  updateQuntity,
  updateItem,
} from "../controller/item_controller.js";

const router = express.Router();
router.route("/createItem").post(createItem);
router.route("/getAllItems").get(getAllItems);
router.route("/getOneItem").post(getOneItem);
router.route("/deleteItem").post(deleteItem);
router.route("/updateQuntity").post(updateQuntity);
router.route("/updateItem").post(updateItem);

export default router;
