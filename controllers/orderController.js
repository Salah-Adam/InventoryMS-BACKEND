import {
getAllOrders,
updateOrder,
toggleOrderStatus,
findOrderByOrderId
} from '../models/orderDB.js';

// Get all products
export async function getOrders(req, res) {
try {
    const products = await getAllOrders();
    res.json(products);
} catch (err) {
    res.status(500).json({ error: err.message });
}
}

// Update a product
export async function updateOrderController(req, res) {
try {
    const { order_id } = req.params;
    const { paid, discount } = req.body;
    await updateOrder(order_id, { paid, discount });
    res.json({ message: 'Order updated successfully' });
} catch (err) {
    res.status(500).json({ error: err.message });
}
}

// Toggle product active/inactive
export async function toggleOrderActivation(req, res) {
try {
    const orderId = req.params.orderId;
    const newStatus = await toggleOrderStatus(orderId);
    const statusText = newStatus === 1 ? 'activated' : 'deactivated';
    res.json({ message: `Order ${statusText} successfully`, is_active: newStatus });
} catch (err) {
    res.status(500).json({ error: err.message });
}
}

export async function getOrderByOrderId(req, res) {
  try {
    const { orderId } = req.params;
    const order = await findOrderByOrderId(orderId);
    if (order.length === 0) {
      return res.status(404).json({ message: 'order not found' });
    }
    res.json(order[0]); // Return only the first match
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};