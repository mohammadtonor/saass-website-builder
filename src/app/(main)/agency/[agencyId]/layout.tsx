import BlurPage from '@/components/global/blur-page'
import InfoBar from '@/components/global/info-bar'
import Sidebar from '@/components/sidebar'
import Unauthorized from '@/components/unauthorized'
import { getNotificationAndUser, verifyAndAcceptInvitation } from '@/lib/queries'
import { currentUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {
    children: React.ReactNode
    params: {agencyId: string}
}

const layout = async ({children, params}: Props) => {
    const agencyId = await verifyAndAcceptInvitation();
    const user = await currentUser();
    
    if(!user) {
        redirect('/')
    }

    if(!agencyId) {
        return redirect('/agency')
    }

    if(
        user.privateMetadata.role !== 'AGENCY_ADMIN' && 
        user.privateMetadata.role !== 'AGENCY_OWNER'
    ) return <Unauthorized />
    
    let allNoti: any = [];
    const notification = await getNotificationAndUser(agencyId)
    if (notification) allNoti = notification;
  return (
    <div className="h-screen overflow-hidden">
        <Sidebar 
            id={params.agencyId}
            type="agency"
        />
        <div className="md:pl-[300px]">
            <div className="relative">
                <BlurPage>
                    <InfoBar notifications={allNoti} role={allNoti.User?.role}/>
                    {children}
                </BlurPage>
            </div>
        </div>
    </div>
  )
}

export default layout