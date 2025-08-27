const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const AuthSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false
    },

    // Refresh token store (optional, keep last N)
    refreshTokens: [
      {
        token: String,
        createdAt: { type: Date, default: Date.now },
        expiresAt: Date
      }
    ],

    // Email verification
    emailVerificationToken: { type: String },
    emailVerificationExpires: { type: Date },

    // Password reset
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date },

    // Security
    loginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date },

    // Password history (optional policy)
    passwordHistory: [
      {
        hashedPassword: String,
        createdAt: { type: Date, default: Date.now }
      }
    ]
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.password;
        delete ret.refreshTokens;
        delete ret.emailVerificationToken;
        delete ret.passwordResetToken;
        delete ret.passwordHistory;
        delete ret.__v;
        return ret;
      }
    }
  }
);

// Helpful sparse indexes (optional)
AuthSchema.index({ emailVerificationToken: 1 }, { sparse: true });
AuthSchema.index({ passwordResetToken: 1 }, { sparse: true });

// Hash password on create/update
AuthSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(12);
    const hashed = await bcrypt.hash(this.password, salt);

    // Maintain password history (optional)
    if (this.password && this.isModified('password')) {
      this.passwordHistory = this.passwordHistory || [];
      this.passwordHistory.push({ hashedPassword: hashed });
    }

    this.password = hashed;
    next();
  } catch (err) {
    next(err);
  }
});

// Methods
AuthSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

AuthSchema.methods.generateAccessToken = function () {
  if (!process.env.JWT_ACCESS_SECRET) {
    throw new Error('JWT_ACCESS_SECRET is missing');
  }
  const exp = process.env.JWT_ACCESS_EXPIRE || '24h';
  return jwt.sign({ userId: this.userId }, process.env.JWT_ACCESS_SECRET, { expiresIn: exp });
};

AuthSchema.methods.generateRefreshToken = function () {
  if (!process.env.JWT_REFRESH_SECRET) {
    throw new Error('JWT_REFRESH_SECRET is missing');
  }
  const exp = process.env.JWT_REFRESH_EXPIRE || '7d';
  const refreshToken = jwt.sign({ userId: this.userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: exp });

  const ttlMs =
    process.env.JWT_REFRESH_EXPIRE_MS
      ? Number(process.env.JWT_REFRESH_EXPIRE_MS)
      : 7 * 24 * 60 * 60 * 1000;

  this.refreshTokens = this.refreshTokens || [];
  this.refreshTokens.push({
    token: refreshToken,
    expiresAt: new Date(Date.now() + ttlMs)
  });

  return refreshToken;
};

AuthSchema.methods.generateEmailVerificationToken = function () {
  if (!process.env.EMAIL_VERIFICATION_SECRET) {
    throw new Error('EMAIL_VERIFICATION_SECRET is missing');
  }
  const token = jwt.sign(
    { userId: this.userId },
    process.env.EMAIL_VERIFICATION_SECRET,
    { expiresIn: '1d' }
  );
  this.emailVerificationToken = token;
  this.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  return token;
};

AuthSchema.virtual('isLocked').get(function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

module.exports = mongoose.model('Auth', AuthSchema);
