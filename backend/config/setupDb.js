const db = require('./db');

function setupDatabase() {
  return new Promise((resolve, reject) => {
    // Helper function for querying with promises
    const queryAsync = (sql, params = []) => {
      return new Promise((res, rej) => {
        db.query(sql, params, (err, results) => {
          if (err) return rej(err);
          res(results);
        });
      });
    };

    async function runMigrations() {
      try {
        // 1. Create users table if not exists
        await queryAsync(`
          CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            fullname VARCHAR(255) NOT NULL,
            phone VARCHAR(50) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            role VARCHAR(50) DEFAULT 'user',
            profile_photo VARCHAR(255) DEFAULT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `);

        // 2. Create products table if not exists
        await queryAsync(`
          CREATE TABLE IF NOT EXISTS products (
            id INT AUTO_INCREMENT PRIMARY KEY,
            luvy_product_id VARCHAR(50) DEFAULT NULL,
            product_name VARCHAR(255) NOT NULL,
            description TEXT NOT NULL,
            category VARCHAR(100) NOT NULL,
            price DECIMAL(10, 2) NOT NULL,
            stock INT NOT NULL DEFAULT 0,
            image TEXT NOT NULL,
            product_type VARCHAR(50) DEFAULT 'shop',
            status VARCHAR(50) DEFAULT 'Active',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `);

        // 3. Create orders table if not exists
        await queryAsync(`
          CREATE TABLE IF NOT EXISTS orders (
            id INT AUTO_INCREMENT PRIMARY KEY,
            luvy_order_id VARCHAR(50) DEFAULT NULL,
            user_id INT DEFAULT NULL,
            customer_name VARCHAR(255) NOT NULL,
            phone_number VARCHAR(50) NOT NULL,
            address TEXT NOT NULL,
            total_amount DECIMAL(10, 2) NOT NULL,
            payment_method VARCHAR(50) NOT NULL DEFAULT 'Online',
            order_status VARCHAR(50) NOT NULL DEFAULT 'Pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `);

        // 4. Create order_items table if not exists
        await queryAsync(`
          CREATE TABLE IF NOT EXISTS order_items (
            id INT AUTO_INCREMENT PRIMARY KEY,
            order_id INT NOT NULL,
            product_id INT DEFAULT NULL,
            product_name VARCHAR(255) NOT NULL,
            product_price DECIMAL(10, 2) NOT NULL,
            quantity INT NOT NULL DEFAULT 1,
            product_image TEXT DEFAULT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `);

        // 5. Create notifications table if not exists
        await queryAsync(`
          CREATE TABLE IF NOT EXISTS notifications (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT DEFAULT NULL,
            title VARCHAR(255) NOT NULL,
            description TEXT NOT NULL,
            type VARCHAR(50) NOT NULL,
            reference_id INT DEFAULT NULL,
            is_read TINYINT(1) DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `);

        // 6. Create contact_messages table if not exists
        await queryAsync(`
          CREATE TABLE IF NOT EXISTS contact_messages (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            phone VARCHAR(50) DEFAULT NULL,
            subject VARCHAR(255) DEFAULT NULL,
            message TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `);

        // 7. Create reviews table if not exists
        await queryAsync(`
          CREATE TABLE IF NOT EXISTS reviews (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT DEFAULT NULL,
            customer VARCHAR(255) NOT NULL,
            product VARCHAR(255) NOT NULL,
            rating INT NOT NULL DEFAULT 5,
            review TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `);

        // Ensure optional columns exist in case of partial schemas
        const userCols = await queryAsync("SHOW COLUMNS FROM users LIKE 'profile_photo'");
        if (userCols.length === 0) {
          await queryAsync("ALTER TABLE users ADD COLUMN profile_photo VARCHAR(255) DEFAULT NULL");
        }

        const productCols = await queryAsync("SHOW COLUMNS FROM products LIKE 'luvy_product_id'");
        if (productCols.length === 0) {
          await queryAsync("ALTER TABLE products ADD COLUMN luvy_product_id VARCHAR(50) DEFAULT NULL");
        }
        await queryAsync(
          "UPDATE products SET luvy_product_id = CONCAT('LUVY-PRD-', LPAD(id, 4, '0')) WHERE luvy_product_id IS NULL OR luvy_product_id = ''"
        );

        const orderCols = await queryAsync("SHOW COLUMNS FROM orders LIKE 'luvy_order_id'");
        if (orderCols.length === 0) {
          await queryAsync("ALTER TABLE orders ADD COLUMN luvy_order_id VARCHAR(50) DEFAULT NULL");
        }
        await queryAsync(
          "UPDATE orders SET luvy_order_id = CONCAT('LUVY-ORD-', LPAD(id, 5, '0')) WHERE luvy_order_id IS NULL OR luvy_order_id = ''"
        );

        // Seed admin user if not exists
        const bcrypt = require('bcryptjs');
        const adminEmail = 'priyanka@gmail.com';
        const existingAdmin = await queryAsync("SELECT * FROM users WHERE LOWER(TRIM(email)) = LOWER(?)", [adminEmail]);
        if (existingAdmin.length === 0) {
          const hashedAdminPw = await bcrypt.hash('admin123', 10);
          await queryAsync(
            "INSERT INTO users (fullname, phone, email, password, role) VALUES (?, ?, ?, ?, ?)",
            ['Priyanka Admin', '9876543210', adminEmail, hashedAdminPw, 'admin']
          );
          console.log(`Default admin account created: ${adminEmail} (password: admin123)`);
        } else if (existingAdmin[0].role !== 'admin') {
          await queryAsync("UPDATE users SET role = 'admin' WHERE id = ?", [existingAdmin[0].id]);
        }

        console.log('Database tables & migrations checked/applied successfully.');
        
        // Auto-seed initial products catalog if empty
        const seedProductsIfEmpty = require('./seedProducts');
        await seedProductsIfEmpty();

        resolve();
      } catch (err) {
        console.error('Database migration error:', err);
        reject(err);
      }
    }

    runMigrations();
  });
}

module.exports = setupDatabase;
