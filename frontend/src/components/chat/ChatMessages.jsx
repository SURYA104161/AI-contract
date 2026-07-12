import AIMessage from "./AIMessage";
import UserMessage from "./UserMessage";

const ChatMessages = ({ messages }) => {
  return (
    <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl p-6 overflow-y-auto">

      {messages.map((message, index) =>
        message.sender === "user" ? (
          <UserMessage key={index} text={message.text} />
        ) : (
          <AIMessage key={index} text={message.text} />
        )
      )}

    </div>
  );
};

export default ChatMessages;
