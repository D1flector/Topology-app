"use client";

import { useTopology } from "@/hooks/useTopology";
import Topology from "@/components/Topology";
import Header from "@/components/Header";

export default function Home() {
  const { data, loading, error } = useTopology();

  return (
    <main className="flex flex-col h-screen">
      <Header />
      {loading && (
        <div
          className="flex-1 flex items-center justify-center"
          style={{ color: "var(--muted)" }}
        >
          Загрузка топологии...
        </div>
      )}
      {error && (
        <div className="flex-1 flex items-center justify-center text-red-500">
          Ошибка: {error}
        </div>
      )}
      {data && <Topology data={data} />}
    </main>
  );
}
