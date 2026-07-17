import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import ChatHeader from "../../components/chat/ChatHeader";
import SuggestedQuestions from "../../components/chat/SuggestedQuestions";
import ChatMessages from "../../components/chat/ChatMessages";
import ChatInput from "../../components/chat/ChatInput";
import LanguageSelector from "../../components/LanguageSelector";
import { chatWithAI, getContracts } from "../../services/api";
import { useAuthContext } from "../../context/AuthContext";

const AIChat = () => {
  const { user } = useAuthContext();
  const location = useLocation();
  const contractIdFromNav = location.state?.contractId;

  const [contracts, setContracts] = useState([]);
  const [selectedContractId, setSelectedContractId] = useState(contractIdFromNav || "");
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hello! Select a contract and ask me anything about it.",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    if (!user) return;
    getContracts()
      .then(setContracts)
      .catch((err) => console.error(err));
  }, [user]);

  useEffect(() => {
    if (contractIdFromNav) {
      setSelectedContractId(contractIdFromNav);
    }
  }, [contractIdFromNav]);

  const sendMessage = async (text) => {
    if (!text.trim() || !selectedContractId) return;

    setMessages((prev) => [...prev, { sender: "user", text }]);
    setLoading(true);

    try {
      const response = await chatWithAI(selectedContractId, text, language);
      setMessages((prev) => [...prev, { sender: "ai", text: response.answer }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "Sorry, I couldn't process your question. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestedQuestion = (question) => {
    sendMessage(question);
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto h-[calc(100vh-130px)] flex flex-col">
        <ChatHeader />

        <div className="mb-4">
          <LanguageSelector value={language} onChange={setLanguage} compact />
        </div>

        {contracts.length > 0 && !selectedContractId && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-5">
            <h2 className="text-xl font-semibold text-white mb-4">Select a Contract</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {contracts.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedContractId(c.id)}
                  className="text-left rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-300 hover:border-blue-500 hover:text-white"
                >
                  {c.original_file_name}
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedContractId && (
          <SuggestedQuestions onAsk={handleSuggestedQuestion} />
        )}

        <ChatMessages messages={messages} />

        {loading && (
          <div className="text-center text-blue-400 py-2">AI is thinking...</div>
        )}

        <ChatInput onSend={sendMessage} disabled={!selectedContractId} />
      </div>
    </MainLayout>
  );
};

export default AIChat;
