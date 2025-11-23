
"use client";

interface ToolbarProps {
  onButtonClick: (content: string) => void;
  visitorCount: number;
}

// تعريف الأزرار مع الترجمات والأيقونات
const buttons = [
  { id: "Visitors", label: "الزوار", icon: "👥" },
  { id: "Private", label: "الخاص", icon: "🔒" },
  { id: "Rooms", label: "الغرف", icon: "🚪" },
  { id: "Wall", label: "الحائط", icon: "📝" },
  { id: "Settings", label: "الإعدادات", icon: "⚙️" },
];

export default function Toolbar({ onButtonClick, visitorCount }: ToolbarProps) {
  return (
    <div className="flex items-center justify-around rounded-lg bg-gray-100 p-1">
      {buttons.map((button) => (
        <button
          key={button.id}
          onClick={() => onButtonClick(button.id)}
          className="flex flex-col items-center rounded-md px-3 py-1 text-xs text-gray-700 hover:bg-gray-200"
        >
          <span className="text-xl">{button.icon}</span>
          <span>
            {button.id === "Visitors" ? `${button.label} (${visitorCount})` : button.label}
          </span>
        </button>
      ))}
    </div>
  );
}
