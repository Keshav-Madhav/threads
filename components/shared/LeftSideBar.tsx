"use client"

import { sidebarLinks } from '@/constants'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { usePathname } from 'next/navigation'
import { SignOutButton, SignedIn } from '@clerk/nextjs'

type Props = {}

const LeftSideBar = (props: Props) => {
  const pathname = usePathname()
  
  return (
    <section className='custom-scrollbar leftsidebar'>
      <div className='flex w-full flex-1 flex-col gap-6 px-6'>
        {sidebarLinks.map((link, index) => {
          const isActive = (pathname.includes(link.route) && link.route.length >1 ) || (pathname === link.route)

          return (
            <Link key={index} href={link.route} className={`leftsidebar_link ${isActive && 'bg-primary-500'}`}>
              <Image 
                src={link.imgURL}
                alt={link.label}
                width={20}
                height={20}
              />
  
              <p className='text-light-1 max-lg:hidden'>{link.label}</p>
            </Link>
          )
        })}
      </div>

      <div className='mt-10 px-6'>
        <SignedIn>
          <SignOutButton signOutOptions={{redirectUrl: '/sign-in'}} redirectUrl='/sign-in'>
            <div className='flex cursor-pointer gap-4 p-4'>
              <Image 
                src="/logout.svg" 
                alt="logout" 
                height={24} 
                width={24}
              />

              <p className='text-light-2 max-lg:hidden'>Logout</p>
            </div>
          </SignOutButton>
        </SignedIn>
      </div>
    </section>
  )
}

export default LeftSideBar