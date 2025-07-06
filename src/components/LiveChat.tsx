import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, X, User, Shield, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Message {
  id: string;
  userId: string;
  userName: string;
  userRole: 'user' | 'admin';
  message: string;
  timestamp: Date;
  isRead: boolean;
}

interface ChatSession {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  messages: Message[];
  status: 'active' | 'closed';
  lastActivity: Date;
  unreadCount: number;
}

const LiveChat: React.FC = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock chat sessions for admin
  useEffect(() => {
    if (user?.role === 'admin') {
      const mockSessions: ChatSession[] = [
        {
          id: 'session-1',
          userId: 'user-1',
          userName: 'John Smith',
          userEmail: 'john@demo.com',
          status: 'active',
          lastActivity: new Date(Date.now() - 5 * 60000),
          unreadCount: 2,
          messages: [
            {
              id: 'msg-1',
              userId: 'user-1',
              userName: 'John Smith',
              userRole: 'user',
              message: 'Hi, I need help with my Bitcoin purchase',
              timestamp: new Date(Date.now() - 10 * 60000),
              isRead: true
            },
            {
              id: 'msg-2',
              userId: 'user-1',
              userName: 'John Smith',
              userRole: 'user',
              message: 'The transaction seems to be pending',
              timestamp: new Date(Date.now() - 5 * 60000),
              isRead: false
            }
          ]
        },
        {
          id: 'session-2',
          userId: 'user-2',
          userName: 'Sarah Johnson',
          userEmail: 'sarah@demo.com',
          status: 'active',
          lastActivity: new Date(Date.now() - 15 * 60000),
          unreadCount: 1,
          messages: [
            {
              id: 'msg-3',
              userId: 'user-2',
              userName: 'Sarah Johnson',
              userRole: 'user',
              message: 'How do I withdraw my Bitcoin?',
              timestamp: new Date(Date.now() - 15 * 60000),
              isRead: false
            }
          ]
        }
      ];
      setChatSessions(mockSessions);
    }
  }, [user]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load messages for active chat
  useEffect(() => {
    if (activeChatId) {
      const session = chatSessions.find(s => s.id === activeChatId);
      if (session) {
        setMessages(session.messages);
      }
    } else if (user?.role === 'user') {
      // Mock messages for regular users
      setMessages([
        {
          id: 'welcome-1',
          userId: 'admin',
          userName: 'Support Team',
          userRole: 'admin',
          message: 'Hello! Welcome to Tesla Stock Pro support. How can we help you today?',
          timestamp: new Date(Date.now() - 30 * 60000),
          isRead: true
        }
      ]);
    }
  }, [activeChatId, chatSessions, user]);

  const sendMessage = () => {
    if (!message.trim()) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      userId: user?.id || 'anonymous',
      userName: user?.name || 'User',
      userRole: user?.role || 'user',
      message: message.trim(),
      timestamp: new Date(),
      isRead: false
    };

    if (user?.role === 'admin' && activeChatId) {
      // Admin sending message to specific chat
      setChatSessions(prev => prev.map(session => 
        session.id === activeChatId 
          ? { ...session, messages: [...session.messages, newMessage], lastActivity: new Date() }
          : session
      ));
    } else {
      // User sending message
      setMessages(prev => [...prev, newMessage]);
      
      // Simulate admin response after 2-3 seconds
      setIsTyping(true);
      setTimeout(() => {
        const adminResponse: Message = {
          id: `admin-${Date.now()}`,
          userId: 'admin',
          userName: 'Support Team',
          userRole: 'admin',
          message: getAutoResponse(message),
          timestamp: new Date(),
          isRead: false
        };
        setMessages(prev => [...prev, adminResponse]);
        setIsTyping(false);
      }, 2000 + Math.random() * 1000);
    }

    setMessage('');
  };

  const getAutoResponse = (userMessage: string): string => {
    const msg = userMessage.toLowerCase();
    if (msg.includes('bitcoin') || msg.includes('btc')) {
      return "I can help you with Bitcoin-related questions. Are you looking to purchase Bitcoin or having issues with a transaction?";
    }
    if (msg.includes('withdraw') || msg.includes('withdrawal')) {
      return "For withdrawals, please go to your dashboard and click on the Bitcoin section. You can withdraw to any valid Bitcoin address.";
    }
    if (msg.includes('tesla') || msg.includes('stock')) {
      return "For Tesla stock purchases, you can use the trading interface on your dashboard. Do you need help with a specific transaction?";
    }
    return "Thank you for your message. A support representative will assist you shortly. Is there anything specific I can help you with?";
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatLastActivity = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  if (!user) return null;

  // Admin Chat Interface
  if (user.role === 'admin') {
    return (
      <>
        {/* Chat Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-blue-500 text-white p-4 rounded-full shadow-lg hover:from-blue-500 hover:to-blue-400 transition-all duration-300 z-50"
        >
          <MessageCircle className="h-6 w-6" />
          {chatSessions.reduce((total, session) => total + session.unreadCount, 0) > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
              {chatSessions.reduce((total, session) => total + session.unreadCount, 0)}
            </span>
          )}
        </button>

        {/* Admin Chat Panel */}
        {isOpen && (
          <div className="fixed bottom-24 right-6 w-96 h-96 bg-gray-800/95 backdrop-blur-sm border border-gray-700 rounded-xl shadow-2xl z-50 flex">
            {/* Chat Sessions List */}
            <div className="w-1/3 border-r border-gray-700 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold text-sm">Support Chats</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-2">
                {chatSessions.map(session => (
                  <button
                    key={session.id}
                    onClick={() => setActiveChatId(session.id)}
                    className={`w-full text-left p-2 rounded-lg transition-colors duration-200 ${
                      activeChatId === session.id 
                        ? 'bg-blue-600/20 border border-blue-500/50' 
                        : 'hover:bg-gray-700/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white text-xs font-medium truncate">
                        {session.userName}
                      </span>
                      {session.unreadCount > 0 && (
                        <span className="bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                          {session.unreadCount}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 text-xs">
                      {formatLastActivity(session.lastActivity)}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 flex flex-col">
              {activeChatId ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-700">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-white font-medium text-sm">
                        {chatSessions.find(s => s.id === activeChatId)?.userName}
                      </span>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {messages.map(msg => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.userRole === 'admin' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs px-3 py-2 rounded-lg ${
                            msg.userRole === 'admin'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-700 text-white'
                          }`}
                        >
                          <p className="text-sm">{msg.message}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {formatTime(msg.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-700">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your response..."
                        className="flex-1 px-3 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                      />
                      <button
                        onClick={sendMessage}
                        className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-lg transition-colors duration-200"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-gray-400 text-sm">Select a chat to start</p>
                </div>
              )}
            </div>
          </div>
        )}
      </>
    );
  }

  // User Chat Interface
  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-red-600 to-red-500 text-white p-4 rounded-full shadow-lg hover:from-red-500 hover:to-red-400 transition-all duration-300 z-50"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* User Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 h-96 bg-gray-800/95 backdrop-blur-sm border border-gray-700 rounded-xl shadow-2xl z-50 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-700 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-red-400" />
              <span className="text-white font-semibold">Live Support</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex ${msg.userRole === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg ${
                    msg.userRole === 'user'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-700 text-white'
                  }`}
                >
                  <p className="text-sm">{msg.message}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {formatTime(msg.timestamp)}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-700 text-white px-3 py-2 rounded-lg">
                  <div className="flex items-center space-x-1">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-xs text-gray-400 ml-2">Support is typing...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-700">
            <div className="flex space-x-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-red-500"
              />
              <button
                onClick={sendMessage}
                className="bg-red-600 hover:bg-red-500 text-white p-2 rounded-lg transition-colors duration-200"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LiveChat;