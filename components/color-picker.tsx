"use client";

import { useEffect, useState } from "react";

// TEMPORARY COMPONENT - Remove after client picks final color
export function ColorPicker() {
  const [color, setColor] = useState("#841891");
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Convert hex to RGB
  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r} ${g} ${b}`;
  };

  // Convert RGB string to hex
  const rgbToHex = (rgb: string) => {
    const parts = rgb.trim().split(/\s+/).map(Number);
    if (parts.length !== 3 || parts.some(isNaN) || parts.some(p => p < 0 || p > 255)) {
      return null;
    }
    const [r, g, b] = parts;
    return `#${[r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('')}`;
  };

  const rgbValue = hexToRgb(color);

  useEffect(() => {
    // Update CSS variable
    const [r, g, b] = rgbValue.split(' ').map(Number);
    document.documentElement.style.setProperty(
      "--primary-color",
      `rgb(${r} ${g} ${b})`
    );
  }, [color, rgbValue]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(rgbValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = rgbValue;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (fallbackErr) {
        console.error('Fallback copy failed:', fallbackErr);
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white shadow-lg rounded-full p-3 border-2 border-gray-300 hover:border-gray-400 transition-colors"
        title="Theme Color Picker"
      >
        <div
          className="w-6 h-6 rounded-full"
          style={{ backgroundColor: color }}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white shadow-xl rounded-lg p-4 border border-gray-200 min-w-[250px]">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Primary Color
              </label>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full h-10 rounded cursor-pointer border border-gray-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                RGB Value
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={rgbValue}
                  onChange={(e) => {
                    const val = e.target.value;
                    const hex = rgbToHex(val);
                    if (hex) {
                      setColor(hex);
                    }
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm font-mono"
                  placeholder="24 123 145"
                />
                <button
                  onClick={handleCopy}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm transition-colors"
                  title="Copy to clipboard"
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>

            <div className="text-xs text-gray-500 pt-2 border-t border-gray-200">
              Pick a color and copy the RGB value to share with the team.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
