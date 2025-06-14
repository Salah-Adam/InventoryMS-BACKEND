// productDB.js
import pool from '../dbConnection.js';

// get total number of products
export async function getTotalProducts() {
  const [rows] = await pool.query('SELECT COUNT(*) AS total FROM products');
  return rows;
}

// get total number of products that are inactivated
export async function getInactivateProducts() {
  const [rows] = await pool.query('SELECT COUNT(*) AS total FROM (SELECT * FROM products WHERE is_active = 0) AS t1');
  return rows;
}

// get total number of products that have zero products
export async function getZeroStockProducts() {
  const [rows] = await pool.query('SELECT COUNT(*) AS total FROM (SELECT * FROM products WHERE stock_units = 0) AS t2;');
  return rows;
}

// get total sales
export async function getTotalRevenue() {
  const [rows] = await pool.query('SELECT SUM(total_price) AS revenue FROM orders');
  return rows;
}


// HIGHEST SELLING PRODCUTS
export async function getHSProducts() {
  const [rows] = await pool.query(
     `SELECT s.product_name, SUM(units_sold) AS total_units_sold, stock_units
      FROM sales s JOIN products p ON s.product_name = p.product_name 
      GROUP BY s.product_name
      ORDER BY total_units_sold DESC
      LIMIT 10 `);
  return rows;
}


// lates 10 sales
export async function getLSProducts() {
  const [rows] = await pool.query(
     `SELECT s.product_name, units_sold, total_price, stock_units, sale_id, s.created_at
      FROM sales s join products p ON s.product_name = p.product_name
      ORDER BY s.created_at DESC
      LIMIT 10`);
  return rows;
}

