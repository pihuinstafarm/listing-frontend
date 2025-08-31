import React from 'react'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Grid, Scrollbar, FreeMode, Mousewheel } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/free-mode'
import 'swiper/css/navigation'
import 'swiper/css/scrollbar'
import "swiper/css/grid";

import Link from 'next/link';
import styles from './index.module.scss'

export default function DestinationList({ locationsList }) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const formatCityName = (city) => {
    return city.replaceAll(" ", "").toLowerCase();
  }

  if (locationsList) {
    return (
      <section className='inner_section'>
        <div className='header'>
          <div className='header_left'>
            <h2>Pick Your Location- Best Farmhouses in Hyderabad</h2>
            <h6 className='text-base text-gray-500 font-light'>Explore the farmhouse at all the popular locations in Hyderabad</h6>
          </div>
          <div className='header_right'>
            <Link scroll={true} aria-label='View All Locations' className="solidbtn" href={`/all-locations`}>See all</Link>
          </div>
        </div>

        <div className={styles.locations}>
          {locationsList && <Swiper
            loop={false}
            modules={[Grid, Navigation, Scrollbar, FreeMode, Mousewheel]}
            navigation={true}
            freeMode={true}
            scrollbar={{ draggable: true }}
            mousewheel={{ forceToAxis: true }}
            slidesPerView={isMobile ? 3 : 6}
            className='inner_swiper top_locations'
            style={{ height: isMobile ? '255px' : '325px' }}
            grid={{
              rows: 2,
              fill: "row",
            }}
          >
            {locationsList.map((location, index) => (
              <SwiperSlide className="destination-slide" key={'location-slide-' + index}>
                <Link scroll={true} aria-label={location?.name} className="link_only" href={`/${location.state_slug}/${formatCityName(location.city_name)}/${location?.slug}`}>
                  {location?.name}
                </Link>
              </SwiperSlide>

            ))}

          </Swiper>}
        </div>

      </section>
    )
  }

}



