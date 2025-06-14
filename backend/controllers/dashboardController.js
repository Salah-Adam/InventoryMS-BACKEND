// controllers/productController.js

import {
    getTotalProducts,
    getInactivateProducts,
    getZeroStockProducts,
    getTotalRevenue,
    getHSProducts,
    getLSProducts
    } from '../models/dashboardDB.js';

// Get total products
export async function findTotalProducts(req, res) {
try {
    const totalProducts = await getTotalProducts();
    res.json(totalProducts);

} catch (err) {
    res.status(500).json({ error: err.message });
}
}

// Get total inactivate products
export async function findInactivateProducts(req, res) {
try {
    const totalInactivateProducts = await getInactivateProducts();
    res.json(totalInactivateProducts);
} catch (err) {
    res.status(500).json({ error: err.message });
}
}

// Get total zero stock products
export async function findZeroStockProducts(req, res) {
try {
    const totalZeroStockProducts = await getZeroStockProducts();
    res.json(totalZeroStockProducts);
} catch (err) {
    res.status(500).json({ error: err.message });
}
}

// Get total revenue
export async function findTotalRevenue(req, res) {
try {
    const totalRevenue = await getTotalRevenue();
    res.json(totalRevenue);
} catch (err) {
    res.status(500).json({ error: err.message });
}
}

// Get highest selling products
export async function findHSProducts(req, res) {
try {
    const HSProducts = await getHSProducts();
    res.json(HSProducts);
} catch (err) {
    res.status(500).json({ error: err.message });
}
}

// Get latest sales
export async function findLSProducts(req, res) {
try {
    const LSProducts = await getLSProducts();
    res.json(LSProducts);
} catch (err) {
    res.status(500).json({ error: err.message });
}
}