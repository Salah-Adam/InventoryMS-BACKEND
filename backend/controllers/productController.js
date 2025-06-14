// controllers/productController.js

import {
    createProduct,
    getAllProducts,
    updateProduct,
    toggleProductStatus,
    findProductByName, 
    getAllProductNames
    } from '../models/productDB.js';
    
    // Create a new product
    export async function addProduct(req, res) {
    try {
        const { product_name, stock_units, unit_cost, created_by } = req.body;
        await createProduct({ product_name, stock_units, unit_cost, created_by });
        res.json({ message: 'Product created successfully' });
    } catch (err) {
    // console.error(err);
    // console.log(err);
        res.status(500).json({ error: err.message });
    }
    }
    
    // Get all products
    export async function getProducts(req, res) {
    try {
        const products = await getAllProducts();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
    }
    
    // Update a product
    export async function updateProductController(req, res) {
    try {
        const { oldProductName } = req.params;
        const { product_name, stock_units, unit_cost } = req.body;
        await updateProduct(oldProductName, { product_name, stock_units, unit_cost });
        res.json({ message: 'Product updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
    }
    
    // Toggle product active/inactive
    export async function toggleProductActivation(req, res) {
    try {
        const productName = req.params.productName;
        const newStatus = await toggleProductStatus(productName);
        const statusText = newStatus === 1 ? 'activated' : 'deactivated';
        res.json({ message: `Product ${statusText} successfully`, is_active: newStatus });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
    }
    
    // Find a product by name
    export async function getProductByName(req, res) {
    try {
        const { name } = req.params;
        const product = await findProductByName(name);
        if (product.length === 0) {
        return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product[0]); // Return only the first match
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
    }



    export async function getProductNames(req, res) {
        try {
            const products = await getAllProductNames();
            res.json(products);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    };
    