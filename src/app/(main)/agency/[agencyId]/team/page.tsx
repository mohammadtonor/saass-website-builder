import { db } from '@/lib/db';
import React from 'react'
import DataTable from './data-table';
import { Plus } from 'lucide-react';
import { currentUser } from '@clerk/nextjs';
import { columns } from './columns';
import SendInvitation from '@/components/forms/send-invitation';

type Props = { params: { agencyId: string } };

const TeamPage = async ({params}: Props) => {
  const authUser = await currentUser();
  if(!authUser) return null;

  const teamMembers = await db.user.findMany({
    where: {
      Agency: {
        id: params.agencyId,
      }
    },
    include: {
      Agency: { include: {SubAccount: true} },
      Permissions: { include: {SubAccount: true}},
    },  
  });

  const agencyDetails = await db.agency.findUnique({
    where: { id: params.agencyId },
    include: {
      SubAccount: true,
    },
  })

  if(!agencyDetails) return;

  return (
    <DataTable
      actionButtonText={
        <>
          <Plus size={15}/>
          Add
        </>
      }
      filterValue='name'
      columns={columns}
      data={teamMembers}
      modalChildren={
        <>
          <SendInvitation agencyId={params.agencyId}/> 
        </>
      }
    ></DataTable>
  )
}

export default TeamPage