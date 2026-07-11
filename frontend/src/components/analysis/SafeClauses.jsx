import { FiCheckCircle } from "react-icons/fi";

const clauses = [
  "Salary",
  "Working Hours",
  "Leave Policy",
  "Insurance Benefits",
];

const SafeClauses = () => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

      <div className="flex items-center gap-3 mb-6">
        <FiCheckCircle className="text-green-400 text-2xl" />
        <h2 className="text-2xl font-bold">Safe Clauses</h2>
      </div>

      <div className="space-y-4">

        {clauses.map((item, index) => (
          <div
            key={index}
            className="bg-slate-800 rounded-xl p-4 flex items-center gap-3"
          >
            <FiCheckCircle className="text-green-400" />

            <span>{item}</span>
          </div>
        ))}

      </div>

    </div>
  );
};

export default SafeClauses;
