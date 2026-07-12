const SearchBar = ({ value, onChange, placeholder = "Search contracts..." }) => {
  return (
    <div className="mb-6">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none ring-0 focus:border-blue-500"
      />
    </div>
  );
};

export default SearchBar;
