'use client'

import * as React from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod'
import { userValidation } from "@/lib/validations/user"
import { isBase64Image } from "@/lib/utils"
import * as z from "zod"
import { useUploadThing } from "@/lib/uploadThing"
import { usePathname, useRouter } from "next/navigation" 

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { Textarea } from "../ui/textarea"
import { updateUser } from "@/lib/actions/user.actions"

interface Props {
  user: {
    id: string,
    objectId: string,
    username: string,
    name: string,
    bio: string,
    image: string
  }
}

export default function AccountProfile({ user }: Props) {
  const [files, setFiles] = React.useState<File[]>([])
  const { startUpload } = useUploadThing('media')
  const pathname = usePathname()
  const router = useRouter()
  const form = useForm<z.infer<typeof userValidation>>({
    resolver: zodResolver(userValidation),
    defaultValues: {
      profile_photo: user?.image,
      name: user?.name,
      username: user?.username,
      bio: user?.bio
    }
  })

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>, fieldChange: (value: string) => void) => {
    e.preventDefault()
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      console.log(Array.from(e.target.files))
      setFiles(Array.from(e.target.files))
      if (!file.type.includes('image')) return
      const fileReader = new FileReader()
      fileReader.onload = (event) => {
        const imageDataUrl = event.target?.result?.toString() || ''
        fieldChange(imageDataUrl)
      }
      fileReader.readAsDataURL(file)
    }
  }

  const onSubmit = async (values: z.infer<typeof userValidation>) => {
    try {
      const blob = values.profile_photo
      const hasImageChanged = isBase64Image(blob)
      console.log('bro1')
      if (hasImageChanged) {
        console.log(files)
        const imgRes = await startUpload(files)
        console.log('bro2')
        if (imgRes && imgRes[0]?.url) {
          values.profile_photo = imgRes[0].url
        }
      }
      await updateUser(user.id, values.username, values.name, values.bio, values.profile_photo, pathname)
      if (pathname === '/profile/edit') {
        router.back()
      } else {
        router.push('/')
      }
    } catch (err) {
      console.error('Error updating user:', err)
    }
  }

  return (
    <Card className="w-full sm:max-w-md bg-dark-1">
      <CardHeader>
        <CardTitle>
          <h1 className="text-heading2-bold text-light-1">Onboarding</h1>
        </CardTitle>
        <CardDescription>
          <p className="mt-3 text-base-regular text-light-2">
            Complete your profile now to use Threads
          </p>
        </CardDescription>
      </CardHeader>

      <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent>
          <FieldGroup>

            {/* Profile Photo */}
            <Controller
              name="profile_photo"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="flex flex-row items-center justify-between">
                  <FieldLabel className="account-form_image-label">
                    {field.value ? (
                      <Image src={field.value} alt="profile photo" width={96} height={96} priority className="rounded-full object-contain" />
                    ) : (
                      <Image src="/assets/profile.svg" alt="profile photo" width={24} height={24} className="object-contain" />
                    )}
                  </FieldLabel>
                  <Input
                    type="file"
                    accept="image/*"
                    placeholder="Upload a photo"
                    className="account-form_image-input"
                    onChange={(e) => handleImage(e, field.onChange)}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* Name */}
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="flex items-center gap-3 w-full">
                  <FieldLabel className="text-base-semibold text-light-2">Name</FieldLabel>
                  <Input type="text" className="account-form_input no-focus" {...field} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* Username */}
            <Controller
              name="username"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="flex items-center gap-3 w-full">
                  <FieldLabel className="text-base-semibold text-light-2">Username</FieldLabel>
                  <Input type="text" className="account-form_input no-focus" {...field} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* Bio */}
            <Controller
              name="bio"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="flex items-center gap-3 w-full">
                  <FieldLabel className="text-base-semibold text-light-2">Bio</FieldLabel>
                  <Textarea rows={10} className="account-form_input no-focus" {...field} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

          </FieldGroup>
        </CardContent>

        <CardFooter className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button type="submit" className="bg-primary-500">
            Submit
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
