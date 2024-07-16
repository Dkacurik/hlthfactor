import React from 'react'
import Image from 'next/image'

const Header = () => {
  return (
    <header className="flex flex-col items-center mt-[5rem] px-[1rem]">
      <Image src="/logo.svg" width={362} height={114} alt="HLTH Factor logo" />
      <h1 className="mt-[2.5rem] text-xl text-center">
        ZMENA ZAČÍNA{' '}
        <span className="text-primary font-semibold">PRVÝM SÚSTOM</span>
      </h1>
    </header>
  )
}

export default Header
