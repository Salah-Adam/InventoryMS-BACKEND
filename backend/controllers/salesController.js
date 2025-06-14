import * as SalesDB from '../models/salesDB.js';

export const addSales = async (req, res) => {
  try {
    const { customerName, phoneNumber, paid, discount, totalUnits, totalOrderPrice, sales, createdBy } = req.body;

    // console.log("inthe sales controller ", sales);

    for (const sale of sales) {
    const validationResult = await SalesDB.validateProduct(sale.product_name, sale.units_sold);
    console.log("validationResult", validationResult)
    if (validationResult && validationResult.error) {
      return res.status(400).json({ error: validationResult.error });
    }
    }; 

    const customerId = await SalesDB.insertCustomer(customerName, phoneNumber, createdBy);
    const orderId = await SalesDB.insertOrder(totalUnits, totalOrderPrice, paid, discount, createdBy, customerId);

    const salesToInsert = sales.map(s => ({
      ...s,
      order_id: orderId,
      created_by: createdBy
    }));

    await SalesDB.insertSales(salesToInsert);

    res.status(201).json({ message: 'Sales added successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong while adding sales.' });
  }
};


export const getSales = async (req, res) => {
  try {
    const data = await SalesDB.getAllSales();
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve sales.' });
  }
};

export const getSalesByOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const data = await SalesDB.getSalesByOrderId(orderId);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch sales for this order.' });
  }
};

export const updateSales = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { sales, totalUnits, totalOrderPrice, paid, discount, createdBy } = req.body;

    await SalesDB.updateStock4OldProduct(orderId);

    // console.log("request_body: ", req.body);
    // console.log("request_params: ", req.params);

    const validationResult = await SalesDB.validateProduct(sales[0].product_name, sales[0].units_sold);

    // console.log("validation result: ", validationResult);
    // Check if validateProduct returned an error
    if (validationResult && validationResult.error) {
      return res.status(400).json({ error: validationResult.error });
    }

    const salesToInsert = sales.map(s => ({
      ...s,
      order_id: orderId,
      created_by:createdBy
    }));

    // console.log("sales to insert in the salescontroller: ", salesToInsert);
    await SalesDB.updateSalesByOrderId(orderId, salesToInsert);

    await SalesDB.updateOrderInfo(orderId, totalUnits, totalOrderPrice, paid, discount);

    res.status(200).json({ message: 'Sales updated successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update sales.' });
    console.log(err)
  }
};

export const toggleSaleStatus = async (req, res) => {
  try {
    const { orderId, productName } = req.params;
    const newStatus = await SalesDB.toggleSaleActiveStatus(orderId, productName);

    if (newStatus === null) {
      return res.status(404).json({ error: 'Sale not found.' });
    }

    res.status(200).json({ message: 'Sale status updated.', is_active: newStatus });
  } catch (err) {
    res.status(500).json({ error: 'Could not update sale status.' });
  }
};
