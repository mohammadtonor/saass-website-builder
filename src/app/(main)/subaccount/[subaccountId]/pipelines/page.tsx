import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {
    params: {subaccountId: string}
}

const PipelinesPage = async ({params}: Props) => {
    const pipelineExist = await db.pipeline.findFirst({
        where: {subAccountId: params.subaccountId}
    })

    if(pipelineExist) {
        return redirect(`/subaccount/${params.subaccountId}/pipelines/${pipelineExist.id}`)
    }

    try {
        const response = await db.pipeline.create({
            data: {name: "First Pipeline", subAccountId: params.subaccountId}
        });
        return redirect(`/subaccount/${params.subaccountId}/pipelines/${response.id}`)
    } catch (error) {
        console.log(error);
        
    }
  return (
    <div>PipelinesPage</div>
  )
}

export default PipelinesPage