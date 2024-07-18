"use client"
import { useModal } from '@/providers/modal-provider';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {ContactFormSchema} from '@/lib/types'
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { toast } from '../ui/use-toast';
import { saveActivityLogsNotification, upsertContact } from '@/lib/queries';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import Loading from '../global/loading';
import { Contact } from '@prisma/client';

type ContactUserFormProps = {
    subaccountId: string;
    defaultData?: Contact
}

const ContactUserForm: React.FC<ContactUserFormProps> = ({ subaccountId, defaultData }) => {
    const {setClose , data} = useModal()
    const router = useRouter();
    const form = useForm<z.infer <typeof ContactFormSchema>>({
        mode: 'onChange',  // or 'onSubmit'
        resolver: zodResolver(ContactFormSchema),
        defaultValues: {
            name:  defaultData?.name  || '',
            email:  defaultData?.email  || '',
        },  
    })

    useEffect(() => {
        if(data.contact) {
            form.reset(defaultData || data.contact)
        }
    }, [data, form.reset, defaultData]);

    const isLoading = form.formState.isLoading

    const handleSubmit = async (values: z.infer<typeof ContactFormSchema>) => {
        try {
            const response = await upsertContact({
                id: defaultData?.id || undefined,
                name: values.name,
                email: values.email,
                subAccountId: subaccountId,
            })
            await saveActivityLogsNotification({
                agencyId: undefined,
                description: `Updated contact information for ${response.name}`,
                subaccountId,
            })
            toast({
                title: "Success!",
                description: "Saved contact information",
            })
            router.refresh()
            setClose()
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Oppse!",
                description: "Could not save  contact information",
            })
        }
    }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Contact Info</CardTitle>
        <CardDescription>
          You can assign tickets to contacts and set a value for each contact in
          the ticket.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="name"
              disabled={isLoading}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              disabled={isLoading}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-20" disabled={isLoading}>
              {form.formState.isSubmitting ? <Loading /> : "Save"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default ContactUserForm