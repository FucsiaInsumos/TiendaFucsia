import React from 'react'
import LandingSections from './Sections/LandingSections'
import HeroCarousel from './Sections/HeroCarousel'
import InfoSections from './Sections/InfoSections'

const Landing = () => {
  return (
    <div>
      <LandingSections/>
      <HeroCarousel/>
      <InfoSections/>
      </div>
  )
}

export default Landing