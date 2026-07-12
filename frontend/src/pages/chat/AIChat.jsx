import { useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import ChatHeader from "../../components/chat/ChatHeader";
import SuggestedQuestions from "../../components/chat/SuggestedQuestions";
import ChatMessages from "../../components/chat/ChatMessages";
import ChatInput from "../../components/chat/ChatInput";

const AIChat = () => {
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hello! 👋 Upload a contract and ask me anything about it.",
    },
  ]);

  const sendMessage = (text) => {
    if (!text.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text,
      },
    ]);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text:
            "This is a demo AI response. Once we connect Spring Boot + AI, you'll receive real contract answers.",
        },
      ]);
    }, 800);
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto h-[calc(100vh-130px)] flex flex-col">

        <ChatHeader />

        <SuggestedQuestions />

        <ChatMessages messages={messages} />

        <ChatInput onSend={sendMessage} />

      </div>
    </MainLayout>
  );
};

export default AIChat;
