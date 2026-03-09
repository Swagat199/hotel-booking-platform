import React from 'react'
import { assets } from '../assets/assets'

function StarRating({rating = 4}) {
  return (
    <>
     {Array(5).fill('').map((_,index)=>(
        <img key={index} src={rating > index ? assets.starIconFilled : assets.starIconFilled} 
        alt='star-icon' className='w-4.5 h-4.5' />
     ))}
    </>
  )
}

export default StarRating