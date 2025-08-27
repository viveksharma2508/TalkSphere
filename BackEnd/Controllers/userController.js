// const User = require('../models/User')

// const userController = {
//     async getAllUser(req, res){
//         try {
//             const users = await User.find({
//                 _id: { $ne: req.user.userId }
//             }).select('Username email photoUrl status');

//             res.json({ users });
//         } catch (error) {
//             res.status(500).json({ message: error.message});
//         }
//     },

//     async updateProfile(req, res){
//         try {
//             const { username, photoUrl } = req.body;
//             const user = await User.findByIdAndUpdate(
//                 req.user.userid,
//                 { username, photoUrl },
//                 { new: true }
//             );

//             res.json({ message: 'Prpfile updated', user })
//         } catch (error) {
//            res.status(500).json({message: error.message});
//         }
//     },

    
//     async updateStatus(req, res){
//         try {
//             const { status, sockeID } = req.body;

//             const updateData = { status };
//             if(status === 'online') updateData.sockeID = sockeID;
//             if(status === 'online') updateData.sockeID = sockeID;

//             const user = await User.findByIdAndUpdate(
//                 req.user.userId,
//                 updateData,
//                 { new: true}
//             );

//             res.json({ user });
//         } catch (error) {
//            res.status(500).json({message: error.message});
//         }
//     },
// }

// module.exports = userController;


// // controllers/userController.js
// const User = require('../models/User');

// const userController = {
//   // GET /api/users
//   async getAllUser(req, res) {
//     try {
//       const me = req.user?.userId;
//       const users = await User.find({ _id: { $ne: me } })
//         .select('username email photoUrl status lastSeen')
//         .lean();

//       return res.json({ success: true, users });
//     } catch (error) {
//       console.error('getAllUser error:', error);
//       return res.status(500).json({ success: false, message: 'Failed to load users' });
//     }
//   },

//   // PUT /api/users/profile
//   async updateProfile(req, res) {
//     try {
//       const userId = req.user?.userId; // FIX: correct casing
//       if (!userId) {
//         return res.status(401).json({ success: false, message: 'Unauthorized' });
//       }

//       const { username, photoUrl } = req.body;

//       const update = {};
//       if (typeof username === 'string' && username.trim()) {
//         update.username = username.trim().toLowerCase();
//       }
//       if (typeof photoUrl === 'string' && photoUrl.trim()) {
//         update.photoUrl = photoUrl.trim();
//       }

//       if (!Object.keys(update).length) {
//         return res.json({ success: true, message: 'Nothing to update' });
//       }

//       const user = await User.findByIdAndUpdate(
//         userId,
//         { $set: update },
//         { new: true, runValidators: true }
//       ).lean();

//       if (!user) {
//         return res.status(404).json({ success: false, message: 'User not found' });
//       }

//       return res.json({ success: true, message: 'Profile updated', user });
//     } catch (error) {
//       // Handle duplicate key errors from unique indexes
//       if (error && error.code === 11000) {
//         const field = Object.keys(error.keyValue || {})[0] || 'field';
//         return res.status(409).json({ success: false, message: `${field} already exists` });
//       }
//       console.error('updateProfile error:', error);
//       return res.status(500).json({ success: false, message: 'Failed to update profile' });
//     }
//   },

//   // PUT /api/users/status
//   async updateStatus(req, res) {
//     try {
//       const userId = req.user?.userId;
//       if (!userId) {
//         return res.status(401).json({ success: false, message: 'Unauthorized' });
//       }

//       const { status, socketID } = req.body; // FIX: socketID
//       if (!status) {
//         return res.status(400).json({ success: false, message: 'Missing status' });
//       }

//       // Build update payload
//       const update = { status };

//       if (status === 'online') {
//         if (socketID) update.socketID = socketID;
//       } else if (status === 'offline') {
//         update.lastSeen = new Date();
//         // unset socketID when offline
//         update.$unset = { socketID: 1 };
//       }

//       const user = await User.findByIdAndUpdate(userId, update, { new: true }).lean();

//       if (!user) {
//         return res.status(404).json({ success: false, message: 'User not found' });
//       }

//       return res.json({ success: true, user });
//     } catch (error) {
//       console.error('updateStatus error:', error);
//       return res.status(500).json({ success: false, message: 'Failed to update status' });
//     }
//   },
// };

// module.exports = userController;


// controllers/userController.js
const User = require('../models/User');

const userController = {
  // GET /api/users/me
  async getMe(req, res) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const user = await User.findById(userId)
        .select('_id username email photoUrl filePath thumbnailUrl status socketID lastSeen createdAt updatedAt')
      

      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      return res.json({ success: true, user });
    } catch (error) {
      console.error('getMe error:', error);
      return res.status(500).json({ success: false, message: 'Failed to load profile' });
    }
  },

  // GET /api/users
  async getAllUser(req, res) {
    try {
      const me = req.user?.userId;
      const users = await User.find({ _id: { $ne: me } })
        .select('_id username email photoUrl filePath thumbnailUrl socketID status lastSeen')
        .lean();

      return res.json({ success: true, users });
    } catch (error) {
      console.error('getAllUser error:', error);
      return res.status(500).json({ success: false, message: 'Failed to load users' });
    }
  },

  // PUT /api/users/profile
  // Accepts: { username?, photoUrl?, filePath?, thumbnailUrl? }
  async updateProfile(req, res) {
    console.log('1. Inside updateProfile function.');
    try {
      const userId = req.user?.userId;
      console.log('2. Extracted userId from token:', userId);

      if (!userId) {
        console.error('Error: Unauthorized access - missing userId.');
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      console.log('3. Received request body:', req.body);
      const { username, photoUrl, filePath, thumbnailUrl } = req.body;

      const update = {};
      
      console.log('4. Building update object...');
      if (typeof username === 'string' && username.trim()) {
        update.username = username.trim().toLowerCase();
        console.log('   - Added username to update.');
      } else {
        console.log('   - Username is invalid or missing.');
      }
      
      if (typeof photoUrl === 'string' && photoUrl.trim()) {
        update.photoUrl = photoUrl.trim();
        console.log('   - Added photoUrl to update.');
      } else {
        console.log('   - photoUrl is invalid or missing.');
      }
      
      if (typeof filePath === 'string' && filePath.trim()) {
        update.filePath = filePath.trim();
        console.log('   - Added filePath to update.');
      } else {
        console.log('   - filePath is invalid or missing.');
      }
      
      if (typeof thumbnailUrl === 'string' && thumbnailUrl.trim()) {
        update.thumbnailUrl = thumbnailUrl.trim();
        console.log('   - Added thumbnailUrl to update.');
      } else {
        console.log('   - thumbnailUrl is invalid or missing.');
      }

      console.log('5. Final update object:', update);

      if (Object.keys(update).length === 0) {
        console.log('6. No valid fields to update. Sending response.');
        return res.json({ success: true, message: 'Nothing to update' });
      }
      
      console.log('7. Attempting to find and update user in database...');
      const user = await User.findByIdAndUpdate(
        userId,
        { $set: update },
        { new: true, runValidators: true }
      ).lean();

      console.log('8. Database query completed.');

      if (!user) {
        console.error('Error: User not found with ID:', userId);
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      console.log('9. User updated successfully. Sending response.');
      return res.json({ success: true, message: 'Profile updated', user });

    } catch (error) {
      console.error('FATAL CATCHED ERROR:', error);
      if (error && error.code === 11000) {
        return res.status(409).json({ success: false, message: 'Duplicate key error.' });
      }
      return res.status(500).json({ success: false, message: 'Failed to update profile due to a server error.' });
    }
  },

  // PUT /api/users/status
  // Accepts: { status: 'online' | 'offline', socketID? }
  async updateStatus(req, res) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const { status, socketID } = req.body;
      if (!status) {
        return res.status(400).json({ success: false, message: 'Missing status' });
      }

      // Align casing with schema enum: 'Online' | 'Offline'
      const normalized = String(status).toLowerCase() === 'online' ? 'Online' : 'Offline';

      const update = { status: normalized };

      if (normalized === 'Online') {
        if (socketID) update.socketID = socketID;
        if (update.$unset) delete update.$unset;
      } else {
        update.lastSeen = new Date();
        update.$unset = { socketID: 1 };
      }

      const user = await User.findByIdAndUpdate(userId, update, { new: true }).lean();

      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      return res.json({ success: true, user });
    } catch (error) {
      console.error('updateStatus error:', error);
      return res.status(500).json({ success: false, message: 'Failed to update status' });
    }
  },
};

module.exports = userController;

