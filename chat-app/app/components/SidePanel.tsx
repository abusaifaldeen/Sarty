
"use client";

import React from "react";
import styles from './SidePanel.module.css';
import clsx from 'clsx';

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function SidePanel({ isOpen, onClose, children }: SidePanelProps) {
  return (
    <div className={clsx(styles.sidePanel, { [styles.open]: isOpen })}>
      <button onClick={onClose} className={styles.closeButton}>
        &times;
      </button>
      {children}
    </div>
  );
}
