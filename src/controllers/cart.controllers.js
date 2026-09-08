import { AVAILABLE_COUPONS } from "../utils/coupon.utils.js";
import Cart from "../models/Cart.model.js";
import Product from "../models/Product.model.js";

const getOrCreateCartFun = async (userId) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = new Cart({
      user: userId,
      items: [],
      coupon: null,
    });
    await cart.save();
  }
  return cart;
};

const getOrCreateCart = async (req, res) => {
  try {
    const userId = req?.user?._id || "64b8f1a2e4b0a1a2b3c4d001";
    const cart = await getOrCreateCartFun(userId);
    res.status(200).json({
      success: true,
      itemCount: cart.itemCount,
      subtotal: cart.subtotal,
      discountAmount: cart.discountAmount,
      total: cart.total,
      coupon: cart.coupon?.code || null,
      items: cart.items.map((item) => ({
        _id: item._id,
        product: item.product,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
      })),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `error in server for get cart : ${error.message}`,
    });
  }
};

const addItemToCart = async (req, res) => {
  try {
    const userId = req?.user?._id || "64b8f1a2e4b0a1a2b3c4d001";
    let { productId, quantity } = req.body;
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }
    if (!quantity || quantity < 1) {
      quantity = 1;
    }

    const cart = await getOrCreateCartFun(userId);

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: `product not found`,
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock to product ${product.name}`,
      });
    }

    const existItem = cart.items.find(
      (item) => item.product.toString() === productId,
    );
    // let newQuantity = quantity;
    if (existItem) {
     let newQuantity = existItem.quantity + quantity;
      
      cart.items = cart.items.map((item) =>
        item.product.toString() === productId
          ? { ...item, quantity: newQuantity }
          : item,
      );
    } else {
      cart.items.push({
        product: productId,
        name: product.name,
        image: product.images?.[0]?.url || "",
        price: product.price,
        quantity: quantity,
      });
    }
    await Product.findByIdAndUpdate(productId, {
      $inc: { stock: -quantity },
    });
    await cart.save();
    res.status(200).json({
      success: true,
      message: "item added to cart successfully",
      itemCount: cart.itemCount,
      subtotal: cart.subtotal,
      discountAmount: cart.discountAmount,
      total: cart.total,
      items: cart.items.map((item) => ({
        _id: item._id,
        product: item.product,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
      })),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `error in server for add item to cart : ${error.message}`,
    });
  }
};

export { getOrCreateCart, addItemToCart };
