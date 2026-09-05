

const db = require('../config/db');

const addProduct = (req, res) => {
  try {
    const {
      product_name,
      description,
      category,
      price,
      stock,
      product_type,
      luvy_product_id
    } = req.body;

    let imageList = [];
    if (req.files && req.files.length > 0) {
      imageList = req.files.map(f => f.filename);
    } else if (req.file) {
      imageList = [req.file.filename];
    }

    const image = imageList.length === 1 ? imageList[0] : (imageList.length > 1 ? JSON.stringify(imageList) : null);

    if (
      !product_name ||
      !description ||
      !category ||
      !price ||
      stock === undefined ||
      !image
    ) {
      return res.status(400).json({
        message: 'All fields including image are required',
      });
    }

    const generatedLuvyId = luvy_product_id || `LUVY-PRD-${Math.floor(1000 + Math.random() * 9000)}`;

    const query = `
      INSERT INTO products
      (product_name, description, category, price, stock, image, product_type, luvy_product_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      query,
      [
        product_name,
        description,
        category,
        price,
        stock,
        image,
        product_type || 'shop',
        generatedLuvyId
      ],
      (err, result) => {
        if (err) {
          console.error('ADD PRODUCT ERROR:', err);
          return res.status(500).json(err);
        }

        return res.status(201).json({
          message: 'Product added successfully',
          id: result.insertId,
          luvy_product_id: generatedLuvyId
        });
      }
    );
  } catch (error) {
    console.error('ADD PRODUCT CATCH ERROR:', error);
    return res.status(500).json(error);
  }
};

const getProducts = (req, res) => {
  const query = `
    SELECT *
    FROM products
    ORDER BY id DESC
  `;

  db.query(query, (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }
    return res.status(200).json(result);
  });
};

const getShopProducts = (req, res) => {
  const query = `
    SELECT *
    FROM products
    WHERE product_type='shop'
    ORDER BY id DESC
  `;

  db.query(query, (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }
    return res.status(200).json(result);
  });
};

const getSpecialProducts = (req, res) => {
  const query = `
    SELECT *
    FROM products
    WHERE product_type='special'
    ORDER BY id DESC
  `;

  db.query(query, (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }
    return res.status(200).json(result);
  });
};

const getNewArrivalProducts = (req, res) => {
  const query = `
    SELECT *
    FROM products
    WHERE product_type = 'new_arrival'
    ORDER BY id DESC
  `;

  db.query(query, (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }
    return res.status(200).json(result);
  });
};

const updateProduct = (req, res) => {
  const id = req.params.id;
  const {
    product_name,
    description,
    category,
    price,
    stock,
    product_type,
    existing_images
  } = req.body;

  // Parse existing images if provided (can be JSON array string, comma-separated string, or array)
  let retainedImages = [];
  if (existing_images) {
    try {
      retainedImages = Array.isArray(existing_images) 
        ? existing_images 
        : (existing_images.startsWith('[') ? JSON.parse(existing_images) : [existing_images]);
    } catch (e) {
      retainedImages = [existing_images];
    }
  }

  // Parse new uploaded files
  let newUploadedImages = [];
  if (req.files && req.files.length > 0) {
    newUploadedImages = req.files.map(f => f.filename);
  } else if (req.file) {
    newUploadedImages = [req.file.filename];
  }

  // Combined final image list
  const combinedImages = [...retainedImages, ...newUploadedImages].filter(Boolean);

  let finalImageValue = null;
  if (combinedImages.length === 1) {
    finalImageValue = combinedImages[0];
  } else if (combinedImages.length > 1) {
    finalImageValue = JSON.stringify(combinedImages);
  }

  let query = '';
  let params = [];

  if (finalImageValue !== null || existing_images !== undefined) {
    query = `
      UPDATE products
      SET
        product_name=?,
        description=?,
        category=?,
        price=?,
        stock=?,
        product_type=?,
        image=?
      WHERE id=?
    `;
    params = [product_name, description, category, price, stock, product_type, finalImageValue, id];
  } else {
    query = `
      UPDATE products
      SET
        product_name=?,
        description=?,
        category=?,
        price=?,
        stock=?,
        product_type=?
      WHERE id=?
    `;
    params = [product_name, description, category, price, stock, product_type, id];
  }

  db.query(query, params, (err) => {
    if (err) {
      console.error('UPDATE PRODUCT ERROR:', err);
      return res.status(500).json(err);
    }

    res.json({
      message: 'Product updated successfully'
    });
  });
};

const deleteProduct = (req, res) => {
  const id = req.params.id;
  const query = 'DELETE FROM products WHERE id = ?';

  db.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    return res.status(200).json({
      message: 'Product deleted successfully'
    });
  });
};

const getPremiumProducts = (req, res) => {
  const query = `
    SELECT *
    FROM products
    WHERE product_type = 'premium'
    ORDER BY id DESC
  `;

  db.query(query, (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json(result);
  });
};

module.exports = {
  addProduct,
  getProducts,
  getSpecialProducts,
  deleteProduct,
  updateProduct,
  getShopProducts,
  getNewArrivalProducts,
  getPremiumProducts 
};