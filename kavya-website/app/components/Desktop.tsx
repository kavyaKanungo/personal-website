'use client';

import Window from './Window';
import Icon from './Icon';
import { useEffect, useState } from 'react';
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

  function openWindow(id: string, title: string, content: React.ReactNode, draggable: boolean = true) {
    setZCounter(z => z + 1);
    setWindows(w => [...w, { id, title, content, z: zCounter + 1, draggable }]);
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
    setZCounter(z => z + 1);
    setWindows(w =>
      w.map(win =>
        win.id === id ? { ...win, z: zCounter + 1 } : win
      )
    );
  }

  return (
    <div className="desktop" style={{ backgroundColor: '#000000', position: 'relative', overflow: 'hidden', height: '100vh' }}>
      <Wavify
        fill='#0ea5e9'
        paused={false}
        options={{
          height: 50,
          amplitude: 10,
          speed: 0.15,
          points: 3,
        }}
        style={{
          position: 'absolute',
          top: '55%',
          left: 0,
          width: '100%',
          zIndex: 1,
        }}
      />
      <Wavify
        fill='#1e5a7a'
        paused={false}
        options={{
          height: 120,
          amplitude: 5,
          speed: 0.15,
          points: 1,
        }}
        style={{
          position: 'absolute',
          top: '55%',
          left: 0,
          width: '100%',
          zIndex: 2,
        }}
      />
      {windows.map(win => (
        <Window
          key={win.id}
          title={win.title}
          zIndex={win.z}
          onClose={() => closeWindow(win.id)}
          onFocus={() => focusWindow(win.id)}
          draggable={win.draggable !== false}
          isHomeWindow={win.id === 'home'}
        >
          {win.content}
        </Window>
      ))}
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
      <h1 style={{ fontSize: 48, marginBottom: 16, color: '#e0e7ff', fontWeight: 600 }}>hi! i'm kavya</h1>

      <p style={{ opacity: 0.7, marginBottom: 60, color: '#c7d2fe', fontSize: 16 }}>
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
  return (
    <div
      onClick={onClick}
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

