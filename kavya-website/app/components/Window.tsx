'use client';

import { useState, useEffect } from 'react';

type ThemeData = {
  windowBackground: string;
  windowText: string;
  windowHeader: string;
};

type Props = {
  title: string;
  zIndex: number;
  onClose: () => void;
  onFocus: () => void;
  children: React.ReactNode;
  draggable: boolean;
  isHomeWindow: boolean;
  theme?: ThemeData;
  isDark?: boolean;
};

export default function Window({
  title,
  zIndex,
  onClose,
  onFocus,
  children,
  draggable,
  isHomeWindow,
  theme,
  isDark,
}: Props) {
  const [pos, setPos] = useState({ x: 120, y: 120 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Position windows offset from the home window (slightly bottom and right)
    if (isHomeWindow) {
      setPos({
        x: window.innerWidth / 2 - 375,
        y: window.innerHeight / 2 - 250,
      });
    } else {
      // Offset new windows to bottom-right of home window by 40px
      setPos({
        x: window.innerWidth / 2 - 375 + 40,
        y: window.innerHeight / 2 - 250 + 40,
      });
    }
    setMounted(true);
  }, [isHomeWindow]);

  function startDrag(e: React.MouseEvent) {
    if (!draggable) return;
    setDragging(true);
    setOffset({
      x: e.clientX - pos.x,
      y: e.clientY - pos.y,
    });
    onFocus();
  }

  function onDrag(e: React.MouseEvent) {
    if (!dragging || !draggable) return;
    setPos({
      x: e.clientX - offset.x,
      y: e.clientY - offset.y,
    });
  }

  function stopDrag() {
    setDragging(false);
  }

  if (!mounted) return null;

  const baseBg = theme?.windowBackground ?? (isDark ? '#132136' : '#ffffff');
  const baseText = theme?.windowText ?? (isDark ? '#ffffff' : '#0f172a');
  const headerBg = theme?.windowHeader ?? (isDark ? '#000000' : '#e2e8f0');

  return (
    <div
      className="window"
      style={{
        left: pos.x,
        top: pos.y,
        zIndex,
        width: isHomeWindow ? 750 : undefined,
        height: isHomeWindow ? 500 : undefined,
        backgroundColor: baseBg,
        color: baseText,
        border: isHomeWindow ? '2px solid #ffffff' : undefined,
      }}
      onMouseMove={onDrag}
      onMouseUp={stopDrag}
      onMouseLeave={stopDrag}
      onMouseDown={onFocus}
    >
      <div className="window-header" onMouseDown={startDrag} style={{ cursor: draggable ? 'grab' : 'default', borderBottom: isHomeWindow ? '2px solid #ffffff' : undefined, backgroundColor: headerBg }}>
        <span>{title}</span>
        <span className="window-close" onClick={onClose}>✕</span>
      </div>
      <div className="window-content">{children}</div>
    </div>
  );
}
