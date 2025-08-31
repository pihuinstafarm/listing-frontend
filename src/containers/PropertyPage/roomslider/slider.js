import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import {Navigation, Autoplay } from 'swiper/modules'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/autoplay'
import styles from './banners.module.scss'

import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

function RoomSlider({showRoomsGallery,rooms}) {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))
   
   
    const getKeyName=(key,index)=>{
        let newindex =parseInt(index)+1
        switch(key) {
         case 'bathrooms':
            return 'Bathroom '+newindex
            break;
        case 'bedrooms':
            return 'Bedroom '+newindex
            break;
        case 'diningrooms':
            return 'Dining Room '+newindex
            break;

        case 'kitchen':
            return 'Kitchen '+newindex
            break;

        case 'leavingrooms':
            return 'Living Room '+newindex
            break;
        case 'other':
            return 'Other '+newindex
            break;
        default:
            return ''
        }
    }
    if(rooms){
        return (
        <div className={styles.sliderwrapper}>
        <div className={styles.innerHeadwrapper}>
        <div className={styles.slider}>
        <Swiper
                    loop={false}
                    autoplay={{
                        delay: 5000,
                        stopOnLastSlide: false,
                        disableOnInteraction: false,
                    }}
                    speed={1000}
                    centeredSlides={false}
                    modules={[Navigation, Autoplay]}
                    className={styles.innerWrapper+' roomslider'}
                    spaceBetween={10}
                    navigation={true}
                    slidesPerView={isMobile?1.2:2.2}
                    lazyPreloadPrevNext={2}
                    >
                    {Object.keys(rooms).map((key, i) => (<div key={'room_slide_' + i}>
                        
                        {rooms[key].map((item, index) => (<SwiperSlide className={styles.slide} key={'room_'+getKeyName(key,index)} >
                                
                                <div className="swiper-zoom-container">
                                {item.thumbnail &&<Image onClick={showRoomsGallery} alt={'InstaFarms '+item.title?item.title:getKeyName(key,index)}  width={500} height={300}  src={item.thumbnail} />}
                                </div>
                                <h5 className={styles.heading}>{item.title?item.title:getKeyName(key,index)}</h5>
                                <div className={styles.description} dangerouslySetInnerHTML={{ __html: item?.description }} />
                            </SwiperSlide>))}
                    </div>
                    
                    ))}

                    </Swiper>
                    </div>
                    </div>
                    </div>
         )
    }
   
}

export default RoomSlider
