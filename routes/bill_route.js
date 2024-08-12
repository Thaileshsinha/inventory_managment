import express from "express";
import {
  createBill,
  getAllBills,
  getOneBill,
  deleteBill,
  updateBill,
} from "../controller/bill_controller.js";
const router = express.Router();
router.route("/createBill").post(createBill);
router.route("/getAllBills").get(getAllBills);
router.route("/getOneBill").post(getOneBill);
router.route("/deleteBill").post(deleteBill);
router.route("/updateBill").post(updateBill);

export default router;
