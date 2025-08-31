import React, { useEffect, useState } from 'react'
import Head from 'next/head';
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Scrollbar, FreeMode, Mousewheel } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/free-mode'
import 'swiper/css/navigation'
import 'swiper/css/scrollbar'

import CollectionItem from 'containers/CollectionItem'
import Link from 'next/link';

function CollectionsSection({ allCollectionsList }) {

    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))
    const [sortedList, setSortedList] = useState([]);

    useEffect(() => {
        if (allCollectionsList.length > 0) {
            let newSotedtData = allCollectionsList.sort(dynamicSortByNumericValue('hpc', 1));
            setSortedList(newSotedtData)
        }
    }, [allCollectionsList])

    const dynamicSortByNumericValue = (orderBy, sortOrder) => {
        return function (a, b) {
            let aPrice = a[orderBy] ? parseFloat(a[orderBy]) : 0;
            let bPrice = b[orderBy] ? parseFloat(b[orderBy]) : 0;
            if (sortOrder == 1) {
                return aPrice - bPrice;
            } else {
                return bPrice - aPrice;
            }
        }
    }
    return (
        <>
            <section className='inner_section'>
                <div className='header'>
                    <div className='header_left'>
                        <h2>All Collections</h2>
                        <h6 className='text-base text-gray-500 font-light'>Book a farmhouse based on your desired amenities & location.</h6>
                    </div>
                    <div className='header_right'>
                        <Link scroll={true} aria-label='View All Collections' className="solidbtn" href={`/all-collections`}>See all</Link>
                    </div>
                </div>

                <div className='properties'>
                    {sortedList && <Swiper
                        modules={[Navigation, Scrollbar, FreeMode, Mousewheel]}
                        navigation={true}
                        freeMode={true}
                        scrollbar={{ draggable: true }}
                        mousewheel={{ forceToAxis: true }}
                        slidesPerView={isMobile ? 1 : 4}
                        className='inner_swiper collection_swiper'
                    >

                        {sortedList.map((collection, index) => (
                            <SwiperSlide
                                className='collection'
                                key={'collection-slide-' + index}>
                                <Link scroll={true} aria-label={'View ' + collection.name} className="link_only" href={`/collections/${collection.slug}`}>
                                    <CollectionItem collection={collection} />
                                </Link>

                            </SwiperSlide>


                        ))}

                    </Swiper>}
                </div>

            </section>
        </>

    )
}


export default CollectionsSection
