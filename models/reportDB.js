// productDB.js
import pool from '../dbConnection.js';

// report
export async function getReport() {
  const [rows] = await pool.query(
     `SELECT s.order_id, o.customer_id, 
             c.phone_number, s.product_name, 
             s.units_sold, s.total_price, 
             o.sales_status, s.created_at, 
             s.last_update, s.created_by 
        FROM sales s
        JOIN orders o USING(order_id)
        JOIN customers c ON o.customer_id = c.customer_id`);
  return rows;
}


// deymaha
export async function getLoans() {
  const [rows] = await pool.query(
     `SELECT s.order_id, c.customer_id, c.full_name, c.phone_number, 
         s.product_name, s.units_sold, s.total_price, 
         o.total_price as total_order_price, o.paid, o.discount, o.rest, o.sales_status, 
         s.created_at, s.last_update, s.created_by 
      FROM sales s
      JOIN orders o USING(order_id)
      JOIN customers c ON o.customer_id = c.customer_id`);
  return rows;
}

