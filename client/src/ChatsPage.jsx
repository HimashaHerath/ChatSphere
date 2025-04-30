import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { 
  HiPaperAirplane, 
  HiOutlineLogout, 
  HiUserAdd, 
  HiPlus, 
  HiX, 
  HiCheck, 
  HiCheckCircle,
  HiPencil,
  HiTrash,
  HiReply,
  HiDotsVertical,
  HiPhotograph,
  HiDocument,
  HiMusicNote,
  HiEmojiHappy,
  HiSearch,
  HiOutlineUser,
  HiOutlinePhone,
  HiOutlineVideoCamera,
  HiInformationCircle,
  HiOutlineClock,
  HiChevronDown,
  HiArrowLeft,
  HiMenu
} from "react-icons/hi";
import { format, isToday, isYesterday } from "date-fns";

// Enhanced Emoji picker component with categories
const EmojiPicker = ({ onEmojiSelect, onClose }) => {
  const categories = [
    { name: "Frequently Used", emojis: ['👍', '❤️', '😂', '😊', '🎉', '👏', '🔥', '😍', '🤔', '😢'] },
    { name: "Smileys", emojis: ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '😉', '😊', '😇', '🥰', '😍', '😘'] },
    { name: "Gestures", emojis: ['👍', '👎', '👌', '✌️', '🤞', '🤟', '🤙', '👈', '👉', '👆', '👇', '✋', '🤚', '👋', '👏'] },
  ];
  
  const [activeCategory, setActiveCategory] = useState(0);
  
  return (
    <div className="absolute bottom-full right-0 mb-2 bg-white rounded-lg shadow-xl p-2 z-50 border border-gray-200 w-64">
      {/* Category tabs */}
      <div className="flex border-b border-gray-200 mb-2">
        {categories.map((category, index) => (
          <button
            key={index}
            onClick={() => setActiveCategory(index)}
            className={`px-2 py-1 text-xs ${
              activeCategory === index 
                ? "border-b-2 border-indigo-500 text-indigo-600 font-medium" 
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
      
      {/* Emoji grid */}
      <div className="grid grid-cols-7 gap-1">
        {categories[activeCategory].emojis.map(emoji => (
          <button
            key={emoji}
            onClick={() => {
              onEmojiSelect(emoji);
              onClose();
            }}
            className="p-1.5 text-xl hover:bg-gray-100 rounded"
          >
            {emoji}
          </button>
        ))}
      </div>
      
      {/* Close button */}
      <div className="text-center mt-2">
        <button
          onClick={onClose}
          className="text-xs text-gray-500 hover:text-gray-700"
        >
          Close
        </button>
      </div>
    </div>
  );
};

// Enhanced Message menu component with animation
const MessageMenu = ({ message, onEdit, onDelete, onReply, isOwnMessage }) => {
  const [showMenu, setShowMenu] = useState(false);
  
  return (
    <div className="relative">
      <button 
        onClick={() => setShowMenu(!showMenu)}
        className="text-gray-400 hover:text-gray-600 ml-2 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
        aria-label="Message options"
      >
        <HiDotsVertical className="h-4 w-4" />
      </button>
      
      {showMenu && (
        <div className="absolute right-0 mt-1 bg-white rounded-lg shadow-lg py-1 z-40 min-w-[140px] border border-gray-200 animate-fade-in">
          <button
            onClick={() => {
              onReply(message);
              setShowMenu(false);
            }}
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 w-full text-left transition-colors duration-200"
          >
            <HiReply className="mr-2 h-4 w-4" />
            Reply
          </button>
          
          {isOwnMessage && (
            <>
              <button
                onClick={() => {
                  onEdit(message);
                  setShowMenu(false);
                }}
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 w-full text-left transition-colors duration-200"
              >
                <HiPencil className="mr-2 h-4 w-4" />
                Edit
              </button>
              
              <button
                onClick={() => {
                  onDelete(message);
                  setShowMenu(false);
                }}
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 w-full text-left transition-colors duration-200"
              >
                <HiTrash className="mr-2 h-4 w-4" />
                Delete
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

// Enhanced File upload preview component
const FilePreview = ({ files, onRemove }) => {
  if (!files.length) return null;
  
  return (
    <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
      {files.map((file, index) => (
        <div key={index} className="relative bg-gray-50 p-2 rounded-lg border border-gray-200 flex items-center group">
          <div className="flex-shrink-0 mr-2">
            {file.type.startsWith('image/') && (
              <div className="h-12 w-12 rounded bg-indigo-50 flex items-center justify-center overflow-hidden">
                <img 
                  src={URL.createObjectURL(file)} 
                  alt={file.name} 
                  className="h-full w-full object-cover" 
                />
              </div>
            )}
            {file.type.startsWith('audio/') && (
              <div className="h-12 w-12 rounded bg-indigo-50 flex items-center justify-center">
                <HiMusicNote className="h-6 w-6 text-indigo-500" />
              </div>
            )}
            {(!file.type.startsWith('image/') && !file.type.startsWith('audio/')) && (
              <div className="h-12 w-12 rounded bg-indigo-50 flex items-center justify-center">
                <HiDocument className="h-6 w-6 text-indigo-500" />
              </div>
            )}
          </div>
          <div className="flex-grow min-w-0">
            <div className="text-sm font-medium truncate">{file.name}</div>
            <div className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</div>
          </div>
          <button 
            onClick={() => onRemove(index)}
            className="absolute top-1 right-1 text-gray-400 hover:text-red-500 p-1 rounded-full bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            aria-label="Remove file"
          >
            <HiX className="h-3 w-3" />
          </button>
        </div>
      ))}
    </div>
  );
};

// Enhanced Message attachment component with better previews
const MessageAttachment = ({ attachment }) => {
  if (!attachment) return null;
  
  return (
    <div className="mt-2">
      {attachment.type === "image" && (
        <a 
          href={`http://localhost:3001${attachment.url}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="block relative rounded-lg overflow-hidden group"
        >
          <img 
            src={`http://localhost:3001${attachment.url}`} 
            alt={attachment.name} 
            className="max-h-60 max-w-full object-contain rounded-lg border border-gray-200"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100">
            <div className="bg-white rounded-lg px-2 py-1 text-xs font-medium">
              View Full Image
            </div>
          </div>
        </a>
      )}
      
      {attachment.type === "audio" && (
        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center mb-2">
            <HiMusicNote className="h-5 w-5 text-indigo-500 mr-2" />
            <div className="text-sm font-medium truncate">{attachment.name}</div>
          </div>
          <audio controls className="w-full h-8">
            <source src={`http://localhost:3001${attachment.url}`} />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
      
      {attachment.type === "document" && (
        <a 
          href={`http://localhost:3001${attachment.url}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors duration-200"
        >
          <div className="h-10 w-10 rounded bg-indigo-50 flex items-center justify-center mr-3">
            <HiDocument className="h-5 w-5 text-indigo-500" />
          </div>
          <div>
            <div className="text-sm font-medium">{attachment.name}</div>
            <div className="text-xs text-gray-500">{(attachment.size / 1024).toFixed(1)} KB • Click to download</div>
          </div>
        </a>
      )}
    </div>
  );
};

// Enhanced Reply preview component
const ReplyPreview = ({ message, onCancelReply }) => {
  if (!message) return null;
  
  return (
    <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-indigo-400 flex items-center justify-between mb-3 relative">
      <div className="flex items-center">
        <HiReply className="h-5 w-5 text-indigo-500 mr-2" />
        <div>
          <p className="text-xs font-medium text-indigo-600">Replying to {message.sender}</p>
          <p className="text-sm truncate text-gray-700">{message.text || (message.attachments?.length > 0 ? "[Attachment]" : "")}</p>
        </div>
      </div>
      <button 
        onClick={onCancelReply} 
        className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200 transition-colors duration-200"
        aria-label="Cancel reply"
      >
        <HiX className="h-4 w-4" />
      </button>
    </div>
  );
};

// Enhanced Message reactions component with tooltips
const MessageReactions = ({ reactions, onReact, username }) => {
  if (!reactions || reactions.length === 0) return null;
  
  // Group reactions by emoji
  const reactionGroups = reactions.reduce((groups, reaction) => {
    if (!groups[reaction.emoji]) {
      groups[reaction.emoji] = [];
    }
    groups[reaction.emoji].push(reaction.username);
    return groups;
  }, {});
  
  return (
    <div className="flex flex-wrap mt-2 gap-1">
      {Object.entries(reactionGroups).map(([emoji, users]) => {
        const hasReacted = users.includes(username);
        const tooltipText = users.length <= 3 
          ? users.join(', ')
          : `${users.slice(0, 3).join(', ')} and ${users.length - 3} more`;
        
        return (
          <div key={emoji} className="relative group">
            <button
              onClick={() => onReact(emoji)}
              className={`flex items-center rounded-full px-2 py-0.5 text-xs ${
                hasReacted 
                  ? 'bg-indigo-100 text-indigo-800 border border-indigo-200' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-200'
              } transition-colors duration-200`}
            >
              <span className="mr-1">{emoji}</span>
              <span>{users.length}</span>
            </button>
            
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
              {tooltipText}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// User Avatar component
const UserAvatar = ({ user, size = "md", status = false }) => {
  const sizes = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12"
  };
  
  return (
    <div className="relative">
      <div className={`${sizes[size]} rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-semibold`}>
        {user.profile_picture ? (
          <img 
            src={`http://localhost:3001${user.profile_picture}`} 
            alt={user.username} 
            className="h-full w-full object-cover"
          />
        ) : (
          <span>{user.username ? user.username.charAt(0).toUpperCase() : '?'}</span>
        )}
      </div>
      
      {status && user.status && (
        <div className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
          user.status === 'online' ? 'bg-green-500' : 
          user.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
        }`}>
        </div>
      )}
    </div>
  );
};

// Chat item component for the sidebar
const ChatItem = ({ chat, activeChat, currentUser, onClick }) => {
  const isActive = activeChat?.chatId === chat.chatId;
  
  // Format timestamp
  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    
    if (isToday(date)) {
      return format(date, "HH:mm");
    } else if (isYesterday(date)) {
      return "Yesterday";
    } else {
      return format(date, "MMM d");
    }
  };
  
  // Generate subtitle text
  const generateSubtitle = () => {
    if (!chat.lastMessage || !chat.lastMessage.text && !chat.lastMessage.hasAttachment) {
      return <span className="text-gray-400 italic">No messages yet</span>;
    }
    
    const prefix = chat.lastMessage.sender === currentUser.username ? 'You: ' : '';
    
    if (chat.lastMessage.hasAttachment && !chat.lastMessage.text) {
      return <span>{prefix}[Attachment]</span>;
    }
    
    return <span>{prefix}{chat.lastMessage.text}</span>;
  };

  return (
    <div
      onClick={onClick}
      className={`px-4 py-3 cursor-pointer transition-colors duration-200 ${
        isActive 
          ? "bg-indigo-50 border-r-4 border-indigo-500" 
          : "hover:bg-gray-50 border-r-4 border-transparent"
      }`}
    >
      <div className="flex items-center space-x-3">
        {/* Chat avatar */}
        <div className="flex-shrink-0">
          <div className="relative">
            {chat.avatar ? (
              <img 
                src={`http://localhost:3001${chat.avatar}`} 
                alt={chat.title} 
                className="h-12 w-12 rounded-full object-cover"
              />
            ) : (
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-white font-semibold">
                {chat.title.charAt(0).toUpperCase()}
              </div>
            )}
            
            {/* Online indicator for direct chats */}
            {!chat.isGroupChat && chat.participantInfo && chat.participantInfo[0]?.status === 'online' && (
              <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></div>
            )}
          </div>
        </div>
        
        {/* Chat info */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-baseline">
            <h3 className={`font-medium truncate ${isActive ? "text-indigo-700" : "text-gray-900"}`}>
              {chat.title}
            </h3>
            {chat.lastMessage && chat.lastMessage.createdAt && (
              <span className="text-xs text-gray-500 ml-1 flex-shrink-0">
                {formatTime(chat.lastMessage.createdAt)}
              </span>
            )}
          </div>
          
          <p className={`text-sm truncate ${isActive ? "text-indigo-600" : "text-gray-500"}`}>
            {generateSubtitle()}
          </p>
        </div>
      </div>
    </div>
  );
};

// Date divider component for message groups
const DateDivider = ({ date }) => {
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    
    if (isToday(date)) {
      return "Today";
    } else if (isYesterday(date)) {
      return "Yesterday";
    } else {
      return format(date, "EEEE, MMMM d");
    }
  };
  
  return (
    <div className="flex items-center my-4">
      <div className="flex-grow border-t border-gray-200"></div>
      <div className="mx-4 flex-shrink-0">
        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {formatDate(date)}
        </span>
      </div>
      <div className="flex-grow border-t border-gray-200"></div>
    </div>
  );
};

// Main ChatsPage component
const ChatsPage = (props) => {
  // Extract user from props and provide default onLogout function
  const user = props.user || {};
  const onLogout = props.onLogout || (() => console.log("Logout not implemented"));

  const [activeChat, setActiveChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState("");
  const [users, setUsers] = useState([]);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [newChatTitle, setNewChatTitle] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showUserList, setShowUserList] = useState(false);
  const [visibleMessages, setVisibleMessages] = useState(new Set());
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [editingMessage, setEditingMessage] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showChatInfo, setShowChatInfo] = useState(false);
  const [filterChats, setFilterChats] = useState("");
  const [searchMessages, setSearchMessages] = useState("");

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const observerRef = useRef(null);
  const fileInputRef = useRef(null);
  const messageInputRef = useRef(null);

  // Initialize socket connection
  useEffect(() => {
    socketRef.current = io("http://localhost:3001");

    // Set current user for this socket
    if (user.username) {
      socketRef.current.emit("set_user", user.username);
    }

    return () => {
      if (activeChat) {
        socketRef.current.emit("leave_chat", activeChat.chatId);
      }
      socketRef.current.disconnect();
    };
  }, [user.username]);
  
  // Setup socket event listeners in a separate effect to prevent dependencies issues
  useEffect(() => {
    if (!socketRef.current || !user.username) return;
    
    // Clear existing listeners to prevent duplicates
    socketRef.current.off("receive_message");
    socketRef.current.off("message_status_update");
    socketRef.current.off("user_typing");
    socketRef.current.off("user_stop_typing");
    socketRef.current.off("message_edited");
    socketRef.current.off("message_deleted");
    socketRef.current.off("message_reaction_updated");
    socketRef.current.off("chat_updated");
    socketRef.current.off("user_status_change");
    
    // Socket event listeners
    socketRef.current.on("receive_message", (message) => {
      if (message.chatId === activeChat?.chatId) {
        setMessages(prevMessages => {
          // Remove any temporary version of this message
          const filteredMessages = prevMessages.filter(
            msg => !msg.isPending || msg.sender !== message.sender || msg.text !== message.text
          );
          
          // Check if message already exists to prevent duplicates
          const exists = filteredMessages.some(msg => msg._id === message._id);
          if (exists) return filteredMessages;
          
          return [...filteredMessages, message];
        });
        
        // Mark message as delivered immediately if it's not our own
        if (message.sender !== user.username) {
          socketRef.current.emit("message_delivered", {
            messageId: message._id,
            username: user.username
          });
        }
      }
      
      // Update chat list - move the chat with new message to top
      setChats(prevChats => {
        const updatedChats = prevChats.map(chat => 
          chat.chatId === message.chatId
            ? {
                ...chat,
                lastMessage: {
                  text: message.text,
                  sender: message.sender,
                  createdAt: message.createdAt,
                  hasAttachment: message.attachments && message.attachments.length > 0
                }
              }
            : chat
        );
        
        // Sort chats to put the one with the new message at the top
        return updatedChats.sort((a, b) => {
          if (a.chatId === message.chatId) return -1;
          if (b.chatId === message.chatId) return 1;
          return 0;
        });
      });
    });

    socketRef.current.on("message_status_update", (statusData) => {
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg._id === statusData.messageId 
            ? { ...msg, deliveredTo: statusData.deliveredTo, readBy: statusData.readBy }
            : msg
        )
      );
    });

    socketRef.current.on("user_typing", ({ username }) => {
      if (username !== user.username) {
        setIsTyping(true);
        setTypingUser(username);
      }
    });

    socketRef.current.on("user_stop_typing", () => {
      setIsTyping(false);
      setTypingUser("");
    });
    
    // Handle edited messages
    socketRef.current.on("message_edited", (data) => {
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg._id === data.messageId 
            ? { ...msg, text: data.text, edited: data.edited }
            : msg
        )
      );
      
      // Update last message if it was edited
      setChats(prevChats =>
        prevChats.map(chat => {
          if (chat.lastMessage && 
              chat.lastMessage.sender === data.sender &&
              chat.lastMessage.text !== data.text) {
            return {
              ...chat,
              lastMessage: {
                ...chat.lastMessage,
                text: data.text
              }
            };
          }
          return chat;
        })
      );
    });
    
    // Handle deleted messages
    socketRef.current.on("message_deleted", (data) => {
      setMessages(prevMessages => 
        prevMessages.filter(msg => msg._id !== data.messageId)
      );
    });
    
    // Handle reaction updates
    socketRef.current.on("message_reaction_updated", (data) => {
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg._id === data.messageId 
            ? { ...msg, reactions: data.reactions }
            : msg
        )
      );
    });
    
    // Handle chat updates (e.g., last message changed)
    socketRef.current.on("chat_updated", (data) => {
      setChats(prevChats => {
        const updatedChats = prevChats.map(chat => 
          chat.chatId === data.chatId 
            ? { ...chat, lastMessage: data.lastMessage }
            : chat
        );
        
        // Sort chats to put the updated one at the top
        return updatedChats.sort((a, b) => {
          if (!a.lastMessage?.createdAt) return 1;
          if (!b.lastMessage?.createdAt) return -1;
          return new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt);
        });
      });
    });
    
    // Handle user status changes
    socketRef.current.on("user_status_change", (data) => {
      setUsers(prevUsers => 
        prevUsers.map(u => 
          u.username === data.username 
            ? { ...u, status: data.status, last_online: data.last_online }
            : u
        )
      );
    });
  }, [activeChat, user.username]);

  // Fetch user chats
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/chats?username=${user.username}`);
        
        // Sort chats by latest message
        const sortedChats = response.data.sort((a, b) => {
          if (!a.lastMessage?.createdAt) return 1;
          if (!b.lastMessage?.createdAt) return -1;
          return new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt);
        });
        
        setChats(sortedChats);
        
        // If there are chats, set the first one as active
        if (sortedChats.length > 0 && !activeChat) {
          setActiveChat(sortedChats[0]);
        }
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };

    if (user.username) {
      fetchChats();
    }
  }, [user.username]);

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:3001/users");
        // Filter out the current user and any invalid user objects
        setUsers(response.data
          .filter(u => u && u.username && u.username !== user.username)
        );
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    if (user.username) {
      fetchUsers();
    }
  }, [user.username]);

  // Set up the Intersection Observer to detect visible messages
  useEffect(() => {
    // Cleanup previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Create new observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const messageId = entry.target.dataset.messageId;
            if (messageId) {
              // Add to visible messages set
              setVisibleMessages(prev => {
                const newSet = new Set(prev);
                newSet.add(messageId);
                return newSet;
              });

              // Find the message
              const message = messages.find(m => m._id === messageId);
              
              // Mark as read if it's someone else's message
              if (message && message.sender !== user.username && 
                  message.readBy && !message.readBy.includes(user.username)) {
                socketRef.current.emit("message_read", {
                  messageId,
                  username: user.username
                });
              }
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    // Attach observer to message elements
    const attachObserver = () => {
      const messageElements = document.querySelectorAll('.message-item');
      messageElements.forEach(el => {
        observerRef.current.observe(el);
      });
    };

    // Allow DOM to update before attaching observer
    if (messages.length > 0) {
      setTimeout(attachObserver, 100);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [messages, user.username]);

  // Document visibility change to mark messages as read when tab becomes active
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && activeChat) {
        // Mark visible messages as read
        messages.forEach(msg => {
          if (visibleMessages.has(msg._id) && 
              msg.sender !== user.username && 
              msg.readBy && !msg.readBy.includes(user.username)) {
            socketRef.current.emit('message_read', {
              messageId: msg._id,
              username: user.username
            });
          }
        });
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [activeChat, messages, visibleMessages, user.username]);

  // Fetch messages when active chat changes
  useEffect(() => {
    if (activeChat && user.username) {
      // Leave previous chat room if any
      if (socketRef.current) {
        socketRef.current.emit("leave_chat", activeChat.chatId);
      }
      
      const fetchMessages = async () => {
        try {
          const response = await axios.get(`http://localhost:3001/messages/${activeChat.chatId}`);
          setMessages(response.data);
          
          // Reset visible messages when changing chats
          setVisibleMessages(new Set());
          
          // Clear any editing or replying state
          setEditingMessage(null);
          setReplyingTo(null);
          
          // Show chat area on mobile when chat selected
          if (window.innerWidth < 768) {
            setShowSidebar(false);
          }
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      };

      fetchMessages();
      
      // Join new chat room
      if (socketRef.current) {
        socketRef.current.emit("join_chat", { 
          chatId: activeChat.chatId,
          username: user.username
        });
      }
    }
  }, [activeChat, user.username]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  // Clear editing state if the active chat changes
  useEffect(() => {
    setEditingMessage(null);
    setReplyingTo(null);
    setShowChatInfo(false);
  }, [activeChat]);
  
  // Focus input when editing or replying
  useEffect(() => {
    if (editingMessage || replyingTo) {
      messageInputRef.current?.focus();
    }
  }, [editingMessage, replyingTo]);
  
  // Responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setShowSidebar(true);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle file selection
  const handleFileSelect = (e) => {
    if (e.target.files) {
      setSelectedFiles([...selectedFiles, ...Array.from(e.target.files)]);
    }
  };
  
  // Remove a file from selection
  const removeFile = (index) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };
  
  // Upload files and get their URLs
  const uploadFiles = async () => {
    if (selectedFiles.length === 0) return [];
    
    setIsUploading(true);
    setUploadProgress(0);
    
    const uploadedAttachments = [];
    
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('sender', user.username);
      
      try {
        const response = await axios.post(
          `http://localhost:3001/messages/${activeChat.chatId}/attachments`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              // Update progress for this file
              setUploadProgress(percentCompleted);
            }
          }
        );
        
        uploadedAttachments.push(response.data);
        
        // Update progress for overall upload
        setUploadProgress(((i + 1) / selectedFiles.length) * 100);
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
    
    setIsUploading(false);
    setSelectedFiles([]);
    
    return uploadedAttachments;
  };

  // Handle sending a message
  const sendMessage = async (e) => {
    e.preventDefault();
    
    if ((newMessage.trim() === "" && selectedFiles.length === 0) || !activeChat || !user.username) return;
    
    // If we're editing a message, update it instead
    if (editingMessage) {
      socketRef.current.emit("edit_message", {
        messageId: editingMessage._id,
        text: newMessage,
        username: user.username
      });
      
      setEditingMessage(null);
      setNewMessage("");
      return;
    }
    
    // Upload any attached files
    const attachments = await uploadFiles();
    
    const messageData = {
      chatId: activeChat.chatId,
      sender: user.username,
      text: newMessage.trim(),
      attachments,
      replyTo: replyingTo ? replyingTo._id : null
    };

    // Create a temporary message with pending status
    const tempId = `temp-${Date.now()}`;
    const tempMessage = {
      _id: tempId,
      ...messageData,
      createdAt: new Date().toISOString(),
      deliveredTo: [user.username],
      readBy: [user.username],
      isPending: true,
      replyToMessage: replyingTo
    };
    
    // Add temporary message to UI immediately
    setMessages(prevMessages => [...prevMessages, tempMessage]);
    
    // Send message via socket
    socketRef.current.emit("send_message", messageData);
    
    // Clear input and state
    setNewMessage("");
    setReplyingTo(null);
    
    // Clear typing indicator
    clearTimeout(typingTimeoutRef.current);
    socketRef.current.emit("stop_typing", { chatId: activeChat.chatId });
    
    // Focus input again
    messageInputRef.current?.focus();
  };

  // Handle typing indicator
  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    
    if (!activeChat || !user.username) return;
    
    // Clear previous timeout
    clearTimeout(typingTimeoutRef.current);
    
    // Emit typing event
    socketRef.current.emit("typing", { chatId: activeChat.chatId, username: user.username });
    
    // Set timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current.emit("stop_typing", { chatId: activeChat.chatId });
    }, 2000);
  };

  // Create a new chat
  const createNewChat = async () => {
    if (newChatTitle.trim() === "" || selectedUsers.length === 0 || !user.username) return;
    
    try {
      // Add current user to participants
      const participants = [...selectedUsers, user.username];
      
      const response = await axios.post("http://localhost:3001/chats", {
        title: newChatTitle,
        participants,
        isGroupChat: participants.length > 2
      });
      
      setChats(prevChats => [response.data, ...prevChats]);
      setActiveChat(response.data);
      
      // Clear form
      setNewChatTitle("");
      setSelectedUsers([]);
      setShowNewChatModal(false);
    } catch (error) {
      console.error("Error creating chat:", error);
    }
  };

  // Toggle user selection for new chat
  const toggleUserSelection = (username) => {
    if (selectedUsers.includes(username)) {
      setSelectedUsers(selectedUsers.filter(u => u !== username));
    } else {
      setSelectedUsers([...selectedUsers, username]);
    }
  };
  
  // Start editing a message
  const startEditMessage = (message) => {
    setEditingMessage(message);
    setNewMessage(message.text);
    setReplyingTo(null);
  };
  
  // Cancel editing
  const cancelEdit = () => {
    setEditingMessage(null);
    setNewMessage("");
  };
  
  // Delete a message
  const deleteMessage = (message) => {
    if (confirm("Are you sure you want to delete this message?")) {
      socketRef.current.emit("delete_message", {
        messageId: message._id,
        username: user.username
      });
    }
  };
  
  // Reply to a message
  const replyToMessage = (message) => {
    setReplyingTo(message);
    setEditingMessage(null);
  };
  
  // Cancel reply
  const cancelReply = () => {
    setReplyingTo(null);
  };
  
  // React to a message
  const reactToMessage = (message, emoji) => {
    socketRef.current.emit("react_to_message", {
      messageId: message._id,
      username: user.username,
      emoji
    });
  };

  // Filter users based on search term
  const filteredUsers = users.filter(u => 
    (u.username && u.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (u.first_name && u.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (u.last_name && u.last_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // Filter chats based on search
  const filteredChats = chats.filter(chat => {
    if (!filterChats) return true;
    
    return (
      chat.title.toLowerCase().includes(filterChats.toLowerCase()) ||
      chat.participants.some(p => p.toLowerCase().includes(filterChats.toLowerCase()))
    );
  });
  
  // Group messages by date for better organization
  const groupedMessages = messages.reduce((groups, message) => {
    const date = new Date(message.createdAt).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});
  
  // Function to render message status indicators
  const renderMessageStatus = (message) => {
    // Only show status for our own messages
    if (message.sender !== user.username) return null;
    
    // Handle pending messages
    if (message.isPending) {
      return (
        <span className="text-gray-300 flex items-center ml-1" title="Sending...">
          <span className="text-xs">Sending...</span>
        </span>
      );
    }
    
    if (!message.deliveredTo || !message.readBy) return null;
    
    // Get counts excluding the sender
    const deliveredCount = message.deliveredTo.filter(u => u !== user.username).length;
    const readCount = message.readBy.filter(u => u !== user.username).length;
    
    // Get other participants count
    const otherParticipants = activeChat ? activeChat.participants.filter(p => p !== user.username).length : 0;
    
    if (readCount === otherParticipants && otherParticipants > 0) {
      // All read
      return (
        <span className="text-green-500 flex items-center ml-1" title="Read by all">
          <HiCheckCircle className="h-4 w-4" />
        </span>
      );
    } else if (deliveredCount === otherParticipants && otherParticipants > 0) {
      // All delivered
      return (
        <span className="text-blue-500 flex items-center ml-1" title="Delivered to all">
          <HiCheck className="h-4 w-4" />
        </span>
      );
    } else if (otherParticipants > 0) {
      // Sent
      return (
        <span className="text-gray-400 flex items-center ml-1" title="Sent">
          <HiCheck className="h-4 w-4" />
        </span>
      );
    } else {
      return null;
    }
  };
  
  // Render the user status indicator dot
  const renderStatusDot = (status) => {
    switch (status) {
      case "online":
        return <span className="h-2 w-2 rounded-full bg-green-500 inline-block mr-1"></span>;
      case "away":
        return <span className="h-2 w-2 rounded-full bg-yellow-500 inline-block mr-1"></span>;
      default:
        return <span className="h-2 w-2 rounded-full bg-gray-300 inline-block mr-1"></span>;
    }
  };
  
  // Format the last online time for user profiles
  const formatLastOnline = (timestamp) => {
    if (!timestamp) return "Last seen: Unknown";
    
    const date = new Date(timestamp);
    const now = new Date();
    
    // If less than 1 minute ago
    if (now - date < 60 * 1000) {
      return "Last seen: Just now";
    }
    
    // If less than 1 hour ago
    if (now - date < 60 * 60 * 1000) {
      const minutes = Math.floor((now - date) / (60 * 1000));
      return `Last seen: ${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    }
    
    // If today
    if (isToday(date)) {
      return `Last seen: Today at ${format(date, "HH:mm")}`;
    }
    
    // If yesterday
    if (isYesterday(date)) {
      return `Last seen: Yesterday at ${format(date, "HH:mm")}`;
    }
    
    // Otherwise show full date
    return `Last seen: ${format(date, "MMM d, yyyy 'at' HH:mm")}`;
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile sidebar toggle */}
      {!showSidebar && (
        <button 
          onClick={() => setShowSidebar(true)}
          className="md:hidden fixed z-20 bottom-5 left-5 rounded-full bg-indigo-600 text-white shadow-lg p-3"
          aria-label="Show sidebar"
        >
          <HiMenu className="h-6 w-6" />
        </button>
      )}
    
      {/* Sidebar */}
      <div className={`${showSidebar ? 'flex' : 'hidden'} md:flex flex-col w-full md:w-80 lg:w-96 bg-white border-r border-gray-200 z-10 ${
        showSidebar ? 'fixed md:relative inset-0' : ''
      }`}>
        {/* User Info & Logout */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center">
            <UserAvatar user={user} size="md" />
            <div className="ml-3">
              <p className="font-medium">{user.first_name || user.username || 'Guest'}</p>
              <p className="text-xs text-indigo-600">
                {renderStatusDot("online")} Online
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setShowNewChatModal(true)}
              className="text-gray-500 hover:text-indigo-600 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              title="New Chat"
            >
              <HiPlus className="h-5 w-5" />
            </button>
            <button 
              onClick={onLogout}
              className="text-gray-500 hover:text-red-600 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              title="Logout"
            >
              <HiOutlineLogout className="h-5 w-5" />
            </button>
            {/* Mobile close sidebar button */}
            <button 
              onClick={() => setShowSidebar(false)}
              className="md:hidden text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
              aria-label="Close sidebar"
            >
              <HiX className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        {/* Search Chats */}
        <div className="p-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search chats..."
              value={filterChats}
              onChange={(e) => setFilterChats(e.target.value)}
              className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            {filterChats && (
              <button
                onClick={() => setFilterChats("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <HiX className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
        
        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {filteredChats.length === 0 ? (
            <div className="p-4 text-center text-gray-500 mt-10">
              {filterChats ? "No matching chats found." : "No chats yet. Create a new chat to get started."}
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredChats.map((chat) => (
                <ChatItem 
                  key={chat.chatId}
                  chat={chat}
                  activeChat={activeChat}
                  currentUser={user}
                  onClick={() => setActiveChat(chat)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Main Chat Area */}
      <div className={`${!showSidebar || !showChatInfo ? 'flex' : 'hidden'} md:flex flex-col flex-grow relative ${showChatInfo ? 'md:mr-80 lg:mr-96 transition-all duration-300' : ''}`}>
        {activeChat ? (
          <>
            {/* Chat Header */}
            <div className="p-3 border-b border-gray-200 bg-white flex justify-between items-center shadow-sm">
              <div className="flex items-center">
                {/* Mobile back button */}
                <button 
                  onClick={() => setShowSidebar(true)}
                  className="md:hidden p-2 rounded-full hover:bg-gray-100 text-gray-600 mr-2"
                  aria-label="Back to chat list"
                >
                  <HiArrowLeft className="h-5 w-5" />
                </button>
                
                <div className="flex items-center cursor-pointer" onClick={() => setShowChatInfo(!showChatInfo)}>
                  {/* Chat avatar */}
                  <div className="mr-3">
                    {activeChat.avatar ? (
                      <img 
                        src={`http://localhost:3001${activeChat.avatar}`} 
                        alt={activeChat.title} 
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-white font-semibold">
                        {activeChat.title.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <div className="flex items-center">
                      <h2 className="font-semibold text-gray-900">{activeChat.title}</h2>
                      <HiChevronDown className={`h-5 w-5 text-gray-500 ml-1 transform transition-transform duration-200 ${showChatInfo ? 'rotate-180' : ''}`} />
                    </div>
                    
                    {/* Status */}
                    <div className="text-xs text-gray-500 flex items-center">
                      {activeChat.isGroupChat ? (
                        <span>
                          {activeChat.participants.length} members
                        </span>
                      ) : (
                        activeChat.participantInfo && activeChat.participantInfo[0] && (
                          <span className="flex items-center">
                            {renderStatusDot(activeChat.participantInfo[0].status)}
                            {activeChat.participantInfo[0].status === 'online' ? 'Online' : 'Offline'}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Action buttons */}
              <div className="flex items-center space-x-2">
                {!activeChat.isGroupChat && (
                  <>
                    <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors duration-200" title="Audio call">
                      <HiOutlinePhone className="h-5 w-5" />
                    </button>
                    <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors duration-200" title="Video call">
                      <HiOutlineVideoCamera className="h-5 w-5" />
                    </button>
                  </>
                )}
                <button 
                  onClick={() => setShowChatInfo(!showChatInfo)}
                  className={`p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 ${showChatInfo ? 'text-indigo-600 bg-indigo-50' : 'text-gray-600'}`}
                  title="Chat info"
                >
                  <HiInformationCircle className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            {/* Messages */}
            <div 
              className="flex-1 p-4 overflow-y-auto bg-slate-50 bg-pattern flex flex-col"
              ref={messagesContainerRef}
            >
              {messages.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                    <HiOutlineUser className="h-8 w-8 text-indigo-500" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 mb-1">Start the conversation</h3>
                  <p className="text-gray-500 max-w-sm">
                    No messages yet in this chat. Send a message to start the conversation!
                  </p>
                </div>
              ) : (
                Object.entries(groupedMessages).map(([date, dateMessages], dateIndex) => (
                  <React.Fragment key={date}>
                    <DateDivider date={new Date(date)} />
                    
                    {dateMessages.map((message, index) => {
                      // Check if we need to show sender name (when sender changes)
                      const showSender = index === 0 || dateMessages[index - 1].sender !== message.sender;
                      
                      // Check if this is the start of a message group from the same sender
                      const isStartOfGroup = showSender;
                      
                      // Check if this is the end of a message group from the same sender
                      const isEndOfGroup = index === dateMessages.length - 1 || 
                                          dateMessages[index + 1].sender !== message.sender;
                      
                      return (
                        <div
                          key={message._id}
                          className={`flex ${
                            message.sender === user.username ? "justify-end" : "justify-start"
                          } ${isStartOfGroup ? 'mt-4' : 'mt-1'}`}
                        >
                          {/* Sender avatar (only show at start of group) */}
                          {message.sender !== user.username && isStartOfGroup && (
                            <div className="flex-shrink-0 mr-2 self-end mb-1">
                              <UserAvatar 
                                user={{ username: message.sender }} 
                                size="sm"
                              />
                            </div>
                          )}
                          
                          <div
                            data-message-id={message._id}
                            className={`message-item max-w-md rounded-lg p-3 shadow-sm ${
                              message.sender === user.username
                                ? `${isStartOfGroup ? 'rounded-tr-none' : ''} ${isEndOfGroup ? 'rounded-br-none' : ''} ${
                                    message.isPending 
                                      ? "bg-indigo-400 text-white" 
                                      : "bg-indigo-600 text-white"
                                  }`
                                : `${isStartOfGroup ? 'rounded-tl-none' : ''} ${isEndOfGroup ? 'rounded-bl-none' : ''} bg-white border border-gray-200`
                            }`}
                          >
                            {/* Message sender */}
                            {message.sender !== user.username && isStartOfGroup && (
                              <p className="text-xs font-semibold mb-1 text-indigo-600">{message.sender}</p>
                            )}
                            
                            {/* Reply reference */}
                            {message.replyToMessage && (
                              <div className={`text-xs p-2 rounded mb-2 ${
                                message.sender === user.username ? "bg-indigo-500" : "bg-gray-100"
                              }`}>
                                <p className="font-medium">
                                  Replying to {message.replyToMessage.sender}
                                </p>
                                <p className="truncate">
                                  {message.replyToMessage.text || "[Attachment]"}
                                </p>
                              </div>
                            )}
                            
                            {/* Message text */}
                            <p className="whitespace-pre-wrap break-words">{message.text}</p>
                            
                            {/* Attachments */}
                            {message.attachments && message.attachments.length > 0 && (
                              <div className="mt-2">
                                {message.attachments.map((attachment, i) => (
                                  <MessageAttachment key={i} attachment={attachment} />
                                ))}
                              </div>
                            )}
                            
                            {/* Message metadata row */}
                            <div className="flex justify-between items-center mt-1">
                              <div className="flex items-center">
                                {/* Edited indicator */}
                                {message.edited && (
                                  <span className={`text-xs mr-2 ${
                                    message.sender === user.username ? "text-indigo-100" : "text-gray-500"
                                  }`}>
                                    (edited)
                                  </span>
                                )}
                                
                                {/* Time */}
                                <span className={message.sender === user.username ? "text-indigo-100" : "text-gray-500"}>
                                  <span className="text-xs">
                                    {format(new Date(message.createdAt), "HH:mm")}
                                  </span>
                                </span>
                                
                                {/* Delivery/read status */}
                                {renderMessageStatus(message)}
                              </div>
                              
                              {/* Message actions */}
                              <div className="relative ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <div className="flex items-center">
                                  {/* Emoji picker button */}
                                  <button
                                    onClick={() => setShowEmojiPicker(prev => prev === message._id ? null : message._id)}
                                    className={`p-1 rounded-full ${
                                      message.sender === user.username ? "text-indigo-100 hover:bg-indigo-500" : "text-gray-500 hover:bg-gray-100"
                                    } hover:opacity-70 transition-colors duration-200`}
                                    aria-label="Add reaction"
                                  >
                                    <HiEmojiHappy className="h-4 w-4" />
                                  </button>
                                  
                                  {showEmojiPicker === message._id && (
                                    <EmojiPicker 
                                      onEmojiSelect={(emoji) => {
                                        reactToMessage(message, emoji);
                                        setShowEmojiPicker(null);
                                      }}
                                      onClose={() => setShowEmojiPicker(null)}
                                    />
                                  )}
                                  
                                  {/* Message actions menu */}
                                  <MessageMenu 
                                    message={message}
                                    onEdit={startEditMessage}
                                    onDelete={deleteMessage}
                                    onReply={replyToMessage}
                                    isOwnMessage={message.sender === user.username}
                                  />
                                </div>
                              </div>
                            </div>
                            
                            {/* Message reactions */}
                            <MessageReactions 
                              reactions={message.reactions} 
                              onReact={(emoji) => reactToMessage(message, emoji)}
                              username={user.username}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </React.Fragment>
                ))
              )}
              
              {/* Typing indicator */}
              {isTyping && (
                <div className="flex items-center mt-2 text-gray-500 text-sm">
                  <div className="flex-shrink-0 mr-2">
                    <UserAvatar user={{ username: typingUser }} size="sm" />
                  </div>
                  <div className="bg-white px-4 py-2 rounded-full shadow-sm">
                    <div className="flex items-center space-x-1">
                      <div className="bg-gray-400 rounded-full h-2 w-2 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="bg-gray-400 rounded-full h-2 w-2 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      <div className="bg-gray-400 rounded-full h-2 w-2 animate-bounce" style={{ animationDelay: '600ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-4">
              {/* Editing indicator */}
              {editingMessage && (
                <div className="bg-amber-50 p-3 rounded-lg flex items-center justify-between mb-3 shadow-sm">
                  <div className="flex items-center">
                    <HiPencil className="h-5 w-5 text-amber-500 mr-2" />
                    <div>
                      <p className="text-xs font-medium text-amber-800">Editing message</p>
                      <p className="text-sm text-amber-700 truncate">{editingMessage.text}</p>
                    </div>
                  </div>
                  <button 
                    onClick={cancelEdit} 
                    className="text-amber-500 hover:text-amber-700 p-1 rounded-full hover:bg-amber-100 transition-colors duration-200"
                    aria-label="Cancel edit"
                  >
                    <HiX className="h-4 w-4" />
                  </button>
                </div>
              )}
              
              {/* Reply preview */}
              {replyingTo && (
                <ReplyPreview message={replyingTo} onCancelReply={cancelReply} />
              )}
              
              {/* File previews */}
              <FilePreview files={selectedFiles} onRemove={removeFile} />
              
              {/* Upload progress */}
              {isUploading && (
                <div className="mb-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-700">Uploading files...</span>
                    <span className="text-sm font-medium text-indigo-600">{Math.round(uploadProgress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-indigo-600 h-full rounded-full"
                      style={{ width: `${uploadProgress}%` }} 
                    ></div>
                  </div>
                </div>
              )}
              
              <form onSubmit={sendMessage} className="flex flex-col">
                <div className="flex items-center space-x-2">
                  {/* Attachment button */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors duration-200"
                    disabled={isUploading}
                    aria-label="Add attachment"
                  >
                    <HiPhotograph className="h-6 w-6" />
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      className="hidden"
                      multiple
                      disabled={isUploading}
                    />
                  </button>
                  
                  {/* Emoji button */}
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(prev => prev === 'input' ? null : 'input')}
                    className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors duration-200"
                    disabled={isUploading}
                    aria-label="Add emoji"
                  >
                    <HiEmojiHappy className="h-6 w-6" />
                  </button>
                  
                  {/* Message input */}
                  <div className="relative flex-1">
                    <input
                      type="text"
                      ref={messageInputRef}
                      value={newMessage}
                      onChange={handleTyping}
                      placeholder={editingMessage ? "Edit your message..." : "Type a message..."}
                      className="w-full border border-gray-300 rounded-full px-4 py-3 pr-16 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 placeholder-gray-500"
                      disabled={isUploading}
                    />
                    
                    {/* Emoji picker for input */}
                    {showEmojiPicker === 'input' && (
                      <div className="absolute bottom-full mb-2 right-0">
                        <EmojiPicker 
                          onEmojiSelect={(emoji) => {
                            setNewMessage(prev => prev + emoji);
                            setShowEmojiPicker(null);
                            messageInputRef.current?.focus();
                          }}
                          onClose={() => setShowEmojiPicker(null)}
                        />
                      </div>
                    )}
                    
                    {/* Send button */}
                    <button
                      type="submit"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors duration-200"
                      disabled={isUploading || (newMessage.trim() === "" && selectedFiles.length === 0)}
                      aria-label="Send message"
                    >
                      <HiPaperAirplane className="h-5 w-5 transform rotate-90" />
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center p-6 bg-gradient-to-br from-indigo-50 to-white">
            <div className="text-center max-w-md">
              <div className="mx-auto w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center mb-6">
                <HiOutlineUser className="h-10 w-10 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Welcome to ChatSphere</h2>
              <p className="text-gray-600 mb-6">
                Connect and chat with friends, colleagues, and groups in real-time. Share files, react to messages, and stay connected.
              </p>
              <button
                onClick={() => setShowNewChatModal(true)}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center mx-auto"
              >
                <HiUserAdd className="h-5 w-5 mr-2" />
                Start a New Conversation
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Chat Info Sidebar */}
      {activeChat && showChatInfo && (
        <div className={`${showChatInfo ? 'flex' : 'hidden'} absolute right-0 top-0 bottom-0 md:static w-full md:w-80 lg:w-96 bg-white border-l border-gray-200 flex-col z-10`}>
          {/* Header */}
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-semibold text-lg">Chat Information</h3>
            <button 
              onClick={() => setShowChatInfo(false)}
              className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              aria-label="Close info panel"
            >
              <HiX className="h-5 w-5" />
            </button>
          </div>
          
          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* Chat avatar */}
            <div className="flex flex-col items-center mb-6">
              <div className="h-24 w-24 rounded-full bg-gray-300 mb-3 overflow-hidden">
                {activeChat.avatar ? (
                  <img 
                    src={`http://localhost:3001${activeChat.avatar}`} 
                    alt={activeChat.title} 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-gray-400 to-gray-500 text-white text-4xl font-bold">
                    {activeChat.title.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <h3 className="text-xl font-semibold text-gray-900">{activeChat.title}</h3>
              <p className="text-sm text-gray-500 mt-1">
                {activeChat.isGroupChat 
                  ? `${activeChat.participants.length} members` 
                  : "Direct Message"}
              </p>
            </div>
            
            {/* Search in chat */}
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search in conversation..."
                  value={searchMessages}
                  onChange={(e) => setSearchMessages(e.target.value)}
                  className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50"
                />
                <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              </div>
            </div>
            
            {/* Participants */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">
                {activeChat.isGroupChat ? "Members" : "Participant"}
              </h4>
              <div className="space-y-3">
                {/* Current user */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100">
                  <div className="flex items-center">
                    <UserAvatar user={user} size="md" status={true} />
                    <div className="ml-3">
                      <p className="font-medium text-gray-900">{user.username} (You)</p>
                      <p className="text-xs text-green-600 flex items-center">
                        {renderStatusDot('online')} Online
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Other participants */}
                {activeChat.participants
                  .filter(p => p !== user.username)
                  .map((participant) => {
                    // Find user data
                    const userData = users.find(u => u.username === participant) || { username: participant };
                    
                    return (
                      <div key={participant} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                        <div className="flex items-center">
                          <UserAvatar user={userData} size="md" status={true} />
                          <div className="ml-3">
                            <p className="font-medium text-gray-900">{userData.first_name || userData.username}</p>
                            <p className="text-xs text-gray-500 flex items-center">
                              {userData.status === 'online' 
                                ? <><span className="text-green-600 flex items-center">{renderStatusDot('online')} Online</span></>
                                : <>{renderStatusDot('offline')} {formatLastOnline(userData.last_online)}</>
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* New Chat Modal */}
      {showNewChatModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            {/* Modal header */}
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-indigo-50">
              <h3 className="font-semibold text-lg text-indigo-800">Create New Conversation</h3>
              <button
                onClick={() => setShowNewChatModal(false)}
                className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-indigo-100 transition-colors duration-200"
                aria-label="Close modal"
              >
                <HiX className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6">
              {/* Chat title input */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Conversation Title
                </label>
                <input
                  type="text"
                  value={newChatTitle}
                  onChange={(e) => setNewChatTitle(e.target.value)}
                  placeholder="Enter a title for your conversation..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                />
              </div>
              
              {/* Add participants section */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Add Participants
                </label>
                <div className="relative">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setShowUserList(true);
                      }}
                      onFocus={() => setShowUserList(true)}
                      placeholder="Search users by name or username..."
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                    />
                    <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  </div>
                  
                  {/* User search results */}
                  {showUserList && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {filteredUsers.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">No users found</div>
                      ) : (
                        filteredUsers.map((u) => (
                          <div
                            key={u.username}
                            onClick={() => toggleUserSelection(u.username)}
                            className="p-3 hover:bg-indigo-50 cursor-pointer flex items-center transition-colors duration-200"
                          >
                            <div className="relative mr-3">
                              <input
                                type="checkbox"
                                checked={selectedUsers.includes(u.username)}
                                onChange={() => {}}
                                className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                              />
                            </div>
                            
                            <div className="flex items-center flex-1">
                              <UserAvatar user={u} size="sm" status={true} />
                              <div className="ml-2">
                                <div className="flex items-center">
                                  <p className="font-medium text-gray-800">{u.username}</p>
                                </div>
                                <p className="text-xs text-gray-500 flex items-center">
                                  {u.first_name && u.last_name 
                                    ? `${u.first_name} ${u.last_name}` 
                                    : (u.status === 'online' ? 'Online' : 'Offline')}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Selected users */}
              {selectedUsers.length > 0 && (
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Selected Participants ({selectedUsers.length})
                  </label>
                  <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    {selectedUsers.map((username) => {
                      const u = users.find(user => user.username === username) || { username };
                      
                      return (
                        <div
                          key={username}
                          className="flex items-center bg-white px-2 py-1 rounded-full shadow-sm text-sm"
                        >
                          <span className="mr-1 text-gray-700">{u.first_name || username}</span>
                          <button
                            onClick={() => toggleUserSelection(username)}
                            className="ml-1 text-gray-400 hover:text-red-500 transition-colors duration-200"
                            aria-label={`Remove ${username}`}
                          >
                            <HiX className="h-4 w-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              
              {/* Action buttons */}
              <div className="flex justify-end mt-6 space-x-3">
                <button
                  onClick={() => setShowNewChatModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={createNewChat}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-sm hover:shadow-md transition-all duration-200 flex items-center"
                  disabled={newChatTitle.trim() === "" || selectedUsers.length === 0}
                >
                  <HiPlus className="h-5 w-5 mr-1" />
                  Create Conversation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Custom CSS */}
      <style jsx>{`
        .bg-pattern {
          background-color: #f9fafc;
          background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e2e8f0' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
        
        .animate-fade-in {
          animation: fadeIn 0.2s ease-in-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-bounce {
          animation: bounce 1.5s infinite;
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        
        /* Hide scrollbar for Chrome, Safari and Opera */
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        
        /* Hide scrollbar for IE, Edge and Firefox */
        .no-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>
    </div>
  );
};

export default ChatsPage;