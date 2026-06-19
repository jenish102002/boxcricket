import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { authApi } from '../../api/auth'
import { useAuthStore } from '../../store/authStore'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export default function RegisterPage() {
  const { login } = useAuthStore()
  const navigate = useNavigate()
  const [showPass, setShowPass] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  })

  const mutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      login(data.token, { userId: data.userId, name: data.name, email: data.email, role: data.role })
      navigate('/')
    },
  })

  const onSubmit = (data) => mutation.mutate(data)

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
            <span className="text-white font-bold text-sm">BC</span>
          </div>
          <span className="font-fraunces font-semibold text-ink">BoxCricket</span>
        </Link>

        <div className="mb-8">
          <h1 className="font-fraunces text-3xl font-semibold text-ink mb-2">Create your account</h1>
          <p className="text-muted text-sm">Start booking premium box cricket slots today.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-ink mb-1.5">Full name</label>
            <input
              id="name"
              type="text"
              placeholder="Rahul Sharma"
              className="input-field"
              {...register('name')}
              aria-describedby={errors.name ? 'name-error' : undefined}
            />
            {errors.name && <p id="name-error" className="text-danger text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-ink mb-1.5">Email</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="input-field"
              {...register('email')}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && <p id="email-error" className="text-danger text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-ink mb-1.5">Password</label>
            <div className="relative">
              <input
                id="password"
                type={showPass ? 'text' : 'password'}
                placeholder="At least 6 characters"
                className="input-field pr-11"
                {...register('password')}
                aria-describedby={errors.password ? 'pass-error' : undefined}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
                aria-label={showPass ? 'Hide password' : 'Show password'}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p id="pass-error" className="text-danger text-xs mt-1">{errors.password.message}</p>}
          </div>

          {mutation.isError && (
            <div className="bg-danger/5 border border-danger/20 rounded-input px-4 py-3 text-danger text-sm">
              {mutation.error?.response?.data?.message || 'Registration failed. Please try again.'}
            </div>
          )}

          <button
            type="submit"
            className="btn-primary w-full justify-center"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="text-center text-sm text-muted mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-accent font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
