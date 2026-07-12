const UserMessage = ({ text }) => {
  return (
    <div className="flex justify-end mb-5">
      <div className="max-w-[75%] bg-blue-600 text-white rounded-2xl rounded-br-md px-5 py-3">
        {text}
      </div>
    </div>
  );
};

export default UserMessage;
