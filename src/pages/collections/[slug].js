import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import PropertyItem from 'containers/PropertyItem'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { settingsServices, collectionsSerivces } from 'utils/services'

import SearchProperty from 'containers/SearchFilter/SearchProperty'
import SortProperty from 'containers/SearchFilter/SortProperty'
import FAQSection from 'containers/Faqs'
import TitleDescription from 'components/TitleDescription'

export async function getStaticPaths() {
    try {
        let payload = {
            pageNumber: 1,
            totalPages: 0,
            LastDocument: false,
            moveTo: false,
            orderBy: 'weight',
            searchBy: '',
            searchKey: '',
            attributes: 'slug',
        }

        // Call an external API endpoint to get posts
        let dataList = await collectionsSerivces.paginateCollections(payload)
        
        if (!dataList || !Array.isArray(dataList)) {
            console.error('Collections data list is not an array:', dataList)
            return { paths: [], fallback: 'blocking' }
        }
        
        const paths = dataList
            .filter((post) => post && post.slug && typeof post.slug === 'string')
            .map((post) => ({
                params: { slug: post.slug },
            }))
            
        console.log('Collections paths generated:', paths.length)
        return { paths, fallback: 'blocking' }
    } catch (error) {
        console.error('Error in collections getStaticPaths:', error)
        return { paths: [], fallback: 'blocking' }
    }
}

export async function getStaticProps({ params }) {
    try {
        let payload = {
            pageNumber: 1,
            totalPages: 0,
            LastDocument: false,
            moveTo: false,
            perPage: 1,
            orderBy: 'weight',
            searchBy: 'slug',
            searchKey: params.slug,
        }
        
        let propsDataList
        try {
            propsDataList = await collectionsSerivces.paginateCollections(payload)
        } catch (error) {
            console.error('Error fetching collection data:', error)
            return { notFound: true }
        }
        
        if (!propsDataList || !Array.isArray(propsDataList) || propsDataList.length === 0) {
            console.error('Collection not found for slug:', params.slug)
            return { notFound: true }
        }
        
        let siteSettings
        try {
            siteSettings = await settingsServices.getSettings()
        } catch (error) {
            console.error('Error fetching site settings:', error)
            siteSettings = {}
        }
        
        return { props: { siteSettings, propsDataList }, revalidate: 10 }
    } catch (error) {
        console.error('Error in collections getStaticProps:', error)
        return { notFound: true }
    }
}

export default function CollectionBySlug({ siteSettings, propsDataList }) {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))
    const router = useRouter()
    const [showPagination, setShowPagination] = useState(false)
    const [page, setPage] = useState(1)
    const [perPage, setPerPage] = useState(8)
    const [visibleItems, setVisibleItems] = useState([])
    const [filtereddataList, setFiltereddataList] = useState(
        (propsDataList && propsDataList[0] && propsDataList[0].properties) ? propsDataList[0].properties : [],
    )
    const [resetData, setResetData] = useState(true)

    // console.log("propsDataList", propsDataList);

    // Safely access data with proper fallbacks
    const collectionData = propsDataList && propsDataList[0] ? propsDataList[0] : {}
    const collectionMetadata = collectionData.metadata || {}

    // Metadata
    const siteName = siteSettings?.site_title || 'InstaFarms'
    const metaTitle = collectionMetadata.metaTitle || siteName
    const metaDescription = collectionMetadata.metaDescription || ''
    const metaKeywords = siteSettings?.meta_keywords || '';
    const metaUrl = collectionMetadata.metaUrl || ''
    const metaImage = collectionMetadata.metaImage || ''


    function itemSchema(dataList){
        if (Array.isArray(dataList) && dataList.length !== 0){
            return dataList.map((item, index)=>{
                if (!item) return null

                const imageUrl = (() => {
                    if (!item) return ''
                    const fi = item.featured_image
                    if (typeof fi === 'string') return fi
                    if (Array.isArray(fi)) return fi[0]?.url || ''
                    return fi?.url || ''
                })()

                const firstWeekPrice = (() => {
                    const week = item?.price_detail?.weekPrice
                    if (Array.isArray(week) && week[0] && week[0].price) return week[0].price
                    return "000"
                })()

                return {
                    "@type": "Product",
                    "position": index + 1,
                    "name": item?.name || '',
                    "image": imageUrl,
                    "description": item?.meta_description || '',
                    "url": item?.meta_url || '',
                    "brand": {
                        "@type": "Brand",
                        "name": "Instafarms"
                    },
                    "offers": {
                        "@type": "Offer",
                        "priceCurrency": "INR",
                        "price": firstWeekPrice,
                        "priceValidUntil": "2025-12-31",
                        "availability": "https://schema.org/InStock",
                        "url": `${item?.meta_url || ''}#booking`,
                    },
                    "aggregateRating": {
                        "@type": "AggregateRating",
                        "ratingValue": "4",
                        "reviewCount": "4"
                    },
                    "review": {
                        "@type": "Review",
                        "author": { "@type": "Person", "name": "Ravi Kumar" },
                        "datePublished": "2025-06-15",
                        "reviewBody": "Amazing stay, clean pool and great service!",
                        "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" }
                    }
                }
            }).filter(Boolean)
        }
        return [];
    }

    function faqsList(faqlist){
        if(faqlist.length!==0){
            return faqlist.map((item, index)=>{
                return {
                    "@type": "Question",
                    "name": item.question,
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": item.answer,
                    }
                }
            })
        }
        return [];
    }

    function itemListSchema(items){
        if(Array.isArray(items) && items.length !== 0){
            return items.map((item, index)=>{
                if (!item) return null
                return {
                    "@type": "ListItem",
                    "position": index+1,
                    "item": item?.meta_url || ''
                }
            }).filter(Boolean)
        }
        return [];
    }

    const pageSchema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebPage",
                "@id": `${metaUrl}#webpage`,
                "url": metaUrl,
                "name": collectionData?.name || '',
                "description": metaDescription
            },
            {
                "@type": "Organization",
                "name": "InstaFarms",
                "url": "https://instafarms.in",
                "logo": "https://instafarms.in/logo.webp"
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
                "name": "Collections",
                "item": "https://instafarms.in/collections"
                },
                {
                "@type": "ListItem",
                "position": 3,
                "name": collectionData.name,
                "item": metaUrl
                }
            ]
            },
            {
                "@type": "FAQPage",
                "mainEntity": faqsList(collectionData.faqs || [])
            },
            {
                "@type": "ItemList",
                "name": collectionData?.name || '',
                "itemListOrder": "https://schema.org/ItemListOrderAscending",
                "numberOfItems": (collectionData?.properties?.length) || 0,
                "itemListElement": itemListSchema(collectionData.properties || [])
            },
            ...itemSchema(collectionData.properties || [])
        ]
    }

    const applicationSchema = JSON.stringify(pageSchema)

    // console.log("Collection : ", collectionData);
    // console.log("Schema", pageSchema);

    useEffect(() => {
        if (visibleItems.length < filtereddataList.length) {
            setShowPagination(true)
        } else {
            setShowPagination(false)
        }
    }, [visibleItems])

    const getVisibleItems = async (PageNumber) => {
        setPage(PageNumber)
        let newPageNumber = PageNumber - 1
        let sliceStart = newPageNumber * perPage
        let sliceEnd = sliceStart + 1 * perPage
        let newVisibleItems = filtereddataList.slice(sliceStart, sliceEnd)

        if (PageNumber == 1) {
            setVisibleItems(newVisibleItems)
        } else {
            setVisibleItems(visibleItems.concat(newVisibleItems))
        }
    }

    const searchReset = (newListData) => {
        setFiltereddataList(newListData)
        setResetData(!resetData)
    }

    useEffect(() => {
        getVisibleItems(1)
    }, [resetData])

    const sortReset = (sortedData) => {
        setFiltereddataList(sortedData)
        setResetData(!resetData)
    }

    return (
        <>
            <Head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: applicationSchema }}
                />
                <title>{metaTitle}</title>
                <meta name="title" content={metaTitle} />
                <meta name="description" content={metaDescription} />
                <meta name="keywords" content={metaKeywords} />
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href={metaUrl} />

                {/* OG Tags */}
                <meta property="og:title" content={metaTitle} />
                <meta property="og:description" content={metaDescription} />
                <meta property="og:url" content={metaUrl} />
                <meta property="og:image" content={metaImage} />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta property="og:type" content="All Collection Page" />
                <meta property="og:logo" content="http://instafarms.in/logo.webp"/>
                <meta property="og:site_name" content={siteName} />
                <meta property="og:locale" content="en_US" />

                {/* Twitter Tags */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={metaTitle} />
                <meta name="twitter:description" content={metaDescription} />
                <meta name="twitter:image" content={metaImage} />
                <meta name="twitter:url" content={metaUrl} />
                <meta name="twitter:site" content="@instafarms" />
                
                <meta itemProp="name" content={metaTitle} />
                <meta itemProp="description" content={metaDescription} />
                <meta itemProp="image" content={metaImage} />
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
                        <h1>{propsDataList ? propsDataList[0]['name'] : ''}</h1>
                    </div>
                    <div className={'right'}></div>
                </div>
            )}

            <div className={'inner_section'}>
                <div className="breadcrum">
                    <Link scroll={true} aria-label="Home" href={`/`}>
                        Home
                    </Link>
                    /<span>{propsDataList ? propsDataList[0]['name'] : ''}</span>
                </div>
            </div>

            <div className={'inner_section'}>
                <div className="header row_column">
                    <div className="header_left">
                        {!isMobile && (
                            <h1 className='capitalize'>
                                {propsDataList ? propsDataList[0]['name'] : ''}
                            </h1>
                        )}
                        <p className="text-[16px]">
                            {propsDataList ? propsDataList[0]['description'] : ''}
                        </p>
                    </div>
                    <div className="header_right">
                        <SearchProperty
                            searchReset={searchReset}
                            dataList={propsDataList[0].properties}
                        />
                        <SortProperty
                            sortReset={sortReset}
                            dataList={filtereddataList}
                            orderByOptions={[]}
                        />
                    </div>
                </div>

                {visibleItems && (
                    <div className="properties search">
                        {visibleItems.map((property, index) => (
                            <>
                                <div
                                    className="property"
                                    key={'collection-slide-' + index}
                                >
                                    <Link
                                        aria-label={property?.property_code_name}
                                        className="link_only"
                                        href={`/${property.address_details.city_name.toLowerCase()}/${property.address_details.area_name.toLowerCase()}/${property.slug}.html`}>
                                        <PropertyItem property={property} />
                                    </Link>
                                </div>
                            </>
                        ))}
                    </div>
                )}
                {showPagination && (
                    <div
                        className="load_more"
                        onClick={() => getVisibleItems(page + 1)}
                    >
                        Load More
                    </div>
                )}

                {propsDataList[0].information && (
                    <TitleDescription
                        title={
                            propsDataList[0].information.title
                                ? propsDataList[0].information.title
                                : ''
                        }
                        description={
                            propsDataList[0].information.description
                                ? propsDataList[0].information.description
                                : ''
                        }
                    />
                )}
                <FAQSection
                    faqData={propsDataList[0].faqs ? propsDataList[0].faqs : []}
                />
            </div>
        </>
    )
}
