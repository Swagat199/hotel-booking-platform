import React from 'react'
import Hero from '../Components/Hero'
import FeaturedDestination from '../Components/FeaturedDestination'
import ExclusiveOffers from '../Components/ExclusiveOffers'
import Testimonial from '../Components/Testimonial'
import Newsletter from '../Components/Newsletter'

function Home() {
  return (
    <div>
        <Hero></Hero>
        <FeaturedDestination/>
        <ExclusiveOffers/>
        <Testimonial/>
        <Newsletter/>
    </div>
  )
}

export default Home