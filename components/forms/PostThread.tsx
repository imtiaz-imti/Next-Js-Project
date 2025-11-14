'use client'

import { Controller, useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod'
import { threadValidation } from "@/lib/validations/thread"
import * as z from "zod"
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
import { createThread } from "@/lib/actions/thread.actions"

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
function PostThread({ userId } : {userId : string }){
    const pathname = usePathname()
    const router = useRouter()
    const form = useForm<z.infer<typeof threadValidation>>({
    resolver: zodResolver(threadValidation),
    defaultValues: {
        thread : '',
        accountId : userId
    }
    }) 
    const onSubmit = async(values: z.infer<typeof threadValidation>)=>{
      await createThread({
        text : values.thread,
        author : userId,
        communityId : null,
        path : pathname 
      })
      router.push('/')
    }
   return(
    <Card className="w-full sm:max-w-md bg-dark-1 mt-10 py-5">
     <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
      <CardContent>
        <FieldGroup>
          <Controller
            name="thread"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field className="flex items-center gap-3 w-full">
                <FieldLabel className="text-base-semibold text-light-2">Content</FieldLabel>
                <Textarea rows={15} className="account-form_input no-focus" {...field} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

        </FieldGroup>
      </CardContent>

      <CardFooter className="flex justify-start gap-3">
        <Button type="button" variant="outline" onClick={() => form.reset()}>
          Reset
        </Button>
        <Button type="submit" className="bg-primary-500">
          Post Thread
        </Button>
      </CardFooter>
    </form>
  </Card>
   )
}
export default PostThread