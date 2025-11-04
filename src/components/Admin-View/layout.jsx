import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Adminsidebar from './sidebar'
import Adminheader from './header'

export default function Adminlayout() {
  const[openSidebar,setOpenSideBar]=useState(false)
  return (
    <div className='flex min-h-screen w-full bg-[#FFECE8]'>
    <Adminsidebar open={openSidebar} setOpen={setOpenSideBar}/>
        <div className='flex flex-col flex-1'>
        <Adminheader setOpen={setOpenSideBar}/>
            <main className='flex flex-col flex-1 bg-muted/40 p-4 md:p-6'>
                <Outlet/>
            </main>
        </div>
    </div>
  )
}
