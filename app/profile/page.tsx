'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { useUserStore } from '@/hooks/use-user-store'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, LogOut, ShieldCheck, Trash2 } from 'lucide-react'
import { Header } from '@/components/shared/header'
import { Popover, PopoverAnchor, PopoverContent } from '@/components/ui/popover'

const phoneRegex = /^[0-9+\s()-]+$/

type AddressSuggestion = {
  address_id: string
  main_text: string
  secondary_text: string
  is_complete: boolean
}

const profileSchema = z.object({
  name: z
    .string()
    .transform((value) => value.trim())
    .refine((value) => value.length === 0 || value.length >= 2, 'Navn må bestå av minst 2 tegn'),
  phone: z
    .string()
    .trim()
    .min(8, 'Telefonnummeret må være minst 8 tegn')
    .regex(phoneRegex, 'Telefonnummer kan bare inneholde tall, mellomrom og tegnene +()-'),
  address: z.string().trim().min(5, 'Adressen må være minst 5 tegn'),
})

const passwordSchema = z
  .object({
    currentPassword: z.string().min(8, 'Nåværende passord må være minst 8 tegn'),
    newPassword: z
      .string()
      .min(8, 'Nytt passord må være minst 8 tegn')
      .regex(/^(?=.*[A-Za-z])(?=.*\d).+$/, 'Passordet må inneholde både bokstaver og tall'),
    confirmPassword: z.string().min(8, 'Bekreft passordet med minst 8 tegn'),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: 'Passordene må være like',
    path: ['confirmPassword'],
  })
  .refine((values) => values.newPassword !== values.currentPassword, {
    message: 'Nytt passord må være forskjellig fra det gamle',
    path: ['newPassword'],
  })

export default function ProfilePage() {
  const router = useRouter()
  const { update: updateSession } = useSession()
  const { user, setUser, setCart, fetchMe } = useUserStore()
  const [isLoading, setIsLoading] = useState(!user)
  const [profileMessage, setProfileMessage] = useState<string | null>(null)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [profileSubmitting, setProfileSubmitting] = useState(false)
  const [passwordSubmitting, setPasswordSubmitting] = useState(false)
  const [deleteSubmitting, setDeleteSubmitting] = useState(false)
  const [addressQuery, setAddressQuery] = useState(user?.address ?? '')
  const [addressResults, setAddressResults] = useState<AddressSuggestion[]>([])
  const [addressFetchError, setAddressFetchError] = useState<string | null>(null)
  const [isAddressPopoverOpen, setIsAddressPopoverOpen] = useState(false)
  const [isSearchingAddress, setIsSearchingAddress] = useState(false)
  const addressInputRef = useRef<HTMLInputElement | null>(null)
  const manualAddressCloseRef = useRef(false)
  const [addressInteracted, setAddressInteracted] = useState(false)

  useEffect(() => {
    let active = true
    if (!user) {
      fetchMe().finally(() => {
        if (active) setIsLoading(false)
      })
    } else {
      setIsLoading(false)
    }
    return () => {
      active = false
    }
  }, [user, fetchMe])

  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name ?? '',
      phone: user?.phone ?? '',
      address: user?.address ?? '',
    },
  })

  useEffect(() => {
    const initialAddress = user?.address ?? ''
    profileForm.reset({
      name: user?.name ?? '',
      phone: user?.phone ?? '',
      address: initialAddress,
    })
    setAddressQuery(initialAddress)
    manualAddressCloseRef.current = false
    setAddressInteracted(false)
  }, [user, profileForm])

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  const profileDirty = profileForm.formState.isDirty

  const watchedAddress = profileForm.watch('address')

  useEffect(() => {
    setAddressQuery(watchedAddress ?? '')
  }, [watchedAddress])

  const trimmedAddressQuery = (addressQuery ?? '').trim()

  useEffect(() => {
    if (!addressInteracted) {
      return
    }

    if (trimmedAddressQuery.length === 0) {
      setAddressResults([])
      setAddressFetchError(null)
      setIsSearchingAddress(false)
      setIsAddressPopoverOpen(false)
      manualAddressCloseRef.current = false
      return
    }

    if (trimmedAddressQuery.length < 2) {
      setAddressResults([])
      setAddressFetchError(null)
      setIsSearchingAddress(false)
      setIsAddressPopoverOpen(false)
      manualAddressCloseRef.current = false
      return
    }

    if (manualAddressCloseRef.current) return

    setIsAddressPopoverOpen(true)
    const controller = new AbortController()
    const timer = setTimeout(async () => {
      setIsSearchingAddress(true)
      setAddressFetchError(null)
      try {
        const response = await fetch(`/api/address-search?query=${encodeURIComponent(trimmedAddressQuery)}`, {
          signal: controller.signal,
        })
        if (!response.ok) {
          throw new Error('Failed to fetch addresses')
        }
        const data = (await response.json()) as {
          data?: AddressSuggestion[]
          error?: string
        }
        if (data.error) throw new Error(data.error)

        const results = data.data ?? []
        setAddressResults(results)
        if (results.length === 0) {
          setAddressFetchError('Fant ingen adresser for søket ditt')
        }
      } catch (error) {
        if ((error as Error).name === 'AbortError') return
        console.error(error)
        setAddressResults([])
        setAddressFetchError('Kunne ikke hente adresser. Prøv igjen senere.')
      } finally {
        setIsSearchingAddress(false)
      }
    }, 300)

    return () => {
      controller.abort()
      clearTimeout(timer)
    }
  }, [trimmedAddressQuery, addressInteracted])

  function handleAddressSelect(address: AddressSuggestion) {
    const label = `${address.main_text}, ${address.secondary_text}`
    setAddressQuery(label)
    profileForm.setValue('address', label, {
      shouldValidate: true,
      shouldDirty: true,
    })
    setIsAddressPopoverOpen(false)
    setAddressResults([])
    setAddressFetchError(null)
    manualAddressCloseRef.current = true
  }

  function resetAddressSelection() {
    setAddressQuery('')
    profileForm.setValue('address', '', {
      shouldValidate: true,
      shouldDirty: true,
    })
    setAddressResults([])
    setAddressFetchError(null)
    manualAddressCloseRef.current = false
    setIsAddressPopoverOpen(false)
    addressInputRef.current?.focus()
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0 },
  }

  const stagger = {
    hidden: { opacity: 1 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.12 },
    },
  }

  async function handleProfileSubmit(values: z.infer<typeof profileSchema>) {
    if (!user) return
    setProfileSubmitting(true)
    setProfileMessage(null)
    setProfileError(null)

    const payload = {
      name: values.name.length > 0 ? values.name : null,
      phone: values.phone,
      address: values.address,
    }

    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        setProfileError(data?.error ?? 'Kunne ikke oppdatere profilen. Prøv igjen senere.')
        return
      }

      const data = await response.json()
      setUser(data.data)
      profileForm.reset({
        name: data.data?.name ?? '',
        phone: data.data?.phone ?? '',
        address: data.data?.address ?? '',
      })
      if (typeof updateSession === 'function') {
        await updateSession({
          name: data.data?.name ?? undefined,
        })
      }
      setProfileMessage('Profilen er oppdatert.')
    } catch (error) {
      console.error(error)
      setProfileError('Noe gikk galt under oppdateringen.')
    } finally {
      setProfileSubmitting(false)
    }
  }

  async function handlePasswordSubmit(values: z.infer<typeof passwordSchema>) {
    if (!user) return
    setPasswordSubmitting(true)
    setPasswordMessage(null)
    setPasswordError(null)

    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: values.currentPassword,
          password: values.newPassword,
        }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        setPasswordError(data?.error ?? 'Kunne ikke endre passordet. Prøv igjen senere.')
        return
      }

      passwordForm.reset()
      setPasswordMessage('Passordet er oppdatert.')
    } catch (error) {
      console.error(error)
      setPasswordError('Noe gikk galt under oppdateringen.')
    } finally {
      setPasswordSubmitting(false)
    }
  }

  async function handleLogout() {
    await signOut({ callbackUrl: '/' })
  }

  async function handleDelete() {
    if (!user) return
    setDeleteError(null)
    const confirmed = window.confirm('Er du sikker på at du vil slette kontoen din? Dette kan ikke angres.')
    if (!confirmed) return

    setDeleteSubmitting(true)
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        setDeleteError(data?.error ?? 'Kunne ikke slette kontoen. Prøv igjen senere.')
        return
      }
      setUser(null)
      setCart(null)
      await signOut({ callbackUrl: '/' })
    } catch (error) {
      console.error(error)
      setDeleteError('Noe gikk galt ved sletting av konto.')
    } finally {
      setDeleteSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Laster profilen din ...
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 text-center">
        <h1 className="text-2xl font-semibold">Du er ikke logget inn</h1>
        <p className="text-muted-foreground">Logg inn for å se og oppdatere profilen din.</p>
        <div className="flex gap-3">
          <Button onClick={() => router.push('/login')}>Logg inn</Button>
          <Button variant="outline" onClick={() => router.push('/register')}>
            Opprett konto
          </Button>
        </div>
      </div>
    )
  }

  return (
    <motion.div className="min-h-[70vh] py-10" initial="hidden" animate="show" variants={stagger}>
      <div className="mx-auto max-w-6xl px-4 lg:px-4 space-y-8">
        <motion.div variants={fadeInUp}>
          <h1 className="text-3xl font-bold">Profil</h1>
          <p className="text-muted-foreground mt-2">
            Oppdater personlige detaljer, endre passord eller administrer kontoen din.
          </p>
        </motion.div>

        <motion.div className="grid gap-6 lg:grid-cols-3 items-start" variants={stagger}>
          {/* left column */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div variants={fadeInUp}>
              <Card>
                <CardHeader>
                  <CardTitle>Personlig informasjon</CardTitle>
                  <CardDescription>Oppdater navn, telefonnummer og adresse som brukes i bestillinger.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...profileForm}>
                    <form onSubmit={profileForm.handleSubmit(handleProfileSubmit)} className="space-y-6">
                      <FormField
                        control={profileForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Navn</FormLabel>
                            <FormControl>
                              <Input placeholder="Ola Nordmann" {...field} />
                            </FormControl>
                            <FormMessage />
                            <p className="text-xs text-muted-foreground">
                              La feltet stå tomt for å skjule navnet ditt.
                            </p>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Telefonnummer</FormLabel>
                            <FormControl>
                              <Input inputMode="tel" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Adresse</FormLabel>
                            <Popover
                              modal={false}
                              open={isAddressPopoverOpen}
                              onOpenChange={(open) => {
                                setIsAddressPopoverOpen(open)
                                if (!open) {
                                  manualAddressCloseRef.current = true
                                  setAddressResults([])
                                  setAddressFetchError(null)
                                  setIsSearchingAddress(false)
                                } else {
                                  manualAddressCloseRef.current = false
                                }
                              }}
                            >
                              <PopoverAnchor asChild>
                                <FormControl>
                                  <Input
                                    {...field}
                                    ref={(node) => {
                                      field.ref(node)
                                      addressInputRef.current = node
                                    }}
                                    value={addressQuery}
                                    onChange={(event) => {
                                      const value = event.target.value
                                      field.onChange(value)
                                      setAddressQuery(value)
                                      manualAddressCloseRef.current = false
                                      setAddressFetchError(null)
                                      if (!addressInteracted) {
                                        setAddressInteracted(true)
                                      }
                                    }}
                                    placeholder="Søk etter adressen din"
                                  />
                                </FormControl>
                              </PopoverAnchor>
                              <PopoverContent
                                align="start"
                                className="p-0 w-[min(320px,calc(100vw-4rem))]"
                                side="bottom"
                                onOpenAutoFocus={(event) => event.preventDefault()}
                                onCloseAutoFocus={(event) => event.preventDefault()}
                              >
                                <div className="py-2">
                                  {isSearchingAddress ? (
                                    <div className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground">
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                      Søker adresser ...
                                    </div>
                                  ) : null}
                                  {!isSearchingAddress && addressResults.length > 0 ? (
                                    <div className="max-h-60 overflow-y-auto">
                                      {addressResults.map((item) => (
                                        <button
                                          key={item.address_id}
                                          type="button"
                                          className="w-full text-left px-3 py-2 hover:bg-secondary transition-colors"
                                          onClick={() => handleAddressSelect(item)}
                                        >
                                          <div className="text-sm font-medium">{item.main_text}</div>
                                          <div className="text-xs text-muted-foreground">{item.secondary_text}</div>
                                        </button>
                                      ))}
                                    </div>
                                  ) : null}
                                  {!isSearchingAddress && addressResults.length === 0 && addressFetchError ? (
                                    <p className="px-3 py-2 text-xs text-destructive">{addressFetchError}</p>
                                  ) : null}
                                </div>
                              </PopoverContent>
                            </Popover>
                            {addressQuery ? (
                              <p className="text-xs text-muted-foreground mt-1">
                                Valgt adresse: {addressQuery}{' '}
                                <button type="button" className="text-xs underline" onClick={resetAddressSelection}>
                                  Endre
                                </button>
                              </p>
                            ) : null}
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {profileError ? <p className="text-sm text-destructive">{profileError}</p> : null}
                      {profileMessage ? (
                        <p className="text-sm text-emerald-600 dark:text-emerald-400">{profileMessage}</p>
                      ) : null}

                      <div className="flex justify-end">
                        <Button type="submit" disabled={profileSubmitting || !profileDirty}>
                          {profileSubmitting ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              Oppdaterer ...
                            </>
                          ) : (
                            'Lagre endringer'
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card>
                <CardHeader>
                  <CardTitle>Endre passord</CardTitle>
                  <CardDescription>Oppgi nåværende passord for å sette et nytt.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...passwordForm}>
                    <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)} className="space-y-6">
                      <FormField
                        control={passwordForm.control}
                        name="currentPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nåværende passord</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={passwordForm.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nytt passord</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={passwordForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bekreft nytt passord</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {passwordError ? <p className="text-sm text-destructive">{passwordError}</p> : null}
                      {passwordMessage ? (
                        <p className="text-sm text-emerald-600 dark:text-emerald-400">{passwordMessage}</p>
                      ) : null}

                      <div className="flex justify-end">
                        <Button type="submit" disabled={passwordSubmitting}>
                          {passwordSubmitting ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              Oppdaterer ...
                            </>
                          ) : (
                            'Endre passord'
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* right column */}
          <motion.div className="space-y-6" variants={stagger}>
            {user?.isAdmin ? (
              <motion.div variants={fadeInUp}>
                <Card className="border-emerald-500/40">
                  <CardHeader>
                    <CardTitle>Adminpanel</CardTitle>
                    <CardDescription>Administrer produkter, kategorier og brukere fra kontrollpanelet.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button className="w-full gap-2" onClick={() => router.push('/admin')}>
                      <ShieldCheck className="h-4 w-4" />
                      Gå til admin
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ) : null}

            <motion.div variants={fadeInUp}>
              <Card>
                <CardHeader>
                  <CardTitle>Sesjon</CardTitle>
                  <CardDescription>Avslutt innlogget økt på enheten.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <Button variant="outline" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logg ut
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="border-destructive/50">
                <CardHeader>
                  <CardTitle>Konto</CardTitle>
                  <CardDescription>Slett kontoen permanent. Dette kan ikke angres.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {deleteError ? <p className="text-sm text-destructive">{deleteError}</p> : null}
                  <Button variant="destructive" onClick={handleDelete} disabled={deleteSubmitting} className="w-full">
                    {deleteSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Sletter ...
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Slett konto
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}
