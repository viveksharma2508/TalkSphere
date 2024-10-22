const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const sendMessage = async (req, res) => {
  const { userId, content } = req.body;
  try {
    const message = await prisma.message.create({
      data: { content, userId },
    });
    res.json(message);
  } catch (error) {
    res.status(500).json({ error: 'Error sending message' });
  }
};

module.exports = { sendMessage };
