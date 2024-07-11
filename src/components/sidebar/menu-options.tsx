"use client"
import { Agency, AgencySidebarOption, SubAccount, SubAccountSidebarOption } from '@prisma/client'
import { useEffect, useMemo, useState } from 'react';
import { Sheet, SheetClose, SheetContent, SheetTrigger } from '../ui/sheet';
import { Button } from '../ui/button';
import { ChevronsUpDown, Compass, Menu, PlusCircleIcon } from 'lucide-react';
import clsx from 'clsx';
import { AspectRatio } from '../ui/aspect-ratio';
import Image from 'next/image';
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command';
import Link from 'next/link';
import { useModal } from '@/providers/modal-provider';
import CustomModal from '../global/custom-modal';
import SubAccountDetails from '../forms/subaccount-details';
import { Separator } from '../ui/separator';
import { icons } from '@/lib/constants';

type Props = {
  defaultOpen?: boolean;
  subaccounts: SubAccount[];
  sidebarOpt: AgencySidebarOption[] | SubAccountSidebarOption[];
  sidebarLogo: string;
  details: any;
  user: any;
  id: string;
};

const MenuOptions = ({
    defaultOpen ,
    subaccounts,
    sidebarOpt,
    sidebarLogo,
    details,
    user,
    id,
}: Props) => {
    const {setOpen} = useModal()
    const [isMounted, setIsMounted] = useState(false);
    const openState = useMemo(() => (defaultOpen ? {open: true} : {}), [defaultOpen])

    useEffect(() => {
        setIsMounted(true);
    }, [isMounted]);

    if(!isMounted) return;
console.log(user?.Agency);

  return (
    <Sheet modal={false} {...openState}>
      <SheetTrigger className="absolute left-4 top-4 z-[100] md:hidden" asChild>
        <Button variant="outline" size="icon">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent
        showX={!defaultOpen}
        side="left"
        className={clsx(
          "bg-background/80 backdrop-blur-xl fixed top-0 border-r-[1px] p-6",
          {
            "hidden md:inline-block z-0 w-[300px]": defaultOpen,
            "inline-block md:hidden  z-[100] w-full": !defaultOpen,
          }
        )}
      >
        <div className="">
          <AspectRatio ratio={16 / 5}>
            <Image
              src={sidebarLogo}
              alt="Sidebar Logo"
              fill
              className="rounded-md object-contain"
            />
          </AspectRatio>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                className="w-full flex items-center mt-4 justify-between py-8"
                variant="ghost"
              >
                <div className="flex items-center text-left gap-2">
                  <Compass />
                  <div className="flex flex-col">
                    {details.name}
                    <span className="text-muted-foreground">
                      {details.address}
                    </span>
                  </div>
                </div>
                <div>
                  <ChevronsUpDown size={16} className="text-muted-foreground" />
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 h-[300] mt-4 z-[200]">
              <Command className="rounded-lg">
                <CommandInput placeholder="Search Accounts..." />
                <CommandList className="pb-16 h-[400]">
                  <CommandEmpty>No Result Found</CommandEmpty>
                  {(user?.role === "AGENCY_OWNER" ||
                    user?.role === "AGENCY_ADMIN") &&
                    user?.Agency && (
                      <CommandGroup heading="Agency">
                        <CommandItem className="!bg-transparent my-2 text-primary border-[1px] border-border p-2 rounded-md hover:bg-muted cursor-pointer transition-all">
                          {defaultOpen ? (
                            <Link
                              href={`/agency/${user?.Agency?.id}`}
                              className="flex gap-4 w-full h-full"
                            >
                              <div className="relative w-16">
                                <Image
                                  src={user?.Agency?.agencyLogo}
                                  alt="Sidebar Logo"
                                  fill
                                  className="rounded-md object-contain"
                                />
                              </div>
                              <div className="flex flex-col flex-1">
                                {user?.Agency?.name}
                                <span className="text-muted-foreground">
                                  {user?.Agency?.address}
                                </span>
                              </div>
                            </Link>
                          ) : (
                            <SheetClose asChild>
                              <Link
                                href={`/agency/${user?.Agency?.id}`}
                                className="flex gap-4 w-full h-full"
                              >
                                <div className="relative w-16">
                                  <Image
                                    src={user?.Agency?.agencyLogo}
                                    alt="Sidebar Logo"
                                    fill
                                    className="rounded-md object-contain"
                                  />
                                </div>
                                <div className="flex flex-col flex-1">
                                  {user?.Agency?.name}
                                  <span className="text-muted-foreground">
                                    {user?.Agency?.address}
                                  </span>
                                </div>
                              </Link>
                            </SheetClose>
                          )}
                        </CommandItem>
                      </CommandGroup>
                    )}
                  <CommandGroup heading="Accounts">
                    {!!subaccounts
                      ? subaccounts.map((subaccount) => (
                          <CommandItem key={subaccount.id}>
                            {defaultOpen ? (
                              <Link
                                href={`/subaccount/${subaccount?.id}`}
                                className="flex gap-4 w-full h-full"
                              >
                                <div className="relative w-16">
                                  <Image
                                    src={subaccount?.subAccountLogo}
                                    alt="Sidebar Logo"
                                    fill
                                    className="rounded-md object-contain"
                                  />
                                </div>
                                <div className="flex flex-col flex-1">
                                  {subaccount?.name}
                                  <span className="text-muted-foreground">
                                    {subaccount?.address}
                                  </span>
                                </div>
                              </Link>
                            ) : (
                              <SheetClose asChild>
                                <Link
                                  href={`/subaccount/${subaccount?.id}`}
                                  className="flex gap-4 w-full h-full"
                                >
                                  <div className="relative w-16">
                                    <Image
                                      src={subaccount?.subAccountLogo}
                                      alt="Sidebar Logo"
                                      fill
                                      className="rounded-md object-contain"
                                    />
                                  </div>
                                  <div className="flex flex-col flex-1">
                                    {subaccount?.name}
                                    <span className="text-muted-foreground">
                                      {subaccount?.address}
                                    </span>
                                  </div>
                                </Link>
                              </SheetClose>
                            )}
                          </CommandItem>
                        ))
                      : "No Accounts"}
                  </CommandGroup>
                </CommandList>
                {(user?.role === "AGENCY_OWNER" ||
                  user?.role === "AGENCY_ADMIN") &&
                  user?.Agency && (
                    <SheetClose>
                      <Button
                        className="w-full flex gap-2 mt-4"
                        onClick={() =>
                          setOpen(
                            <CustomModal
                              title="Create Subaccount"
                              subheading="You can Switch between your agency account and the subaccount from sidebar"
                            >
                              <SubAccountDetails
                                agencyDetails={user?.Agency as Agency}
                                userName={user?.name as string}
                                userId={user?.id as string}
                              />
                            </CustomModal>
                          )
                        }
                      >
                        <PlusCircleIcon size={15} />
                        Create Sub Account
                      </Button>
                    </SheetClose>
                  )}
              </Command>
            </PopoverContent>
          </Popover>
          <p className='text-muted-foreground text-xs uppercase mt-4'>menu links</p>
          <Separator className='my-4'/>
          <nav className='relative'>
            <Command className='rounded-lg overflow-visible bg-transparent'>
                <CommandInput placeholder='Search...'/>
                <CommandList className='py-4 overflow-visible'>
                    <CommandEmpty>No Results Found</CommandEmpty>
                    <CommandGroup>
                        {sidebarOpt.map((sidebarOption) => {
                            let val;
                            const result = icons.find((icon) => icon.value === sidebarOption.icon)
                            if(result) {
                                val = <result.path />;
                            }
                            return (
                                <CommandItem key={sidebarOption.id}>
                                    <Link 
                                        className='flex items-center gap-2 hover:bg-transparent rounded-md transition-all md:w-full w-[320px]'
                                        href={sidebarOption.link}
                                    >
                                        {val}
                                        <span>{sidebarOption.name}</span>
                                    </Link>
                                </CommandItem>
                            )
                        })}
                    </CommandGroup>
                </CommandList>
            </Command>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default MenuOptions