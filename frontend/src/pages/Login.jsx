import { useForm } from 'react-hook-form';
import { loginUser } from '../api/authApi';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaWrench, FaCarSide } from 'react-icons/fa';
import { GiTireIronCross } from 'react-icons/gi';
import AuthBackground from '../components/AuthBackground';

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const res = await loginUser(data);

      localStorage.setItem('access', res.data.access);
      localStorage.setItem('refresh', res.data.refresh);

      toast.success('Login successful 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden">
      <AuthBackground />
      <div className="absolute top-10 left-10 animate-bounce text-cyan-400 text-3xl">
        <FaWrench />
      </div>
      <div className="absolute bottom-10 right-10 animate-pulse text-yellow-400 text-3xl">
        <FaCarSide />
      </div>
      <div className="absolute top-1/2 left-5 animate-spin text-gray-400 text-2xl">
        <GiTireIronCross />
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <motion.div
          whileHover={{ rotateX: 5, rotateY: -5 }}
          transition={{ type: 'spring', stiffness: 100 }}
          className="backdrop-blur-xl bg-white/10 border border-white/20 p-8 rounded-2xl shadow-2xl w-96 text-white"
        >
          <h2 className="text-3xl font-bold mb-6 text-center tracking-wide">Vehicle Service Login</h2>

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^\S+@\S+$/i,
              message: 'Invalid email format',
            },
          })}
          className="w-full p-3 mb-1 border rounded-lg bg-white/90 text-black placeholder:text-gray-500"
        />
        {errors.email && <p className="text-red-500 text-sm mb-3">{errors.email.message}</p>}

        {/* Password */}
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Minimum 6 characters required',
              },
            })}
            className="w-full p-3 mb-1 border rounded-lg bg-white/90 text-black placeholder:text-gray-500"
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 cursor-pointer text-gray-500"
          >
            {showPassword ? 'Hide' : 'Show'}
          </span>
        </div>
        {errors.password && <p className="text-red-500 text-sm mb-4">{errors.password.message}</p>}

        {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="metal-btn glow w-full flex items-center justify-center"
          >
            {loading ? (
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
            ) : (
              'Login'
            )}
          </button>
        </motion.div>
      </form>
    </div>
  );
}
