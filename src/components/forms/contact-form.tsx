import React from 'react'
import { z } from 'zod'
import {ContactFormSchema} from "@/lib/types"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import Loading from '../global/loading'
import { Button } from '../ui/button'

type Props = {
    title: string
    subTitle: string
    apiCall: (values: z.infer<typeof ContactFormSchema>) => any
}

const ContactForm = ({apiCall, title, subTitle}: Props) => {
    const form = useForm<z.infer<typeof ContactFormSchema>>({
         mode: "onChange",
         resolver: zodResolver(ContactFormSchema),
         defaultValues :{
            name: "",
            email: ""
         }
    })

    const isLoading = form.formState.isLoading;

  return (
    <Card className="w-[500px] max-w-[500px]">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{subTitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(apiCall)}
            className="flex flex-col gap-4"
          >
            <FormField
              disabled={isLoading}
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled={isLoading}
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="mt-4" disabled={isLoading} type="submit">
              {form.formState.isSubmitting ? <Loading /> : "Get a free quote!"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default ContactForm