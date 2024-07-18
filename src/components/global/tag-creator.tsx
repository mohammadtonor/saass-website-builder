import { Tag } from '@prisma/client'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandSeparator } from '../ui/command'
import TagComponent from './tag'
import { PlusSquareIcon, TrashIcon, X } from 'lucide-react'
import { toast } from '../ui/use-toast'
import { v4 } from 'uuid'
import { CommandList } from 'cmdk'
import { deleteTag, getTagsForSubaccount, saveActivityLogsNotification, upsertTag } from '@/lib/queries'

type Props = {
    subAccountId: string
    getSelectedTags: (tags: Tag[]) => void
    defaultTags?: Tag[]
}

const TagColors = ['BLUE', 'ORANGE', 'ROSE', 'PURPLE', 'GREEN'] as const
export type TagColor = (typeof TagColors)[number]; 

const TagCreator = ({subAccountId, getSelectedTags, defaultTags}: Props) => {
    const [selectedTags, setSelectedTags] = useState<Tag[]>(defaultTags || []); 
    const [tags, setTags] = useState<Tag[]>([]);
    const router = useRouter();
    const [value, setValue] = useState('');
    const [selectedColor, setSelectedColor] = useState('');

    useEffect(() => {
        getSelectedTags(selectedTags);
    }, [selectedTags])

    useEffect(() => {
        if(subAccountId) {
            const fetchTags = async () => {
                const response = await getTagsForSubaccount(subAccountId);
                if(response) setTags(response.Tags);
            }
            fetchTags();
        }
    }, [subAccountId])

    const handledeleteSelection = (tagId: string) => {
        setSelectedTags(selectedTags.filter((tag) => tag.id !== tagId));
    }

    const handleAddTag = async () => {
        if(!value) {
            toast({
                variant: "destructive",
                title: "Tags need to have name"
            })
            return
        }
        if(!selectedColor) {
            toast({
                variant: "destructive",
                title: "Tags need to have color"
            })
            return
        }
        const tagData: Tag = {
            color: selectedColor,
            createdAt: new Date(),
            id: v4(),
            name: value,
            subAccountId,
            updatedAt: new Date(),
            ticket_ids: [],
        }
        setTags([...tags, tagData])
        setValue('')
        setSelectedColor('')
        try {
            const response  = await upsertTag(subAccountId, tagData);
            toast({
                title: "Created The Tag",
            })

            await saveActivityLogsNotification({
                agencyId: undefined,
                description: `Created a tag | ${response?.name}`,
                subaccountId: subAccountId,
            })
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Failed to add tag",
            })
        }
    }

    const handleAddSelection = (tag: Tag) => {
        if(selectedTags.every(t => t.id !== tag.id)) {
            setSelectedTags([...selectedTags, tag])
        }
    }   

    const handleDeleteTag = async (tagId: string) => {
        setTags(tags.filter((tag) => tag.id!== tagId));
        try {
            const response = await deleteTag(tagId)
            await saveActivityLogsNotification({
                agencyId: undefined,
                description: `Deleted a tag | ${response.name}`,
                subaccountId: subAccountId,
            })
            toast({
                title: "Deleted Tag",
            })
            router.refresh();
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Failed to delete tag",
            })
        }
    }

  return (
    <AlertDialog>
      <Command className="bg-transparent">
        {!!selectedTags.length && (
          <div className="flex flex-wrap gap-2 p-2 bg-background border-2 border-border rounded-md">
            {selectedTags.map((tag) => (
              <div key={tag.id} className="flex items-center">
                <TagComponent colorName={tag.color} title={tag.name} />

                <X
                  size={14}
                  className="text-muted-foreground cursor-pointer"
                  onClick={() => handledeleteSelection(tag.id)}
                />
              </div>
            ))}
          </div>
        )}
        <div className="flex items-center gap-2 my-2 mt-1">
          {TagColors.map((colorName) => (
            <TagComponent
              key={colorName}
              selectedColor={setSelectedColor}
              title=""
              colorName={colorName}
            />
          ))}
        </div>
        <CommandList>
          <div className="relative mb-4">
            <CommandInput
              placeholder="Search for tag..."
              value={value}
              onValueChange={setValue}
            />
            <PlusSquareIcon
              onClick={handleAddTag}
              size={20}
              className="absolute top-1/2 transform -translate-y-1/2 right-2 hover:text-primary transition-all cursor-pointer text-muted-foreground"
            />
          </div>
          <CommandSeparator />
          <CommandGroup heading="Tags">
            {tags.map(tag => (
                <CommandItem 
                    key={tag.id}
                    className='hover:bg-secondary !bg-transparent flex items-center justify-between !font-light cursor-pointer'
                >
                    <div onClick={() => handleAddSelection(tag)}>
                        <TagComponent colorName={tag.color} title={tag.name} />
                    </div>
                    <AlertDialogTrigger>
                        <TrashIcon 
                            size={16}
                            className='cursor-pointer text-muted-foreground hover:text-rose-400 transition-all '
                        />
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle className='text-left'>
                                Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription className='text-left'>
                                This action cannot be undone. This will permanently delete
                                your the tag and remove it from our servers.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className='items-center '>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                                className='bg-destructive'
                                onClick={() => handleDeleteTag(tag.id)}
                            >
                                Delete Tag
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </CommandItem>
            ))}
          </CommandGroup>
          <CommandEmpty>No Tag found</CommandEmpty>
        </CommandList>
      </Command>
    </AlertDialog>
  );
}

export default TagCreator