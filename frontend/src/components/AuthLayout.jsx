import CarScene from './CarScene';

export default function AuthLayout({ children }) {
  return (
    <div className="h-screen flex items-center justify-center">
      <CarScene />
      <div className="relative z-10 bg-gray-900/80 backdrop-blur-lg p-8 rounded-xl w-96 shadow-xl">
        {children}
      </div>
    </div>
  );
}
