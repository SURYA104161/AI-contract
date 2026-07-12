const TypingIndicator = () => {
  return (
    <div className="flex justify-start mb-5">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4">
        <div className="flex gap-2">
          <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></span>
          <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-150"></span>
          <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-300"></span>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
