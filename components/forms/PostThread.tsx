'use client'

import { Controller, useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod'
import { threadValidation } from "@/lib/validations/thread"
import * as z from "zod"
import { usePathname, useRouter } from "next/navigation" 
import { useOrganization } from "@clerk/nextjs"

import { Button } from "@/components/ui/button"
import {
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Textarea } from "../ui/textarea"
import { createThread } from "@/lib/actions/thread.actions"

function PostThread({ userId } : {userId : string }){
    const pathname = usePathname()
    const router = useRouter()
    const { organization } = useOrganization()
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
        communityId : organization ? organization.id : null,
        path : pathname 
      })
      router.push('/')
    }
   return(
    <div className="w-full bg-dark-1 mt-10 py-5 border-2 border-light-1">
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
        <Button type="submit" className="bg-primary-500 w-full">
          Post Thread
        </Button>
      </CardFooter>
    </form>
  </div>
   )
}
export default PostThread