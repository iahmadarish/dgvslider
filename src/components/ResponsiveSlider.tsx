import React, { useEffect, useRef, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'
import { motion, useAnimation, PanInfo } from 'framer-motion'
import { useGesture } from '@use-gesture/react'
import { useSpring, animated } from '@react-spring/web'
import slide1 from "../assets/slider.jpg"
import slide2 from "../assets/slider2.png"
import slidemobile from "../assets/mobileview1.jpg"
import slidemobile2 from "../assets/mobileview2.png"
import joy from "../assets/ai.png"
import arrow from "../assets/frame.png"
import 'swiper/css'
import 'swiper/css/pagination'
import arrowbottom from "../assets/arrow-right 1.png"
const ResponsiveSlider: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <div className="relative w-full">
      {isMobile ? <MobileSlider /> : <DesktopSlider />}
    </div>
  )
}

const DraggableArrow: React.FC<{ onSlideChange: () => void }> = ({ onSlideChange }) => {
  const [{ x }, api] = useSpring(() => ({ x: 0 }))
  const startXRef = useRef(0)
  const isDraggingRef = useRef(false)

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      isDraggingRef.current = true
      startXRef.current = e.touches[0].clientX
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current) return

      const currentX = e.touches[0].clientX
      const deltaX = currentX - startXRef.current
      
      if (deltaX < 0) return
      
      const screenWidth = window.innerWidth
      const progress = (deltaX / screenWidth) * 100

      api.start({ x: deltaX, immediate: true })

      if (progress >= 70) {
        onSlideChange()
        isDraggingRef.current = false
        api.start({ x: 0 })
      }
    }

    const handleTouchEnd = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false
        api.start({ x: 0 })
      }
    }

    const arrow = document.getElementById('draggable-arrow')
    if (arrow) {
      arrow.addEventListener('touchstart', handleTouchStart)
      arrow.addEventListener('touchmove', handleTouchMove)
      arrow.addEventListener('touchend', handleTouchEnd)

      return () => {
        arrow.removeEventListener('touchstart', handleTouchStart)
        arrow.removeEventListener('touchmove', handleTouchMove)
        arrow.removeEventListener('touchend', handleTouchEnd)
      }
    }
  }, [api, onSlideChange])

  return (
    <animated.div
      id="draggable-arrow"
      style={{
        x,
        touchAction: 'none',
        cursor: 'grab',
      }}
      className="absolute left-2 touch-none select-none"
    >
      <img 
        src={arrow} 
        alt="arrow" 
        className="w-[38px] h-[38px]" 
        draggable="false"
      />
    </animated.div>
  )
}

const MobileSlider: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const swiperRef = useRef<any>(null)

  const handleSlideChange = () => {
    if (activeIndex === 0) {
      swiperRef.current?.swiper?.slideNext()
      setActiveIndex(1)
    } else if (activeIndex === 1) {
      swiperRef.current?.swiper?.slidePrev()
      setActiveIndex(0)
    }
  }

  const slides = [
    {
      image: slidemobile,
      joy: joy,
      title: "Welcome to Evoked! I'm Joy 👋",
      description: "Your AI-friend for building confidence. I can help you pick scents that fits your vibe, feels amazing and gets compliments ❤️",
      buttonText: "Swipe to start"
    },
    {
      image: slidemobile2,
      joy: joy,
      title: "I'm by your side, whenever you need me 😊",
      description: "When we're not talking about scents, we can chat about work, health and relationship problems that's impacting your confidence levels.",
      buttonText: "Swipe to go back"
    }
  ]

  return (
    <Swiper
      ref={swiperRef}
      slidesPerView={1}
      pagination={{
        clickable: true,
        type: 'bullets',
      }}
      modules={[Pagination]}
      className="h-screen w-full bg-black"
      onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
      allowTouchMove={false}
    >
      {slides.map((slide, index) => (
        <SwiperSlide key={index} className="relative">
          <div className="h-full w-full">
            <img
              src={slide.image}
              alt={slide.title}
              className="h-full w-full object-cover"
            />
            
            <div className="absolute inset-0 bg-black/50" />
            
            <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center px-6 pb-12 text-center">
              <img
                src={slide.joy}
                alt="Joy mascot"
                className="mb-6 h-[118px] w-[100px]"
              />
              
              <h2 className="mb-4 text-2xl font-bold text-white">
                {slide.title}
              </h2>
              <p className="mb-8 text-sm text-white/90">
                {slide.description}
              </p>
              
              <button className="mt-4 w-full rounded-[8px] border border-white/20 bg-[#343434] py-3 text-white backdrop-blur-sm relative">
                <div className="flex gap-x items-center justify-between px-4">
                  <DraggableArrow onSlideChange={handleSlideChange} />
                  <span className="ml-8">{slide.buttonText}</span>
                </div>
              </button>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  )
}

const DesktopSlider: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const swiperRef = useRef<any>(null)

  const handleNext = () => {
    swiperRef.current?.swiper?.slideNext()
  }

  const desktopSlides = [
    {
      image: slide1,
      title: "Welcome to Evoked! I'm Joy 👋",
      description: "Your AI-friend for building confidence. I can help you pick scents that fits your vibe, feels amazing and gets compliments ❤️"
    },
    {
      image: slide2,
      title: "I'm by your side, whenever you need me 😊",
      description: "When we're not talking about scents, we can chat about work, health and relationship problems that's impacting your confidence levels."
    }
  ]

  return (
    <div className="relative">
      <Swiper
        ref={swiperRef}
        slidesPerView="auto"
        spaceBetween={10}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          stopOnLastSlide: true,
        }}
        // pagination={{
        //   clickable: true,
        //   type: 'bullets',
        // }}
        modules={[Pagination]}
        className="w-full"
        centeredSlides={true}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
      >
        {desktopSlides.map((slide, index) => (
          <SwiperSlide key={index} className="!w-[80%] relative pb-32">
            <div className={`transition-all duration-300 ${activeIndex === index ? 'opacity-100' : 'opacity-0'}`}>
              <div className="z-10 flex gap-x-[24px] items-center mb-[48px]">
                <div>
                  <img
                    src={joy}
                    alt="Joy AI Assistant"
                    className="w-[150px] h-[153.947px]"
                  />
                </div>
                <div className="flex-col text-start">
                  <h2 className="text-[32px]">{slide.title}</h2>
                  <p className="text-gray-600 py-[20px]">{slide.description}</p>
                </div>
              </div>
            </div>

            <div className="relative max-w-[900px] mx-auto h-[400px]">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover rounded-[12px]"
              />
            </div>

            {index === 1 && (
              <div className="absolute bottom-8 right-9 mt-[48px]">
                <button
                  onClick={handleNext}
                  className="text-black hover:opacity-75 transition-opacity"
                >
               <img src={arrowbottom} alt="" />
                </button>
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default ResponsiveSlider