'use client';

import Window from './Window';
import Icon from './Icon';
import { useEffect, useRef, useState } from 'react';
import Wavify from 'react-wavify';


type AppWindow = {
  id: string;
  title: string;
  content: React.ReactNode;
  z: number;
  draggable?: boolean;
};

export default function Desktop() {
  const [windows, setWindows] = useState<AppWindow[]>([]);
  const [zCounter, setZCounter] = useState(10);
  const [isDark, setIsDark] = useState(true);

  const darkTheme = {
    desktopBackground: '#171616', // Desktop Background
    wave1: '#0ea5e9', // dark wave accented color
    wave2: '#1e5a7a', // dark wave secondary color
    buttonBg: '#1e40af', // dark toggle button
    buttonText: '#dbeafe',
    windowBackground: '#132137', // dark window background
    windowText: '#e0e7ff', // dark window text
    windowHeader: '#171616',
    homeTitle: '#e0e7ff',
    homeText: '#c7d2fe',
  };

  const lightTheme = {
    desktopBackground: '#ffffff', // Desktop Background
    wave1: '#60a5fa', // light wave accented color
    wave2: '#93c5fd', // light wave secondary color
    buttonBg: '#2563eb', // light toggle button
    buttonText: '#ffffff',
    windowBackground: '#ffffff', // light window background
    windowText: '#000000', // home text
    windowHeader: '#3d3e42',
    homeTitle: '#1e3a8a',
    homeText: '#1e40af',
  };

  const theme = isDark ? darkTheme : lightTheme;

  function openWindow(id: string, title: string, content: React.ReactNode, draggable: boolean = true) {
    setZCounter(prevZ => {
      const newZ = prevZ + 1;
      setWindows(prev => {
        const existing = prev.find(win => win.id === id);
        if (existing) {
          // If already open, bring to front instead of adding duplicate.
          return prev.map(win =>
            win.id === id ? { ...win, z: newZ } : win
          );
        }

        return [...prev, { id, title, content, z: newZ, draggable }];
      });
      return newZ;
    });
  }

  function closeWindow(id: string) {
    setWindows(w => w.filter(win => win.id !== id));
  }

  useEffect(() => {
  openWindow(
    'home',
    'home',
    <HomeContent openWindow={openWindow} />,
    false
  );
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

  function focusWindow(id: string) {
    setZCounter(prevZ => {
      const newZ = prevZ + 1;
      setWindows(w =>
        w.map(win =>
          win.id === id ? { ...win, z: newZ } : win
        )
      );
      return newZ;
    });
  }

  return (
    <div className="desktop" style={{ backgroundColor: theme.desktopBackground, position: 'relative', overflow: 'hidden', height: '100vh' }}>
      {/* Single-color background full page */}
      <div style={{ position: 'absolute', inset: 0, backgroundColor: theme.desktopBackground, zIndex: 5 }} />

      {/* Wave overlay at bottom */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '33.333%', overflow: 'hidden', zIndex: 6 }}>
        <Wavify
          fill={theme.wave2}
          paused={false}
          options={{
            height: 60,
            amplitude: 5,
            speed: 0.15,
            points: 1,
          }}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}
        />
      </div>

      {/* Windows overlay */}
      <button
        onClick={() => setIsDark(prev => !prev)}
        style={{
          position: 'absolute',
          top: 14,
          right: 14,
          zIndex: 999,
          pointerEvents: 'auto',
          border: 'none',
          borderRadius: 999,
          padding: '8px 14px',
          background: theme.buttonBg,
          color: theme.buttonText,
          cursor: 'pointer',
        }}
      >
        {isDark ? 'Switch to Light' : 'Switch to Dark'}
      </button>

      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
        {windows.map(win => (
          <div key={win.id} style={{ pointerEvents: 'auto' }}>
            <Window
              title={win.title}
              zIndex={win.z}
              onClose={() => closeWindow(win.id)}
              onFocus={() => focusWindow(win.id)}
              draggable={win.draggable !== false}
              isHomeWindow={win.id === 'home'}
              isDark={isDark}
              theme={theme}
            >
              {win.content}
            </Window>
          </div>
        ))}
      </div>
    </div>
  );
}

function HomeContent({
  openWindow,
}: {
  openWindow: (id: string, title: string, content: React.ReactNode, draggable?: boolean) => void;
}) {
  return (
    <div style={{ textAlign: 'center', padding: '60px 40px' }}>
      <h1 style={{ fontSize: 48, marginBottom: 16, fontWeight: 600 }}>hi! i'm kavya</h1>

      <p style={{ opacity: 0.7, marginBottom: 60, fontSize: 16 }}>
        As a computer science student fully committed to life-long learning,
        I'm a creative with a passion for software development.
      </p>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 24,
        }}
      >
        <HomeButton
          label="about"
          icon="👩‍💻"
          onClick={() =>
            openWindow(
              'about',
              'about',
              <>I'm a CS student interested in product + engineering.</>,
              true
            )
          }
        />

        <HomeButton
          label="links"
          icon="🔗"
          onClick={() =>
            openWindow(
              'links',
              'links',
              <>
                <p>GitHub / LinkedIn / Twitter</p>
              </>,
              true
            )
          }
        />

        <HomeButton
          label="work"
          icon="💼"
          onClick={() =>
            openWindow(
              'work',
              'work',
              <ul>
                <li>Retro Desktop Portfolio</li>
                <li>Next.js Projects</li>
              </ul>,
              true
            )
          }
        />

        <HomeButton
          label="faq"
          icon="❓"
          onClick={() =>
            openWindow(
              'faq',
              'faq',
              <>Coming soon.</>,
              true
            )
          }
        />

        <HomeButton
          label="contact"
          icon="✉️"
          onClick={() =>
            openWindow(
              'contact',
              'contact',
              <ContactForm />,
              true
            )
          }
        />
      </div>
    </div>
  );
}

function HomeButton({
  label,
  icon,
  onClick,
}: {
  label: string;
  icon: string;
  onClick: () => void;
}) {
  const pointerDown = useRef<{ x: number; y: number } | null>(null);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    pointerDown.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!pointerDown.current) return;
    const dx = Math.abs(e.clientX - pointerDown.current.x);
    const dy = Math.abs(e.clientY - pointerDown.current.y);
    pointerDown.current = null;

    if (dx < 6 && dy < 6) {
      onClick();
    }
  };

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={() => {
        pointerDown.current = null;
      }}
      style={{
        background: 'transparent',
        border: '2px solid #60a5fa',
        borderRadius: 12,
        padding: 16,
        width: 80,
        cursor: 'pointer',
        textAlign: 'center',
        transition: 'all 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#93c5fd';
        e.currentTarget.style.backgroundColor = 'rgba(4, 35, 72, 0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#60a5fa';
        e.currentTarget.style.backgroundColor = 'transparent';
      }}
    >
      <div style={{ fontSize: 24 }}>{icon}</div>
      <div style={{ fontSize: 13, marginTop: 8, color: '#e0e7ff', fontWeight: 500 }}>{label}</div>
    </div>
  );
}




/* CONTACT FORM COMPONENT */
function ContactForm() {
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      message: formData.get('message') as string,
    };

    await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    alert('Message sent!');
    e.currentTarget.reset();
  }

  return (
    <form onSubmit={submit}>
      <input name="name" placeholder="Name" required />
      <input name="email" placeholder="Email" required />
      <textarea name="message" placeholder="Message" />
      <button type="submit">Send</button>
    </form>
  );
}

