import { FiMessageSquare } from "react-icons/fi";

const ChatHeader = () => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-5">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-2xl">
          <FiMessageSquare />
        </div>

        <div>
          <h1 className="text-3xl font-bold">AI Contract Assistant</h1>

          <p className="text-slate-400">
            Ask anything about your uploaded contract.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
