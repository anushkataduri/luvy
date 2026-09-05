// const express = require('express');

// const router = express.Router();
// const multer = require('multer');

// const {
//   addProduct,
//   getProducts,
// } = require('../controllers/productController');

// router.post('/add', addProduct);

// router.get('/', getProducts);
// router.post(
//   '/add',
//   upload.single('image'),
//   addProduct
// );

// module.exports = router;




const express = require('express');
const router = express.Router();

const multer = require('multer');

const {
  addProduct,
  getProducts,
  deleteProduct,
  updateProduct,
  getShopProducts,
  getSpecialProducts,
  getNewArrivalProducts,
  getPremiumProducts
} = require('../controllers/productController');


// multer storage
const storage = multer.diskStorage({

  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });


// routes
router.post(
  '/add',
  upload.any(),
  addProduct
);

router.get('/', getProducts);
router.get(
  '/shop',
  getShopProducts
);

router.get(
  '/special',
  getSpecialProducts
);

router.get(
  '/new-arrivals',
  getNewArrivalProducts
);

router.put(
  '/:id',
  upload.any(),
  updateProduct
);
router.delete('/:id', deleteProduct);
router.get(
  "/premium",
  getPremiumProducts
);

module.exports = router;