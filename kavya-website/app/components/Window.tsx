'use client';

import { useState } from 'react';

type Props = {
  title: string;
  zIndex: number;
  onClose: () => void;
  onFocus: () => void;
  children: React.ReactNode;
};

export default function Window({
  title,
  zIndex,
  onClose,
  onFocus,
  children,
}: Props) {
  const [pos, setPos] = useState({ x: 120, y: 120 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  function startDrag(e: React.MouseEvent) {
    setDragging(true);
    setOffset({
      x: e.clientX - pos.x,
      y: e.clientY - pos.y,
    });
    onFocus();
  }

  function onDrag(e: React.MouseEvent) {
    if (!dragging) return;
    setPos({
      x: e.clientX - offset.x,
      y: e.clientY - offset.y,
    });
  }

  function stopDrag() {
    setDragging(false);
  }

  return (
    <div
      className="window"
      style={{ left: pos.x, top: pos.y, zIndex }}
      onMouseMove={onDrag}
      onMouseUp={stopDrag}
      onMouseLeave={stopDrag}
      onMouseDown={onFocus}
    >
      <div className="window-header" onMouseDown={startDrag}>
        <span>{title}</span>
        <span className="window-close" onClick={onClose}>✕</span>
      </div>
      <div className="window-content">{children}</div>
    </div>
  );
}
