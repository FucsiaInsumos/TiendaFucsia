import React from 'react'
import LandingSections from './Sections/LandingSections'
import HeroCarousel from './Sections/HeroCarousel'
import InfoSections from './Sections/InfoSections'
import ImageSection from './Sections/ImageSection'

const Landing = () => {
  return (
    <div>
      <LandingSections/>
      <HeroCarousel/>
      <InfoSections/>
      <ImageSection/>
      </div>
  )
}

export default Landing