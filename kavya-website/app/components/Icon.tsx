type Props = {
  label: string;
  icon: string;
  onClick: () => void;
};

export default function Icon({ label, icon, onClick }: Props) {
  return (
    <div className="desktop-icon" onClick={onClick}>
      <div className="icon">{icon}</div>
      <div>{label}</div>
    </div>
  );
}
