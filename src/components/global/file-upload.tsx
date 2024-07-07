import { FileIcon, X } from 'lucide-react';
import Image from 'next/image';
import React from 'react'
import { Button } from '../ui/button';
import { UploadDropzone } from '@/lib/uploadthing';

type Props = {
    apiEndPoint: 'agencyLogo' | 'avatar' | 'subaccountLogo';
    onChange: (url?: string) => void;
    value?: string;
}

const FileUpload = ({apiEndPoint, onChange, value}: Props) => {
  const type = value?.split('.').pop();

  if(value) {
    return (
      <div className="flex flex-col justify-center items-center">
        {type !== "pdf" ? (
          <div className="relative w-40 h-40">
            <Image className="object-contain" src={value} alt="logo" fill />
          </div>
        ) : (
          <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
            <FileIcon />
            <a
              href={value}
              target="_blank"
              rel="noopener_noreferrer"
              className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
            >
              View PDF
            </a>
          </div>
        )}
        <Button
            onClick={() => onChange('')}
            variant='ghost'
            type='button'
        >
          <X className="w-4 h-4" />
          Remove Logo
        </Button>
      </div>
    );
  }
  return (
    <div className='w-full bg-muted/30'>
        <UploadDropzone 
          endpoint={apiEndPoint} 
          onClientUploadComplete={(res) => {
            onChange(res?.[0].url)
          }}
          onUploadError={(err) => {
            console.log(err);
          }}
        />
    </div>
  )
}

export default FileUpload