"use client";

import { useTopology } from "@/hooks/useTopology";
import Topology from "@/components/Topology";

export default function Home() {
  const { data, loading, error } = useTopology();

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;
  if (!data) return null;

  return (
    <main>
      <Topology data={data} />
    </main>
  );
}
