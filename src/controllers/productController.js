import Product from "../models/Product.model.js";
import uploadToCloudinary from "../utilis/upload.js"
//Get Products
export const getProducts = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const sort = req.query.sort;
  let sortOption = {};
  const category = req.query.category;
  const brand = req.query.brand;

  const minPrice = Number(req.query.minPrice);
  const maxPrice = Number(req.query.maxPrice);

  const filter = {
    isActive: true,
  };

  if (category) {
    filter.category = category;
  }

  if (brand) {
    filter.brand = brand;
  }

  // Price filtering
  if (!isNaN(minPrice)) {
    filter.price = { $gte: minPrice };
  }

  if (!isNaN(maxPrice)) {
    filter.price = {
      ...filter.price,
      $lte: maxPrice,
    };
  }

  if (sort === "price_asc") {
    sortOption = { price: 1 };
  }

  if (sort === "price_desc") {
    sortOption = { price: -1 };
  }
  ////////////////////
  if (sort === "rating") {
    sortOption = { averageRating: -1 };
  }

  if (sort === "oldest") {
    sortOption = { createdAt: 1 };
  }

  const skip = (page - 1) * limit;

  const totalProducts = await Product.countDocuments(filter);

  const totalPages = Math.ceil(totalProducts / limit);

  const products = await Product.find(filter)
    .sort(sortOption)
    .skip(skip)
    .limit(limit);

  return res.status(200).json({
    products,
    pagination: {
      page,
      limit,
      totalProducts,
      totalPages,
    },
  });
};
///////////////////////////////////////////////////

//Get Products by ID

export const getProductById = async (req, res) => {
  const { id } = req.params;

  const product = await Product.findById(id);

  if (!product) {
    return res.status(404).json({
      message: "Product not found",
    });
  }

  return res.status(200).json({
    product,
  });
};
///////////////////////////////////////////////////

//Create Product
export const createProduct = async (req, res) => {
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
    } = req.body;
     // Dev6 - Product Image Integration
    // Upload product images to Cloudinary and save public_id + URL
    const uploadImage=await Promise.all(
   (req.files||[]).map(async(file)=>{
  const result=await uploadToCloudinary(file.buffer)
  return{
    public_id:result.public_id,
    url:result.secure_url
  }
  })
  )

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
      images:uploadImage,

      createdBy: req.user._id, //work only when adim user login!
    });

    return res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create product",
      error: error.message,
    });
  }
};
///////////////////////////////////////////////////

//Update Product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

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
    } = req.body;

    const updateData = {};

    if (name !== undefined) updateData.name = name;
    if (shortDescription !== undefined)
      updateData.shortDescription = shortDescription;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = price;
    if (discountPrice !== undefined) updateData.discountPrice = discountPrice;
    if (stock !== undefined) updateData.stock = stock;
    if (sku !== undefined) updateData.sku = sku;
    if (category !== undefined) updateData.category = category;
    if (subcategory !== undefined) updateData.subcategory = subcategory;
    if (brand !== undefined) updateData.brand = brand;
    if (tags !== undefined) updateData.tags = tags;

    product.set(updateData);

    await product.save();

    return res.status(200).json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update product",
      error: error.message,
    });
  }
};
///////////////////////////////////////////////////

//Delete Product
export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  const product = await Product.findById(id);

  if (!product) {
    return res.status(404).json({
      message: "Product not found",
    });
  }

  await product.deleteOne();

  return res.status(200).json({
    message: "Product deleted successfully",
  });
}; //  Don't forget Delete images from Cloudinary
