import React, { useState, useEffect, useRef } from 'react';
import './css/Goals.css';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

const Goals: React.FC = () => {
  const [conversation, setConversation] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const chatboxRef = useRef<HTMLDivElement>(null);

  const sendMessage = async () => {
    const messageText = inputText.trim();
    if (messageText === '') return;

    // Add user message to conversation
    const newUserMessage: Message = { sender: 'user', text: messageText };
    setConversation((prev) => [...prev, newUserMessage]);

    // Scroll to bottom after adding message
    scrollToBottom();

    // Send message to Flask backend
    try {
      const response = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_input: messageText }),
      });

      const data = await response.json();

      if (response.ok) {
        const newBotMessage: Message = { sender: 'bot', text: data.bot_response };
        setConversation((prev) => [...prev, newBotMessage]);
        // Scroll to bottom after receiving bot response
        scrollToBottom();
      } else {
        console.error('Error:', data.error);
      }
    } catch (error) {
      console.error('Error:', error);
    }

    setInputText('');
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      sendMessage();
    }
  };

  const scrollToBottom = () => {
    if (chatboxRef.current) {
      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
    }
  };

  const finishTalking = () => {
    // Handle the finish talking action here, if needed.
    // Since tasks are handled elsewhere, we might redirect or show a message.
    alert('Thank you for chatting! You can end the session or continue whenever you like.');
  };

  return (
    <div className="goals-main-container">
      <div className="goals-container">
        <h1>Chat</h1>
        <div className="chatbox" id="chatbox" ref={chatboxRef}>
          {conversation.map((message, index) => (
            <div key={index} className={`message ${message.sender}`}>
              {message.text}
            </div>
          ))}
        </div>

        <div className="input-container">
          <input
            type="text"
            id="message-input"
            className="message-input"
            placeholder="Type your message"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button className="send-btn" onClick={sendMessage}>
            Send
          </button>
        </div>
      </div>

      <button className="finished-btn" onClick={finishTalking}>
        Finished Talking
      </button>
    </div>
  );
};

export default Goals;
