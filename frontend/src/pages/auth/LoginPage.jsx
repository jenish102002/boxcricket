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
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export default function LoginPage() {
  const { login } = useAuthStore()
  const navigate = useNavigate()
  const [showPass, setShowPass] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  })

  const mutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      login(data.token, { userId: data.userId, name: data.name, email: data.email, role: data.role })
      navigate(data.role === 'ADMIN' ? '/admin' : '/')
    },
  })

  const onSubmit = (data) => mutation.mutate(data)

  return (
    <div className="min-h-screen bg-bg flex">
      {/* Left panel — decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-ink flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-ink via-ink to-accent/20" />
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center">
              <span className="text-white font-bold">BC</span>
            </div>
            <span className="font-fraunces font-semibold text-white text-xl">BoxCricket</span>
          </Link>
        </div>
        <div className="relative z-10">
          <p className="font-fraunces text-4xl text-white leading-tight mb-4">
            "The best venues,<br />the perfect slots."
          </p>
          <p className="text-white/60 text-sm">Book your next match in seconds.</p>
        </div>
        <div className="relative z-10 flex gap-6">
          <div>
            <p className="font-mono text-2xl font-semibold text-accent">4+</p>
            <p className="text-xs text-white/50">Venues</p>
          </div>
          <div>
            <p className="font-mono text-2xl font-semibold text-accent">500+</p>
            <p className="text-xs text-white/50">Slots / week</p>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                <span className="text-white font-bold text-sm">BC</span>
              </div>
              <span className="font-fraunces font-semibold text-ink">BoxCricket</span>
            </Link>
            <h1 className="font-fraunces text-3xl font-semibold text-ink mb-2">Welcome back</h1>
            <p className="text-muted text-sm">Sign in to book your next match.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
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
                  placeholder="••••••••"
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
                {mutation.error?.response?.data?.message || 'Invalid email or password'}
              </div>
            )}

            <button
              type="submit"
              className="btn-primary w-full justify-center"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="text-center text-sm text-muted mt-6">
            No account?{' '}
            <Link to="/register" className="text-accent font-medium hover:underline">Create one</Link>
          </p>

          {/* Demo credentials */}
          <div className="mt-8 p-4 bg-surface-alt rounded-input border border-border text-xs text-muted">
            <p className="font-medium text-ink mb-1">Demo credentials</p>
            <p>Admin: <code>admin@boxcricket.com</code> / <code>admin123</code></p>
            <p>User: <code>rahul@example.com</code> / <code>user123</code></p>
          </div>
        </div>
      </div>
    </div>
  )
}
