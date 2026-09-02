function StatusBadge() {
  return <span>🟢 Live</span>;
}

// Ang main page component — ginagamit niya ang StatusBadge
export default function Page() {
  return (
    <main>
      <h1>AutoDo</h1>
      <StatusBadge />
      <StatusBadge />
    </main>
  );
}
