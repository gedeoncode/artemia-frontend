import { tabs } from "../constants/tabs";

interface ProfileTabsProps {
  profileType: "individual" | "company";
  activeTab: string;
  setActiveTab: (tabId: string) => void;
  disabled: boolean;
}

export function ProfileTabs({
  profileType,
  activeTab,
  setActiveTab,
  disabled,
}: ProfileTabsProps) {
  const filteredTabs = tabs.filter((tab) =>
    tab.id === "business" ? profileType === "company" : true
  );

  return (
    <div className="border-b border-gray-200">
      <nav className="flex -mb-px overflow-x-auto hide-scrollbar">
        <div className="flex space-x-8">
          {filteredTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              disabled={disabled}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200
                ${
                  activeTab === tab.id
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }
                ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
