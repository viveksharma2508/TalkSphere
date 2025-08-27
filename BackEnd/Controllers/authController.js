// // controllers/authController.js
// const User = require('../models/User');
// const Auth = require('../models/authentication');

// const authController = {
//   // Register
//   async register(req, res) {
//     try {
//       const { username, email, password } = req.body;

//       // Check if user exists
//       const existingUser = await User.findOne({ 
//         $or: [{ email }, { username }] 
//       });

//       if (existingUser) {
//         return res.status(400).json({ 
//           message: 'User already exists' 
//         });
//       }

//       // Create user and auth
//       const user = await User.create({ username, email });
//       const auth = await Auth.create({ userId: user._id, password });

//       // Generate tokens
//       const accessToken = auth.generateAccessToken();
//       const refreshToken = auth.generateRefreshToken();
//       await auth.save();

//       res.status(201).json({
//         message: 'Registration successful',
//         user,
//         accessToken,
//         refreshToken
//       });

//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   },

//   // Login
//   async login(req, res) {
//     try {
//       const { email, password } = req.body;

//       // Find user
//       const user = await User.findOne({ email });
//       if (!user) {
//         return res.status(401).json({ message: 'Invalid credentials' });
//       }

//       // Find auth and check password
//       const auth = await Auth.findOne({ userId: user._id }).select('+password');
//       const isMatch = await auth.comparePassword(password);
      
//       if (!isMatch) {
//         return res.status(401).json({ message: 'Invalid credentials' });
//       }

//       // Generate tokens
//       const accessToken = auth.generateAccessToken();
//       const refreshToken = auth.generateRefreshToken();
//       await auth.save();

//       res.json({
//         message: 'Login successful',
//         user,
//         accessToken,
//         refreshToken
//       });

//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   },

//   // Get current user
//   async me(req, res) {
//     try {
//       const user = await User.findById(req.user.userId);
//       res.json({ user });
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   }
// };

// module.exports = authController;



// controllers/authController.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Auth = require('../models/authentication');

function requireJwtSecrets() {
  if (!process.env.JWT_ACCESS_SECRET || !process.env.JWT_REFRESH_SECRET) {
    throw new Error('JWT secrets are missing. Set JWT_ACCESS_SECRET and JWT_REFRESH_SECRET in .env');
  }
}

function createTokens(userId) {
  requireJwtSecrets();
  const accessToken = jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET, { expiresIn: '24h' });
  const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
  return { accessToken, refreshToken };
}

const authController = {
  // Register (create new user or upgrade placeholder created by Socket.IO)
  async register(req, res) {
    const t0 = Date.now();
    try {
      const { username: rawUsername, email: rawEmail, password, photoUrl, filePath, thumbnailUrl } = req.body;
      const username = String(req.body.username || '').trim().toLowerCase();
      const email = String(req.body.email || '').trim().toLowerCase();
  

      console.log('[REGISTER] payload', { username, email, passLen: password?.length });

      if (!username || !email || !password) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
      }
      if (password.length < 6) {
        return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
      }

      let user = await User.findOne({ $or: [{ email }, { username }] });
      console.log('[REGISTER] existing user?', !!user);

      if (user) {
        // Check if real account already exists (Auth doc present)
        const existingAuth = await Auth.findOne({ userId: user._id }).select('_id');
        console.log('[REGISTER] existing auth?', !!existingAuth);

        if (existingAuth) {
          return res.status(409).json({ success: false, message: 'User already exists' });
        }

        // Upgrade placeholder user to full account
        user.username = username;
        user.email = email;
        if(photoUrl) user.photoUrl = photoUrl;
        if(filePath) user.filePath = filePath;
        if(thumbnailUrl) user.thumbnailUrl = thumbnailUrl;
        await user.save();

        const auth = await Auth.create({ userId: user._id, password }); // password hashing should happen in model
        const { accessToken, refreshToken } = createTokens(user._id);
        auth.refreshToken = refreshToken;
        await auth.save();

        const safe = user.toObject();
        delete safe.__v;

        console.log('[REGISTER] upgraded placeholder in', Date.now() - t0, 'ms');
        return res.status(200).json({
          success: true,
          message: 'Registration completed',
          user: safe,
          accessToken,
          refreshToken
        });
      }

      // Fresh user + auth
      console.log('[REGISTER] creating new user…');
      user = await User.create({ 
        username, 
        email,
        photoUrl,
        filePath,
        thumbnailUrl
      });
      const auth = await Auth.create({ userId: user._id, password });

      const { accessToken, refreshToken } = createTokens(user._id);
      auth.refreshToken = refreshToken;
      await auth.save();

      const safe = user.toObject();
      delete safe.__v;

      console.log('[REGISTER] new user created in', Date.now() - t0, 'ms');
      return res.status(201).json({
        success: true,
        message: 'Registration successful',
        user: safe,
        accessToken,
        refreshToken
      });
    } catch (error) {
      console.error('[REGISTER] error:', error?.message);

      // Mongo duplicate key
      if (error?.code === 11000) {
        const field = Object.keys(error.keyValue || {})[0] || 'field';
        return res.status(409).json({ success: false, message: `${field} already exists` });
      }

      // JWT config error surfaced clearly
      if (String(error?.message || '').includes('secret') && String(error?.message || '').includes('JWT')) {
        return res.status(500).json({ success: false, message: 'Server JWT configuration error' });
      }

      return res.status(500).json({ success: false, message: 'Registration failed' });
    }
  },

  // Login
  async login(req, res) {
    try {
      const email = String(req.body.email || '').trim().toLowerCase();
      const { password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Missing email or password' });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      const auth = await Auth.findOne({ userId: user._id }).select('+password');
      if (!auth) {
        return res.status(401).json({ success: false, message: 'Account not completed' });
      }

      const isMatch = await auth.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      const { accessToken, refreshToken } = createTokens(user._id);
      auth.refreshToken = refreshToken;
      await auth.save();

      const safe = user.toObject();
      delete safe.__v;

      return res.json({
        success: true,
        message: 'Login successful',
        user: safe,
        accessToken,
        refreshToken
      });
    } catch (error) {
      console.error('[LOGIN] error:', error?.message);
      return res.status(500).json({ success: false, message: 'Login failed' });
    }
  },

  // Current user
  async me(req, res) {
    try {
      const user = await User.findById(req.user.userId);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });

      const safe = user.toObject();
      delete safe.__v;

      return res.json({ success: true, user: safe });
    } catch (error) {
      console.error('[ME] error:', error?.message);
      return res.status(500).json({ success: false, message: 'Failed to fetch user' });
    }
  }
};

module.exports = authController;
