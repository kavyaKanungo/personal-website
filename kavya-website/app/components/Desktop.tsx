'use client';

import { useState } from 'react';
import Window from './Window';
import Icon from './Icon';

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
      <div className="desktop-icons">
        <Icon
          label="About"
          icon="👩‍💻"
          onClick={() =>
            openWindow(
              'about',
              'About Me',
              <>Hi! I’m Kavya, a CS student passionate about building things.</>
            )
          }
        />

        <Icon
          label="GitHub"
          icon="🐙"
          onClick={() => window.open('https://github.com/YOUR_USERNAME')}
        />

        <Icon
          label="LinkedIn"
          icon="💼"
          onClick={() => window.open('https://linkedin.com/in/YOUR_USERNAME')}
        />

        <Icon
          label="Projects"
          icon="📂"
          onClick={() =>
            openWindow(
              'projects',
              'Projects',
              <ul>
                <li>Retro Desktop Portfolio</li>
                <li>Next.js Apps</li>
              </ul>
            )
          }
        />

        <Icon
          label="Contact"
          icon="✉️"
          onClick={() =>
            openWindow(
              'contact',
              'Contact Me',
              <ContactForm />
            )
          }
        />
      </div>

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

