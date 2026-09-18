import Order from "../models/Order.model.js";
import User from "../models/User.model.js";
import Cart from "../models/Cart.model.js";
import mongoose from "mongoose";
import { sendEmail, formatDate } from "../utils/email.js";
import Wishlist from "../models/Wishlist.model.js";

const getDashboardStats = async (req, res) => {
  try {
    const ordersCountByStatus = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const statusCounts = {
      pending: 0,
      processing: 0,
      confirmed: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
      returned: 0,
    };

    ordersCountByStatus.forEach((item) => {
      if (statusCounts.hasOwnProperty(item._id)) {
        statusCounts[item._id] = item.count;
      }
    });

    const totalOrders = Object.values(statusCounts).reduce((a, b) => a + b, 0);

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const totalRevenueResult = await Order.aggregate([
      {
        $match: { status: "delivered" },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalPrice" },
        },
      },
    ]);

    const totalRevenue = totalRevenueResult[0]?.total || 0;

    const thisMonthRevenue = await Order.aggregate([
      {
        $match: {
          status: "delivered",
          createdAt: { $gte: startOfMonth },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalPrice" },
        },
      },
    ]);

    const lastMonthRevenue = await Order.aggregate([
      {
        $match: {
          status: "delivered",
          createdAt: {
            $gte: startOfLastMonth,
            $lt: startOfMonth,
          },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalPrice" },
        },
      },
    ]);

    const thisMonth = thisMonthRevenue[0]?.total || 0;
    const lastMonth = lastMonthRevenue[0]?.total || 0;

    let growthPercent = 0;
    if (lastMonth > 0) {
      growthPercent = ((thisMonth - lastMonth) / lastMonth) * 100;
      growthPercent = Math.round(growthPercent * 100) / 100;
    } else if (thisMonth > 0) {
      growthPercent = 100;
    }

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("user", "username email phone avatar")
      .lean();

    const formatRecentOrders = recentOrders.map((order) => ({
      _id: order._id,
      user: order.user,
      items: order.items.map((item) => ({
        product: item.product,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
      })),
      shippingAddress: order.shippingAddress,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      transactionId: order.transactionId || "",
      subtotal: order.subtotal,
      shippingFee: order.shippingFee,
      tax: order.tax,
      discount: order.discount,
      totalPrice: order.totalPrice,
      status: order.status,
      paidAt: order.paidAt || null,
      deliveredAt: order.deliveredAt || null,
      cancelledAt: order.cancelledAt || null,
      customerNote: order.customerNote || "",
      adminNote: order.adminNote || "",
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }));

    const top10SellingProducts = await Order.aggregate([
      {
        $match: { status: "delivered" },
      },
      {
        $unwind: "$items",
      },
      {
        $group: {
          _id: "$items.product",
          name: { $first: "$items.name" },
          image: { $first: "$items.image" },
          totalSold: { $sum: "$items.quantity" },
          revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
        },
      },
      {
        $sort: { totalSold: -1 },
      },
      {
        $limit: 10,
      },
    ]);

    const ordersByStatus = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const dailyRevenue = await Order.aggregate([
      {
        $match: {
          status: "delivered",
          createdAt: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          revenue: { $sum: "$totalPrice" },
          orders: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const totalCustomers = await User.countDocuments({ role: "customer" });

    let dashboardData = {
      orders: {
        total: totalOrders,
        ...statusCounts,
      },
      revenue: {
        total: totalRevenue,
        thisMonth: thisMonth,
        lastMonth: lastMonth,
        growthPercent: growthPercent,
      },
      recentOrders: formatRecentOrders,
      topProducts: top10SellingProducts,
      ordersByStatus: ordersByStatus,
      dailyRevenue: dailyRevenue,
      totalCustomers: totalCustomers,
    };

    res.status(200).json({
      success: true,
      dashboard: dashboardData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `failed to get dashboard stats: ${error.message}`,
    });
  }
};

const getActiveCarts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const total = await Cart.countDocuments({
      items: { $not: { $size: 0 } },
    });

    const carts = await Cart.find({
      items: { $not: { $size: 0 } },
    })
      .populate("user", "username email ")
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit);

    const formattedCarts = carts.map((cart) => ({
      _id: cart._id,
      user: {
        username: cart.user.username,
        email: cart.user.email,
      },
      items: cart.items,
      subtotal: cart.subtotal,
      itemCount: cart.itemCount,
    }));
    res.status(200).json({
      success: true,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      carts: formattedCarts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `failed to get active carts: ${error.message}`,
    });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const status = req.query.status;
    const paymentStatus = req.query.paymentStatus;
    const from = req.query.from;
    const to = req.query.to;
    const sortBy = req.query.sortBy || "createdAt";
    const sortDir = req.query.sortDir === "asc" ? 1 : -1;
    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (paymentStatus) {
      filter.paymentStatus = paymentStatus;
    }

    if (from || to) {
      filter.createdAt = {};
      if (from) {
        filter.createdAt.$gte = new Date(from);
      }
      if (to) {
        filter.createdAt.$lte = new Date(to);
      }
    }

    const total = await Order.countDocuments(filter);

    const orders = await Order.find(filter)
      .sort({ [sortBy]: sortDir })
      .skip(skip)
      .limit(limit)
      .populate("user", "username email phone avatar")
      .lean();

    res.status(200).json({
      success: true,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      orders: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `failed to get orders: ${error.message}`,
    });
  }
};

const getSingleOrder = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "invalid order id format ",
      });
    }

    const order = await Order.findById(id)
      .populate("user", "username email phone avatar")
      .lean();

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "order not found",
      });
    }
    if (!order.adminNote) {
      order.adminNote = "";
    }
    res.status(200).json({
      success: true,
      order: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `failed to get order: ${error.message}`,
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    let { status, adminNote } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "invalid order id format ",
      });
    }
    const order = await Order.findById(id).populate(
      "user",
      "username email phone avatar",
    );
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "order not found",
      });
    }
    order.status = status;
    if (adminNote) {
      order.adminNote = adminNote;
    }
    if (status === "delivered") {
      order.deliveredAt = new Date();
    }
    if (status === "cancelled") {
      order.cancelledAt = new Date();
    }
    if (status === "shipped") {
      order.paidAt = new Date();
    }

    const { success } = await sendEmail(
      order.user.email,
      `Order Status Update #${order._id}`,
      "orderStatusUpdate-template.hbs",
      {
        orderId: order._id,
        customerName: order.shippingAddress.fullName,
        status: order.status,
        orderDate: formatDate(Date.now()),
        items: order.items.map((item) => item.toObject()),
        totalPrice: order.totalPrice,
        adminNote: order.adminNote,
        year: new Date().getFullYear(),
      },
    );
    if (success) {
      await order.save();
      return res.status(200).json({
        success: true,
        message: `order status updated to ${status} successfully and send email`,
        order: order,
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "error in send email for order status update",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `order status update error: ${error.message}`,
    });
  }
};

const getAllWishlists = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
   const limit = Math.min(
  Math.max(parseInt(req.query.limit) || 10, 1),
  100
);
    const skip = (page - 1) * limit;

    let [wishlists, total] = await Promise.all([
      Wishlist.find()
        .populate("user", "username email avatar")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Wishlist.countDocuments(),
    ]);

    wishlists = wishlists.map((wishlist) => {
      wishlist.products.map((product) => {
        product.reviews.map((review) => {
          review.username = wishlist.user.username;
        });
      });
      return wishlist;
    });

    res.status(200).json({
      success: true,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      wishlists,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `get on all user wishlists error: ${error.message}`,
    });
  }
};

const getWishlistStats = async (req, res) => {
  try {
    const totalWishlists = await Wishlist.countDocuments();

    const totalAgg = await Wishlist.aggregate([
      { $project: { count: { $size: "$products" } } },
      { $group: { _id: null, total: { $sum: "$count" } } },
    ]);
    const totalWishlistProducts = totalAgg[0]?.total || 0;

    const topProducts = await Wishlist.aggregate([
      { $unwind: "$products" },
      {
        $group: {
          _id: "$products",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1, _id: 1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $project: {
          _id: 1,
          productId: "$_id",
          count: 1,
          name: "$product.name",
          image: { $arrayElemAt: ["$product.images.url", 0] },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      statistics: {
        totalWishlists,
        totalWishlistProducts,
        topProducts,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `get on wishlist statistics error: ${error.message}`,
    });
  }
};

export {
  getDashboardStats,
  getActiveCarts,
  getAllOrders,
  getSingleOrder,
  updateOrderStatus,
  getAllWishlists,
  getWishlistStats,
};
