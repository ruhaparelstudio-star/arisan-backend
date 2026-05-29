export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar placeholder — diisi AD-1 */}
        <aside className="w-64 min-h-screen bg-white border-r border-gray-200 p-4">
          <p className="text-sm text-gray-400">Sidebar (AD-1)</p>
        </aside>
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
