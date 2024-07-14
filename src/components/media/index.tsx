import { GetMediaFiles } from '@/lib/types'
import React from 'react'
import MediaUploadButton from './upload-button'
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from '../ui/command'

type Props = {
    data: GetMediaFiles
    subaccountId: string
}

const MediaComponent = ({data, subaccountId}: Props) => {
  return (
    <div className='flex flex-col gap-4 h-full w-full'>
        <div className="flex justify-between items-center">
            <h1 className='text-4xl'>Media Bucket</h1>
            <MediaUploadButton 
                subaccountId={subaccountId}
            />
        </div>
        <Command className='bg-transparent'>
            <CommandInput placeholder='Search for file name'/>
            <CommandList className='pb-40 max-h-full'>
                <CommandEmpty>No Media File</CommandEmpty>
                <div className="flex flex-wrap gap-4 pt-4">
                    {data?.Media.map((file) => (
                        <CommandItem
                            key={file.id}
                            className='p-0 max-w-[300px] !bg-transparent !font-medium text-white'
                        >

                        </CommandItem>
                    ))}
                </div>
            </CommandList>
        </Command>
    </div>
  )
}

export default MediaComponent