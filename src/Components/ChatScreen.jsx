import React, { useState, useRef, useEffect } from 'react';
import { Typography, TextField, IconButton, Avatar } from '@mui/material';
import { FiPaperclip, FiMic, FiArrowLeft, FiSearch, FiMoreVertical } from 'react-icons/fi';
import { RiSendPlaneFill } from 'react-icons/ri';

import bg from '../../public/bg.jpg'; 
import wbg from '../../public/whitebg.jpg'
function ChatWindow({ selectedChat, messages, isMobile, onBackClick, isDarkMode }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [highlightedMessageId, setHighlightedMessageId] = useState(null);
  const [newMessage, setNewMessage] = useState('');

  const messageRefs = useRef([]);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (highlightedMessageId !== null) {
      const messageIndex = messages.findIndex(message => message.id === highlightedMessageId);
      if (messageIndex !== -1 && messageRefs.current[messageIndex]) {
        messageRefs.current[messageIndex].scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [highlightedMessageId, messages]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSearch = () => {
    const messageIndex = messages.findIndex(message =>
      message.message.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (messageIndex !== -1) {
      setHighlightedMessageId(messages[messageIndex].id);
    } else {
      setHighlightedMessageId(null);
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      // Here you would typically send the message to your backend
      // and then update the messages state with the new message
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  const bgColor = isDarkMode ? '#0E1621' : 'white';
  const headerBgColor = isDarkMode ? '#17212B' : 'white';
  const textColor = isDarkMode ? 'white' : 'black';
  const inputBgColor = isDarkMode ? '#242F3D' : 'white';
const bbgg = isDarkMode ?wbg :bg;
  const chatWindowStyle = {
    backgroundImage: `url(${bbgg})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundColor: bgColor,
    backgroundAttachment: 'fixed', // Keeps the background fixed while content scrolls
  };

  return (
    <div className={`${isMobile ? 'w-full absolute inset-0' : 'w-2/3'} flex flex-col`} style={chatWindowStyle}>
      {selectedChat && (
        <>
          <div className={`p-3 shadow-md flex items-center justify-between`} style={{ backgroundColor: headerBgColor }}>
            <div className="flex items-center">
              {isMobile && (
                <IconButton color={isDarkMode ? "inherit" : "primary"} onClick={onBackClick} className="mr-2">
                  <FiArrowLeft />
                </IconButton>
              )}
              <Avatar className="mr-3 bg-[#2AABEE]">
                {selectedChat.creator.name ? selectedChat.creator.name[0].toUpperCase() : 'A'}
              </Avatar>
              <Typography variant="h6" className={`font-semibold ${textColor}`}>
                {selectedChat.creator.name || 'Anonymous'}
              </Typography>
            </div>
            <div>
              <IconButton color={isDarkMode ? "inherit" : "primary"} onClick={() => setIsSearching(!isSearching)}>
                <FiSearch />
              </IconButton>
              <IconButton color={isDarkMode ? "inherit" : "primary"}>
                <FiMoreVertical />
              </IconButton>
            </div>
          </div>
          {isSearching && (
            <div className="p-3">
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                InputProps={{
                  style: { color: textColor },
                }}
              />
            </div>
          )}
          <div ref={chatContainerRef} className="flex-grow overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={message.id}
                ref={(el) => (messageRefs.current[index] = el)}
                className={`flex ${message.sender_id === 1 ? 'justify-end' : 'justify-start'} 
                            ${highlightedMessageId === message.id ? ' ' : ''}`}
              >
                <div
                  className={`max-w-[70%] p-3 rounded-lg ${
                    message.sender_id === 1 
                      ? 'bg-[#2AABEE] text-white' 
                      : isDarkMode ? 'bg-[#242F3D] text-white' : 'bg-[#F0F0F0] text-black'
                  }`}
                >
                  <Typography>{message.message}</Typography>
                </div>
              </div>
            ))}
          </div>
          <div className={`p-3`} style={{ backgroundColor: headerBgColor }}>
            <div className={`flex items-center ${inputBgColor} rounded-full p-2 ${isDarkMode ? '' : 'border border-gray-300'}`}>
              <IconButton size="small" color={isDarkMode ? "inherit" : "primary"}>
                <FiPaperclip />
              </IconButton>
              <TextField
                fullWidth
                variant="standard"
                placeholder="Write a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSendMessage();
                  }
                }}
                InputProps={{
                  disableUnderline: true,
                  style: { color: textColor }
                }}
                className="mx-2"
              />
              <IconButton size="small" color={isDarkMode ? "inherit" : "primary"}>
                <FiMic />
              </IconButton>
              <IconButton size="small" color={isDarkMode ? "inherit" : "primary"} onClick={handleSendMessage}>
                <RiSendPlaneFill />
              </IconButton>
            </div>
          </div>
        </>
      )}
      {!selectedChat && (
        <div className="flex-grow flex items-center justify-center">
          <Typography variant="h6" style={{ color: textColor }}>
            Select a chat to start messaging
          </Typography>
        </div>
      )}
    </div>
  );
}

export default ChatWindow;
