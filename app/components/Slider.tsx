import React from 'react'
import sliderImg1 from "../assests/sliderImg1.png"
import sliderImg2 from "../assests/sliderImg2.png"
import sliderImg3 from "../assests/sliderImg3.png"
import Image, { StaticImageData } from 'next/image'
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';


const Slider = () => {
    interface SliderProps {
        image: StaticImageData;
        name: string;
        review: string;
    }
    const SliderItem = ({image,name,review}:SliderProps) =>{
    return (
        <div className='py-8 px-6 w-[325px] bg-white rounded-2xl border-2 border-[#9dc782]'>
            <Image className='block mx-auto mb-6' src={image} alt={`${name}'s image`} />
            <div>
                <div className='flex flex-row mb-4 mb-10'>
                    <Quote className='shrink-0 text-2xl self-start -translate-y-[10px] rotate-180' />
                    <p className='text-xl font-normal text-center'>{review}</p>
                    <Quote className='shrink-0 text-2xl self-end translate-y-[10px]' />
                </div>
                <p className='text-center text-base font-normal'>{name}</p>
            </div>
        </div>

    )
  }  
  return (
    <section className='px-[5%] bg-[#d8e9cd] pt-4 md:pt-6 lg:pt-8 pb-8 md:pb-12 lg:pb-16'>
        <p className='text-center font-semibold text-2xl md:text-3xl text-[#0f170a] mb-3 lg:mb-4'>What our customers say</p>
        <p className='text-center mx-auto text-[#485d3a] md:w-[375px] mb-6 lg:mb-8'>Get to see review from our past client about the quality or our services across all industries.</p>
        <div className='relative items-center flex flex-col md:flex-row justify-center gap-6'>
            <ChevronLeft className='absolute text-3xl left-0 top-[50%] -translate-y-[50%]' />
            <ChevronRight className='absolute text-3xl right-0 top-[50%] -translate-y-[50%]' />
            <SliderItem 
                image={sliderImg1}
                name={"Mrs Wunmi, Eko Electricy"}
                review={"Bayog are fast and very reliable. They have saved us from numerous scams"}
            />
            <SliderItem 
                image={sliderImg2}
                name={"Mr. Kunle, GTCO"}
                review={"I have never seen an agency which so much proficiency. They deliver the best even the most complex jobs"}
            />
            <SliderItem 
                image={sliderImg3}
                name={"Mr. Leke, Eko Electricty"}
                review={"Bayog are fast and very reliable. They have saved us from numerous scams"}
            />
        </div>
    </section>
  )
}

export default Slider
