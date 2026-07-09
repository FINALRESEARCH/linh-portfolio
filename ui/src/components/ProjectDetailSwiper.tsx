'use client'

import {useCallback, useEffect, useState} from 'react'
import type {SanityImageSource} from '@sanity/image-url'
import {EffectFade, Keyboard} from 'swiper/modules'
import {Swiper, SwiperSlide} from 'swiper/react'
import type {Swiper as SwiperType} from 'swiper'
import {SanityImage} from '@/components/SanityImage'
import {CustomCursor} from '@/components/CustomCursor'
import 'swiper/css'
import 'swiper/css/effect-fade'

type ProjectDetailSwiperProps = {
  images: SanityImageSource[]
  title: string
}

export function ProjectDetailSwiper({images, title}: ProjectDetailSwiperProps) {
  const [swiper, setSwiper] = useState<SwiperType | null>(null)

  const handleImageLoad = useCallback(() => {
    document.querySelectorAll('.swiper-image-link').forEach((link) => link.classList.remove('loaded'))

    const activeSlide = document.querySelector('.swiper-slide-active .swiper-image-link')
    if (!activeSlide) return

    const img = activeSlide.querySelector('img')
    const loaded = () => {
      setTimeout(() => activeSlide.classList.add('loaded'), 350)
    }

    activeSlide.classList.remove('loaded')
    if (img?.complete) loaded()
    else if (img) img.addEventListener('load', loaded, {once: true})
  }, [])

  useEffect(() => {
    if (!swiper) return

    handleImageLoad()

    const onSlideChange = () => {
      handleImageLoad()
    }

    swiper.on('slideChange', onSlideChange)

    return () => {
      swiper.off('slideChange', onSlideChange)
    }
  }, [swiper, handleImageLoad])

  if (!images.length) {
    return (
      <div className="images-wrapper">
        <p className="fine-print">No gallery images.</p>
      </div>
    )
  }

  return (
    <>
      <CustomCursor swiper={swiper} />
      <div className="images-wrapper">
        <Swiper
          className="swiper swiper-projects"
          modules={[EffectFade, Keyboard]}
          centeredSlides
          slidesPerView={1}
          effect="fade"
          fadeEffect={{crossFade: true}}
          speed={0}
          loop={images.length >= 3}
          keyboard={{enabled: true}}
          allowTouchMove={false}
          onSwiper={setSwiper}
        >
          {images.map((image, index) => (
            <SwiperSlide key={`${title}-${index}`} className="swiper-slide project">
              <div className="swiper-image-link project">
                <SanityImage
                  image={image}
                  alt={`${title} — image ${index + 1}`}
                  className="swiper-slide-image project"
                  sizes="(max-width: 479px) 100vw, 65vw"
                  priority={index === 0}
                  loading="eager"
                />
                <div className="swiper-project-image-nav">
                  <button
                    type="button"
                    className="swiper-project-image-nav-prev"
                    aria-label="Previous image"
                    onClick={() => swiper?.slidePrev()}
                  />
                  <button
                    type="button"
                    className="swiper-project-image-nav-next"
                    aria-label="Next image"
                    onClick={() => swiper?.slideNext()}
                  />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="swiper-navigation is-projects">
          <button
            type="button"
            className="swiper-button-prev swiper-arrow"
            aria-label="Previous image"
            onClick={() => swiper?.slidePrev()}
          />
          <button
            type="button"
            className="swiper-button-next swiper-arrow"
            aria-label="Next image"
            onClick={() => swiper?.slideNext()}
          />
        </div>
      </div>
    </>
  )
}
