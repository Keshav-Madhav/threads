"use client"

import { sidebarLinks } from '@/constants'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

type Props = {}

const BottomBar = (props: Props) => {
  const pathname = usePathname()

  return (
    <section className='bottombar'>
      <div className='bottombar_container'>
        {sidebarLinks.map((link, index) => {
          const isActive = (pathname.includes(link.route) && link.route.length >1 ) || (pathname === link.route)

          return (
            <Link key={index} href={link.route} className={`bottombar_link ${isActive && 'bg-primary-500'}`}>
              <Image 
                src={link.imgURL}
                alt={link.label}
                width={20}
                height={20}
              />
  
              <p className='text-subtle-medium text-light-1 max-sm:hidden'>
                {link.label.split(' ')[0]}
              </p>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

export default BottomBar