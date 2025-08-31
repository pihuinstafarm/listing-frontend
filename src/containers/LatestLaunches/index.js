import React from 'react'

import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination,Navigation} from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import 'swiper/css/autoplay'
import 'swiper/css/effect-fade'


import PropertyItem from 'containers/PropertyItem'
import Link from 'next/link';
function LatestLaunches({title,propertiesList}) {
   
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))
    
    const getPropertyUrl=(url)=>{
        return url
        .toLowerCase() // Convert to lowercase
        .replace(/%20| /g, '-') // Replace spaces and %20 with hyphens
        .replace(/[^a-z0-9/-]+/g, '') // Remove special characters except hyphens and slashes
        .replace(/\/+/g, '/') // Ensure single slashes
        .replace(/-+/g, '-') // Ensure single hyphens
        .replace(/\/-|-\/|^-|-$/g, '')+'.html'; 
      }
    return (
        <section className='inner_section'>
           <div className='header'>
           <div className='header_left'>
            <h2>{title}</h2>
            <p>Explore Our Serene Farmhouses & Play Areas nearby </p>
            </div>
            <div className='header_right'>
                <Link  scroll={true}  aria-label='View All Properties' className="solidbtn"  href={`/all-property`}>See all</Link>
            </div>
            </div>

            <div className='properties'>
                {propertiesList &&<Swiper
                    modules={[Pagination,Navigation]}
                    navigation={true}
                    speed={1000}
                    pagination={true}
                    slidesPerView={isMobile?1:4}
                    className='inner_swiper properties_swiper'
                >
                    
                {propertiesList.map((property, index) => (
                   <SwiperSlide 
                   className='property' 
                   key={'latest_property-slide-' + index}>
                   
                    <Link aria-label={property?.property_code_name} className="link_only"  href={getPropertyUrl(`/${property.address_details.city_name}/${property.address_details.area_name}/${property.type}/${property.slug}`)}>
                            <PropertyItem property={property}/>
                    </Link>

                   </SwiperSlide>
                ))}

                </Swiper>}
                </div>

        </section>
    )
 }


export default LatestLaunches
