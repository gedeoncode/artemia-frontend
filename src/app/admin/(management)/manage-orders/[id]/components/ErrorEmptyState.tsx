export function ErrorState({ error }) {
  return (
    <div className="p-6 mx-auto max-w-7xl">
      <div className="p-4 text-center border rounded-lg bg-destructive/10 border-destructive">
        <h2 className="mb-2 text-lg font-semibold">Failed to load order</h2>
        <p className="text-sm text-muted-foreground">{error}</p>
      </div>
    </div>
  );
}

export function EmptyState() {
  return (
    <div className="p-6 mx-auto max-w-7xl">
      <div className="p-4 text-center border rounded-lg">
        <h2 className="mb-2 text-lg font-semibold">Order not found</h2>
        <p className="text-sm text-muted-foreground">
          The requested order could not be found in our system
        </p>
      </div>
    </div>
  );
}
