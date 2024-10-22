const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const register = async (req, res) => {
  const { userName, profilePic } = req.body;
  try {
    const user = await prisma.user.create({
      data: { userName, profilePic },
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error creating user' });
  }
};

module.exports = { register };
