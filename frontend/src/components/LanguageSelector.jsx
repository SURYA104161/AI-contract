import { FiGlobe } from "react-icons/fi";

const LANGUAGES = [
  { code: "en", label: "English", nativeLabel: "English" },
  { code: "ta", label: "Tamil", nativeLabel: "தமிழ்" },
];

const LanguageSelector = ({ value, onChange, compact = false }) => {
  const selected = LANGUAGES.find((l) => l.code === value) || LANGUAGES[0];

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <FiGlobe className="text-slate-400" />
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-2 outline-none focus:border-blue-500 cursor-pointer"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.nativeLabel}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
      <div className="flex items-center gap-3 mb-3">
        <FiGlobe className="text-blue-400 text-lg" />
        <span className="text-sm font-medium text-slate-300">Output Language</span>
      </div>
      <div className="flex gap-2">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => onChange(lang.code)}
            className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              value === lang.code
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"
            }`}
          >
            <span className="block">{lang.nativeLabel}</span>
            <span className="block text-xs mt-0.5 opacity-70">{lang.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSelector;
