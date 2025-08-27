// const Message = require('../models/Message');

// const messageController = {
//     async sendMessage(req, res){
//         try {
//             const { recievedId, content } = req.body;

//             const message = await Message.create({
//                 senderId: req.user.userId,
//                 receiverId: recievedId || null,
//                 content
//             });

//            const populatedMessage = await Message.findById(message._id)
//             .populate('senderId', 'username photoUrl')
//             .populate('receiverId', 'username photoUrl');

//         res.status(201).json({ message: populatedMessage });
//         } catch (error) {
//             res.status(500).json({message: error.message})
//         }
//     },

//     async getMessage(req, res){
//         try {
//             const { receiverId, limit = 50 } = req.body;
//             const currentUserId = req.user.userId;

//             let query = {};

//             if (receiverId) {
//         query = {
//           $or: [
//             { senderId: currentUserId, receiverId },
//             { senderId: receiverId, receiverId: currentUserId }
//           ]
//         };
//       } else {
//         query = { receiverId: null };
//       }

//       const messages = await Message.find(query)
//         .populate('senderId', 'username photoUrl')
//         .populate('receiverId', 'username photoUrl')
//         .sort({ createdAt: -1 })
//         .limit(parseInt(limit));

//       res.json({ messages: messages.reverse() });
//         } catch (error) {
//             res.status(500).json({message: error.message})
//         }
//     },

//     async deleteMessage(req, res){
//         try {
//             const { messageId } = req.params;

//             const message = await Message.findById(messageId)

//             if(message.senderId.toString() != req.user.userId){
//                 return res.status(403).json({ message: 'Not authorized'})
//             }

//             await Message.findByIdAndUpdate(messageId, {
//                 content: 'This message was deleted',
//                 deleteAt: new Date()
//             });

//             res.status(201).json({ message: populatedMessage });
//         } catch (error) {
//             res.status(500).json({message: error.message})
//         }
//     },

// }


// module.exports = messageController;
const Message = require('../models/Message');

const messageController = {
  async sendMessage(req, res) {
    try {
      const { receiverId, content, attachmentUrl, messageType } = req.body;

      const message = await Message.create({
        senderId: req.user.userId,
        receiverId: receiverId || null, // ✅ match schema spelling
        content: content || undefined,
        attachmentUrl: attachmentUrl || undefined,
        messageType: messageType || (attachmentUrl ? "image" : "text")
      });

      const populatedMessage = await Message.findById(message._id)
        .populate('senderId', 'username photoUrl')
        .populate('receiverId', 'username photoUrl'); // ✅ match schema spelling

      // 🔌 Emit to both sender and receiver
      if (receiverId) {
        io.to(receiverId.toString()).emit("newMessage", populatedMessage);
      }
      io.to(req.user.userId.toString()).emit("newMessage", populatedMessage);

      res.status(201).json({ message: populatedMessage });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async getMessage(req, res) {
    try {
      const { receiverId, limit = 50 } = req.body;
      const currentUserId = req.user.userId;

      let query = {};

      if (receiverId) {
        query = {
          $or: [
            { senderId: currentUserId, receiverId },
            { senderId: receiverId, receiverId: currentUserId }
          ]
        };
      } else {
        query = { receiverId: null }; // ✅ for group/public chat
      }

      const messages = await Message.find(query)
        .populate('senderId', 'username photoUrl')
        .populate('receiverId', 'username photoUrl') // ✅ fixed
        .sort({ createdAt: -1 })
        .limit(parseInt(limit));

      res.json({ messages: messages.reverse() });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async deleteMessage(req, res) {
    try {
      const { messageId } = req.params;

      const message = await Message.findById(messageId);
      if (!message) return res.status(404).json({ message: 'Message not found' });

      if (message.senderId.toString() !== req.user.userId) {
        return res.status(403).json({ message: 'Not authorized' });
      }

      const updatedMessage = await Message.findByIdAndUpdate(
        messageId,
        {
          content: 'This message was deleted',
          deleteAt: new Date()
        },
        { new: true }
      )
        .populate('senderId', 'username photoUrl')
        .populate('receiverId', 'username photoUrl'); // ✅ fixed

      res.status(200).json({ message: updatedMessage });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = messageController;
