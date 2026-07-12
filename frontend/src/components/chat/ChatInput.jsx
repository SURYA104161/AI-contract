import { useState } from "react";

const ChatInput = ({ onSend }) => {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;

    onSend(text);

    setText("");
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">

      <div className="flex gap-3">

        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
          type="text"
          placeholder="Ask a question about your contract..."
          className="flex-1 rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none focus:border-blue-500"
        />

        <button
          onClick={handleSend}
          className="rounded-xl bg-blue-600 px-5 py-3 text-sm text-white hover:bg-blue-700"
        >
          Send
        </button>

      </div>

    </div>
  );
};

export default ChatInput;
