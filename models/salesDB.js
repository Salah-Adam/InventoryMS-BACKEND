import pool from '../dbConnection.js';

export const validateProduct = async (product_name, units_sold) => {
  try {
    const [old_product] = await pool.query(`SELECT stock_units, is_active FROM products WHERE product_name = ?`, [product_name]);

    if (!old_product || old_product.length === 0) {
      return { error: `Product "${product_name}" not found.` };
    }

    // console.log("inthe validate product", old_product)
    const oldStockUnit = old_product[0].stock_units;
    const old_isActive = old_product[0].is_active;

    if (units_sold < 1) {
      return { error: "Units sold cannot be less than or equal to 0" };
    } else if (oldStockUnit < units_sold) {
      return { error: `Insufficient Stock Units for "${product_name}"!` };
    } else if (old_isActive == 0) {
      return { error: `The product "${product_name}" is Deactivated!` };
    }

    // If all validations pass, return null (or an empty object)
    return null;
  } catch (error) {
    console.error('Error validating product:', error);
    return { error: 'Error validating product.' }; // Handle database errors
  }
};

export const insertCustomer = async (fullName, phoneNumber, createdBy) => {
  if (phoneNumber) {
    const [existing] = await pool.query(`SELECT customer_id FROM customers WHERE phone_number = ?`, [phoneNumber]);
    if (existing.length > 0) {
      return existing[0].customer_id;
    } else {
      const [result] = await pool.query(`INSERT INTO customers (full_name, phone_number, created_by) VALUES (?, ?, ?)`, [fullName, phoneNumber, createdBy]);
      return result.insertId;
    }
  } 
  else {
    const [result] = await pool.query(
      `INSERT INTO customers (full_name, phone_number, created_by) VALUES (?, ?, ?)`,
      [fullName, phoneNumber, createdBy]
    );
    return result.insertId;
  }
};

export const insertOrder = async (units, total, paid, discount, createdBy, customerId) => {

  const rest = total - (paid + discount);
  let status = 'Unpaid';
  if (rest === 0) status = 'Completed';
  else if (rest > 0 && paid > 0) status = 'Partially Paid';
  

  const [result] = await pool.query(
    `INSERT INTO orders (customer_id, total_units_sold, total_price, paid, discount, rest, sales_status, created_by) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [customerId, units, total, paid + 0.00, discount + 0.00, rest + 0.00, status, createdBy]
  );
  return result.insertId;
};

export const insertSales = async (salesArray) => {

  const values = salesArray.map(sale => [sale.order_id, sale.product_name, sale.units_sold, sale.total_price + 0.00, sale.created_by]);
  await pool.query(
    `INSERT INTO sales (order_id, product_name, units_sold, total_price, created_by) VALUES ?`,
    [values]
  ); 

for (const sale of salesArray) {
  await pool.query(
    `UPDATE products SET stock_units = stock_units - ? WHERE product_name = ?`,
    [sale.units_sold, sale.product_name]
  );

//   If stock reaches 0, set is_active = FALSE
  await pool.query(
      `UPDATE products SET is_active = 0 WHERE stock_units <= 0 AND product_name = ?`,
      [sale.product_name]
  );

};
};

export const getAllSales = async () => {
    const [rows] = await pool.query(`
    SELECT * FROM sales ORDER BY created_at DESC `);
    return rows;
  };


export const getSalesByOrderId = async (orderId) => {
  const [rows] = await pool.query(
    `SELECT * FROM sales WHERE order_id = ?`, [orderId]
  );
  return rows;
};

export const updateStock4OldProduct = async(orderId) => {

    const [older_sale] = await pool.query(`SELECT product_name, units_sold FROM sales WHERE order_id = ?`, [orderId]);
  // console.log("older sale: ", older_sale);
for (const sale of older_sale) {
  await pool.query(
    `UPDATE products SET stock_units = stock_units + ? WHERE product_name = ?`,
    [sale.units_sold, sale.product_name]
  );
};


};

export const updateSalesByOrderId = async (orderId, salesData) => {
  console.log("before deletion", salesData)


// get the original created timestamp
const [oldSales_createdTime] = await pool.query(
  `SELECT created_at FROM sales WHERE order_id = ? LIMIT 1`,
  [orderId]
);
// Step 2: Determine a shared created_at timestamp

  const preservedCreatedAt = oldSales_createdTime[0].created_at
  
  // delete old sales record
  await pool.query(`DELETE FROM sales WHERE order_id = ?`, [orderId]);

  // Step 4: Recreate the sales with preserved created_at timestamps
  const values = salesData.map(sale => [
    orderId,
    sale.product_name,
    sale.units_sold,
    sale.total_price,
    sale.created_by,
    preservedCreatedAt
  ]);

  // console.log("sales data after recreatin", salesData)
  await pool.query(
    `INSERT INTO sales (order_id, product_name, units_sold, total_price, created_by, created_at)
     VALUES ?`,
    [values]
  );

for (const newSale of salesData) {
  await pool.query(
    `UPDATE products SET stock_units = stock_units - ? WHERE product_name = ?`,
    [newSale.units_sold, newSale.product_name]
  );

  await pool.query(
      `UPDATE products SET is_active = 0 WHERE stock_units = 0 AND product_name = ?`,
      [newSale.product_name]
  );
};
};

export const updateOrderInfo = async (orderId, units, total, paid, discount) => {
  const rest = total - (paid + discount);
  let status = 'Unpaid';
  if (rest === 0) status = 'Completed';
  else if (rest > 0 && paid > 0 ) status = 'Partially Paid';

  // console.log("paid", paid);
  // console.log("discoutn", discount);
  // console.log("toatl", total);

  await pool.query(
    `UPDATE orders SET total_units_sold = ?, total_price = ?, paid = ?, discount = ?, rest = ?, sales_status = ?
     WHERE order_id = ?`,
    [units, total, paid, discount, rest, status, orderId]
  );
};

export const toggleSaleActiveStatus = async (orderId, productName) => {
  const [rows] = await pool.query(
    `SELECT is_active FROM sales WHERE order_id = ? AND product_name = ?`,
    [orderId, productName]
  );

  if (rows.length === 0) return null;

  const newStatus = rows[0].is_active === 1 ? 0 : 1;

  await pool.query(
    `UPDATE sales SET is_active = ? WHERE order_id = ? AND product_name = ?`,
    [newStatus, orderId, productName]
  );

  return newStatus;
};