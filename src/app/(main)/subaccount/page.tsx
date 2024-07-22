import Unauthorized from '@/components/unauthorized';
import { getAuthUserDetails, verifyAndAcceptInvitation } from '@/lib/queries'
import { redirect } from 'next/navigation';
import React from 'react'

type Props = {
  searchParams: {state: string, code: string},
}

const SubAccountMainPage = async ({searchParams}: Props) => {
  const agencyId = verifyAndAcceptInvitation();

  if(!agencyId) {
    return <Unauthorized />
  }

  const user = await getAuthUserDetails();
  if(!user) return;

  const getFirstSubaccountWithAccess = user.Permissions.find(
    (permission) => permission.access === true
  );

  if(searchParams.state) {
    const statePath = searchParams.state.split('__')[0];
    const stateSubaccountId = searchParams.state.split('__')[1];
    if(!stateSubaccountId) return <Unauthorized />
    return redirect(
      `/subaccount/${stateSubaccountId}/${statePath}?code=${searchParams.code}`
    );
  }

  if(getFirstSubaccountWithAccess) {
    return redirect(`/subaccount/${getFirstSubaccountWithAccess.subAccountId}`);
  }
}

export default SubAccountMainPage