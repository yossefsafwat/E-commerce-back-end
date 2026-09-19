import Wishlist from "../models/Wishlist.model.js";
import Product from "../models/Product.model.js";
import User from "../models/User.model.js";

const getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({
      user: req.user._id,
    });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: req.user._id,
        products: [],
      });
      const user = await User.findOne({ _id: req.user._id });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "user not found",
        });
      }
      user.wishlist = [];
      await user.save();
    }
    return res.status(200).json({
      success: true,
      totalProducts: wishlist.products.length,
      wishlist,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Failed to get wishlist: ${error.message}`,
    });
  }
};

const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    const user = await User.findOne({ _id: req.user._id });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    }
    let wishlist = await Wishlist.findOne({
      user: req.user._id,
    });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: req.user._id,
        products: [productId],
      });

      user.wishlist = [productId];
      await user.save();

      await wishlist.populate("products");

      return res.status(201).json({
        success: true,
        message: "Product added to wishlist successfully",
        wishlist,
      });
    } else {
      const alreadyExists = wishlist.products.find(
        (product) => product._id.toString() === productId,
      );

      if (alreadyExists) {
        return res.status(400).json({
          success: false,
          message: "Product already exists in wishlist",
        });
      }

      wishlist.products.push(productId);
      await wishlist.save();
      await wishlist.populate("products");

      user.wishlist.push(productId);
      await user.save();

      return res.status(200).json({
        success: true,
        message: "Product added to wishlist successfully",
        wishlist,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to add product to wishlist",
      error: error.message,
    });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({
      user: req.user._id,
    });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: "Wishlist not found",
      });
    }

    const productExists = wishlist.products.find(
      (product) => product._id.toString() === productId,
    );

    if (!productExists) {
      return res.status(404).json({
        success: false,
        message: "Product not found in wishlist",
      });
    }
    const user = await User.findOne({ _id: req.user._id });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    }

    wishlist.products = wishlist.products.filter(
      (product) => product._id.toString() !== productId,
    );

    await wishlist.save();

    user.wishlist = wishlist.products;
    await user.save();

    await wishlist.populate("products");

    return res.status(200).json({
      success: true,
      message: "Product removed from wishlist successfully",
      wishlist,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to remove product from wishlist",
      error: error.message,
    });
  }
};

const clearWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({
      user: req.user._id,
    });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: "Wishlist not found",
      });
    }

    wishlist.products = [];
    await wishlist.save();

    const user = await User.findOne({ _id: req.user._id });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    }
    user.wishlist = [];
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Wishlist cleared successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to clear wishlist",
      error: error.message,
    });
  }
};

export { getWishlist, addToWishlist, removeFromWishlist, clearWishlist };
