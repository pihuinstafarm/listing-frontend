import React, { useEffect, useState } from 'react';
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';

// Components
import SortProperty from 'containers/SearchFilter/SortProperty';
import SearchProperty from 'containers/SearchFilter/SearchProperty';
import PropertyItem from 'containers/PropertyItem';
import LocationInfoSection from 'containers/LocationInfo';
import FAQSection from 'containers/Faqs';

export default function LocationPage({ pageType,siteSettings, dataList,areaDetails, citySlug, areaSlug }) {

    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))
    const router = useRouter()
    const [showPagination, setShowPagination] = useState(false);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(12);
    const [visibleItems, setVisibleItems] = useState([]);
    const [filtereddataList, setFiltereddataList] = useState([]);
    const [resetData, setResetData] = useState(true);
    
    const collectionData = areaDetails[0] || {};
    const collectionMetadata = collectionData.metadata || {};

    // Metadata
    const siteName = siteSettings?.site_title || 'InstaFarms';
    const metaTitle = collectionMetadata.metaTitle || siteName;
    const metaDescription = collectionMetadata.metaDescription || "";
    const metaKeywords = collectionMetadata.metaKeywords || "";
    const metaUrl = collectionMetadata.metaUrl|| 'https://instafarms.in/location/';
    const metaImage = collectionMetadata?.metaImage || '';

    // console.log("dataList", dataList);
    // console.log("areaDetails", areaDetails);
    
    function itemSchema(dataList){
        if (dataList.length!==0){
            return dataList.map((item, index)=>{
                return {
                    "@type": ["Product", "LodgingBusiness"],
                    "name": item.name,
                    "image": item.featured_image.url || "",
                    "description": item.meta_description,
                    "url": item.meta_url,
                    "priceRange": "₹₹₹",
                    "brand": {
                        "@type": "Brand",
                        "name": "InstaFarms"
                    },
                    "offers": {
                        "@type": "Offer",
                        "url": `${item.meta_url}#booking`,
                        "priceCurrency": "INR",
                        "price": item.price_detail.weekPrice[0].price || "000",
                        "priceValidUntil": "2025-12-31",
                        "availability": "https://schema.org/InStock",
                        "itemCondition": "https://schema.org/NewCondition"
                    },
                    "aggregateRating": {
                        "@type": "AggregateRating",
                        "ratingValue": "4.6",
                        "reviewCount": "15"
                    },
                    "telephone": `+91-8019127474`,
                    "address": {
                        "@type": "PostalAddress",
                        "streetAddress" : item.address_details.address || "",
                        "addressLocality": item.address_details.area_name || "Medchal",
                        "addressRegion": item.address_details.state_name || "Telangana",
                        "postalCode": "501218",
                        "addressCountry": "IN"
                    },
                    "geo": {
                        "@type": "GeoCoordinates",
                        "latitude": item.address_details.latitude,
                        "longitude": item.address_details.longitude,
                    }
                }
            })
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

    const formatCityName = (city) => {
        return city.replaceAll(" ", "").toLowerCase();
    }

    const pageSchema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebPage",
                "@id": metaUrl,
                "url": metaUrl,
                "name": `Farmhouses in ${collectionData.name}, ${collectionData.city_name}`,
                "description": metaDescription
            },
            {
                "@type": "Organization",
                "@id": "https://instafarms.in#organization",
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
                    "name": `Farmhouses in ${areaDetails[0].city_name}`,
                    "item": `https://instafarms.in/${areaDetails[0].state_slug}/${formatCityName(areaDetails[0].city_name)}`
                    },
                    {
                    "@type": "ListItem",
                    "position": 3,
                    "name": `Farmhouses in ${areaDetails[0].name}`,
                    "item": metaUrl,
                    }
                ]
            },
            {
                "@type": "FAQPage",
                "mainEntity": faqsList(collectionData.faqs)
            },
            {
                "@type": "ItemList",
                "name": `Available Farmhouses in ${areaDetails[0].name}`,
                "itemListOrder": "https://schema.org/ItemListOrderAscending",
                "numberOfItems": dataList.length,
                "itemListElement": dataList.map((item, index)=>{
                    return {
                        "@type": "ListItem",
                        "position": index+1,
                        "url": `https://instafarms.in/${item.address_details.city_name.toLowerCase()}/${item.address_details.area_name.toLowerCase()}/${item.slug}.html`
                    }
                }) || []
            },
            ...itemSchema(dataList || [])
        ]
    }

    // console.log("Schema", pageSchema);
    // console.log("areaDetailes", areaDetails);
    // console.log("datalist" , dataList);

    let applicationSchema = JSON.stringify(pageSchema);

    useEffect(() => {
        if (visibleItems.length < filtereddataList.length) {
            setShowPagination(true)
        } else {
            setShowPagination(false)
        }
    }, [visibleItems, filtereddataList]);

    useEffect(() => {
        setVisibleItems([])
        if (dataList) {
            setFiltereddataList(dataList)
        }
    }, [dataList]);

    useEffect(() => {
        if (filtereddataList.length > 0) {
            getVisibleItems(1)
        }
    }, [filtereddataList]);

    const getVisibleItems = async (PageNumber) => {
        setPage(PageNumber)
        let newPageNumber = PageNumber - 1
        let sliceStart = newPageNumber * perPage;
        let sliceEnd = sliceStart + 1 * perPage;

        let newVisibleItems = filtereddataList.slice(sliceStart, sliceEnd)
        if (PageNumber == 1) {
            setVisibleItems(newVisibleItems)
        } else {
            setVisibleItems(visibleItems.concat(newVisibleItems))
        }
    }

    useEffect(() => {
        if (filtereddataList.length > 0) {
            getVisibleItems(1)
        }
    }, [resetData]);

    const searchReset = (newListData) => {
        setFiltereddataList(newListData)
    }

    const sortReset = (sortedData) => {
        setFiltereddataList(sortedData)
        setResetData(!resetData)
    }

    // Add loading state for router
    if (router.isFallback) {
        return <div>Loading...</div>
    }

    // Add safety check for areaDetails
    if (!areaDetails || areaDetails.length === 0) {
        return <div>Area not found</div>
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
                <meta property="og:type" content="Location Page" />
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

            {isMobile && <div className={'customHeader'} >
                <div className={'left'} onClick={() => router.push('/')}>
                    <Image alt="Insta Farms" width={30} height={30} src={'/assets/images/close_icon.webp'} />
                </div>
                <div className={'center'}>
                    <h2>{visibleItems.length > 0 ? 'From ' + visibleItems[0]['address_details']['area_name'] : ''}</h2>
                </div>
                <div className={'right'}>
                </div>
            </div>}

            <div className={'inner_section'}>
                <div className='breadcrum'>
                    <Link scroll={true} aria-label='Home' href={`/`}>Home</Link>/
                    <Link scroll={true} aria-label='City' href={`/`}>{areaDetails[0].city_name}</Link>/
                    <span>{areaDetails[0].name}</span>
                </div>
            </div>

            <div className={'inner_section'}>
                <div className='header row_column'>
                    <div className='header_left'>
                        {!isMobile && <h1>Farmhouses in {areaDetails[0].name}</h1>}
                        <h6>Spacious & Serene Farmhouses in {areaDetails[0].name}, {areaDetails[0].city_name}</h6>
                    </div>
                    <div className='header_right'>
                        <SearchProperty searchReset={searchReset} dataList={dataList} />
                        <SortProperty sortReset={sortReset} dataList={filtereddataList} orderByOptions={['price', 'guest_count', 'bedrooms']} />
                    </div>
                </div>

                {visibleItems && visibleItems.length > 0 && <div className='properties search'>
                    {visibleItems.map((property, index) => (
                        <div key={'location-slide-' + index} className='property location_list' >
                            <Link aria-label={property?.property_code_name} className="link_only" href={`/${property.address_details.city_name.toLowerCase()}/${property.address_details.area_name.toLowerCase()}/${property.slug}.html`}>
                                <PropertyItem property={property} />
                            </Link>
                        </div>
                    ))}
                </div>}

                {showPagination && <div className='load_more' onClick={() => getVisibleItems(page + 1)}>
                    Load More
                </div>}

                {/* FAQ Section */}
                <LocationInfoSection pageContent={areaDetails[0]?.information || {}} />
                <FAQSection faqData={areaDetails[0]?.faqs || []} />
            </div>
        </>
    );
}