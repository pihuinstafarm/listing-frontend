import React, { useEffect, useRef, useState } from 'react'
import { CircularLoader } from 'utils/components'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { getPropertyPrice } from 'utils/components'
import Link from 'next/link'
import Head from 'next/head'
import Image from 'next/image'
import { Modal } from 'components'
import { Button } from 'utils/components'
import CloseIcon from '@mui/icons-material/Close'
import styles from './index.module.scss'
import { useSearchParams } from 'next/navigation'

import {
    propertiesServices,
    amenitiesServices,
    locationsSerivces,
    metadataServices,
    enquiryTrackingService,
} from 'utils/services'

import FilterBox from 'containers/FilterBox'
import DesktopSearchBox from 'containers/DesktopSearchBox'

const PropertyItem = dynamic(() => import('containers/PropertyItem'), { ssr: false })

export default function Search() {
    const metadataFetched = useRef(false)
    const searchParams = useSearchParams()
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))
    const router = useRouter()
    const [showPagination, setShowPagination] = useState(false)
    const [page, setPage] = useState(1)
    const [perPage, setPerPage] = useState(8)
    const [visibleItems, setVisibleItems] = useState([])
    const [filtereddataList, setFiltereddataList] = useState([])
    const [searchDataList, setSearchDataList] = useState([])
    const [resetData, setResetData] = useState(false)
    const [filterModal, setFilterModal] = useState(false)
    const [queryString, setQueryString] = useState('')
    const [queryData, setQueryData] = useState([])
    const [loading, setLoading] = useState(false)

    const [allAmenities, setallAmenities] = useState([])
    const [allLocations, setallLocations] = useState([])

    // Dynamic metadata state
    const [metadata, setMetadata] = useState({
        title: 'Search Properties - InstaFarms',
        description: 'Search Properties at InstaFarms',
        url: 'https://instafarms.in/search',
        image: '',
        keywords: '',
        siteName: 'InstaFarms',
    })

    const fetchMetadataFromBackend = async () => {
        try {
            setLoading(true) // Add loading state if needed
            const metadataResponse = await metadataServices.getMetadata(
                'AVYwslNDgGJA6i48l7KY',
            )

            if (metadataResponse.metadata) {
                const newMetadata = {
                    title:
                        metadataResponse?.metadata.metaTitle ||
                        'Search Properties - InstaFarms',
                    description:
                        metadataResponse?.metadata.metaDescription ||
                        'Search Properties at InstaFarms',
                    url:
                        metadataResponse?.metaUrl?.metaUrl ||
                        'https://instafarms.in/search',
                    image: metadataResponse?.metadata.metaImage || '',
                    keywords: "",
                    siteName: 'InstaFarms',
                }

                // Force update by using functional state update
                setMetadata((prevMetadata) => ({
                    ...prevMetadata,
                    ...newMetadata,
                }))
            }
        } catch (error) {
            console.error('Error fetching metadata:', error)
        } finally {
            setLoading(false)
        }
    }

    const getPropertyUrl = (url) => {
        let adult = searchParams.get('adult') ? searchParams.get('adult') : 2
        let children = searchParams.get('children')
            ? searchParams.get('children')
            : 0
        let infant = searchParams.get('infant') ? searchParams.get('infant') : 0

        let returnurl = url.toLowerCase() + '.html'
        return returnurl
    }

    function schemaDescription(queryData) {
        let description = "Browse and book farmhouses";
        
        // Safe check for location data
        if (queryData && queryData.location && queryData.location.trim()) {
            description += " in ";
            
            const locationList = queryData.location.split(",");
            
            locationList.forEach((element, index) => {
                if (index !== 0) description += ", "; // Add comma and space
                const cleanLocation = element.replace("farmhouses-in-", "").trim();
                // Capitalize first letter of each word
                const capitalizedLocation = cleanLocation.split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                    .join(' ');
                description += capitalizedLocation;
            });
        }
        
        description += " near Hyderabad";
        
        // Only add "Results for" if we have guest data
        const hasGuestData = queryData && (
            (queryData.adult && queryData.adult > 0) ||
            (queryData.children && queryData.children > 0) ||
            (queryData.infant && queryData.infant > 0)
        );
        
        if (hasGuestData) {
            description += ". Results for ";
            
            // Fix: Proper handling of guest counts with pluralization
            const guestInfo = [];
            
            if (queryData.adult && queryData.adult > 0) {
                const adultText = queryData.adult === 1 ? "adult" : "adults";
                guestInfo.push(`${queryData.adult} ${adultText}`);
            }
            
            if (queryData.children && queryData.children > 0) {
                const childrenText = queryData.children === 1 ? "child" : "children";
                guestInfo.push(`${queryData.children} ${childrenText}`);
            }
            
            if (queryData.infant && queryData.infant > 0) {
                const infantText = queryData.infant === 1 ? "infant" : "infants";
                guestInfo.push(`${queryData.infant} ${infantText}`);
            }
            
            // Join guest info with commas and "and"
            if (guestInfo.length > 0) {
                if (guestInfo.length === 1) {
                    description += guestInfo[0];
                } else if (guestInfo.length === 2) {
                    description += guestInfo.join(" and ");
                } else {
                    description += guestInfo.slice(0, -1).join(", ") + " and " + guestInfo[guestInfo.length - 1];
                }
            }
        }
        
        description += ".";
        
        return description;
    }

    function itemSchema(searchDataList) {
        // Return empty array if searchDataList is null, undefined, or empty
        if (!searchDataList || !Array.isArray(searchDataList) || searchDataList.length === 0) {
            return [];
        }
        
        return searchDataList.map((item, index) => {
            // Safe property access with fallbacks
            const cityName = item?.address_details?.city_name?.toLowerCase() || '';
            const areaName = item?.address_details?.area_name?.toLowerCase() || '';
            const slug = item?.slug || '';
            
            return {
                "@type": "ListItem",
                "position": index + 1,
                "item": `https://instafarms.in/${cityName}/${areaName}/${slug}.html`
            };
        });
    }

    const pageSchema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebPage",
                "@id": "https://instafarms.in/search",
                "url": "https://instafarms.in/search",
                "name": `Search Farmhouses Near Hyderabad`,
                "description": schemaDescription(queryData || {}),
            },
            {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": "https://instafarms.in/"
                    },
                    {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "Search Results",
                    "item": "https://instafarms.in/search"
                    }
                ]
            },
            {
                "@type": "ItemList",
                "name": "Available Farmhouses",
                "itemListOrder": "https://schema.org/ItemListOrderAscending",
                "numberOfItems": searchDataList.length || 0,
                "itemListElement": itemSchema(searchDataList || [])
            }
        ]
    }

    const applicationSchema = JSON.stringify(pageSchema)

    async function loadPageData() {
        // console.log('🚀 Starting to load page data...');
        amenitiesServices.getAll().then((res) => {
            // console.log('🎯 Amenities service response:', res);
            // console.log('🎯 Setting allAmenities state with:', res);
            setallAmenities(res)
        }).catch((error) => {
            console.error('❌ Error fetching amenities:', error);
        });
        locationsSerivces.getAllArea().then((res) => {
            setallLocations(res)
        })
    }

    useEffect(() => {
        let location = searchParams.get('location')
            ? searchParams.get('location')
            : ''
        let adult = searchParams.get('adult') ? searchParams.get('adult') : 2
        let children = searchParams.get('children')
            ? searchParams.get('children')
            : 2
        let infant = searchParams.get('infant') ? searchParams.get('infant') : 0
            
        setQueryData({
            location: location,
            adult: adult,
            children: children,
            infant: infant,
        })

        let SearchData = {
            adult: adult,
            children: children,
            infant: infant,
        }
        // Note: Avoid localStorage in production - use session state instead
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('searchPayload', JSON.stringify(SearchData))
        }
    }, [searchParams])

    async function searchProperties() {
        let payLoad = {
            GuestCount:
                parseInt(queryData.adult ? queryData.adult : 2) +
                parseInt(queryData.children ? queryData.children : 2),
            attributes:
                'plans,property_code_name,name,slug,max_guest_count,address_details,plans,price_detail,base_guest_count,caretaker,featured_image,type,bedroom_count,rooms,amenities',
        }

        if (queryData.location) {
            payLoad['location'] = queryData.location
        }

        let newQueryString =
            '?adult=' +
            queryData.adult +
            '&children=' +
            queryData.children +
            '&infant=' +
            queryData.infant
        setQueryString(newQueryString)
        setLoading(true)
        setSearchDataList('')
        setFiltereddataList('')

        await propertiesServices.searchProperties(payLoad).then((searchResult) => {
            setLoading(false)
            
            console.log('🔍 Debug: Search result:', searchResult);
            
            // Handle both legacy format (list) and new format (data)
            // Also handle case where success might be undefined due to legacy mapper
            if (searchResult.success !== false && (searchResult.data || searchResult.list)) {
                const propertyData = searchResult.data || searchResult.list || [];
                
                console.log('🔍 Debug: Property data length:', propertyData.length);
                
                let propertyList = []
                propertyData.forEach((item, index) => {
                    let payload = {
                        propertyItem: item,
                        adult: queryData.adult ? parseInt(queryData.adult) : 0,
                        children: queryData.children
                            ? parseInt(queryData.children)
                            : 0,
                        infant: queryData.infant ? parseInt(queryData.infant) : 0,
                    }
                    const PropertyPrice = getPropertyPrice(payload)

                    item['PropertyPrice'] = PropertyPrice
                    propertyList.push(item)
                })
                
                console.log('🔍 Debug: Processed property list length:', propertyList.length);
                
                setSearchDataList(propertyList)
                setFiltereddataList(propertyList)
            } else {
                console.error('❌ Search failed:', searchResult.message || 'Unknown error');
            }
        }).catch((error) => {
            console.error('💥 Search API call failed:', error);
            setLoading(false);
        })
    }

    useEffect(() => {
        if (visibleItems.length < filtereddataList.length) {
            setShowPagination(true)
        } else {
            setShowPagination(false)
        }
    }, [visibleItems])

    useEffect(() => {
        loadPageData()
        searchProperties()
    }, [queryData])

    useEffect(() => {
        metadataFetched.current = false
    }, [searchParams.toString()])

    useEffect(() => {
        if (
            (searchDataList.length > 0 || queryData.location) &&
            !metadataFetched.current
        ) {
            fetchMetadataFromBackend()
            metadataFetched.current = true
        }
    }, [searchDataList, queryData.location])

    const getVisibleItems = async (PageNumber) => {
        setPage(PageNumber)
        let newPageNumber = PageNumber - 1
        let sliceStart = newPageNumber * perPage
        let sliceEnd = sliceStart + 1 * perPage

        let newVisibleItems = filtereddataList.slice(sliceStart, sliceEnd)
        
        console.log('🔍 Debug: getVisibleItems - PageNumber:', PageNumber, 'filtereddataList length:', filtereddataList.length, 'newVisibleItems length:', newVisibleItems.length);

        if (PageNumber == 1) {
            setVisibleItems(newVisibleItems)
        } else {
            setVisibleItems(visibleItems.concat(newVisibleItems))
        }
    }

    useEffect(() => {
        getVisibleItems(1)
    }, [filtereddataList])

    useEffect(() => {
        getVisibleItems(1)
    }, [resetData])

    const showFilterModal = () => {
        setFilterModal(!filterModal)
    }

    const sortReset = (sortedData) => {
        setFilterModal(false)
        setFiltereddataList(sortedData)
        setResetData(!resetData)
    }

    const updateSearchQuery = (newQueryData) => {
        setQueryData(newQueryData)
    }

    // Handle property click tracking (Task 3)
    const handlePropertyClick = async (property, source = 'search_page') => {
        try {
            // Track the property click with ViewEnquiry
            await enquiryTrackingService.trackPropertyClick(property.id, {
                source,
                propertyName: property.property_code_name,
                location: `${property.address_details?.city_name}/${property.address_details?.area_name}`,
            })
        } catch (error) {
            // Don't block navigation if tracking fails
            console.error('Failed to track property click:', error)
        }
    }

    return (
        <>
            <Head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: applicationSchema }}
                />
                <title>{metadata.title}</title>
                <meta name="title" content={metadata.title} />
                <meta name="description" content={metadata.description} />
                <meta name="robots" content="index, follow" />
                <meta name="keywords" content={metadata.keywords} />
                <link rel="canonical" href={metadata.url} />
                
                {/* OG Tags */}
                <meta property="og:title" content={metadata.title} />
                <meta property="og:description" content={metadata.description} />
                <meta property="og:url" content={metadata.url} />
                <meta property="og:image" content={metadata.image} />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta property="og:type" content="Search Page" />
                <meta property="og:logo" content="http://instafarms.in/logo.webp"/>
                <meta property="og:site_name" content={metadata.siteName} />
                <meta property="og:locale" content="en_US" />

                {/* Twitter Tags */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={metadata.title} />
                <meta name="twitter:description" content={metadata.description} />
                <meta name="twitter:image" content={metadata.image} />
                <meta name="twitter:url" content={metadata.url} />
                <meta name="twitter:site" content="@instafarms"/>

                <meta itemProp="name" content={metadata.title} />
                <meta itemProp="description" content={metadata.description} />
                <meta itemProp="image" content={metadata.image} />
            </Head>

            {isMobile && (
                <div className={'customHeader'}>
                    <div className={'left'} onClick={() => router.push('/')}>
                        <Image
                            alt="Insta Farms"
                            width={30}
                            height={30}
                            src={'/assets/images/close_icon.webp'}
                        />
                    </div>
                    <div className={'center'}>
                        <h2>Search Results</h2>
                    </div>
                    <div className={'right'}></div>
                </div>
            )}
            
            <div className={'inner_section'}>
                <div className="breadcrum">
                    <Link scroll={true} aria-label="Home" href={`/`}>
                        Home
                    </Link>
                    /<span>Search</span>
                </div>
            </div>

            {allLocations.length > 0 && (
                <DesktopSearchBox
                    queryData={queryData}
                    allLocations={allLocations}
                    showFilterModal={showFilterModal}
                    updateSearchQuery={updateSearchQuery}
                />
            )}
            <section className="inner_section header row_column">
                <div className="header_left">
                    {!isMobile && <h2>Search Results</h2>}
                </div>
                <div className="header_right"></div>
            </section>

            {filterModal && (
                <Modal
                    classname={styles.modalwrapper + ' ' + styles.filterbox}
                    onClose={(e) => setFilterModal(false)}
                    isOpen={filterModal}
                >
                    <Button
                        aria-label="Close"
                        width={32}
                        label={<CloseIcon variant="alert" />}
                        className={styles.close}
                        onClick={(e) => setFilterModal(false)}
                    />
                    <div className={styles.content}>
                        <FilterBox
                            allAmenities={allAmenities}
                            sortReset={sortReset}
                            dataList={searchDataList}
                        />
                    </div>
                </Modal>
            )}

            {loading && (
                <section className="full_screen_loading flex justify-center items-center h-[75%] w-full">
                    <CircularLoader />
                </section>
            )}

            {!loading && visibleItems && visibleItems.length === 0 && searchDataList.length === 0 && (
                <section className="inner_section">
                    <div className="text-center py-8">
                        <h3>No properties found</h3>
                        {/* <p>Try adjusting your search criteria.</p> */}
                    </div>
                </section>
            )}

            {visibleItems && visibleItems.length > 0 && (
                <section className="inner_section properties search">
                    {console.log('🔍 Debug: visibleItems length:', visibleItems.length)}
                    {visibleItems.map((property, index) => {
                        console.log(`🔍 Debug: Property ${index}:`, property?.property_code_name);
                        return (
                            <div className="property" key={'search-item-' + index} style={{ minWidth: '250px', width: '100%' }}>
                                <a
                                    title={property?.property_code_name}
                                    className="link_only"
                                    style={{ display: 'block', width: '100%' }}
                                    href={getPropertyUrl(
                                        `/${property.address_details.city_name.toLowerCase()}/${property.address_details.area_name.toLowerCase()}/${property.slug}`,
                                    )}
                                    onClick={() => handlePropertyClick(property, 'search_page')}
                                >
                                    <PropertyItem property={property} />
                                </a>
                            </div>
                        );
                    })}
                </section>
            )}

            {showPagination && (
                <div className="load_more" onClick={() => getVisibleItems(page + 1)}>
                    Load More
                </div>
            )}
        </>
    )
}
