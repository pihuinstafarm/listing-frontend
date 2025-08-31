import React from 'react'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Scrollbar, FreeMode, Mousewheel } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/free-mode'
import 'swiper/css/navigation'
import 'swiper/css/scrollbar'
import Link from 'next/link';
import PropertyItem from 'containers/PropertyItem'
import { enquiryTrackingService } from 'utils/services'



function NearByLocations({ propertiesList, titleTag, title, subtitle }) {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))
    const Heading = `${titleTag}`;

    // Handle property click tracking (Task 3)
    const handlePropertyClick = async (property, source = 'homepage') => {
        try {
            // Track the property click with ViewEnquiry
            await enquiryTrackingService.trackPropertyClick(property.id, {
                source,
                propertyName: property.property_code_name,
                location: `${property.address_details?.city_name}/${property.address_details?.area_name}`,
                section: title, // Track which section (Popular Locations, Newly Launched, etc.)
            })
        } catch (error) {
            // Don't block navigation if tracking fails
            console.error('Failed to track property click:', error)
        }
    }

    return (
        <section className='inner_section'>
            <div className='header'>
                <div className='header_left'>
                    <Heading>{title}</Heading>
                    <h6 className='text-base text-gray-500 font-light'>{subtitle} </h6>
                </div>
                <div className='header_right'>
                    <Link scroll={true} aria-label='View All Properties' className="solidbtn" href={`/all-property`}>See all</Link>
                </div>
            </div>

            <div className='properties'>
                {propertiesList && <Swiper
                    modules={[Navigation, Scrollbar, FreeMode, Mousewheel]}
                    navigation={true}
                    freeMode={true}
                    scrollbar={{ draggable: true }}
                    mousewheel={{ forceToAxis: true }}
                    slidesPerView={isMobile ? 1 : 4}
                    className='inner_swiper properties_swiper'
                >

                    {propertiesList.map((property, index) => (<SwiperSlide
                        className='property'
                        key={'property-slide-' + index}>

                        <Link 
                            aria-label={property?.property_code_name} 
                            className="link_only" 
                            href={`/${property.address_details.city_name.toLowerCase()}/${property.address_details.area_name.toLowerCase()}/${property.slug}.html`}
                            onClick={() => handlePropertyClick(property, 'homepage')}
                        >
                            <PropertyItem property={property} />
                        </Link>
                    </SwiperSlide>))}

                </Swiper>}
            </div>

        </section>
    )

}


export default NearByLocations
