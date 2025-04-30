const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

// Initialize Express app
const app = express();
app.use(express.json());
app.use(cors({ origin: true }));

// Create HTTP server and Socket.IO instance
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Set up static file serving for uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "uploads");
    // Create the directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueFileName = `${Date.now()}-${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueFileName);
  }
});

const fileFilter = (req, file, cb) => {
  // Accept images, documents, and audio files
  const allowedTypes = [
    // Images
    "image/jpeg", "image/png", "image/gif", "image/webp",
    // Documents
    "application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    // Audio
    "audio/mpeg", "audio/ogg", "audio/wav"
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only images, documents, and audio files are allowed."), false);
  }
};

const upload = multer({ 
  storage, 
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB file size limit
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/chat-app", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB connection error:", err));

// Enhanced User Schema with profile picture
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  secret: { type: String, required: true }, // password
  email: { type: String, required: false },
  first_name: { type: String, required: false },
  last_name: { type: String, required: false },
  profile_picture: { type: String, default: null },
  bio: { type: String, default: "" },
  last_online: { type: Date, default: Date.now },
  status: { type: String, enum: ["online", "offline", "away"], default: "offline" },
  createdAt: { type: Date, default: Date.now }
});

// Enhanced Message schema with attachment support and reactions
const MessageSchema = new mongoose.Schema({
  chatId: { type: String, required: true },
  sender: { type: String, required: true },
  text: { type: String, default: "" },
  attachments: [{ 
    type: { type: String, enum: ["image", "document", "audio"] },
    url: { type: String },
    name: { type: String },
    size: { type: Number }
  }],
  createdAt: { type: Date, default: Date.now },
  deliveredTo: { type: [String], default: [] },
  readBy: { type: [String], default: [] },
  edited: { type: Boolean, default: false },
  reactions: [{
    emoji: { type: String },
    username: { type: String }
  }],
  replyTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Message', default: null }
});

// Enhanced Chat schema with last message reference
const ChatSchema = new mongoose.Schema({
  chatId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  participants: { type: [String], required: true },
  createdAt: { type: Date, default: Date.now },
  lastMessage: {
    text: { type: String, default: "" },
    sender: { type: String, default: "" },
    createdAt: { type: Date, default: null },
    hasAttachment: { type: Boolean, default: false }
  },
  isGroupChat: { type: Boolean, default: false },
  avatar: { type: String, default: null },  // For group chat avatar
  admins: { type: [String], default: [] }   // For group chat admins
});

// Remove any existing indexes that might be causing conflicts
const cleanupIndexes = async () => {
  try {
    const collections = await mongoose.connection.db.collections();
    const usersCollection = collections.find(col => col.collectionName === 'users');
    
    if (usersCollection) {
      const indexes = await usersCollection.indexes();
      const credentialIdIndex = indexes.find(idx => idx.key && idx.key.credentialId === 1);
      
      if (credentialIdIndex) {
        console.log("Dropping conflicting credentialId index...");
        await usersCollection.dropIndex("credentialId_1");
        console.log("Index dropped successfully");
      }
    }
  } catch (error) {
    console.error("Error cleaning up indexes:", error);
  }
};

// Create models
const User = mongoose.model("User", UserSchema);
const Message = mongoose.model("Message", MessageSchema);
const Chat = mongoose.model("Chat", ChatSchema);

// Call the cleanup function after mongoose connection is established
mongoose.connection.once('open', () => {
  cleanupIndexes();
});

// Online users tracking
const onlineUsers = new Map(); // Map username to socket ID

// Signup endpoint
app.post("/signup", async (req, res) => {
  const { username, secret, email, first_name, last_name, bio } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ detail: "Username already taken" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(secret, 10);
    
    // Create new user
    const newUser = new User({
      username,
      secret: hashedPassword,
      email,
      first_name,
      last_name,
      bio: bio || ""
    });

    await newUser.save();
    
    // Remove password from response
    const userResponse = {
      username,
      email,
      first_name,
      last_name,
      profile_picture: null,
      bio: bio || "",
      id: newUser._id
    };

    return res.status(201).json(userResponse);
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ detail: "Internal Server Error", error: error.message });
  }
});

// Login endpoint
app.post("/login", async (req, res) => {
  const { username, secret } = req.body;

  try {
    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ detail: "User not found" });
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(secret, user.secret);
    if (!passwordMatch) {
      return res.status(401).json({ detail: "Invalid credentials" });
    }

    // Update last online and status
    user.last_online = new Date();
    user.status = "online";
    await user.save();

    // Return user data (excluding password)
    const userResponse = {
      username: user.username,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      profile_picture: user.profile_picture,
      bio: user.bio || "",
      status: user.status,
      id: user._id
    };

    return res.status(200).json(userResponse);
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ detail: "Internal Server Error" });
  }
});

// Update user profile
app.put("/users/:username", async (req, res) => {
  const { username } = req.params;
  const { first_name, last_name, bio } = req.body;

  try {
    const updatedUser = await User.findOneAndUpdate(
      { username },
      { $set: { first_name, last_name, bio } },
      { new: true, projection: { secret: 0 } }
    );

    if (!updatedUser) {
      return res.status(404).json({ detail: "User not found" });
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Update user error:", error);
    return res.status(500).json({ detail: "Internal Server Error" });
  }
});

// Upload profile picture
app.post("/users/:username/profile-picture", upload.single("profile_picture"), async (req, res) => {
  const { username } = req.params;

  try {
    if (!req.file) {
      return res.status(400).json({ detail: "No file uploaded" });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    
    const updatedUser = await User.findOneAndUpdate(
      { username },
      { $set: { profile_picture: fileUrl } },
      { new: true, projection: { secret: 0 } }
    );

    if (!updatedUser) {
      // Delete the uploaded file if user not found
      fs.unlinkSync(path.join(__dirname, fileUrl));
      return res.status(404).json({ detail: "User not found" });
    }

    return res.status(200).json({ profile_picture: fileUrl });
  } catch (error) {
    console.error("Upload profile picture error:", error);
    
    // Delete the uploaded file if there was an error
    if (req.file) {
      fs.unlinkSync(path.join(__dirname, "uploads", req.file.filename));
    }
    
    return res.status(500).json({ detail: "Internal Server Error" });
  }
});

// Get user profile
app.get("/users/:username", async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne(
      { username },
      { username: 1, email: 1, first_name: 1, last_name: 1, profile_picture: 1, bio: 1, last_online: 1, status: 1, _id: 1 }
    );

    if (!user) {
      return res.status(404).json({ detail: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Get user error:", error);
    return res.status(500).json({ detail: "Internal Server Error" });
  }
});

// Get user chats with last message
app.get("/chats", async (req, res) => {
  const { username } = req.query;
  
  if (!username) {
    return res.status(400).json({ detail: "Username is required" });
  }

  try {
    const userChats = await Chat.find({ participants: username }).sort({ "lastMessage.createdAt": -1 });
    
    // Populate user information for each chat participant
    const chatsWithUserInfo = await Promise.all(userChats.map(async (chat) => {
      // Get participant info for each chat (excluding the requesting user)
      const participantInfo = await User.find(
        { username: { $in: chat.participants.filter(p => p !== username) } },
        { username: 1, first_name: 1, last_name: 1, profile_picture: 1, status: 1, _id: 0 }
      );
      
      return {
        ...chat.toObject(),
        participantInfo
      };
    }));
    
    return res.status(200).json(chatsWithUserInfo);
  } catch (error) {
    console.error("Get chats error:", error);
    return res.status(500).json({ detail: "Internal Server Error" });
  }
});

// Create a new chat
app.post("/chats", async (req, res) => {
  const { title, participants, isGroupChat, avatar } = req.body;
  
  if (!title || !participants || !Array.isArray(participants) || participants.length === 0) {
    return res.status(400).json({ detail: "Title and at least one participant are required" });
  }

  try {
    // Check if a private chat already exists between these two participants
    if (participants.length === 2 && !isGroupChat) {
      const existingChat = await Chat.findOne({
        participants: { $all: participants, $size: 2 },
        isGroupChat: false
      });
      
      if (existingChat) {
        return res.status(200).json(existingChat);
      }
    }
    
    // Generate a unique chat ID
    const chatId = `chat_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    const newChat = new Chat({
      chatId,
      title,
      participants,
      isGroupChat: isGroupChat || false,
      avatar: avatar || null,
      admins: isGroupChat ? [participants[0]] : [] // First participant is admin for group chats
    });

    await newChat.save();
    
    // Get participant info
    const participantInfo = await User.find(
      { username: { $in: participants } },
      { username: 1, first_name: 1, last_name: 1, profile_picture: 1, status: 1, _id: 0 }
    );
    
    const chatWithParticipants = {
      ...newChat.toObject(),
      participantInfo
    };
    
    return res.status(201).json(chatWithParticipants);
  } catch (error) {
    console.error("Create chat error:", error);
    return res.status(500).json({ detail: "Internal Server Error" });
  }
});

// Update a chat (rename, add/remove participants, etc.)
app.put("/chats/:chatId", async (req, res) => {
  const { chatId } = req.params;
  const { title, addParticipants, removeParticipants, avatar } = req.body;
  
  try {
    const chat = await Chat.findOne({ chatId });
    
    if (!chat) {
      return res.status(404).json({ detail: "Chat not found" });
    }
    
    // Update the chat title if provided
    if (title) {
      chat.title = title;
    }
    
    // Update avatar if provided
    if (avatar) {
      chat.avatar = avatar;
    }
    
    // Add new participants if provided
    if (addParticipants && Array.isArray(addParticipants) && addParticipants.length > 0) {
      chat.participants = [...new Set([...chat.participants, ...addParticipants])];
    }
    
    // Remove participants if provided
    if (removeParticipants && Array.isArray(removeParticipants) && removeParticipants.length > 0) {
      chat.participants = chat.participants.filter(p => !removeParticipants.includes(p));
    }
    
    await chat.save();
    
    return res.status(200).json(chat);
  } catch (error) {
    console.error("Update chat error:", error);
    return res.status(500).json({ detail: "Internal Server Error" });
  }
});

// Upload chat group avatar
app.post("/chats/:chatId/avatar", upload.single("avatar"), async (req, res) => {
  const { chatId } = req.params;

  try {
    if (!req.file) {
      return res.status(400).json({ detail: "No file uploaded" });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    
    const updatedChat = await Chat.findOneAndUpdate(
      { chatId },
      { $set: { avatar: fileUrl } },
      { new: true }
    );

    if (!updatedChat) {
      // Delete the uploaded file if chat not found
      fs.unlinkSync(path.join(__dirname, fileUrl));
      return res.status(404).json({ detail: "Chat not found" });
    }

    return res.status(200).json({ avatar: fileUrl });
  } catch (error) {
    console.error("Upload chat avatar error:", error);
    
    // Delete the uploaded file if there was an error
    if (req.file) {
      fs.unlinkSync(path.join(__dirname, "uploads", req.file.filename));
    }
    
    return res.status(500).json({ detail: "Internal Server Error" });
  }
});

// Delete a chat
app.delete("/chats/:chatId", async (req, res) => {
  const { chatId } = req.params;
  const { username } = req.query; // Require the requesting user
  
  try {
    const chat = await Chat.findOne({ chatId });
    
    if (!chat) {
      return res.status(404).json({ detail: "Chat not found" });
    }
    
    // Only allow admins to delete group chats
    if (chat.isGroupChat && !chat.admins.includes(username)) {
      return res.status(403).json({ detail: "Only chat admins can delete group chats" });
    }
    
    // Delete all messages associated with this chat
    await Message.deleteMany({ chatId });
    
    // Delete the chat
    await Chat.deleteOne({ chatId });
    
    return res.status(200).json({ detail: "Chat deleted successfully" });
  } catch (error) {
    console.error("Delete chat error:", error);
    return res.status(500).json({ detail: "Internal Server Error" });
  }
});

// Get messages for a chat
app.get("/messages/:chatId", async (req, res) => {
  const { chatId } = req.params;
  const { limit = 50, before = null } = req.query;
  
  try {
    const query = { chatId };
    
    // Add pagination
    if (before) {
      query.createdAt = { $lt: new Date(before) };
    }
    
    const messages = await Message.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .sort({ createdAt: 1 });
      
    // For messages that reference a reply, get the original message data
    const messagesWithReplies = await Promise.all(messages.map(async (message) => {
      if (message.replyTo) {
        const originalMessage = await Message.findById(message.replyTo);
        return {
          ...message.toObject(),
          replyToMessage: originalMessage ? originalMessage.toObject() : null
        };
      }
      return message.toObject();
    }));
    
    return res.status(200).json(messagesWithReplies);
  } catch (error) {
    console.error("Get messages error:", error);
    return res.status(500).json({ detail: "Internal Server Error" });
  }
});

// Upload a file to a chat
app.post("/messages/:chatId/attachments", upload.single("file"), async (req, res) => {
  const { chatId } = req.params;
  const { sender } = req.body;
  
  try {
    if (!req.file) {
      return res.status(400).json({ detail: "No file uploaded" });
    }
    
    const fileUrl = `/uploads/${req.file.filename}`;
    const fileType = req.file.mimetype.split('/')[0];
    
    // Determine attachment type based on mimetype
    let attachmentType = "document";
    if (fileType === "image") {
      attachmentType = "image";
    } else if (fileType === "audio") {
      attachmentType = "audio";
    }
    
    return res.status(200).json({
      url: fileUrl,
      name: req.file.originalname,
      size: req.file.size,
      type: attachmentType
    });
  } catch (error) {
    console.error("Upload attachment error:", error);
    
    // Delete the uploaded file if there was an error
    if (req.file) {
      fs.unlinkSync(path.join(__dirname, "uploads", req.file.filename));
    }
    
    return res.status(500).json({ detail: "Internal Server Error" });
  }
});

// Edit a message
app.put("/messages/:messageId", async (req, res) => {
  const { messageId } = req.params;
  const { text, username } = req.body;
  
  try {
    const message = await Message.findById(messageId);
    
    if (!message) {
      return res.status(404).json({ detail: "Message not found" });
    }
    
    // Only the original sender can edit the message
    if (message.sender !== username) {
      return res.status(403).json({ detail: "You can only edit your own messages" });
    }
    
    message.text = text;
    message.edited = true;
    
    await message.save();
    
    return res.status(200).json(message);
  } catch (error) {
    console.error("Edit message error:", error);
    return res.status(500).json({ detail: "Internal Server Error" });
  }
});

// Delete a message
app.delete("/messages/:messageId", async (req, res) => {
  const { messageId } = req.params;
  const { username } = req.query;
  
  try {
    const message = await Message.findById(messageId);
    
    if (!message) {
      return res.status(404).json({ detail: "Message not found" });
    }
    
    // Get the chat to check if the user is an admin
    const chat = await Chat.findOne({ chatId: message.chatId });
    
    // Allow deletion if user is sender or chat admin
    if (message.sender !== username && !(chat && chat.admins.includes(username))) {
      return res.status(403).json({ detail: "You can only delete your own messages or messages in chats where you're an admin" });
    }
    
    // If message has attachments, delete the files
    if (message.attachments && message.attachments.length > 0) {
      message.attachments.forEach(attachment => {
        const filePath = path.join(__dirname, attachment.url);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }
    
    await Message.deleteOne({ _id: messageId });
    
    return res.status(200).json({ detail: "Message deleted successfully" });
  } catch (error) {
    console.error("Delete message error:", error);
    return res.status(500).json({ detail: "Internal Server Error" });
  }
});

// React to a message
app.post("/messages/:messageId/reactions", async (req, res) => {
  const { messageId } = req.params;
  const { username, emoji } = req.body;
  
  try {
    const message = await Message.findById(messageId);
    
    if (!message) {
      return res.status(404).json({ detail: "Message not found" });
    }
    
    // Check if user has already reacted with this emoji
    const existingReactionIndex = message.reactions.findIndex(
      reaction => reaction.username === username && reaction.emoji === emoji
    );
    
    if (existingReactionIndex !== -1) {
      // User has already reacted with this emoji, so remove it (toggle)
      message.reactions.splice(existingReactionIndex, 1);
    } else {
      // Add the new reaction
      message.reactions.push({ username, emoji });
    }
    
    await message.save();
    
    return res.status(200).json(message.reactions);
  } catch (error) {
    console.error("Message reaction error:", error);
    return res.status(500).json({ detail: "Internal Server Error" });
  }
});

// Get all users
app.get("/users", async (req, res) => {
  const { search } = req.query;
  
  try {
    let query = {};
    
    // Add search functionality
    if (search) {
      query = {
        $or: [
          { username: { $regex: search, $options: 'i' } },
          { first_name: { $regex: search, $options: 'i' } },
          { last_name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      };
    }
    
    const users = await User.find(
      query, 
      { username: 1, first_name: 1, last_name: 1, profile_picture: 1, status: 1, _id: 0 }
    );
    
    return res.status(200).json(users);
  } catch (error) {
    console.error("Get users error:", error);
    return res.status(500).json({ detail: "Internal Server Error" });
  }
});

// Socket.IO Connection
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);
  let currentUser = null;

  // Set user for this socket connection
  socket.on("set_user", (username) => {
    if (!username) return;
    
    currentUser = username;
    console.log(`User ${username} associated with socket ${socket.id}`);
    
    // Add to online users map
    onlineUsers.set(username, socket.id);
    
    // Update user status in database
    User.findOneAndUpdate(
      { username },
      { $set: { status: "online", last_online: new Date() } },
      { new: true }
    ).then(updatedUser => {
      // Broadcast user online status to all connected users
      io.emit("user_status_change", { 
        username, 
        status: "online" 
      });
    }).catch(err => console.error("Error updating user status:", err));
  });

  // Join a chat room
  socket.on("join_chat", async (data) => {
    const { chatId, username } = data;
    socket.join(chatId);
    console.log(`User ${username} joined chat: ${chatId}`);
    
    // Mark messages as delivered for this user
    if (username) {
      try {
        // Update delivery status for all undelivered messages
        await Message.updateMany(
          { 
            chatId, 
            sender: { $ne: username }, 
            deliveredTo: { $ne: username } 
          },
          { $addToSet: { deliveredTo: username } }
        );
        
        // Get updated messages to broadcast status change
        const messages = await Message.find({ 
          chatId, 
          sender: { $ne: username },
          deliveredTo: username 
        });
        
        // Broadcast delivery status update to sender
        messages.forEach(message => {
          io.to(chatId).emit("message_status_update", {
            messageId: message._id,
            deliveredTo: message.deliveredTo,
            readBy: message.readBy
          });
        });
      } catch (error) {
        console.error("Error updating message delivery status:", error);
      }
    }
  });

  // Leave a chat room
  socket.on("leave_chat", (chatId) => {
    socket.leave(chatId);
    console.log(`User left chat: ${chatId}`);
  });

  // Send a message
  socket.on("send_message", async (messageData) => {
    try {
      const { chatId, sender, text, attachments = [], replyTo = null } = messageData;
      
      // Save message to database
      const newMessage = new Message({
        chatId,
        sender,
        text,
        attachments,
        replyTo,
        // Initialize with empty arrays
        deliveredTo: [sender], // Sender automatically receives their own message
        readBy: [sender]       // Sender automatically reads their own message
      });
      
      await newMessage.save();
      
      // Update last message in chat
      await Chat.findOneAndUpdate(
        { chatId },
        { 
          lastMessage: {
            text: text || "(Attachment)",
            sender,
            createdAt: newMessage.createdAt,
            hasAttachment: attachments.length > 0
          }
        }
      );
      
      // If this is a reply, get the original message data
      let replyToMessage = null;
      if (replyTo) {
        replyToMessage = await Message.findById(replyTo);
      }
      
      // Broadcast message to all users in the chat
      io.to(chatId).emit("receive_message", {
        _id: newMessage._id,
        chatId,
        sender,
        text,
        attachments,
        createdAt: newMessage.createdAt,
        deliveredTo: newMessage.deliveredTo,
        readBy: newMessage.readBy,
        replyTo,
        replyToMessage: replyToMessage ? replyToMessage.toObject() : null
      });
      
      // Also emit chat_updated event to update the chat list with the last message
      io.emit("chat_updated", {
        chatId,
        lastMessage: {
          text: text || "(Attachment)",
          sender,
          createdAt: newMessage.createdAt,
          hasAttachment: attachments.length > 0
        }
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  });

  // Mark message as delivered
  socket.on("message_delivered", async (data) => {
    try {
      const { messageId, username } = data;
      
      if (!messageId || !username) return;
      
      const message = await Message.findByIdAndUpdate(
        messageId,
        { $addToSet: { deliveredTo: username } },
        { new: true }
      );
      
      if (message) {
        // Broadcast updated status to all users in chat
        io.to(message.chatId).emit("message_status_update", {
          messageId: message._id,
          deliveredTo: message.deliveredTo,
          readBy: message.readBy
        });
      }
    } catch (error) {
      console.error("Error marking message as delivered:", error);
    }
  });
  
  // Mark message as read
  socket.on("message_read", async (data) => {
    try {
      const { messageId, username } = data;
      
      if (!messageId || !username) return;
      
      const message = await Message.findByIdAndUpdate(
        messageId,
        { 
          $addToSet: { 
            deliveredTo: username, // Ensure it's also marked as delivered
            readBy: username 
          } 
        },
        { new: true }
      );
      
      if (message) {
        // Broadcast updated status to all users in chat
        io.to(message.chatId).emit("message_status_update", {
          messageId: message._id,
          deliveredTo: message.deliveredTo,
          readBy: message.readBy
        });
      }
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  });

  // User is typing
  socket.on("typing", ({ chatId, username }) => {
    socket.to(chatId).emit("user_typing", { username });
  });

  // User stopped typing
  socket.on("stop_typing", ({ chatId }) => {
    socket.to(chatId).emit("user_stop_typing");
  });

  // Edit a message
  socket.on("edit_message", async (data) => {
    try {
      const { messageId, text, username } = data;
      
      const message = await Message.findById(messageId);
      
      if (!message || message.sender !== username) return;
      
      message.text = text;
      message.edited = true;
      
      await message.save();
      
      // Broadcast edited message to all users in the chat
      io.to(message.chatId).emit("message_edited", {
        messageId: message._id,
        text: message.text,
        edited: true
      });
      
      // Update last message in chat if this was the last message
      const chat = await Chat.findOne({ chatId: message.chatId });
      if (chat.lastMessage && chat.lastMessage.createdAt && 
          new Date(chat.lastMessage.createdAt).getTime() === new Date(message.createdAt).getTime() &&
          chat.lastMessage.sender === message.sender) {
        
        await Chat.findOneAndUpdate(
          { chatId: message.chatId },
          { 
            lastMessage: {
              text: text,
              sender: message.sender,
              createdAt: message.createdAt,
              hasAttachment: message.attachments && message.attachments.length > 0
            }
          }
        );
        
        // Emit chat_updated to refresh chat list
        io.emit("chat_updated", {
          chatId: message.chatId,
          lastMessage: {
            text: text,
            sender: message.sender,
            createdAt: message.createdAt,
            hasAttachment: message.attachments && message.attachments.length > 0
          }
        });
      }
    } catch (error) {
      console.error("Error editing message:", error);
    }
  });
  
  // Delete a message
  socket.on("delete_message", async (data) => {
    try {
      const { messageId, username } = data;
      
      const message = await Message.findById(messageId);
      if (!message) return;
      
      // Get the chat to check if the user is an admin
      const chat = await Chat.findOne({ chatId: message.chatId });
      
      // Allow deletion if user is sender or chat admin
      if (message.sender !== username && !(chat && chat.admins.includes(username))) {
        return;
      }
      
      // Delete message
      await Message.deleteOne({ _id: messageId });
      
      // Broadcast message deletion to all users in the chat
      io.to(message.chatId).emit("message_deleted", {
        messageId: message._id
      });
      
      // If this was the last message in the chat, update the last message
      const chat2 = await Chat.findOne({ chatId: message.chatId });
      if (chat2.lastMessage && chat2.lastMessage.createdAt && 
          new Date(chat2.lastMessage.createdAt).getTime() === new Date(message.createdAt).getTime() &&
          chat2.lastMessage.sender === message.sender) {
        
        // Find the new last message
        const lastMessage = await Message.findOne({ chatId: message.chatId })
          .sort({ createdAt: -1 })
          .limit(1);
        
        if (lastMessage) {
          await Chat.findOneAndUpdate(
            { chatId: message.chatId },
            { 
              lastMessage: {
                text: lastMessage.text || "(Attachment)",
                sender: lastMessage.sender,
                createdAt: lastMessage.createdAt,
                hasAttachment: lastMessage.attachments && lastMessage.attachments.length > 0
              }
            }
          );
        } else {
          // No messages left
          await Chat.findOneAndUpdate(
            { chatId: message.chatId },
            { 
              lastMessage: {
                text: "",
                sender: "",
                createdAt: null,
                hasAttachment: false
              }
            }
          );
        }
        
        // Emit chat_updated to refresh chat list
        io.emit("chat_updated", {
          chatId: message.chatId,
          lastMessage: lastMessage ? {
            text: lastMessage.text || "(Attachment)",
            sender: lastMessage.sender,
            createdAt: lastMessage.createdAt,
            hasAttachment: lastMessage.attachments && lastMessage.attachments.length > 0
          } : {
            text: "",
            sender: "",
            createdAt: null,
            hasAttachment: false
          }
        });
      }
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  });
  
  // React to a message
  socket.on("react_to_message", async (data) => {
    try {
      const { messageId, username, emoji } = data;
      
      const message = await Message.findById(messageId);
      
      if (!message) return;
      
      // Check if user has already reacted with this emoji
      const existingReactionIndex = message.reactions.findIndex(
        reaction => reaction.username === username && reaction.emoji === emoji
      );
      
      if (existingReactionIndex !== -1) {
        // User has already reacted with this emoji, so remove it (toggle)
        message.reactions.splice(existingReactionIndex, 1);
      } else {
        // Add the new reaction
        message.reactions.push({ username, emoji });
      }
      
      await message.save();
      
      // Broadcast updated reactions to all users in the chat
      io.to(message.chatId).emit("message_reaction_updated", {
        messageId: message._id,
        reactions: message.reactions
      });
    } catch (error) {
      console.error("Error reacting to message:", error);
    }
  });
  
  // User presence management
  socket.on("set_status", async (data) => {
    try {
      const { username, status } = data;
      
      if (!username || !status) return;
      
      // Update user status in database
      await User.findOneAndUpdate(
        { username },
        { $set: { status, last_online: new Date() } }
      );
      
      // Broadcast status change to all users
      io.emit("user_status_change", { username, status });
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  });

  // Disconnect
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
    
    if (currentUser) {
      // Remove from online users map
      onlineUsers.delete(currentUser);
      
      // Update user status in database
      User.findOneAndUpdate(
        { username: currentUser },
        { $set: { status: "offline", last_online: new Date() } }
      ).then(() => {
        // Broadcast user offline status to all connected users
        io.emit("user_status_change", { 
          username: currentUser, 
          status: "offline",
          last_online: new Date()
        });
      }).catch(err => console.error("Error updating user status:", err));
    }
  });
});

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});