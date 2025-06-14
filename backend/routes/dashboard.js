// routes/productRoutes.js

import express from "express";
const router = express.Router();

import {
  findTotalProducts,
  findInactivateProducts,
  findZeroStockProducts,
  findTotalRevenue,
  findHSProducts,
  findLSProducts,
} from "../controllers/dashboardController.js";

import { authenticateToken } from "../middlewares/authMiddleware.js"; // ✅ Import middleware
import { authorizeRole } from "../middlewares/authorizeRole.js";

// ✅ Apply middleware to all routes below
router.use(authenticateToken);

// Get all products
router.get("/totalP", authorizeRole("admin"), findTotalProducts);
router.get("/inactivateP", authorizeRole("admin"), findInactivateProducts);
router.get("/zeroStockP", authorizeRole("admin"), findZeroStockProducts);
router.get("/totalRev", authorizeRole("admin"), findTotalRevenue);
router.get("/HSproducts", authorizeRole("admin"), findHSProducts);
router.get("/latestSales", authorizeRole("admin"), findLSProducts);

export default router;
