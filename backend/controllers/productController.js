

const db = require('../config/db');

const addProduct = (req, res) => {
  try {
    const {
      product_name,
      description,
      category,
      price,
      stock,
      product_type
    } = req.body;

    let image = null;
    if (req.files && req.files.length > 0) {
      if (req.files.length === 1) {
        image = req.files[0].filename;
      } else {
        image = JSON.stringify(req.files.map(f => f.filename));
      }
    } else if (req.file) {
      image = req.file.filename;
    }

    if (
      !product_name ||
      !description ||
      !category ||
      !price ||
      stock === undefined ||
      !image
    ) {
      return res.status(400).json({
        message: 'All fields are required',
      });
    }

    const query = `
      INSERT INTO products
      (product_name, description, category, price, stock, image, product_type)
      VALUES (?, ?, ?, ?, ?, ?, ?)
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
        product_type
      ],
      (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).json(err);
        }

        return res.status(201).json({
          message: 'Product added successfully',
        });
      }
    );
  } catch (error) {
    return res.status(500).json(error);
  }
};

const getProducts = (req, res) => {

  // const query = 'SELECT * FROM products';
    const query = `
    SELECT *
    FROM products
    
  `;

  db.query(query, (err, result) => {

    if (err) {
      return res.status(500).json(err);
    }

    return res.status(200).json(result);
  });
};


const getShopProducts = (req,res) => {

  const query =
  `
  SELECT *
  FROM products
  WHERE product_type='shop'
  `;


  db.query(query, (err, result) => {

    if (err) {
      return res.status(500).json(err);
    }

    return res.status(200).json(result);
  });

};

const getSpecialProducts = (req,res) => {

  const query =
  `
  SELECT *
  FROM products
  WHERE product_type='special'
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
    product_type
  } = req.body;

  let image = null;
  if (req.files && req.files.length > 0) {
    if (req.files.length === 1) {
      image = req.files[0].filename;
    } else {
      image = JSON.stringify(req.files.map(f => f.filename));
    }
  } else if (req.file) {
    image = req.file.filename;
  }

  const query = image
    ? `
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
    `
    : `
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

  const params = image
    ? [product_name, description, category, price, stock, product_type, image, id]
    : [product_name, description, category, price, stock, product_type, id];

  db.query(query, params, (err) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json({
      message: 'Product updated successfully'
    });
  });
};



const deleteProduct = (req, res) => {

  const id = req.params.id;

  const query =
    'DELETE FROM products WHERE id = ?';

  db.query(
    query,
    [id],
    (err, result) => {

      if (err) {
        return res.status(500).json(err);
      }

      return res.status(200).json({
        message: 'Product deleted successfully'
      });
    }
  );
};


const getPremiumProducts = (req, res) => {

  const query = `
    SELECT *
    FROM products
    WHERE product_type = 'premium'
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