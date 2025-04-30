import React, { useState, useEffect } from 'react';
import { 
  HiOutlineChat, 
  HiOutlineUsers, 
  HiOutlineLockClosed, 
  HiOutlinePhotograph, 
  HiOutlineEmojiHappy, 
  HiOutlinePaperAirplane, 
  HiOutlineDeviceMobile, 
  HiOutlineCheckCircle, 
  HiOutlineGlobeAlt, 
  HiOutlineMenuAlt4, 
  HiOutlineX, 
  HiOutlineChevronDown, 
//   HiOutlineGitHub, 
  HiOutlineArrowRight
} from 'react-icons/hi';
import { FaReact, FaNodeJs, FaGithub, FaLinkedin } from 'react-icons/fa';
import { SiMongodb, SiSocketdotio, SiTailwindcss, SiExpress } from 'react-icons/si';

const SCREENSHOTS = [
  '/screenshots/chat-screen.png',
  '/screenshots/mobile-view.png',
  '/screenshots/auth-screen.png',
];

const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeScreenshot, setActiveScreenshot] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveScreenshot((prev) => (prev + 1) % SCREENSHOTS.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-indigo-600 text-white">
                <HiOutlineChat className="h-6 w-6" />
              </div>
              <span className="ml-2 text-2xl font-bold text-gray-900">ChatSphere</span>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">Features</a>
              <a href="#tech-stack" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">Tech Stack</a>
              <a href="#development" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">Development</a>
              <a href="#contribute" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">Contribute</a>
            </nav>
            
            <div className="hidden md:block">
              <a 
                href="https://github.com/HimashaHerath/ChatSphere" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <FaGithub className="mr-2 h-5 w-5" />
                View on GitHub
              </a>
            </div>
            
            <div className="md:hidden">
              <button 
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 rounded-md text-gray-700 hover:text-indigo-600 focus:outline-none"
              >
                <HiOutlineMenuAlt4 className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-50 md:hidden">
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-xl z-50 transform transition-all">
            <div className="p-6 h-full flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                  <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-indigo-600 text-white">
                    <HiOutlineChat className="h-6 w-6" />
                  </div>
                  <span className="ml-2 text-xl font-bold text-gray-900">ChatSphere</span>
                </div>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  <HiOutlineX className="h-6 w-6" />
                </button>
              </div>
              
              <nav className="flex flex-col space-y-6 mt-4">
                <a 
                  href="#features" 
                  className="text-lg font-medium text-gray-700 hover:text-indigo-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Features
                </a>
                <a 
                  href="#tech-stack" 
                  className="text-lg font-medium text-gray-700 hover:text-indigo-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Tech Stack
                </a>
                <a 
                  href="#development" 
                  className="text-lg font-medium text-gray-700 hover:text-indigo-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Development
                </a>
                <a 
                  href="#contribute" 
                  className="text-lg font-medium text-gray-700 hover:text-indigo-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contribute
                </a>
              </nav>
              
              <div className="mt-auto">
                <a 
                  href="https://github.com/HimashaHerath/ChatSphere" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center px-4 py-3 w-full border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FaGithub className="mr-2 h-5 w-5" />
                  View on GitHub
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      <section className="pt-32 pb-20 sm:pt-40 sm:pb-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 lg:pr-12">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
                Real-time Chat Application for Modern Teams
              </h1>
              <p className="mt-6 text-xl text-gray-600 leading-relaxed max-w-2xl">
                ChatSphere is an open-source messaging platform with real-time chat, file sharing, reactions, and more. Connect with anyone, anywhere.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <a 
                  href="https://github.com/HimashaHerath/ChatSphere" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-md text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                >
                  <FaGithub className="mr-2 h-5 w-5" />
                  Clone Repository
                </a>
                <a 
                  href="#features" 
                  className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 rounded-md shadow-md text-base font-medium text-indigo-600 bg-white hover:bg-gray-50 transition-colors"
                >
                  Learn More
                  <HiOutlineArrowRight className="ml-2 h-5 w-5" />
                </a>
              </div>
            </div>
            
            <div className="lg:w-1/2 mt-12 lg:mt-0">
              <div className="relative w-full max-w-xl mx-auto">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-50 to-blue-50 transform rotate-3"></div>
                <div className="relative shadow-2xl rounded-2xl overflow-hidden border-8 border-white">
                  {SCREENSHOTS.map((src, index) => (
                    <div
                      key={index}
                      className={`absolute inset-0 transition-opacity duration-1000 ${
                        index === activeScreenshot ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      <img 
                        src={src || "https://via.placeholder.com/600x400?text=ChatSphere+Screenshot"} 
                        alt={`ChatSphere screenshot ${index + 1}`}
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  ))}
                  
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {SCREENSHOTS.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveScreenshot(index)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === activeScreenshot 
                            ? 'bg-white' 
                            : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                        }`}
                        aria-label={`View screenshot ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="absolute -right-4 -bottom-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  Active Development
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section id="features" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Powerful Chat Features
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              ChatSphere combines modern design with a powerful feature set to deliver the best chatting experience
            </p>
          </div>
          
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="p-8">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <HiOutlinePaperAirplane className="h-6 w-6 transform rotate-90" />
                </div>
                <h3 className="mt-6 text-lg font-medium text-gray-900">Real-time Messaging</h3>
                <p className="mt-2 text-base text-gray-600">
                  Instant message delivery with typing indicators and read receipts. Know exactly when your messages are seen.
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="p-8">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <HiOutlineUsers className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-lg font-medium text-gray-900">Group Conversations</h3>
                <p className="mt-2 text-base text-gray-600">
                  Create group chats with multiple participants. Add or remove members, set group avatars, and more.
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="p-8">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <HiOutlinePhotograph className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-lg font-medium text-gray-900">File Sharing</h3>
                <p className="mt-2 text-base text-gray-600">
                  Share images, documents, and audio files with ease. Preview files within the chat interface.
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="p-8">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <HiOutlineEmojiHappy className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-lg font-medium text-gray-900">Message Reactions</h3>
                <p className="mt-2 text-base text-gray-600">
                  React to messages with emojis. See who reacted with which emoji at a glance.
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="p-8">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <HiOutlineLockClosed className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-lg font-medium text-gray-900">User Authentication</h3>
                <p className="mt-2 text-base text-gray-600">
                  Secure sign-up and login system. Create your profile and personalize your experience.
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="p-8">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <HiOutlineDeviceMobile className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-lg font-medium text-gray-900">Responsive Design</h3>
                <p className="mt-2 text-base text-gray-600">
                  Works perfectly on all devices. Enjoy ChatSphere on desktop, tablet, or mobile with a consistent experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section id="tech-stack" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Built with Modern Technology
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              ChatSphere leverages the latest tools and frameworks for a fast, reliable experience
            </p>
          </div>
          
          <div className="mt-16">
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="px-6 py-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Frontend Technology</h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <FaReact className="h-8 w-8 text-blue-500" />
                      </div>
                      <div className="ml-4">
                        <h4 className="text-lg font-medium text-gray-900">React</h4>
                        <p className="text-gray-600">Powerful component-based UI framework for building the user interface</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <SiTailwindcss className="h-8 w-8 text-teal-500" />
                      </div>
                      <div className="ml-4">
                        <h4 className="text-lg font-medium text-gray-900">Tailwind CSS</h4>
                        <p className="text-gray-600">Utility-first CSS framework for flexible, responsive design</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <SiSocketdotio className="h-8 w-8 text-black" />
                      </div>
                      <div className="ml-4">
                        <h4 className="text-lg font-medium text-gray-900">Socket.IO Client</h4>
                        <p className="text-gray-600">Real-time, bidirectional client-server communication</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <HiOutlineGlobeAlt className="h-8 w-8 text-purple-500" />
                      </div>
                      <div className="ml-4">
                        <h4 className="text-lg font-medium text-gray-900">Axios</h4>
                        <p className="text-gray-600">Promise-based HTTP client for API requests</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="px-6 py-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Backend Technology</h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <FaNodeJs className="h-8 w-8 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <h4 className="text-lg font-medium text-gray-900">Node.js</h4>
                        <p className="text-gray-600">JavaScript runtime built on Chrome's V8 engine</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <SiExpress className="h-8 w-8 text-gray-700" />
                      </div>
                      <div className="ml-4">
                        <h4 className="text-lg font-medium text-gray-900">Express</h4>
                        <p className="text-gray-600">Fast, unopinionated web framework for Node.js</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <SiMongodb className="h-8 w-8 text-green-500" />
                      </div>
                      <div className="ml-4">
                        <h4 className="text-lg font-medium text-gray-900">MongoDB</h4>
                        <p className="text-gray-600">NoSQL database for storing user and chat data</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <SiSocketdotio className="h-8 w-8 text-black" />
                      </div>
                      <div className="ml-4">
                        <h4 className="text-lg font-medium text-gray-900">Socket.IO</h4>
                        <p className="text-gray-600">Server-side implementation for real-time messaging</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-10 bg-indigo-50 rounded-xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Additional Libraries & Tools</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow">
                  <span className="text-gray-900 font-medium">Mongoose</span>
                  <span className="text-sm text-gray-600">MongoDB ODM</span>
                </div>
                
                <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow">
                  <span className="text-gray-900 font-medium">bcrypt.js</span>
                  <span className="text-sm text-gray-600">Password Hashing</span>
                </div>
                
                <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow">
                  <span className="text-gray-900 font-medium">Multer</span>
                  <span className="text-sm text-gray-600">File Uploads</span>
                </div>
                
                <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow">
                  <span className="text-gray-900 font-medium">React Icons</span>
                  <span className="text-sm text-gray-600">Icon Library</span>
                </div>
                
                <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow">
                  <span className="text-gray-900 font-medium">date-fns</span>
                  <span className="text-sm text-gray-600">Date Formatting</span>
                </div>
                
                <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow">
                  <span className="text-gray-900 font-medium">UUID</span>
                  <span className="text-sm text-gray-600">Unique IDs</span>
                </div>
                
                <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow">
                  <span className="text-gray-900 font-medium">dotenv</span>
                  <span className="text-sm text-gray-600">Environment Variables</span>
                </div>
                
                <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow">
                  <span className="text-gray-900 font-medium">CORS</span>
                  <span className="text-sm text-gray-600">Cross-Origin Resource Sharing</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section id="development" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Development & Architecture
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Understand how ChatSphere is built and how to get started with development
            </p>
          </div>
          
          <div className="mt-16 grid gap-8 lg:grid-cols-2">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="px-6 py-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Project Structure</h3>
                
                <div className="bg-gray-800 rounded-lg p-4 text-gray-200 font-mono text-sm overflow-auto">
                  <pre>
{`📁 ChatSphere/
  ├── 📁 backend/
  │   ├── 📄 index.js       # Main server entry point
  │   ├── 📁 uploads/       # File storage
  │   ├── 📄 package.json   # Backend dependencies
  │   └── 📄 .env.example   # Environment variables template
  │
  ├── 📁 frontend/
  │   ├── 📁 public/        # Static assets
  │   ├── 📁 src/
  │   │   ├── 📁 components/ # React components
  │   │   ├── 📄 App.js     # Main application
  │   │   ├── 📄 index.js   # React entry point
  │   │   └── 📄 ChatsPage.js # Main chat interface
  │   │
  │   └── 📄 package.json   # Frontend dependencies
  │
  ├── 📄 README.md          # Project documentation
  └── 📄 LICENSE            # License information`}
                  </pre>
                </div>
                
                <div className="mt-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Architecture Highlights</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start">
                      <HiOutlineCheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" />
                      <span>Separate frontend and backend for clear separation of concerns</span>
                    </li>
                    <li className="flex items-start">
                      <HiOutlineCheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" />
                      <span>RESTful API for data operations with Socket.IO for real-time events</span>
                    </li>
                    <li className="flex items-start">
                      <HiOutlineCheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" />
                      <span>MongoDB schemas for Users, Messages, and Chats</span>
                    </li>
                    <li className="flex items-start">
                      <HiOutlineCheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" />
                      <span>Component-based React UI with responsive design</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="px-6 py-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Getting Started</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Prerequisites</h4>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start">
                        <HiOutlineCheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" />
                        <span>Node.js (v14.x or later)</span>
                      </li>
                      <li className="flex items-start">
                        <HiOutlineCheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" />
                        <span>MongoDB (local or Atlas)</span>
                      </li>
                      <li className="flex items-start">
                        <HiOutlineCheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" />
                        <span>npm or yarn package manager</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Installation Steps</h4>
                    <div className="bg-gray-100 rounded-lg p-4 font-mono text-sm">
                      <div className="mb-2"># Clone the repository</div>
                      <div className="text-indigo-600">git clone https://github.com/HimashaHerath/ChatSphere.git</div>
                      <div className="mt-3 mb-2"># Install backend dependencies</div>
                      <div className="text-indigo-600">cd ChatSphere/backend</div>
                      <div className="text-indigo-600">npm install</div>
                      <div className="mt-3 mb-2"># Install frontend dependencies</div>
                      <div className="text-indigo-600">cd ../frontend</div>
                      <div className="text-indigo-600">npm install</div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Configuration</h4>
                    <p className="mb-2 text-gray-600">Create a <code className="bg-gray-100 px-1 py-0.5 rounded">.env</code> file in the backend directory:</p>
                    <div className="bg-gray-100 rounded-lg p-4 font-mono text-sm">
                      <div className="text-green-600">MONGODB_URI=mongodb://localhost:27017/chat-app</div>
                      <div className="text-green-600">PORT=3001</div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Running the App</h4>
                    <div className="bg-gray-100 rounded-lg p-4 font-mono text-sm">
                      <div className="mb-2"># Start backend server</div>
                      <div className="text-indigo-600">cd backend</div>
                      <div className="text-indigo-600">npm start</div>
                      <div className="mt-3 mb-2"># Start frontend development server</div>
                      <div className="text-indigo-600">cd ../frontend</div>
                      <div className="text-indigo-600">npm start</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-10 bg-white rounded-xl shadow-md p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Development Roadmap</h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Current Features</h4>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <HiOutlineCheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" />
                    <span>User authentication and profile management</span>
                  </li>
                  <li className="flex items-start">
                    <HiOutlineCheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" />
                    <span>Real-time 1-on-1 and group conversations</span>
                  </li>
                  <li className="flex items-start">
                    <HiOutlineCheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" />
                    <span>Message status tracking (sent, delivered, read)</span>
                  </li>
                  <li className="flex items-start">
                    <HiOutlineCheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" />
                    <span>File attachments (images, documents, audio)</span>
                  </li>
                  <li className="flex items-start">
                    <HiOutlineCheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" />
                    <span>Message reactions and replies</span>
                  </li>
                  <li className="flex items-start">
                    <HiOutlineCheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" />
                    <span>Typing indicators</span>
                  </li>
                  <li className="flex items-start">
                    <HiOutlineCheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" />
                    <span>Online/offline status indicators</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Planned Enhancements</h4>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <HiOutlineChevronDown className="h-6 w-6 text-indigo-500 mr-2 flex-shrink-0" />
                    <span>End-to-end encryption for messages</span>
                  </li>
                  <li className="flex items-start">
                    <HiOutlineChevronDown className="h-6 w-6 text-indigo-500 mr-2 flex-shrink-0" />
                    <span>Voice and video calls using WebRTC</span>
                  </li>
                  <li className="flex items-start">
                    <HiOutlineChevronDown className="h-6 w-6 text-indigo-500 mr-2 flex-shrink-0" />
                    <span>Message search functionality</span>
                  </li>
                  <li className="flex items-start">
                    <HiOutlineChevronDown className="h-6 w-6 text-indigo-500 mr-2 flex-shrink-0" />
                    <span>Push notifications for new messages</span>
                  </li>
                  <li className="flex items-start">
                    <HiOutlineChevronDown className="h-6 w-6 text-indigo-500 mr-2 flex-shrink-0" />
                    <span>Custom themes and personalization</span>
                  </li>
                  <li className="flex items-start">
                    <HiOutlineChevronDown className="h-6 w-6 text-indigo-500 mr-2 flex-shrink-0" />
                    <span>Message scheduling and reminders</span>
                  </li>
                  <li className="flex items-start">
                    <HiOutlineChevronDown className="h-6 w-6 text-indigo-500 mr-2 flex-shrink-0" />
                    <span>Chat bots and integrations</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section id="contribute" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Join the Community
              </h2>
              <p className="mt-4 text-xl text-gray-600">
                ChatSphere is an open-source project and welcomes contributions from developers of all skill levels
              </p>
            </div>
            
            <div className="mt-12 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl shadow-md overflow-hidden">
              <div className="grid md:grid-cols-2">
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">How to Contribute</h3>
                  <p className="text-gray-600 mb-6">
                    We welcome contributions of all kinds - from bug fixes and feature implementations to documentation improvements and design enhancements.
                  </p>
                  
                  <ol className="space-y-4 text-gray-600">
                    <li className="flex">
                      <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-indigo-600 text-white font-medium mr-3">1</span>
                      <span>Fork the repository on GitHub</span>
                    </li>
                    <li className="flex">
                      <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-indigo-600 text-white font-medium mr-3">2</span>
                      <span>Create a new branch for your feature or bugfix</span>
                    </li>
                    <li className="flex">
                      <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-indigo-600 text-white font-medium mr-3">3</span>
                      <span>Make your changes and commit them</span>
                    </li>
                    <li className="flex">
                      <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-indigo-600 text-white font-medium mr-3">4</span>
                      <span>Submit a pull request with a clear description of the changes</span>
                    </li>
                  </ol>
                  
                  <div className="mt-8">
                    <a 
                      href="https://github.com/HimashaHerath/ChatSphere/issues"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <FaGithub className="mr-2 h-5 w-5" />
                      Browse Issues
                    </a>
                  </div>
                </div>
                
                <div className="bg-white p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Connect with the Developer</h3>
                  
                  <div className="flex items-start mb-6">
                    <img 
                      src="https://github.com/HimashaHerath.png" 
                      alt="Himasha Herath"
                      className="h-16 w-16 rounded-full mr-4"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/60?text=HH";
                      }}
                    />
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">Himasha Herath</h4>
                      <p className="text-gray-600">Project Creator & Lead Developer</p>
                      <div className="mt-2 flex space-x-3">
                        <a 
                          href="https://github.com/HimashaHerath" 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-700 hover:text-indigo-600 transition-colors"
                          aria-label="GitHub Profile"
                        >
                          <FaGithub className="h-6 w-6" />
                        </a>
                        <a 
                          href="https://www.linkedin.com/in/himasha-herath/" 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-700 hover:text-blue-600 transition-colors"
                          aria-label="LinkedIn Profile"
                        >
                          <FaLinkedin className="h-6 w-6" />
                        </a>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Looking for help with:</h4>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start">
                        <HiOutlineCheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                        <span>UI/UX design improvements</span>
                      </li>
                      <li className="flex items-start">
                        <HiOutlineCheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                        <span>Testing and bug reporting</span>
                      </li>
                      <li className="flex items-start">
                        <HiOutlineCheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                        <span>New feature implementations</span>
                      </li>
                      <li className="flex items-start">
                        <HiOutlineCheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                        <span>Documentation and code comments</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-20 bg-indigo-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Ready to Get Started?
            </h2>
            <p className="mt-4 text-xl text-indigo-100">
              Start chatting in real-time with a modern, feature-rich messaging platform
            </p>
            
            <div className="mt-8 flex justify-center flex-col sm:flex-row gap-4">
              <a 
                href="https://github.com/HimashaHerath/ChatSphere" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50 transition-colors"
              >
                <FaGithub className="mr-2 h-5 w-5" />
                View on GitHub
              </a>
              <a 
                href="#features" 
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-800 bg-opacity-60 hover:bg-opacity-70 transition-colors"
              >
                Explore Features
              </a>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center">
                <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-white">
                  <HiOutlineChat className="h-6 w-6 text-indigo-600" />
                </div>
                <span className="ml-2 text-2xl font-bold">ChatSphere</span>
              </div>
              
              <p className="mt-4 text-gray-400">
                An open-source real-time chat application built with React, Node.js, and Socket.IO.
              </p>
              
              <div className="mt-6 flex space-x-4">
                <a 
                  href="https://github.com/HimashaHerath/ChatSphere" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="GitHub"
                >
                  <FaGithub className="h-6 w-6" />
                </a>
                <a 
                  href="https://www.linkedin.com/in/himasha-herath/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="LinkedIn"
                >
                  <FaLinkedin className="h-6 w-6" />
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <nav className="flex flex-col space-y-2">
                <a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a>
                <a href="#tech-stack" className="text-gray-400 hover:text-white transition-colors">Tech Stack</a>
                <a href="#development" className="text-gray-400 hover:text-white transition-colors">Development</a>
                <a href="#contribute" className="text-gray-400 hover:text-white transition-colors">Contribute</a>
              </nav>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <nav className="flex flex-col space-y-2">
                <a 
                  href="https://github.com/HimashaHerath/ChatSphere" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  GitHub Repository
                </a>
                <a 
                  href="https://github.com/HimashaHerath/ChatSphere/issues" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Issue Tracker
                </a>
                <a 
                  href="https://github.com/HimashaHerath/ChatSphere/blob/main/README.md" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Documentation
                </a>
                <a 
                  href="https://github.com/HimashaHerath/ChatSphere/blob/main/LICENSE" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  License
                </a>
              </nav>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-700 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} ChatSphere. All rights reserved.</p>
            <p className="mt-2">Developed by <a 
              href="https://github.com/HimashaHerath" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300 transition-colors"
            >Himasha Herath</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;