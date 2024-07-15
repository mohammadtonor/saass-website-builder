import React from 'react'
import { db } from '@/lib/db'
import { getLaneswithTicketsAndTags, getPipelineDetails, updateLanesOrder, updateTicketsOrder } from '@/lib/queries'
import { LaneDetail } from '@/lib/types'
import { redirect } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import PipelineInfobar from '../_components/pipeline-infobar'
import PipelineSettings from '../_components/pipeline-settings'
import PipelineView from '../_components/pipeline-view'

type Props = {
    params: {subaccountId: string, pipelineId: string}
}

const PipelinesIdPage = async ({params}: Props) => {
const pipelineDetails = await getPipelineDetails(params.pipelineId)

if(!pipelineDetails) return redirect(`/subaccount/${params.subaccountId}/pipelines`);

const pipelines = await db.pipeline.findMany({
    where: {
        subAccountId: params.subaccountId
    }
});

const lanes = await getLaneswithTicketsAndTags(
    params.pipelineId
) as LaneDetail[];

  return (
    <Tabs
        defaultValue='view'
        className='w-full'
    >
        <TabsList className='bg-transparent border-b-2 h-16 w-full justify-between mb-4'>
            <PipelineInfobar 
                pipelineId={params.pipelineId}
                subAccountId={params.subaccountId}
                pipelines={pipelines}
            />
            <div>
                <TabsTrigger value='view'>PipelineView</TabsTrigger>
                <TabsTrigger value='settings'>Settings</TabsTrigger>
            </div> 
        </TabsList>
        <TabsContent value='view'>
            <PipelineView 
                lanes={lanes}
                pipelineId={params.pipelineId}
                subaccountId={params.subaccountId}
                pipelineDetails={pipelineDetails}
                updateLanesOrder={updateLanesOrder}
                updateTicketsOrder={updateTicketsOrder}
            />
        </TabsContent>
        <TabsContent value='settings'>
            <PipelineSettings 
                pipelineId={params.pipelineId}
                subaccountId={params.subaccountId}
                pipelines={pipelines}
            />
        </TabsContent>

    </Tabs>
  )
}

export default PipelinesIdPage