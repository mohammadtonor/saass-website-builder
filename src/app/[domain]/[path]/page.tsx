import FunnelEditor from '@/app/(main)/subaccount/[subaccountId]/funnels/[funnelId]/editor/[funnelpageId]/_components/funnel-editor';
import { getDomainContent } from '@/lib/queries'
import EditorProvider from '@/providers/editor/editor-provider';
import { Ruthie } from 'next/font/google';
import { notFound } from 'next/navigation';
import React from 'react'

const page = async ({
  params
}: {
  params: {domain: string, path: string}
}) => {
  const domainData = await getDomainContent(params.domain.slice(0, -1));
  const pageData = domainData?.FunnelPages.find(
    page => page.pathName === params.path
  );
  
  if(!pageData || !domainData) return notFound();

  return (
    <EditorProvider
      subaccountId={domainData.subAccountId}
      pageDetails={pageData}
      funnelId={domainData.id}
    >
      <FunnelEditor
        funnelPageId={pageData.id}
        liveMode={true}
      />
    </EditorProvider>
  )
}

export default page