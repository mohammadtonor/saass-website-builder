
import React from 'react'
import { z } from 'zod'
import { useToast } from '../ui/use-toast'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { createMedia, saveActivityLogNotification } from '@/lib/queries'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import FileUpload from '../global/file-upload'

type Props = {
    subaccountId: string
}

const formSchema = z.object({
    link: z.string().min(1, { message: "Media File is Required"}),
    name: z.string().min(1, { message: "Name File is Required"})
})

const UploadMediaForm = ({subaccountId}: Props) => {
    const {toast} = useToast();
    const router = useRouter()
    const form = useForm<z.infer <typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: "onSubmit",
        defaultValues: {
            link: '',
            name: '',
        },
    })

    async function onSubmit (values: z.infer<typeof formSchema>) {
        try {
            const response = await createMedia(subaccountId, values)
            await saveActivityLogNotification({
                agencyId: undefined,
                description: `Uploaded a media file | ${response.name}`,
                subaccountId,
            })
            router.refresh()
            toast({
                title: 'Success',
                description: 'Media file uploaded successfully',
            })
        } catch (error) {
            console.log(error);
            toast({
                variant: 'destructive',
                title: 'Oppse!',
                description: 'Could not upload media file',
            })
        }
    }

  return (
    <Card className='w-full'>
        <CardHeader>
            <CardTitle>Media Information</CardTitle>
            <CardDescription>Please Enter the details for your file</CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>File Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your agency name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Media File</FormLabel>
                  <FormControl>
                    <FileUpload
                      apiEndPoint="subaccountLogo"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="mt-4"
            >
              Upload Media
            </Button>
                </form>
            </Form>
        </CardContent>
    </Card>
  )
}

export default UploadMediaForm