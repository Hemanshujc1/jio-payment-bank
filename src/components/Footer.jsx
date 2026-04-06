import React from 'react'
import footerimg from "../assets/footerimg.svg"

const Footer = () => {
  return (
    <footer className='w-full flex flex-col items-center shrink-0 bg-white'>
      <img src={footerimg} alt="Footer Details" className='w-full h-auto object-cover' />
      <p className='text-xs'> &copy; 2026 Vakrangee Limited & Jio Payments Bank. All Rights Reserved</p>
    </footer>
  )
}

export default Footer
