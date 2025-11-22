
"use client";
import styles from './Toolbar.module.css';

interface ToolbarProps {
  onButtonClick: (content: string) => void;
  visitorCount: number;
}

const buttonNames = ["Visitors", "Private", "Rooms", "Wall", "Settings"];

export default function Toolbar({ onButtonClick, visitorCount }: ToolbarProps) {
  return (
    <div className={styles.toolbar}>
      {buttonNames.map((name) => (
        <button key={name} onClick={() => onButtonClick(name)}>
          {name === "Visitors" ? `${name} (${visitorCount})` : name}
        </button>
      ))}
    </div>
  );
}
