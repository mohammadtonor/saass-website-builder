import MediaComponent from '@/components/media';
import { getMedia } from '@/lib/queries';
import { GetMediaFiles } from '@/lib/types';
import React, { useEffect, useState } from 'react'

type Props = {
    subaccountId: string
}

const MediaBucketTeb = (props: Props) => {
    const [data, setData] = useState<GetMediaFiles>(null);

    useEffect(() =>{
        const fetchData = async () => {
            const response = await getMedia(props.subaccountId)
            setData(response)
        }
        fetchData()
    }, [props.subaccountId])
  return (
    <div className='h-[900px] overflow-auto p-4'>
        <MediaComponent 
            data={data}
            subaccountId={props.subaccountId}
        />
    </div>
  )
}

export default MediaBucketTeb