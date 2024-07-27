"use client"
import clsx from 'clsx'
import { Chicle } from 'next/font/google'
import { usePathname } from 'next/navigation'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'

type Props = {
    children: React.ReactNode
}

const CoverPage = (props: Props) => {
    const [isEdit, setIsEdit] = useState(false)
    const params = usePathname();
    useEffect(() => {
        setIsEdit(params.includes('editor'))
    }, [params]);
    
  return (
    <div className={clsx({
        "md:pl-[300px]": !isEdit
    })}>{props.children}</div>
  )
}

export default CoverPage