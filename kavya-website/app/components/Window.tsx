'use client';

import { useState, useEffect } from 'react';

type Props = {
  title: string;
  zIndex: number;
  onClose: () => void;
  onFocus: () => void;
  children: React.ReactNode;
  draggable: boolean;
  isHomeWindow: boolean;
};

export default function Window({
  title,
  zIndex,
  onClose,
  onFocus,
  children,
  draggable,
  isHomeWindow,
}: Props) {
  const [pos, setPos] = useState({ x: 120, y: 120 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isHomeWindow) {
      setPos({
        x: window.innerWidth / 2 - 375,
        y: 150,
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

  return (
    <div
      className="window"
      style={{
        left: pos.x,
        top: pos.y,
        zIndex,
        width: isHomeWindow ? 750 : undefined,
        height: isHomeWindow ? 500 : undefined,
        backgroundColor: isHomeWindow ? '#132136' : undefined,
        border: isHomeWindow ? '2px solid #ffffff' : undefined,
      }}
      onMouseMove={onDrag}
      onMouseUp={stopDrag}
      onMouseLeave={stopDrag}
      onMouseDown={onFocus}
    >
      <div className="window-header" onMouseDown={startDrag} style={{ cursor: draggable ? 'grab' : 'default', borderBottom: isHomeWindow ? '2px solid #ffffff' : undefined }}>
        <span>{title}</span>
        <span className="window-close" onClick={onClose}>✕</span>
      </div>
      <div className="window-content">{children}</div>
    </div>
  );
}
