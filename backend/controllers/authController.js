const jwt = require('jsonwebtoken');
const db = require('../config/db');
const bcrypt = require('bcryptjs');

const testAuth = (req, res) => {
  res.send('Auth Controller Working');
};

const signupUser = async (req, res) => {
  try {
    const {
      fullname,
      phone,
      email,
      password,
      confirmPassword,
    } = req.body;

    // Check empty fields
    if (
      !fullname ||
      !phone ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      return res.status(400).json({
        message: 'All fields are required',
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Password match check
    if (password !== confirmPassword) {
      return res.status(400).json({
        message: 'Passwords do not match',
      });
    }

    // Check existing user (case-insensitive)
    const checkQuery = 'SELECT * FROM users WHERE LOWER(TRIM(email)) = LOWER(TRIM(?))';

    db.query(checkQuery, [cleanEmail], async (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }

      // User already exists
      if (result.length > 0) {
        return res.status(400).json({
          message: 'User already exists',
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert user
      const insertQuery = `
        INSERT INTO users (fullname, phone, email, password, role)
        VALUES (?, ?, ?, ?, 'user')
      `;

      db.query(
        insertQuery,
        [fullname.trim(), phone.trim(), cleanEmail, hashedPassword],
        (err, result) => {
          if (err) {
            return res.status(500).json(err);
          }

          return res.status(201).json({
            message: 'User registered successfully',
          });
        }
      );
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

const loginUser = (req, res) => {
  try {
    const { email, password } = req.body;

    // Check empty fields
    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required',
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check user exists (case-insensitive)
    const query = 'SELECT * FROM users WHERE LOWER(TRIM(email)) = LOWER(TRIM(?))';

    db.query(query, [cleanEmail], async (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }

      // User not found
      if (result.length === 0) {
        return res.status(400).json({
          message: 'Invalid email or password',
        });
      }

      const user = result[0];

      // Compare password
      const isMatch = await bcrypt.compare(
        password,
        user.password
      );

      if (!isMatch) {
        return res.status(400).json({
          message: 'Invalid email or password',
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        process.env.JWT_SECRET || 'luvy_secret_key',
        {
          expiresIn: '7d',
        }
      );

      // Send response
      return res.status(200).json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          fullname: user.fullname,
          email: user.email,
          phone: user.phone,
          role: user.role,
          profile_photo: user.profile_photo || null,
        },
      });
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

const getProfile = (req, res) => {
  const userId = req.params.id;
  const query = 'SELECT id, fullname, email, phone, role, profile_photo FROM users WHERE id = ?';
  db.query(query, [userId], (err, results) => {
    if (err) {
      return res.status(500).json(err);
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json(results[0]);
  });
};

const updateProfile = (req, res) => {
  const userId = req.params.id;
  const { fullname, email } = req.body;
  let profilePhoto = null;

  if (req.file) {
    profilePhoto = 'uploads/' + req.file.filename;
  }

  // Check if email already in use by another user
  const checkEmailQuery = 'SELECT * FROM users WHERE email = ? AND id != ?';
  db.query(checkEmailQuery, [email, userId], (err, results) => {
    if (err) {
      return res.status(500).json(err);
    }
    if (results.length > 0) {
      return res.status(400).json({ message: 'Email is already in use by another account' });
    }

    const updateQuery = profilePhoto 
      ? 'UPDATE users SET fullname = ?, email = ?, profile_photo = ? WHERE id = ?'
      : 'UPDATE users SET fullname = ?, email = ? WHERE id = ?';
      
    const queryParams = profilePhoto
      ? [fullname, email, profilePhoto, userId]
      : [fullname, email, userId];

    db.query(updateQuery, queryParams, (updateErr, result) => {
      if (updateErr) {
        return res.status(500).json(updateErr);
      }

      // Fetch the updated user details to return to the frontend
      const selectQuery = 'SELECT id, fullname, email, phone, role, profile_photo FROM users WHERE id = ?';
      db.query(selectQuery, [userId], (selectErr, selectResults) => {
        if (selectErr) {
          return res.status(500).json(selectErr);
        }
        return res.status(200).json({
          message: 'Profile updated successfully',
          user: selectResults[0]
        });
      });
    });
  });
};

const changePassword = async (req, res) => {
  const userId = req.params.id;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Current and new passwords are required' });
  }

  const query = 'SELECT * FROM users WHERE id = ?';
  db.query(query, [userId], async (err, results) => {
    if (err) {
      return res.status(500).json(err);
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect current password' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updateQuery = 'UPDATE users SET password = ? WHERE id = ?';
    db.query(updateQuery, [hashedPassword, userId], (updateErr) => {
      if (updateErr) {
        return res.status(500).json(updateErr);
      }
      return res.status(200).json({ message: 'Password updated successfully' });
    });
  });
};

module.exports = {
  testAuth,
  signupUser,
  loginUser,
  getProfile,
  updateProfile,
  changePassword,
};