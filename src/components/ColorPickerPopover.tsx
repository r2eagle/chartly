import React, { useState, useRef, useEffect } from 'react';
import { HexColorPicker } from 'react-colorful';
import './ColorPickerPopover.css';

interface Props {
  color: string;
  onChange: (color: string) => void;
  label?: string;
}

export const ColorPickerPopover: React.FC<Props> = ({ color, onChange, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hexInput, setHexInput] = useState(color);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Update hex input when color prop changes
  useEffect(() => {
    setHexInput(color);
  }, [color]);

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setHexInput(value);

    // Only update if valid hex color
    if (/^#[0-9A-F]{6}$/i.test(value)) {
      onChange(value);
    }
  };

  const handleColorChange = (newColor: string) => {
    setHexInput(newColor);
    onChange(newColor);
  };

  return (
    <div>
      {label && (
        <label className="block text-wf-xs text-wf-text-primary mb-1">
          {label}
        </label>
      )}
      <div className="relative" ref={popoverRef}>
        {/* Color Swatch Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full h-8 rounded-wf border border-wf-border hover:border-wf-border-subtle transition-colors flex items-center gap-2 px-2 bg-wf-bg-primary"
        >
          <div
            className="w-5 h-5 rounded border border-wf-border"
            style={{ backgroundColor: color }}
          />
          <span className="text-wf-xs text-wf-text-primary font-mono">
            {color.toUpperCase()}
          </span>
        </button>

        {/* Popover */}
        {isOpen && (
          <div className="absolute z-50 mt-2 p-3 bg-wf-bg-secondary border border-wf-border rounded-wf shadow-lg">
            <div className="space-y-3">
              {/* Hex Input */}
              <div>
                <label className="block text-wf-xs text-wf-text-secondary mb-1">
                  Hex
                </label>
                <input
                  type="text"
                  value={hexInput}
                  onChange={handleHexInputChange}
                  className="wf-input font-mono text-wf-xs"
                  placeholder="#000000"
                  maxLength={7}
                />
              </div>

              {/* Color Picker */}
              <div className="color-picker-container">
                <HexColorPicker color={color} onChange={handleColorChange} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
