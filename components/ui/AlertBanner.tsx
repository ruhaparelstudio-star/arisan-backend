export function AlertBanner({ messages }: { messages: string[] }) {
  if (!messages.length) return null;
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-2 mb-4">
      {messages.map((msg, i) => (
        <div key={i} className="flex items-center gap-2 text-red-600 text-sm font-semibold">
          <span>⚠</span>
          {msg}
        </div>
      ))}
    </div>
  );
}
