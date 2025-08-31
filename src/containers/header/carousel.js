import React from 'react'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Autoplay, Navigation } from 'swiper/modules'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/autoplay'
import 'swiper/css/navigation'
import styles from './carousel.module.scss'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

function Carousel({allCarousels}) {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))
    let banners=[]
    if(isMobile){
        allCarousels.forEach(element => {
            element['imgurl']=element.mob_banner_url?element.mob_banner_url:element.banner_url
            banners.push(element)
        });
    }else{
        allCarousels.forEach(element => {
            element['imgurl']=element.banner_url
            banners.push(element)
        });
    }
   
    return (
                <div className={styles.innerHeadwrapper+' header_slider'}>
                <Swiper
                    loop={false}
                    autoplay={{
                        delay: 5000,
                        stopOnLastSlide: false,
                        disableOnInteraction: false,
                    }}
                    speed={1000}
                    modules={[Pagination, Autoplay,Navigation]}
                    pagination={true}
                    centeredSlides={true}
                    navigation={true}
                    className={styles.innerWrapper}
                    spaceBetween={10}
                >
                    {allCarousels.map((slide, index) => (
                        <SwiperSlide
                            className={styles.slide}
                            key={'carousel-slide-' + index}
                        >
                           <a className={styles.slideLink} href={slide.link?slide.link:'/all-collections'} aria-label={`View ${slide.heading || "collection"}`}>
                           <picture>
                                {(() => {
                                    const candidateSrc = slide?.imgurl || slide?.mob_banner_url || slide?.banner_url || slide?.bannerUrl || slide?.image || ''
                                    const safeSrc = typeof candidateSrc === 'string' && candidateSrc.trim().length > 0 ? candidateSrc : '/placeholder-image.jpg'
                                    return (
                                        <Image
                                            src={safeSrc}
                                            alt={slide?.altText || slide?.heading || 'Promotional carousel slide'}
                                            layout="fill"
                                            priority={index<1?true:false}
                                        />
                                    )
                                })()}
                              
                            </picture>
                            </a>
                        </SwiperSlide>
                        ))}
                    
                </Swiper>
                </div>
            
        )
    
}

export default Carousel
