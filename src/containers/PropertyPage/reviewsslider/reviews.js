import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useTheme } from '@mui/material/styles'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Navigation, Autoplay, EffectCoverflow } from 'swiper/modules'
import useMediaQuery from '@mui/material/useMediaQuery'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/autoplay'
import styles from './reviews.module.scss'
function ReviewsSlider({reviews}) {
    const progressCircle = useRef(null)
    const progressContent = useRef(null)
    const [height, setHeight] = useState('20vh')
    const [width, setWidth] = useState('100vw')
    const theme = useTheme()
    

    
   

    const onAutoplayTimeLeft = (s, time, progress) => {
        progressCircle.current?.style.setProperty('--progress', 1 - progress)
        if (progressContent.current) {
            progressContent.current.textContent = `${Math.ceil(time / 1000)}s`
        }
    }
    const getFormattedDate=(dateString)=>{
        var dayNames = ["Sun","Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
        let date  = new Date(new Date(dateString)); 
        let formattedDate = dayNames[date.getDay()]+' '+date.getDate()+' '+date.toLocaleString('default', { month: 'short'})+' '+date.getFullYear()
        return formattedDate
    }
    return (
        <div className={styles.sliderwrapper}>
        <div className={styles.innerHeadwrapper}>
        <div className={styles.slider}>
                 <Swiper
                    loop={true}
                    autoplay={{
                    delay: 5000,
                    stopOnLastSlide: false,
                    disableOnInteraction: false,
                    }}
                    speed={1000}
                    centeredSlides={true}
                    modules={[Navigation, Autoplay]}
                    coverflowEffect={{
                    rotate: 50,
                    stretch: 0,
                    depth: 100,
                    modifier: 1,
                    slideShadows: true,
                    }}
                    className={styles.innerWrapper}
                    spaceBetween={10}
                    navigation={false}
                    onAutoplayTimeLeft={onAutoplayTimeLeft}
                    >
                    {reviews.map((review, index) => (
                    <SwiperSlide
                    className={styles.slide}
                    key={'review-slide-' + index}
                    >
                    <div className={styles.reviewsBox}>
                        <div className={styles.reviewsBoxHeader}>
                            <div className={styles.reviewsBoxHeaderLeft}>
                              <p className={styles.authorThumbnail}></p>
                            </div>
                            <div className={styles.reviewsBoxHeaderRight}>
                            <p className={styles.authorName}>{review.user.name}</p>
                            {review.created_at &&<p className={styles.postDate}>{getFormattedDate(review.created_at)}</p>}
                            </div>
                        </div>
                        <div className={styles.reviewsBoxContnet}>
                            <p>{review.content}</p>
                         </div>
                    </div>
                    

                    </SwiperSlide>
                    ))}

                    </Swiper>
                    </div>
                    </div>
                    </div>
    )
}

export default ReviewsSlider
