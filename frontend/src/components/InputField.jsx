import { useState } from 'react';

export default function InputField({
  label,
  type = 'text',
  placeholder,
  register,
  name,
  rules,
  error,
}) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === 'password';

  return (
    <div className="w-full mb-4">
      <label className="block text-sm text-gray-400 mb-1">{label}</label>

      <div className="relative">
        <input
          type={isPassword && showPassword ? 'text' : type}
          placeholder={placeholder}
          {...register(name, rules)}
          className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-2 text-xs text-cyan-400"
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        )}
      </div>

      {error ? <p className="text-xs text-red-400 mt-1">{error}</p> : null}
    </div>
  );
}
