import Product from "../models/Product.model.js";
import User from "../models/User.model.js";
import Wishlist from "../models/Wishlist.model.js";
import Cart from "../models/Cart.model.js";

import { uploadToCloudinary, deleteFromCloudinary } from "../utils/upload.js";
import {
  ProductFilter,
  ProductSort,
  Pagination,
} from "../utils/productQuery.js";

const getProducts = async (req, res) => {
  try {
    const filter = ProductFilter(req.query);

    const sortOption = ProductSort(req.query.sort);

    const totalProducts = await Product.countDocuments(filter);

    const { page, limit, skip, totalPages } = Pagination(
      req.query,
      totalProducts,
    );

    const products = await Product.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      totalProducts,
      currentPage: page,
      totalPages,
      products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to get products",
      error: error.message,
    });
  }
};

const searchProducts = async (req, res) => {
  try {
    const { tags } = req.query;

    const filter = ProductFilter(req.query);

    if (tags) {
      const tagsArray = Array.isArray(tags) ? tags : tags.split(",");

      filter.tags = {
        $in: tagsArray,
      };
    }

    const sortOption = ProductSort(req.query.sort);

    const totalProducts = await Product.countDocuments(filter);

    const { page, limit, skip, totalPages } = Pagination(
      req.query,
      totalProducts,
    );

    const products = await Product.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      totalProducts,
      currentPage: page,
      totalPages,
      products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to search products",
      error: error.message,
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to get product",
      error: error.message,
    });
  }
};

const createProduct = async (req, res) => {
  try {
    const {
      name,
      shortDescription,
      description,
      price,
      discountPrice,
      stock,
      sku,
      category,
      subcategory,
      brand,
      tags,
      featured,
      isActive,
    } = req.body;

    const uploadImage = await Promise.all(
      (req.files || []).map(async (file) => {
        const result = await uploadToCloudinary(file.buffer);
        return {
          public_id: result.public_id,
          url: result.secure_url,
        };
      }),
    );

    const product = await Product.create({
      name,
      shortDescription,
      description,
      price,
      discountPrice,
      stock,
      sku,
      category,
      subcategory,
      brand,
      tags,
      featured,
      isActive,
      images: uploadImage,
      createdBy: req.user._id,
    });
    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Product already exists",
      });
    }
    return res.status(500).json({
      success: false,
      message: "Failed to create product",
      error: error.message,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const bodyFeild = Object.keys(req.body || {}).length > 0;
    const filesFeild = req.files && req.files.length > 0;

    if (!bodyFeild && !filesFeild) {
      return res.status(400).json({
        success: false,
        message: "At least update one  field",
      });
    }

    const { id } = req.params;
    const { deletedImages } = req.body || {};

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // const imagesToDelete = deletedImages
    //   ? Array.isArray(deletedImages)
    //     ? deletedImages
    //     : [deletedImages]
    //   : [];
    const imagesToDelete = deletedImages
  ? Array.isArray(deletedImages)
    ? deletedImages
    : deletedImages.split(",").map((id) => id.trim())
  : [];

    const notFoundImages = imagesToDelete.filter(
      (publicId) =>
        !product.images.find((image) => image.public_id === publicId),
    );

    if (notFoundImages.length > 0) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
        publicIds: notFoundImages,
      });
    }

    const newImagesCount = req.files?.length || 0;

    const finalImagesCount =
      product.images.length - imagesToDelete.length + newImagesCount;

    if (finalImagesCount > 5) {
      return res.status(400).json({
        success: false,
        message:
          "Maximum 5 images are allowed. Please delete an existing image first.",
      });
    }

    const allowedFields = [
      "name",
      "shortDescription",
      "description",
      "price",
      "discountPrice",
      "stock",
      "sku",
      "category",
      "subcategory",
      "brand",
      "tags",
      "featured",
      "isActive",
    ];

    const updateData = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    if (imagesToDelete.length > 0) {
      await Promise.all(
        imagesToDelete.map((publicId) => deleteFromCloudinary(publicId)),
      );

      product.images = product.images.filter(
        (image) => !imagesToDelete.includes(image.public_id),
      );
    }

    const uploadImages = await Promise.all(
      (req.files || []).map(async (file) => {
        const result = await uploadToCloudinary(file.buffer);

        return {
          public_id: result.public_id,
          url: result.secure_url,
        };
      }),
    );

    if (uploadImages.length > 0) {
      product.images.push(...uploadImages);
    }

    product.set(updateData);
    await product.save();

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update product",
      error: error.message,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await Promise.all(
      product.images.map((image) => deleteFromCloudinary(image.public_id)),
    );

    await product.deleteOne();

    await User.updateMany({ wishlist: id }, { $pull: { wishlist: id } });

    await Wishlist.updateMany({ products: id }, { $pull: { products: id } });

    await Cart.updateMany(
      { "items.product": id },
      { $pull: { items: { product: id } } },
    );

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete product",
      error: error.message,
    });
  }
};

export {
  getProducts,
  searchProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
