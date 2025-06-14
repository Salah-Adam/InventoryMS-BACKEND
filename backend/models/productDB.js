// productDB.js
import pool from '../dbConnection.js';

// Add new product
export async function createProduct({ product_name, stock_units, unit_cost, created_by }) {
  const [result] = await pool.query(
    'INSERT INTO products (product_name, stock_units, unit_cost, created_by) VALUES (?, ?, ?, ?)',
    [product_name, stock_units, unit_cost, created_by]
  );
  return result;
}

// Read all products
export async function getAllProducts() {
  const [rows] = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
  return rows;
}

// Update product data
export async function updateProduct(old_product_name, { product_name, stock_units, unit_cost }) {
  const [result] = await pool.query(
    'UPDATE products SET product_name = ?, stock_units = ?, unit_cost = ? WHERE product_name = ?',
    [product_name, stock_units, unit_cost, old_product_name]
  );
  return result;
}

// Toggle product active/inactive status
export async function toggleProductStatus(productName) {
  const [rows] = await pool.query('SELECT is_active FROM products WHERE product_name = ?', [productName]);
  if (rows.length === 0) throw new Error('Product not found');

  const currentStatus = rows[0].is_active;
  const newStatus = currentStatus === 1 ? 0 : 1;

  await pool.query('UPDATE products SET is_active = ? WHERE product_name = ?', [newStatus, productName]);
  return newStatus;
}

// Find product by name (partial or exact match)
export async function findProductByName(name) {
  const [rows] = await pool.query(
    'SELECT * FROM products WHERE product_name LIKE ?',
    [`%${name}%`]
  );
  return rows;
}


export async function getAllProductNames() {
  const [rows] = await pool.query('SELECT product_name FROM products where is_active = 1');
  return rows;
}
