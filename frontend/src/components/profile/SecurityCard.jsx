const SecurityCard = () => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
      <h3 className="text-xl font-semibold mb-4">Security</h3>

      <div className="flex items-center justify-between py-3 border-b border-slate-800">
        <div>
          <p className="font-medium">Password</p>
          <p className="text-sm text-slate-400">Last updated 2 days ago</p>
        </div>
        <button className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-xl">
          Change
        </button>
      </div>

      <div className="flex items-center justify-between py-3">
        <div>
          <p className="font-medium">Two-Factor Authentication</p>
          <p className="text-sm text-slate-400">Add an extra layer of protection</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl">
          Enable
        </button>
      </div>
    </div>
  );
};

export default SecurityCard;
