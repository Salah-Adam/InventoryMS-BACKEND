// productDB.js
import pool from '../dbConnection.js';

// Add new product
export async function createCustomer({ full_name, phone_number, created_by }) {
  const [result] = await pool.query(
    'INSERT INTO customers (full_name, phone_number, created_by) VALUES (?, ?, ?)',
    [full_name, phone_number, created_by]
  );
  return result;
}

// Read all products
export async function getAllCustomers() {
  const [rows] = await pool.query('SELECT * FROM customers ORDER BY customer_id');
  return rows;
}

// Update product data
export async function updateCustomer(customer_id, { full_name, phone_number }) {
  const [result] = await pool.query(
    'UPDATE customers SET full_name = ?, phone_number = ? WHERE customer_id = ?',
    [full_name, phone_number, customer_id]
  );
  return result;
}


// Find product by name (partial or exact match)
export async function findCustomerByName(name) {
  const [rows] = await pool.query(
    'SELECT * FROM customers WHERE full_name LIKE ?',
    [`%${name}%`]
  );
  return rows;
}

export async function findCustomerById(customer_id) {
    const [rows] = await pool.query('SELECT * FROM customers WHERE customer_id = ?', [customer_id]);
    return rows;
}

export async function findCustomerByPhone(phone_number) {
    const [rows] = await pool.query('SELECT * FROM customers WHERE phone_number = ?', [phone_number]);
    return rows;
}
