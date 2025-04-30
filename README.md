# ChatSphere

![ChatSphere Logo](./public/logo.png)

> A modern real-time chat application with rich features built on the MERN stack

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![GitHub Stars](https://img.shields.io/github/stars/HimashaHerath/ChatSphere?style=social)](https://github.com/HimashaHerath/ChatSphere)
[![GitHub Issues](https://img.shields.io/github/issues/HimashaHerath/ChatSphere)](https://github.com/HimashaHerath/ChatSphere/issues)

## 📱 Demo

![ChatSphere Demo](./public/screenshots/demo.gif)

## ✨ Features

ChatSphere is a feature-rich chat application designed for both individual and group communication:

- **Real-time messaging** powered by Socket.IO
- **User authentication** with secure password hashing
- **File attachments** (images, documents, audio)
- **Message reactions** with emoji support
- **Message status tracking** (sent, delivered, read)
- **Typing indicators** for active conversations
- **Online/offline status** for users
- **Reply functionality** for threaded conversations
- **Message editing and deletion**
- **Group conversations** with admin privileges
- **User profiles** with customizable information
- **Responsive design** for all device sizes

## 🛠️ Technology Stack

### Frontend
- **React** - UI library
- **Socket.IO Client** - Real-time communication
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - API requests
- **Date-fns** - Date formatting

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **Socket.IO** - Real-time server
- **bcrypt.js** - Password hashing
- **Multer** - File uploads
- **UUID** - Unique ID generation

## 🚀 Getting Started

### Prerequisites

- Node.js (v14.x or later)
- MongoDB (local installation or Atlas)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/HimashaHerath/ChatSphere.git
   cd ChatSphere
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Configure environment variables**
   
   Create a `.env` file in the backend directory:
   ```
   MONGODB_URI=mongodb://localhost:27017/chat-app
   PORT=3001
   ```

5. **Start the backend server**
   ```bash
   cd backend
   npm start
   ```

6. **Start the frontend development server**
   ```bash
   cd frontend
   npm start
   ```

7. **Access the application**
   
   Open your browser and navigate to `http://localhost:3000`

## 📖 Project Structure

```
ChatSphere/
├── backend/
│   ├── index.js           # Main server entry point
│   ├── uploads/           # File storage directory
│   └── package.json       # Backend dependencies
│
├── frontend/
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── pages/         # Page components
│   │   │   ├── LandingPage.jsx  # Landing page
│   │   │   └── ...        # Other pages
│   │   ├── components/    # Reusable components
│   │   ├── App.jsx        # Main app component
│   │   ├── AuthPage.jsx   # Authentication page
│   │   ├── ChatsPage.jsx  # Main chat interface
│   │   └── index.js       # Entry point
│   │
│   └── package.json       # Frontend dependencies
│
└── README.md              # Project documentation
```

## 📸 Screenshots

<div style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center;">
  <img src="./public/screenshots/landing-page.png" alt="Landing Page" width="30%">
  <img src="./public/screenshots/auth-page.png" alt="Authentication Page" width="30%">
  <img src="./public/screenshots/chat-interface.png" alt="Chat Interface" width="30%">
</div>

## 🧩 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST | `/signup` | Create new user | `{ username, secret, email, first_name, last_name, bio }` | User object |
| POST | `/login` | Authenticate user | `{ username, secret }` | User object with auth token |

### Chat Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/chats` | Get user's chats | Query: `username` | Array of chat objects |
| POST | `/chats` | Create a new chat | `{ title, participants, isGroupChat }` | New chat object |
| GET | `/messages/:chatId` | Get chat messages | - | Array of message objects |
| POST | `/messages/:chatId/attachments` | Upload file | Form data: `file` | Attachment object |

For a complete API documentation, see [API.md](API.md).

## 🔌 Socket Events

| Event | Direction | Payload | Description |
|-------|-----------|---------|-------------|
| `set_user` | Client → Server | `username` | Associate socket with user |
| `join_chat` | Client → Server | `{ chatId, username }` | Join a chat room |
| `send_message` | Client → Server | Message object | Send a new message |
| `receive_message` | Server → Client | Message object | Receive a new message |
| `typing` | Client → Server | `{ chatId, username }` | User is typing |
| `user_typing` | Server → Client | `{ username }` | Someone is typing |

For a complete list of socket events, see [SOCKETS.md](SOCKETS.md).

## 🔄 Development Roadmap

### Implemented Features
- ✅ User authentication and profile management
- ✅ Real-time messaging (1-on-1 and group chats)
- ✅ Message delivery status tracking
- ✅ File sharing capabilities
- ✅ Message reactions and replies
- ✅ Typing indicators
- ✅ Online/offline status

### Planned Enhancements
- 🔲 End-to-end message encryption
- 🔲 Voice and video calling
- 🔲 Message search functionality
- 🔲 Push notifications
- 🔲 Custom themes and personalization
- 🔲 Message scheduling and reminders
- 🔲 Chat bots and integrations

## 🤝 Contributing

Contributions are always welcome! Here's how you can help:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

Please ensure your code follows the project's style guidelines and includes appropriate tests.

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Himasha Herath**

- GitHub: [@HimashaHerath](https://github.com/HimashaHerath)
- LinkedIn: [Himasha Herath](https://www.linkedin.com/in/himasha-herath/)

## 🙏 Acknowledgements

- [Socket.IO](https://socket.io/) for real-time capabilities
- [MongoDB](https://www.mongodb.com/) for database services
- [React Icons](https://react-icons.github.io/react-icons/) for the icon set
- All open-source contributors who make these tools possible

---

<p align="center">Made with ❤️ by Himasha Herath</p>