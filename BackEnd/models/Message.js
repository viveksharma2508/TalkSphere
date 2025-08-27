// const mongoose = require('mongoose');

// const MessageSchema = new mongoose.Schema(
//     {
//         senderId: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: 'User',
//             required: true,
//             index: true
//         },
//         receiverId: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: 'User',
//             default: null,
//             index: true
//         },
//         content:{
//             type: String,
//             required: function () { return !this.attachmentUrl && !this.audio; },
//             trim: true,
//             maxlength: 1000
//         },
//         attachmentUrl: { type: String, default: null},
//         messageType: {
//             type: String,
//             enum: ['text', 'image', 'file'],
//             default: 'text'
//         },

//         isEdited: { type: Boolean, default: false},
//         deleteAt: { type: Date},
//         deliveredAt: { type: Date},
//         readAt: { type: Date}
//     },
//     { timestamps: true}
// );

// MessageSchema.index({ senderId: 1, createdAt: -1});
// MessageSchema.index({ receiverId: 1, createdAt: -1});

// module.exports = mongoose.model('Message', MessageSchema);


const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    receiverId: { 
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    content: {
      type: String,
      required: function () {
        return !this.attachmentUrl && !this.audio;
      },
      trim: true,
      maxlength: 1000,
    },
    attachmentUrl: { type: String, default: null },
    messageType: {
      type: String,
      enum: ['text', 'image', 'file'],
      default: 'text',
    },

    isEdited: { type: Boolean, default: false },
    deleteAt: { type: Date },
    deliveredAt: { type: Date },
    readAt: { type: Date },
  },
  { timestamps: true }
);

MessageSchema.index({ senderId: 1, createdAt: -1 });
MessageSchema.index({ receiverId: 1, createdAt: -1 });

module.exports = mongoose.model('Message', MessageSchema);
