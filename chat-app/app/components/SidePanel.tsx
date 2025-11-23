
"use client";

import React from "react";
import clsx from 'clsx';

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function SidePanel({ isOpen, onClose, children }: SidePanelProps) {
  return (
    <>
      {/* Overlay */}
      <div
        className={clsx(
          "fixed inset-0 z-30 bg-black bg-opacity-50 transition-opacity",
          { 'opacity-100': isOpen, 'opacity-0 pointer-events-none': !isOpen }
        )}
        onClick={onClose}
      />
      {/* Panel */}
      <div
        className={clsx(
          "fixed top-0 right-0 z-40 h-full w-80 transform bg-white p-4 shadow-xl transition-transform",
          { 'translate-x-0': isOpen, 'translate-x-full': !isOpen }
        )}
      >
        <button
          onClick={onClose}
          className="absolute top-2 left-2 rounded-full p-1 text-2xl text-gray-500 hover:bg-gray-200"
        >
          &times;
        </button>
        <div className="mt-8">
          {children}
        </div>
      </div>
    </>
  );
}
