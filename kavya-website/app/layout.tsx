import './globals.css';

export const metadata = {
  title: "Kavya's Portfolio",
  description: "Retro desktop style portfolio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
