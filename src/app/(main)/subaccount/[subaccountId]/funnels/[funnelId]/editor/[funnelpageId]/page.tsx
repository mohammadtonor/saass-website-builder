import { db } from '@/lib/db'
import EditorProvider from '@/providers/editor/editor-provider'
import { redirect } from 'next/navigation'
import React from 'react'
import FunnelEditorNavigation from './_components/funnel-editor-navigation'

type Props = {
    params: {
        subaccountId: string
        funnelId: string
        funnelPgaeId: string
    }
}

const FunnelPageId = async ({params}: Props) => {
    const funnelPageDetails = await db.funnelPage.findFirst({
        where: { id: params.funnelPgaeId }
    })

    if(!funnelPageDetails) {
        return redirect(`/subaccount/${params.subaccountId}/funnels/${params.funnelId}`)
    }

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 z-[99999] bg-background overflow-hidden">
      <EditorProvider
        subaccountId={params.subaccountId}
        funnelId={params.funnelId}
        pageDetails={funnelPageDetails}
      >
        <FunnelEditorNavigation
          funnelId={params.funnelId}
          funnelPageDetails={funnelPageDetails}
          subaccountId={params.subaccountId}
        />
        
      </EditorProvider>
  </div>
  )
}

export default FunnelPageId