'use client'

import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Card, CardContent } from '@/components/ui/card'
import { Eye, EyeOff } from 'lucide-react'
import Image from 'next/image'
import { Header } from '@/components/shared/home'
import { useTheme } from '@/lib/theme-provider'
import { useUserStore } from '@/hooks/use-user-store'

const loginSchema = z.object({
  email: z.string().email('Ugyldig e-post'),
  password: z.string().min(8, 'Minst 8 tegn'),
})

export default function LoginPage() {
  const router = useRouter()
  const [show, setShow] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isDarkMode = useTheme().theme === 'dark'
  const fetchMe = useUserStore((state) => state.fetchMe)
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setError(null)
    const res = await signIn('credentials', {
      email: values.email.toLowerCase(),
      password: values.password,
      redirect: false,
    })
    if (res?.error) {
      setError('Feil e-post eller passord')
      return
    }
    await fetchMe()
    router.push('/')
  }

  return (
    <div className="min-h-[80dvh] flex items-center justify-center bg-[--background]">
      <div className="grid max-w-5xl w-full grid-cols-1 md:grid-cols-2 gap-8 p-6">
        <div className="hidden md:block" aria-hidden>
          <Image
            src={isDarkMode ? '/images/login-image-light.svg' : '/images/login-image-dark.svg'}
            alt="Oda login image"
            width={385}
            height={278}
            className="fill-white h-full w-full"
            priority
          />
        </div>
        <div>
          <h1 className="text-4xl font-bold mb-2">Du er klar for å handle!</h1>
          <p className="text-muted-foreground mb-8">Logg inn for å starte.</p>
          <Card className="bg-transparent border-0 shadow-none p-0">
            <CardContent className="p-0">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Din e-post</FormLabel>
                        <FormControl>
                          <Input placeholder="navn@epost.no" type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ditt passord</FormLabel>
                        <div className="relative">
                          <Input type={show ? 'text' : 'password'} {...field} />
                          <button
                            type="button"
                            onClick={() => setShow((s) => !s)}
                            className="absolute inset-y-0 right-3 inline-flex items-center text-muted-foreground"
                            aria-label="toggle password visibility"
                          >
                            {show ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {error ? <p className="text-sm text-destructive">{error}</p> : null}
                  <Button type="submit" className="inline-flex items-center gap-2">
                    Logg inn
                  </Button>
                </form>
              </Form>
              <div className="mt-8 text-sm">
                Har du ingen konto ennå?{' '}
                <a href="/register" className="underline">
                  Opprett konto
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
