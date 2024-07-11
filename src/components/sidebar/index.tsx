import { getAuthUserDetails  } from '@/lib/queries';
import React from 'react'
import MenuOptions from './menu-options';

type Props = {
    id: string;
    type: "agency" | "subaccount"
}

const Sidebar = async ({id, type}: Props) => {
    const user  = await getAuthUserDetails ();
    if(!user) return null;

    if(!user.Agency) return;

    const details =
      type === "agency"
        ? user?.Agency
        : user?.Agency.SubAccount.find((subacount) => subacount.id === id);
    
    const isWhitelableAgency = user.Agency.whiteLabel;
    if(!details) return;

    let sidebarLogo = user.Agency.agencyLogo || "/asset/plura-logo.svg";

    if(!isWhitelableAgency) {
        if(type === "subaccount") {
            sidebarLogo =
              user?.Agency.SubAccount.find((subaccount) => subaccount.id === id)
                ?.subAccountLogo || user.Agency.agencyLogo;
        }
    }

    const sidebarOpt =
      type === "agency"
        ? user.Agency.SidebarOption || []
        : user.Agency.SubAccount.find((subaccount) => subaccount.id === id)
            ?.SidebarOption || [];

    const subaccounts = user.Agency.SubAccount.filter((subaccount) =>
      user.Permissions.find(
        (permission) =>
          permission.subAccountId === subaccount.id && permission.access
      )
    );
  return (
    <>
        <MenuOptions 
            defaultOpen={true}
            details={details}
            id={id}
            sidebarLogo={sidebarLogo}
            sidebarOpt={sidebarOpt}
            subaccounts={subaccounts}
            user={user}
        />
        <MenuOptions 
            defaultOpen={false}
            details={details}
            id={id}
            sidebarLogo={sidebarLogo}
            sidebarOpt={sidebarOpt}
            subaccounts={subaccounts}
            user={user}
        />
        
    </>
  )
}

export default Sidebar