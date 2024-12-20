// controllers/cartController.js
const CartModel = require('../Model/Cart_model.js');
const SessionService = require('../Helper/SessionService.js');

// Get Cart by Session ID
const getCart = async (req, res) => {
  const sessionId = req.cookies.session_id; // Retrieve session ID from cookies
  if (!sessionId) {
    return res.status(400).json({ message: 'Session ID is required' });
  }

  try {
    const cart = await CartModel.getCartBySessionId(sessionId);
    if (!cart || cart.length === 0) {
      return res.status(404).json({ status:false,message: "Cart not found" });
    }
    return res.status(200).json({ cart });
  } catch (err) {
    return res.status(500).json({status:false, message: "Internal Server Error" });
  }
};

// Add Item to Cart
const addItemToCart = async (req, res) => {
  const { productId, quantity, price } = req.body; // Get product details from request body
  const sessionId = req.cookies.session_id;

  if (!sessionId) {
    return res.status(400).json({ message: 'Session ID is required' });
  }

  try {
    // Check if cart exists, create a new cart if not
    let cart = await CartModel.getCartBySessionId(sessionId);
    if (!cart || cart.length === 0) {
      await CartModel.createCart(sessionId);
      cart = await CartModel.getCartBySessionId(sessionId); // Get new cart
    }

    const cartId = cart[0].cart_id;
    await CartModel.addCartItem(cartId, productId, quantity, price);
    return res.status(201).json({ message: 'Item added to cart' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Update Cart Item
const updateCartItem = async (req, res) => {
  const { cartItemId, quantity } = req.body;

  try {
    const result = await CartModel.updateCartItem(cartItemId, quantity);
    return res.status(200).json({ message: 'Cart item updated', result });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Delete Cart Item
const deleteCartItem = async (req, res) => {
  const { cartItemId } = req.body;

  try {
    const result = await CartModel.deleteCartItem(cartItemId);
    return res.status(200).json({ message: 'Cart item deleted', result });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Recalculate Cart Total Price
const updateCartTotalPrice = async (req, res) => {
  const sessionId = req.cookies.session_id;

  try {
    const cart = await CartModel.getCartBySessionId(sessionId);
    if (!cart || cart.length === 0) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const cartId = cart[0].cart_id;
    const cartItems = await CartModel.getCartItems(cartId);
    const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    await CartModel.updateTotalPrice(cartId, totalPrice);
    return res.status(200).json({ message: 'Total price updated', totalPrice });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getCart,
  addItemToCart,
  updateCartItem,
  deleteCartItem,
  updateCartTotalPrice,
};
