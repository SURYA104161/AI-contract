import { useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import SettingsCard from "../../components/settings/SettingsCard";
import ToggleSwitch from "../../components/settings/ToggleSwitch";
import SelectOption from "../../components/settings/SelectOption";

const Settings = () => {
  const [darkMode, setDarkMode] = useState(true);

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [analysisCompleted, setAnalysisCompleted] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(false);

  const [saveChats, setSaveChats] = useState(true);
  const [saveContracts, setSaveContracts] = useState(true);
  const [deleteAfterAnalysis, setDeleteAfterAnalysis] = useState(false);

  const [language, setLanguage] = useState("English");
  const [aiModel, setAiModel] = useState("GPT-4o Mini");

  const handleSave = () => {
    alert("Settings saved successfully! (Frontend Demo)");
  };

  const handleLogout = () => {
    alert("Logout will be connected after backend integration.");
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl font-bold">Settings</h1>

        <p className="text-slate-400 mt-2 mb-8">
          Customize your AI Contract Assistant experience.
        </p>

        <div className="space-y-6">

          <SettingsCard title="Appearance">
            <ToggleSwitch
              label="Dark Mode"
              enabled={darkMode}
              onChange={setDarkMode}
            />
          </SettingsCard>

          <SettingsCard title="AI Settings">
            <SelectOption
              label="AI Model"
              value={aiModel}
              onChange={setAiModel}
              options={[
                "GPT-4o Mini",
                "GPT-4.1",
                "Claude",
                "Gemini"
              ]}
            />
          </SettingsCard>

          <SettingsCard title="Contract Analysis">

            <ToggleSwitch
              label="Generate Summary"
              enabled={true}
              onChange={() => {}}
            />

            <ToggleSwitch
              label="Detect Risky Clauses"
              enabled={true}
              onChange={() => {}}
            />

            <ToggleSwitch
              label="Suggest Questions"
              enabled={true}
              onChange={() => {}}
            />

            <ToggleSwitch
              label="Highlight Important Clauses"
              enabled={true}
              onChange={() => {}}
            />

          </SettingsCard>

          <SettingsCard title="Notifications">

            <ToggleSwitch
              label="Email Notifications"
              enabled={emailNotifications}
              onChange={setEmailNotifications}
            />

            <ToggleSwitch
              label="Analysis Completed"
              enabled={analysisCompleted}
              onChange={setAnalysisCompleted}
            />

            <ToggleSwitch
              label="Weekly Report"
              enabled={weeklyReport}
              onChange={setWeeklyReport}
            />

          </SettingsCard>

          <SettingsCard title="Privacy">

            <ToggleSwitch
              label="Save Chat History"
              enabled={saveChats}
              onChange={setSaveChats}
            />

            <ToggleSwitch
              label="Save Uploaded Contracts"
              enabled={saveContracts}
              onChange={setSaveContracts}
            />

            <ToggleSwitch
              label="Delete Files After Analysis"
              enabled={deleteAfterAnalysis}
              onChange={setDeleteAfterAnalysis}
            />

          </SettingsCard>

          <SettingsCard title="Language">

            <SelectOption
              label="Preferred Language"
              value={language}
              onChange={setLanguage}
              options={[
                "English",
                "Tamil",
                "Hindi"
              ]}
            />

          </SettingsCard>

          <SettingsCard title="About">

            <div className="space-y-2 text-slate-300">

              <p><strong>Application:</strong> AI Contract Assistant</p>

              <p><strong>Version:</strong> 1.0.0</p>

              <p><strong>Frontend:</strong> React + Tailwind CSS</p>

              <p><strong>Backend:</strong> FastAPI</p>

              <p><strong>Database:</strong> Supabase</p>

            </div>

          </SettingsCard>

          <div className="flex gap-4">

            <button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl"
            >
              Save Changes
            </button>

            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-xl"
            >
              Logout
            </button>

          </div>

        </div>

      </div>
    </MainLayout>
  );
};

export default Settings;
