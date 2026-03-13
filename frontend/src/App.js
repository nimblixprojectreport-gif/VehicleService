import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSend, FiMenu, FiX, FiSun, FiMoon, 
  FiUser, FiMessageCircle, FiCopy, FiCheck
} from 'react-icons/fi';
import './App.css';

const API_URL = 'http://localhost:8000/api/chatbot';

function App() {
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      role: 'bot', 
      content: "Hi there! I'm AutoBuddy, your vehicle service assistant. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [menu, setMenu] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const newSession = 'session_' + Date.now();
    setSessionId(newSession);
    fetchMenu();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchMenu = async () => {
    try {
      const res = await axios.get(`${API_URL}/menu/`);
      setMenu(res.data);
    } catch (error) {
      console.error('Menu fetch error:', error);
    }
  };

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: text,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await axios.post(`${API_URL}/ask/`, {
        question: text,
        session_id: sessionId
      });
      
      setTimeout(() => {
        const botMessage = {
          id: Date.now() + 1,
          role: 'bot',
          content: res.data.answer,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
      }, 1000);
    } catch (error) {
      console.error('Send error:', error);
      setIsTyping(false);
    }
  };

  const handleQuestionClick = (question) => {
    sendMessage(question);
    setMenuOpen(false);
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearChat = () => {
    setMessages([
      { 
        id: Date.now(), 
        role: 'bot', 
        content: "Hi there! I'm AutoBuddy, your vehicle service assistant. How can I help you today?",
        timestamp: new Date()
      }
    ]);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`app ${darkMode ? 'dark' : ''}`}>
      <header className="header">
        <div className="header-left">
          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            <FiMenu size={24} />
          </button>
          <div className="header-info">
            <h1>AutoBuddy</h1>
            <span className="header-status">AI Assistant • Online</span>
          </div>
        </div>
        <div className="header-right">
          <button onClick={clearChat} className="clear-btn">New Chat</button>
          <button onClick={() => setDarkMode(!darkMode)} className="theme-toggle">
            {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            className="side-menu"
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', damping: 25 }}
          >
            <div className="menu-header">
              <h3>Quick Questions</h3>
              <button onClick={() => setMenuOpen(false)}>
                <FiX size={20} />
              </button>
            </div>
            <div className="menu-content">
              {menu.map(category => (
                <div key={category.id} className="menu-category">
                  <h4>{category.icon} {category.name}</h4>
                  {category.questions.map(q => (
                    <button
                      key={q.id}
                      className="menu-item"
                      onClick={() => handleQuestionClick(q.question)}
                    >
                      {q.question}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="chat-container">
        <div className="messages">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              className={`message ${msg.role}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {msg.role === 'bot' && (
                <div className="avatar">
                  <FiMessageCircle />
                </div>
              )}
              <div className="content">
                {msg.role === 'bot' && (
                  <div className="message-sender">AutoBuddy</div>
                )}
                <div className="message-text">{msg.content}</div>
                <div className="message-footer">
                  <span className="time">{formatTime(msg.timestamp)}</span>
                  <button 
                    className="copy-btn"
                    onClick={() => copyToClipboard(msg.content, msg.id)}
                  >
                    {copiedId === msg.id ? <FiCheck size={14} /> : <FiCopy size={14} />}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
          
          {isTyping && (
            <motion.div 
              className="message bot typing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="avatar">
                <FiMessageCircle />
              </div>
              <div className="content">
                <div className="message-sender">AutoBuddy</div>
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="input-area">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage(input)}
            placeholder="Type a message..."
            disabled={isTyping}
          />
          <button 
            onClick={() => sendMessage(input)}
            disabled={isTyping || !input.trim()}
            className="send-btn"
          >
            <FiSend />
          </button>
        </div>

        <div className="suggested-chips">
          {menu.slice(0, 3).map(cat => 
            cat.questions.slice(0, 2).map(q => (
              <button
                key={q.id}
                className="chip"
                onClick={() => handleQuestionClick(q.question)}
              >
                {q.question}
              </button>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default App;