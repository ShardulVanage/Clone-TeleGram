import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Sidebar from './Components/SideMenu';
import ChatWindow from './Components/ChatScreen';
import { MdModeEditOutline } from "react-icons/md";
function App() {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const theme = createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
      primary: {
        main: '#3390EC',
      },
      background: {
        default: isDarkMode ? '#0E1621' : '#FFFFFF',
        paper: isDarkMode ? '#17212B' : '#FFFFFF',
      },
      text: {
        primary: isDarkMode ? '#FFFFFF' : '#000000',
        secondary: isDarkMode ? '#8E9BA7' : '#707579',
      },
    },
  });

  useEffect(() => {
    fetchChats();
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchChats = async () => {
    try {
      const response = await fetch('https://devapi.beyondchats.com/api/get_all_chats?page=1');
      const data = await response.json();
      setChats(data.data.data);
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };

  const fetchMessages = async (chatId) => {
    try {
      const response = await fetch(`https://devapi.beyondchats.com/api/get_chat_messages?chat_id=${chatId}`);
      const data = await response.json();
      setMessages(data.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    fetchMessages(chat.id);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {(isMobile && !selectedChat) && (
        <>
        <div>

        <a  class="float" target="_blank">
        <MdModeEditOutline className='text-center ml-4 mt-3' />
        </a>
        </div>
        </>
         )}
      <div className={`flex h-screen ${isDarkMode ? 'bg-[#0E1621]' : 'bg-white'}`}>
        <Sidebar 
          chats={chats} 
          onChatSelect={handleChatSelect} 
          isMobile={isMobile} 
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
          isMenuOpen={isMenuOpen}
          toggleMenu={toggleMenu}
        />
        {(!isMobile || selectedChat) && (
          
          <ChatWindow
            selectedChat={selectedChat}
            messages={messages}
            isMobile={isMobile}
            onBackClick={() => setSelectedChat(null)}
            isDarkMode={isDarkMode}
          />
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;