const OrderModel = require("../Model/Order_model.js");

// Create a new order
const createOrder = async (req, res) => {
  try {
    const { user_id, total_price, items } = req.body;

    // Create order
    const [orderResult] = await OrderModel.createOrder(user_id, total_price);
    const orderId = orderResult.insertId;

    // Add items to order
    for (const item of items) {
      await OrderModel.addOrderItem(
        orderId,
        item.product_id,
        item.quantity,
        item.price
      );
    }

    return res.status(201).json({ success: true, orderId });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Error creating order", error });
  }
};

// Retrieve an order by ID
const getOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Fetch order details
    const [order] = await OrderModel.getOrderById(orderId);
    if (order.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    // Fetch associated items
    const [items] = await OrderModel.getOrderItems(orderId);
    return res.status(200).json({ success: true, order: order[0], items });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Error fetching order", error });
  }
};

// Update an order's status
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    // Update status
    await OrderModel.updateOrderStatus(orderId, status);
    return res
      .status(200)
      .json({ success: true, message: "Order status updated" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Error updating order status", error });
  }
};

// Delete an order
const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Check if order exists
    const [order] = await OrderModel.getOrderById(orderId);
    if (order.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    // Delete order and associated items
    await OrderModel.deleteOrderItems(orderId);
    await OrderModel.deleteOrder(orderId);

    return res.status(200).json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Error deleting order", error });
  }
};

// List all orders
const listOrders = async (req, res) => {
  try {
    // Fetch all orders
    const [orders] = await OrderModel.getAllOrders();
    return res.status(200).json({ success: true, orders });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Error fetching orders", error });
  }
};

module.exports = {
  createOrder,
  getOrder,
  updateOrderStatus,
  deleteOrder,
  listOrders,
};
