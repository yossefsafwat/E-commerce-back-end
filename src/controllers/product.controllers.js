import Product from "../models/Product.model.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/upload.js";

// Get Products
export const getProducts = async (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1);

  const limit = Math.min(
    Math.max(Number(req.query.limit) || 10, 1),
    100
  );

  const sort = req.query.sort;

  let sortOption = {};

  const category = req.query.category;
  const subcategory = req.query.subcategory;
  const brand = req.query.brand;

  const minPrice = Number(req.query.minPrice);
  const maxPrice = Number(req.query.maxPrice);

  const filter = {
    isActive: true,
  };

  if (category) {
    filter.category = category;
  }

  if (subcategory) {
    filter.subcategory = subcategory;
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

  // Sorting
  if (sort === "price_asc") {
    sortOption = { price: 1 };
  }

  if (sort === "price_desc") {
    sortOption = { price: -1 };
  }

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


// Search Products
export const searchProducts = async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);

    const limit = Math.min(
      Math.max(Number(req.query.limit) || 10, 1),
      100
    );

    const {
      search,
      category,
      subcategory,
      brand,
      tags,
      minPrice,
      maxPrice,
      sort,
    } = req.query;

    const filter = {
      isActive: true,
    };

    // Text Search
    if (search) {
      filter.$text = {
        $search: search,
      };
    }

    // Category Filter
    if (category) {
      filter.category = category;
    }

    // Subcategory Filter
    if (subcategory) {
      filter.subcategory = subcategory;
    }

    // Brand Filter
    if (brand) {
      filter.brand = brand;
    }

    // Tags Filter
    if (tags) {
      const tagsArray = Array.isArray(tags) ? tags : tags.split(",");

      filter.tags = {
        $in: tagsArray,
      };
    }

    // Price Filter
    const min = Number(minPrice);
    const max = Number(maxPrice);

    if (!isNaN(min)) {
      filter.price = {
        $gte: min,
      };
    }

    if (!isNaN(max)) {
      filter.price = {
        ...filter.price,
        $lte: max,
      };
    }

    // Sorting
    let sortOption = {};

    if (sort === "price_asc") {
      sortOption = {
        price: 1,
      };
    }

    if (sort === "price_desc") {
      sortOption = {
        price: -1,
      };
    }

    if (sort === "rating") {
      sortOption = {
        averageRating: -1,
      };
    }

    if (sort === "oldest") {
      sortOption = {
        createdAt: 1,
      };
    }

    if (sort === "newest") {
      sortOption = {
        createdAt: -1,
      };
    }

    const skip = (page - 1) * limit;

    const totalProducts = await Product.countDocuments(filter);

    const totalPages = Math.ceil(totalProducts / limit);

    const products = await Product.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      products,
      pagination: {
        page,
        limit,
        totalProducts,
        totalPages,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to search products",
      error: error.message,
    });
  }
};


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
      images: uploadImage,

      createdBy: req.user._id,
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
      deleteImages,
    } = req.body;

    // Update normal product fields
    const updateData = {};

    if (name !== undefined) updateData.name = name;

    if (shortDescription !== undefined) {
      updateData.shortDescription = shortDescription;
    }

    if (description !== undefined) {
      updateData.description = description;
    }

    if (price !== undefined) {
      updateData.price = price;
    }

    if (discountPrice !== undefined) {
      updateData.discountPrice = discountPrice;
    }

    if (stock !== undefined) {
      updateData.stock = stock;
    }

    if (sku !== undefined) {
      updateData.sku = sku;
    }

    if (category !== undefined) {
      updateData.category = category;
    }

    if (subcategory !== undefined) {
      updateData.subcategory = subcategory;
    }

    if (brand !== undefined) {
      updateData.brand = brand;
    }

    if (tags !== undefined) {
      updateData.tags = tags;
    }

    // Delete selected images from Cloudinary and MongoDB
    if (deleteImages) {
      const imagesToDelete = Array.isArray(deleteImages)
        ? deleteImages
        : [deleteImages];

      await Promise.all(
        imagesToDelete.map((publicId) => deleteFromCloudinary(publicId)),
      );

      product.images = product.images.filter(
        (image) => !imagesToDelete.includes(image.public_id),
      );
    }

    // Upload new images to Cloudinary
    const uploadImages = await Promise.all(
      (req.files || []).map(async (file) => {
        const result = await uploadToCloudinary(file.buffer);

        return {
          public_id: result.public_id,
          url: result.secure_url,
        };
      }),
    );

    // Add new images to existing images
    if (uploadImages.length > 0) {
      product.images.push(...uploadImages);
    }

    // Apply normal field updates
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
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // Delete all product images from Cloudinary
    await Promise.all(
      product.images.map((image) => deleteFromCloudinary(image.public_id)),
    );

    // Delete product from MongoDB
    await product.deleteOne();

    return res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete product",
      error: error.message,
    });
  }
};


// import cloudinary from "../config/cloudinary.js";
// import Product from "../models/Product.model.js";
// import uploadToCloudinary from "../utils/upload.js"
// //Get Products
// export const getProducts = async (req, res) => {
//   const page = Number(req.query.page) || 1;
//   const limit = Number(req.query.limit) || 10;

//   const sort = req.query.sort;
//   let sortOption = {};
//   const category = req.query.category;
//   const brand = req.query.brand;

//   const minPrice = Number(req.query.minPrice);
//   const maxPrice = Number(req.query.maxPrice);

//   const filter = {
//     isActive: true,
//   };

//   if (category) {
//     filter.category = category;
//   }

//   if (brand) {
//     filter.brand = brand;
//   }

//   // Price filtering
//   if (!isNaN(minPrice)) {
//     filter.price = { $gte: minPrice };
//   }

//   if (!isNaN(maxPrice)) {
//     filter.price = {
//       ...filter.price,
//       $lte: maxPrice,
//     };
//   }

//   if (sort === "price_asc") {
//     sortOption = { price: 1 };
//   }

//   if (sort === "price_desc") {
//     sortOption = { price: -1 };
//   }
//   ////////////////////
//   if (sort === "rating") {
//     sortOption = { averageRating: -1 };
//   }

//   if (sort === "oldest") {
//     sortOption = { createdAt: 1 };
//   }

//   const skip = (page - 1) * limit;

//   const totalProducts = await Product.countDocuments(filter);

//   const totalPages = Math.ceil(totalProducts / limit);

//   const products = await Product.find(filter)
//     .sort(sortOption)
//     .skip(skip)
//     .limit(limit);

//   return res.status(200).json({
//     products,
//     pagination: {
//       page,
//       limit,
//       totalProducts,
//       totalPages,
//     },
//   });
// };
// ///////////////////////////////////////////////////

// //Get Products by ID

// export const getProductById = async (req, res) => {
//   const { id } = req.params;

//   const product = await Product.findById(id);

//   if (!product) {
//     return res.status(404).json({
//       message: "Product not found",
//     });
//   }

//   return res.status(200).json({
//     product,
//   });
// };
// ///////////////////////////////////////////////////

// //Create Product
// export const createProduct = async (req, res) => {
//   try {
//     const {
//       name,
//       shortDescription,
//       description,
//       price,
//       discountPrice,
//       stock,
//       sku,
//       category,
//       subcategory,
//       brand,
//       tags,
//     } = req.body;
//      // Dev6 - Product Image Integration
//     // Upload product images to Cloudinary and save public_id + URL
//     const uploadImage=await Promise.all(
//    (req.files||[]).map(async(file)=>{
//   const result=await uploadToCloudinary(file.buffer)
//   return{
//     public_id:result.public_id,
//     url:result.secure_url
//   }
//   })
//   )

//     const product = await Product.create({
//       name,
//       shortDescription,
//       description,
//       price,
//       discountPrice,
//       stock,
//       sku,
//       category,
//       subcategory,
//       brand,
//       tags,
//       images:uploadImage,

//       createdBy: req.user._id, //work only when adim user login!
//     });

//     return res.status(201).json({
//       message: "Product created successfully",
//       product,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: "Failed to create product",
//       error: error.message,
//     });
//   }
// };
// ///////////////////////////////////////////////////

// //Update Product
// export const updateProduct = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const product = await Product.findById(id);

//     if (!product) {
//       return res.status(404).json({
//         message: "Product not found",
//       });
//     }

//     const {
//       name,
//       shortDescription,
//       description,
//       price,
//       discountPrice,
//       stock,
//       sku,
//       category,
//       subcategory,
//       brand,
//       tags,
//     } = req.body;

//     const updateData = {};

//     if (name !== undefined) updateData.name = name;
//     if (shortDescription !== undefined)
//       updateData.shortDescription = shortDescription;
//     if (description !== undefined) updateData.description = description;
//     if (price !== undefined) updateData.price = price;
//     if (discountPrice !== undefined) updateData.discountPrice = discountPrice;
//     if (stock !== undefined) updateData.stock = stock;
//     if (sku !== undefined) updateData.sku = sku;
//     if (category !== undefined) updateData.category = category;
//     if (subcategory !== undefined) updateData.subcategory = subcategory;
//     if (brand !== undefined) updateData.brand = brand;
//     if (tags !== undefined) updateData.tags = tags;

//     product.set(updateData);

//     await product.save();

//     return res.status(200).json({
//       message: "Product updated successfully",
//       product,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: "Failed to update product",
//       error: error.message,
//     });
//   }
// };
// ///////////////////////////////////////////////////

// //Delete Product
// export const deleteProduct = async (req, res) => {
//   const { id } = req.params;

//   const product = await Product.findById(id);

//   if (!product) {
//     return res.status(404).json({
//       message: "Product not found",
//     });
//   }
//   //////delete image from cloudinary
//    await Promise.all(
//     product.images.map(async(image)=>{
//       await cloudinary.uploader.destroy(image.public_id)
//     })
//   )
//   await product.deleteOne();

//   return res.status(200).json({
//     message: "Product deleted successfully",
//   });
// };
// ///////////////delete image from product
// export const deleteProductImage = async (req, res) => {
//   const {productId}=req.params
//   const product=await Product.findById(productId)
//   if (!product) {
//     return res.status(404).json({
//       message: "Product not found",
//     })
//   }
//  const image= product.images.find((image) => {
//    return image._id.toString()===req.params.imageId
// })
//  if (!image) {
//     return res.status(404).json({
//       message: "image not found",
//     })
//   }
//   await cloudinary.uploader.destroy(image.public_id)
//   product.images = product.images.filter((image) => {
//    return image._id.toString() !== req.params.imageId
// })
// await product.save()
// return res.status(200).send({
//   message:"Image Deleted Successfully"
// })
// }
// ///////////// replace image
// export const replaceProductImage=async(req,res)=>{
//   const {productId}=req.params
//   const product=await Product.findById(productId)
//   if(!product){
//    return res.status(404).send({
//       message:"Product Not Found"
//     })
//   }
//   const image=product.images.find((image)=>{
//     return image._id.toString()===req.params.imageId
//   })
//   if(!image){
//     return res.status(404).send({
//       message:"Image Not Found"
//     })
//   }
//   await cloudinary.uploader.destroy(image.public_id )
//   const result = await uploadToCloudinary(req.file.buffer)
//   image.public_id=result.public_id
//   image.url=result.secure_url
//    await product.save()
//    res.status(200).send({
//     message:"Image Successfully Replace"
//    })
// }













// import cloudinary from "../config/cloudinary.js";
// import Product from "../models/Product.model.js";
// import uploadToCloudinary from "../utils/upload.js"
// //Get Products
// export const getProducts = async (req, res) => {
//   // const page = Number(req.query.page) || 1;
//   // const limit = Number(req.query.limit) || 10;
//   const page = Math.max(Number(req.query.page) || 1, 1);
// const limit = Math.min(
//   Math.max(Number(req.query.limit) || 10, 1),
//   100
// );

//   const sort = req.query.sort;
//   let sortOption = {};
//   const category = req.query.category;
//   const brand = req.query.brand;

//   const minPrice = Number(req.query.minPrice);
//   const maxPrice = Number(req.query.maxPrice);

//   const filter = {
//     isActive: true,
//   };

//   if (category) {
//     filter.category = category;
//   }

//   if (brand) {
//     filter.brand = brand;
//   }

//   // Price filtering
//   if (!isNaN(minPrice)) {
//     filter.price = { $gte: minPrice };
//   }

//   if (!isNaN(maxPrice)) {
//     filter.price = {
//       ...filter.price,
//       $lte: maxPrice,
//     };
//   }

//   if (sort === "price_asc") {
//     sortOption = { price: 1 };
//   }

//   if (sort === "price_desc") {
//     sortOption = { price: -1 };
//   }
//   ////////////////////
//   if (sort === "rating") {
//     sortOption = { averageRating: -1 };
//   }

//   if (sort === "oldest") {
//     sortOption = { createdAt: 1 };
//   }

//   const skip = (page - 1) * limit;

//   const totalProducts = await Product.countDocuments(filter);

//   const totalPages = Math.ceil(totalProducts / limit);

//   const products = await Product.find(filter)
//     .sort(sortOption)
//     .skip(skip)
//     .limit(limit);

//   return res.status(200).json({
//     products,
//     pagination: {
//       page,
//       limit,
//       totalProducts,
//       totalPages,
//     },
//   });
// };
// ///////////////////////////////////////////////////

// //Get Products by ID

// export const getProductById = async (req, res) => {
//   const { id } = req.params;

//   const product = await Product.findById(id);

//   if (!product) {
//     return res.status(404).json({
//       message: "Product not found",
//     });
//   }

//   return res.status(200).json({
//     product,
//   });
// };
// ///////////////////////////////////////////////////

// //Create Product
// export const createProduct = async (req, res) => {
//   try {
//     const {
//       name,
//       shortDescription,
//       description,
//       price,
//       discountPrice,
//       stock,
//       sku,
//       category,
//       subcategory,
//       brand,
//       tags,
//     } = req.body;
//      // Dev6 - Product Image Integration
//     // Upload product images to Cloudinary and save public_id + URL
//     const uploadImage=await Promise.all(
//    (req.files||[]).map(async(file)=>{
//   const result=await uploadToCloudinary(file.buffer)
//   return{
//     public_id:`ecommerce-products/${result.public_id}`,
//     url:result.secure_url
//   }
//   })
//   )

//     const product = await Product.create({
//       name,
//       shortDescription,
//       description,
//       price,
//       discountPrice,
//       stock,
//       sku,
//       category,
//       subcategory,
//       brand,
//       tags,
//       images:uploadImage,

//       createdBy: req.user._id, //work only when adim user login!
//     });

//     return res.status(201).json({
//       message: "Product created successfully",
//       product,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: "Failed to create product",
//       error: error.message,
//     });
//   }
// };
// ///////////////////////////////////////////////////

// //Update Product
// export const updateProduct = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const product = await Product.findById(id);

//     if (!product) {
//       return res.status(404).json({
//         message: "Product not found",
//       });
//     }

//     const {
//       name,
//       shortDescription,
//       description,
//       price,
//       discountPrice,
//       stock,
//       sku,
//       category,
//       subcategory,
//       brand,
//       tags,
//     } = req.body;

//     const updateData = {};

//     if (name !== undefined) updateData.name = name;
//     if (shortDescription !== undefined)
//       updateData.shortDescription = shortDescription;
//     if (description !== undefined) updateData.description = description;
//     if (price !== undefined) updateData.price = price;
//     if (discountPrice !== undefined) updateData.discountPrice = discountPrice;
//     if (stock !== undefined) updateData.stock = stock;
//     if (sku !== undefined) updateData.sku = sku;
//     if (category !== undefined) updateData.category = category;
//     if (subcategory !== undefined) updateData.subcategory = subcategory;
//     if (brand !== undefined) updateData.brand = brand;
//     if (tags !== undefined) updateData.tags = tags;

//     product.set(updateData);

//     await product.save();

//     return res.status(200).json({
//       message: "Product updated successfully",
//       product,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: "Failed to update product",
//       error: error.message,
//     });
//   }
// };
// ///////////////////////////////////////////////////

// //Delete Product
// export const deleteProduct = async (req, res) => {
//   const { id } = req.params;

//   const product = await Product.findById(id);

//   if (!product) {
//     return res.status(404).json({
//       message: "Product not found",
//     });
//   }

//   await product.deleteOne();

//   return res.status(200).json({
//     message: "Product deleted successfully",
//   });
// }; //  Don't forget Delete images from Cloudinary