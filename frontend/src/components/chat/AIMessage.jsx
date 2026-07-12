const AIMessage = ({ text }) => {
  return (
    <div className="flex justify-start mb-5">
      <div className="max-w-[75%] bg-slate-800 border border-slate-700 rounded-2xl rounded-bl-md px-5 py-3">
        {text}
      </div>
    </div>
  );
};

export default AIMessage;
