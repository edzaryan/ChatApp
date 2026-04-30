import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { api } from '../lib/api';
import { useState } from 'react';
import { z } from 'zod';

const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 chars'),
  password: z.string().min(6, 'Password must be at least 6 chars'),
});

type RegisterForm = z.infer<typeof registerSchema>

function Register() {
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      setServerError('');

      await api.post('/auth/register', {
        username: data.username,
        password: data.password,
      });

      navigate("/login");
    } catch (err: any) {
      setServerError(err.response?.data || 'Registration failed');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="w-full max-w-md p-6 bg-gray-800 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Create Account
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Username"
              {...register('username')}
              className="w-full p-3 rounded-lg bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            {errors.username && (
              <p className="text-red-400 text-sm mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              {...register('password')}
              className="w-full p-3 rounded-lg bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {serverError && (
            <p className="text-red-500 text-sm text-center">
              {serverError}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-green-500 hover:bg-green-600 transition p-3 rounded-lg font-semibold cursor-pointer"
          >
            {isSubmitting ? 'Creating...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Register;