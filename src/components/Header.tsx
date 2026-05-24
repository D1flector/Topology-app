import Image from "next/image";

export default function Header() {
  return (
    <header
      className="flex items-center justify-between px-8 py-4"
      style={{
        background: "var(--surface)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <Image src="/yadro-logo.png" alt="YADRO" width={80} height={40} />
      <span className="text-lg font-semibold" style={{ color: "var(--muted)" }}>
        Визуализация сетевой топологии
      </span>
    </header>
  );
}
