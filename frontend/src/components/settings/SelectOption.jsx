const SelectOption = ({ label, value, options, onChange }) => {
  return (
    <div className="py-3">
      <label className="block text-slate-300 mb-2">{label}</label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white"
      >
        {options.map((item) => (
          <option key={item}>{item}</option>
        ))}
      </select>
    </div>
  );
};

export default SelectOption;
