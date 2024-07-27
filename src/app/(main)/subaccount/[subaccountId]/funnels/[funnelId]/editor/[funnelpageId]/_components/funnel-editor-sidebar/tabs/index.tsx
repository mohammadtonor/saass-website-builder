import { TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Database, Plus, Settings2Icon, SquareStackIcon } from 'lucide-react'
import React from 'react'

type Props = {}

const TabList = (props: Props) => {
  return (
    <TabsList className=" flex items-center flex-col mt-4 justify-evenly w-full bg-transparent h-fit gap-4 ">
      <TabsTrigger
        value="Settings"
        className="w-10 h-10 p-0 data-[state=active]:bg-muted"
      >
        <Settings2Icon />
      </TabsTrigger>
      <TabsTrigger
        value="Components"
        className="data-[state=active]:bg-muted w-10 h-10 p-0"
      >
        <Plus />
      </TabsTrigger>

      <TabsTrigger
        value="Layers"
        className="w-10 h-10 p-0 data-[state=active]:bg-muted"
      >
        <SquareStackIcon />
      </TabsTrigger>
      <TabsTrigger
        value="Media"
        className="w-10 h-10 p-0 data-[state=active]:bg-muted"
      >
        <Database />
      </TabsTrigger>
    </TabsList>
  )
}

export default TabList