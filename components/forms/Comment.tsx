'use client'

import { Controller, useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod'
import { commentValidation } from "@/lib/validations/thread"
import * as z from "zod"
import { usePathname} from "next/navigation" 

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import {
  FieldError,
  FieldGroup,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { addCommentToThread} from "@/lib/actions/thread.actions"
interface props {
    threadId : string,
    currentUserImg : string,
    currentUserId : string
}
const Comment = ({threadId,currentUserImg,currentUserId} : props)=>{
    const pathname = usePathname()
    const form = useForm<z.infer<typeof commentValidation>>({
    resolver: zodResolver(commentValidation),
    defaultValues: {
        thread : ''
    }
    }) 
    const onSubmit = async(values: z.infer<typeof commentValidation>)=>{
       await addCommentToThread(threadId,values.thread,currentUserId,pathname)
       form.reset()
    } 
   return(
    <Card className="w-full bg-dark-1 mt-10 py-5 border-none">
     <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)} className="flex justify-between">
      <CardContent className="w-full">
        <FieldGroup>
          <Controller
            name="thread"
            control={form.control}
            render={({ field, fieldState }) => (
              <div className="flex flex-grow gap-3 items-center">
                <div className="max-w-10">
                 <Image src={currentUserImg} alt="Profile Image" className="object-cover rounded-full" width={48} height={48}/>    
                </div>  
                <Input type="text" placeholder='Comment...' className="border-none bg-dark-3 text-light-1 no-focus outline-none" {...field} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </div>
            )}
          />

        </FieldGroup>
      </CardContent>

      <CardFooter className="flex justify-start items-center gap-3">
        <Button type="submit" className="comment-form_btn">
          Reply
        </Button>
      </CardFooter>
     </form>
    </Card>
   )
}
export default Comment 