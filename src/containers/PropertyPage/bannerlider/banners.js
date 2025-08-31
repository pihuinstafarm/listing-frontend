import React from 'react'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import {Autoplay,Pagination } from 'swiper/modules'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/autoplay'
import styles from './banners.module.scss'
function PropertySlider({showGallery,propertyItem,galleryItems}) {
   

  const getLogoFromName = (name = '') => {
    if (!name.trim()) return 'IF';
  
    let rgx = /\b\p{L}/gu; // Matches first letter of each word
    let initials = [...name.match(rgx)] || [];
  
    if (initials.length === 0) return 'IF'; // Fallback if no valid letters found
  
    return (initials[0] + (initials[1] || '')).toUpperCase();
  };
  

    
        return (
        <div className={styles.sliderwrapper+' header_slider'}>
        <div className={styles.innerHeadwrapper}>
                 {galleryItems &&<Swiper
                    loop={false}
                    autoplay={{
                    delay: 5000,
                    stopOnLastSlide: false,
                    disableOnInteraction: false,
                    }}
                    speed={1000}
                    pagination={true}
                    centeredSlides={true}
                    modules={[Pagination, Autoplay]}
                    className={styles.innerWrapper}
                    spaceBetween={10}
                    >
                    
                    <SwiperSlide
                    className={styles.slide}
                    onClick={showGallery}
                    >
                           <picture>
                                <Image
                                    src={propertyItem.cover_1
  ? (Array.isArray(propertyItem.cover_1)
      ? propertyItem.cover_1[0]?.url
      : propertyItem.cover_1.url)
  : galleryItems[0]?.url}
                                    alt={propertyItem.cover_1
  ? (Array.isArray(propertyItem.cover_1)
      ? propertyItem.cover_1[0]?.altText
      : propertyItem.cover_1.altText)
  :'InstaFarms '+propertyItem.property_code_name}
  layout="fill"
                                    sizes="(max-width: 480px) 400px,(max-width: 640px) 600px, (max-width: 768px) 750, (max-width: 1200px) 1080px, 1080px"
                                    priority={true}
                                />
                            </picture>

                      <div className={styles.listedBy}>
                        <div className={styles.left}>
                        {propertyItem.logo ?<Image alt={'InstaFarms '+propertyItem.listed_by?propertyItem.listed_by:propertyItem.owner.name}  width={100} height={100} src={propertyItem.logo}/>:<span>{getLogoFromName(propertyItem.listed_by?propertyItem.listed_by:propertyItem.owner.name)}</span>}
                        </div>
                        <div className={styles.right}>
                        <span>Listed By:</span>
                        <p className={styles.title}>{propertyItem.listed_by?propertyItem.listed_by:propertyItem.owner.name}</p>
                        <p>For:  ₹{propertyItem.price_detail.weekPrice[0].price}  -  ₹{propertyItem.price_detail.weekPrice[6].price}</p>
                        </div>
                      </div>

                    </SwiperSlide>

                    <SwiperSlide
                    className={styles.slide}
                    onClick={showGallery}
                    >
                           <picture>
                                <Image
                                    src={propertyItem.cover_2
  ? (Array.isArray(propertyItem.cover_2)
      ? propertyItem.cover_2[0]?.url
      : propertyItem.cover_2.url)
  : galleryItems[1]?.url}
                                    
  alt={propertyItem.cover_2
  ? (Array.isArray(propertyItem.cover_2)
      ? propertyItem.cover_2[0]?.altText
      : propertyItem.cover_2.altText)
  :'InstaFarms '+propertyItem.property_code_name}
  layout="fill"
                                    sizes="(max-width: 480px) 400px,(max-width: 640px) 600px, (max-width: 768px) 750, (max-width: 1200px) 1080px, 1080px"
                                    priority={false}
                                />
                            </picture>

                      <div className={styles.listedBy}>
                        <div className={styles.left}>
                        {propertyItem.logo ?<Image alt={'InstaFarms '+propertyItem.listed_by?propertyItem.listed_by:propertyItem.owner.name}  width={100} height={100} src={propertyItem.logo}/>:<span>{getLogoFromName(propertyItem.listed_by?propertyItem.listed_by:propertyItem.owner.name)}</span>}
                        </div>
                        <div className={styles.right}>
                        <span>Listed By:</span>
                        <p className={styles.title}>{propertyItem.listed_by?propertyItem.listed_by:propertyItem.owner.name}</p>
                        <p>For:  ₹{propertyItem.price_detail.weekPrice[0].price}  -  ₹{propertyItem.price_detail.weekPrice[6].price}</p>
                        </div>
                      </div>

                    </SwiperSlide>

                    <SwiperSlide
                    className={styles.slide}
                    onClick={showGallery}
                    >
                           <picture>
                                <Image
                                    src={propertyItem.cover_3
  ? (Array.isArray(propertyItem.cover_3)
      ? propertyItem.cover_3[0]?.url
      : propertyItem.cover_3.url)
  : galleryItems[2]?.url}
                                    
  alt={propertyItem.cover_3
  ? (Array.isArray(propertyItem.cover_3)
      ? propertyItem.cover_3[0]?.altText
      : propertyItem.cover_3.altText)
  :'InstaFarms '+propertyItem.property_code_name}
  layout="fill"
                                    sizes="(max-width: 480px) 400px,(max-width: 640px) 600px, (max-width: 768px) 750, (max-width: 1200px) 1080px, 1080px"
                                    priority={false}
                                />
                            </picture>

                      <div className={styles.listedBy}>
                        <div className={styles.left}>
                        {propertyItem.logo ?<Image alt={'InstaFarms '+propertyItem.listed_by?propertyItem.listed_by:propertyItem.owner.name}  width={100} height={100} src={propertyItem.logo}/>:<span>{getLogoFromName(propertyItem.listed_by?propertyItem.listed_by:propertyItem.owner.name)}</span>}
                        </div>
                        <div className={styles.right}>
                        <span>Listed By:</span>
                        <p className={styles.title}>{propertyItem.listed_by?propertyItem.listed_by:propertyItem.owner.name}</p>
                        <p>For:  ₹{propertyItem.price_detail.weekPrice[0].price}  -  ₹{propertyItem.price_detail.weekPrice[6].price}</p>
                        </div>
                      </div>

                    </SwiperSlide>

                    <SwiperSlide
                    className={styles.slide}
                    onClick={showGallery}
                    >
                           <picture>
                                <Image
                                    src={propertyItem.cover_4
  ? (Array.isArray(propertyItem.cover_1)
      ? propertyItem.cover_4[0]?.url
      : propertyItem.cover_4.url)
  : galleryItems[3]?.url}
                                    
  alt={propertyItem.cover_4
  ? (Array.isArray(propertyItem.cover_4)
      ? propertyItem.cover_4[0]?.altText
      : propertyItem.cover_4.altText)
  :'InstaFarms '+propertyItem.property_code_name}
  layout="fill"
                                    sizes="(max-width: 480px) 400px,(max-width: 640px) 600px, (max-width: 768px) 750, (max-width: 1200px) 1080px, 1080px"
                                    priority={false}
                                />
                            </picture>

                      <div className={styles.listedBy}>
                        <div className={styles.left}>
                        {propertyItem.logo ?<Image alt={'InstaFarms '+propertyItem.listed_by?propertyItem.listed_by:propertyItem.owner.name}  width={100} height={100} src={propertyItem.logo}/>:<span>{getLogoFromName(propertyItem.listed_by?propertyItem.listed_by:propertyItem.owner.name)}</span>}
                        </div>
                        <div className={styles.right}>
                        <span>Listed By:</span>
                        <p className={styles.title}>{propertyItem.listed_by?propertyItem.listed_by:propertyItem.owner.name}</p>
                        <p>For:  ₹{propertyItem.price_detail.weekPrice[0].price}  -  ₹{propertyItem.price_detail.weekPrice[6].price}</p>
                        </div>
                      </div>

                    </SwiperSlide>

                    <SwiperSlide
                    className={styles.slide}
                    onClick={showGallery}
                    >
                           <picture>
                                <Image
                                    src={propertyItem.cover_5
  ? (Array.isArray(propertyItem.cover_5)
      ? propertyItem.cover_5[0]?.url
      : propertyItem.cover_5.url)
  : galleryItems[4]?.url}
                                    
  alt={propertyItem.cover_5
  ? (Array.isArray(propertyItem.cover_5)
      ? propertyItem.cover_5[0]?.altText
      : propertyItem.cover_5.altText)
  :'InstaFarms '+propertyItem.property_code_name}
  layout="fill"
                                    sizes="(max-width: 480px) 400px,(max-width: 640px) 600px, (max-width: 768px) 750, (max-width: 1200px) 1080px, 1080px"
                                    priority={false}
                                />
                            </picture>

                      <div className={styles.listedBy}>
                        <div className={styles.left}>
                        {propertyItem.logo ?<Image alt={'InstaFarms '+propertyItem.listed_by?propertyItem.listed_by:propertyItem.owner.name}  width={100} height={100} src={propertyItem.logo}/>:<span>{getLogoFromName(propertyItem.listed_by?propertyItem.listed_by:propertyItem.owner.name)}</span>}
                        </div>
                        <div className={styles.right}>
                        <span>Listed By:</span>
                        <p className={styles.title}>{propertyItem.listed_by?propertyItem.listed_by:propertyItem.owner.name}</p>
                        <p>For:  ₹{propertyItem.price_detail.weekPrice[0].price}  -  ₹{propertyItem.price_detail.weekPrice[6].price}</p>
                        </div>
                      </div>

                    </SwiperSlide>
                    

                  </Swiper>}
        
        </div>
        </div>
         )
        
   
}

export default PropertySlider
