'use client';

import Window from './Window';
import Icon from './Icon';
import { useEffect, useState } from 'react';


type AppWindow = {
  id: string;
  title: string;
  content: React.ReactNode;
  z: number;
};




export default function Desktop() {
  const [windows, setWindows] = useState<AppWindow[]>([]);
  const [zCounter, setZCounter] = useState(1);

  function openWindow(id: string, title: string, content: React.ReactNode) {
    setZCounter(z => z + 1);
    setWindows(w => [...w, { id, title, content, z: zCounter + 1 }]);
  }

  function closeWindow(id: string) {
    setWindows(w => w.filter(win => win.id !== id));
  }

  useEffect(() => {
  openWindow(
    'home',
    'home',
    <HomeContent openWindow={openWindow} />
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
    <div className="desktop">

      {windows.map(win => (
        <Window
          key={win.id}
          title={win.title}
          zIndex={win.z}
          onClose={() => closeWindow(win.id)}
          onFocus={() => focusWindow(win.id)}
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
  openWindow: (id: string, title: string, content: React.ReactNode) => void;
}) {
  return (
    <div style={{ textAlign: 'center' }}>
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>hi! i’m kavya</h1>

      <p style={{ opacity: 0.8, marginBottom: 24 }}>
        As a computer science student fully committed to life-long learning,
        I’m a creative with a passion for software development.
      </p>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: 12,
        }}
      >
        <HomeButton
          label="about"
          icon="👩‍💻"
          onClick={() =>
            openWindow(
              'about',
              'about',
              <>I’m a CS student interested in product + engineering.</>
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
              </>
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
              </ul>
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
              <>Coming soon.</>
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
              <ContactForm />
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
        background: '#374151',
        borderRadius: 10,
        padding: 12,
        width: 64,
        cursor: 'pointer',
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: 20 }}>{icon}</div>
      <div style={{ fontSize: 12, marginTop: 6 }}>{label}</div>
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

