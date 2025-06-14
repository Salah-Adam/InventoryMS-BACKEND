// productDB.js
import pool from '../dbConnection.js';

// Read all products
export async function getAllOrders() {
  const [rows] = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
  return rows;
}

// Update product data
export async function updateOrder(orderID, { paid,discount }) {

  // get total pricde
  const [totalPrice] = await pool.query(
    'SELECT total_price FROM orders WHERE order_id = ?',
    [orderID]
  );
  let total = totalPrice[0].total_price;

  const parsedPaid = parseFloat(paid);
  const parsedDiscount = parseFloat(discount);

  const rest = total - (parsedPaid + parsedDiscount);
  let status = 'Unpaid';
  if (rest === 0) status = 'Completed';
  else if (rest > 0 && parsedPaid > 0 ) status = 'Partially Paid';


  const [result] = await pool.query(
    `UPDATE orders SET  paid = ?, discount = ?, rest = ?, sales_status = ?
     WHERE order_id = ?`,
    [parsedPaid, parsedDiscount, rest, status, orderID]
  );
  // console.log("result ", result);


  return result;
}

// Toggle product active/inactive status
export async function toggleOrderStatus(orderID) {
  const [rows] = await pool.query('SELECT is_active FROM orders WHERE order_id = ?', [orderID]);
  if (rows.length === 0) throw new Error('order ID not found');

  const currentStatus = rows[0].is_active;
  const newStatus = currentStatus === 1 ? 0 : 1;

  await pool.query('UPDATE orders SET is_active = ? WHERE order_id = ?', [newStatus, orderID]);
  return newStatus;
}

export async function findOrderByOrderId(orderId) {
    const [rows] = await pool.query(
        'SELECT * FROM orders WHERE order_id = ? ',
        [orderId]
    );
    return rows;
}

