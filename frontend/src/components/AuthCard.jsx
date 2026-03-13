export default function AuthCard({ title, children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-black">
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-center text-white mb-6">{title}</h2>
        {children}
      </div>
    </div>
  );
}
