import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import PropertyItem from 'containers/PropertyItem'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link';
import { settingsServices, propertiesServices, metadataServices } from 'utils/services'
import SearchProperty from 'containers/SearchFilter/SearchProperty'
import SortProperty from 'containers/SearchFilter/SortProperty'



export async function getStaticProps() {
  let siteSettings = await settingsServices.getSettings();
  let dataList = await propertiesServices.getAllList();
  let metadata = await metadataServices.getMetadata("zkiN9DQ2XJ1erCjo71eV");

  return { props: { siteSettings, metadata, dataList }, revalidate: 60 }
}


export default function AllLocations({ siteSettings, metadata, dataList = [] }) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const router = useRouter()
  const [showPagination, setShowPagination] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(8);
  const [visibleItems, setVisibleItems] = useState([]);
  const [filtereddataList, setFiltereddataList] = useState(dataList || []);
  const [resetData, setResetData] = useState(false);

  // Matatags
  const siteName = siteSettings.site_title || 'InstaFarms';
  const metaTitle = metadata?.metadata?.metaTitle || "Big Screen Farmhouses | Perfect for Family & Friend Events"
  const metaKeywords = siteSettings.meta_keywords ? siteSettings.meta_keywords : '';
  const metaDescription = metadata?.metadata?.metaDescription || "Enjoy private farmhouses with big screens in Hyderabad, perfect for family gatherings, friends' get-togethers, and movie nights. Relax, unwind, and have fun!";
  const metaUrl = metadata?.metadata?.metaUrl || 'https://instafarms.in/all-property';
  const metaImage = metadata?.metadata?.metaImage || (dataList?.[0]?.featured_image?.url || '/assets/images/placeholder-image.jpg');

  function itemSchema(properties){
    if (properties && properties.length!==0){
      return properties.map((item, index)=>{
        return {
          "@type": "Product",
          "name": item.name || "Property",
          "image": item.featured_image?.url || '/assets/images/placeholder-image.jpg',
          "description": item.meta_description || "Beautiful property for rent",
          "sku": item.code_name || `property-${index}`,
          "brand": {
            "@type": "Brand",
            "name": "InstaFarms"
          },
          "offers": {
            "@type": "Offer",
            "url": item.meta_url || `https://instafarms.in/property/${item.slug || index}`,
            "priceCurrency": "INR",
            "priceValidUntil": "2025-12-31",
            "price": item.price_detail?.weekPrice?.[0]?.price || "22000",
            "availability": "https://schema.org/InStock",
            "itemCondition": "https://schema.org/NewCondition"
          },
          "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.6",
              "reviewCount": "15"
          },
          "review": {
              "@type": "Review",
              "author": { "@type": "Person", "name": "Ravi Kumar" },
              "datePublished": "2025-06-15",
              "reviewBody": "Amazing stay, clean pool and great service!",
              "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" }
          },
        }
      })
    }
    return [];
  }

  const pageSchema =  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://instafarms.in/all-property#webpage",
        "url": "https://instafarms.in/all-property",
        "name": "All Farmhouses for Rent – InstaFarms",
        "description":metaDescription,
      },
      {
        "@type": "Organization",
        "@id": "https://instafarms.in#organization",
        "name": "InstaFarms",
        "url": "https://instafarms.in",
        "logo": "https://instafarms.in/logo.webp",
        "sameAs": [
          "https://instagram.com/instafarms",
          "https://facebook.com/instafarms"
        ]
      },
      {
        "@type": "LocalBusiness",
        "name": "InstaFarms – Farmhouse Rental Hub",
        "image": "https://instafarms.in/logo.webp",
        "url": "https://instafarms.in/all-property",
        "telephone": "+91-94038-92058",
        "priceRange": "₹₹₹",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Hyderabad",
          "streetAddress" : "Instafarms Hyderabad, Telangana",
          "addressRegion": "Telangana",
          "postalCode": "500001",
          "addressCountry": "IN"
        },
        "openingHoursSpecification": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": [
            "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
          ],
          "opens": "09:00",
          "closes": "21:00"
        }
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
            "name": "All Properties",
            "item": "https://instafarms.in/all-property"
          }
        ]
      },
      {
        "@type": "ItemList",
        "name": "All Available Farmhouses",
        "itemListOrder": "https://schema.org/ItemListOrderAscending",
        "numberOfItems": 2,
        "itemListElement": visibleItems.map((item, index)=>{
          return {
            "@type": "ListItem",
            "position": index+1,
            "url": `https://instafarms.in/${(item.address_details?.city_name || 'hyderabad').toLowerCase()}/${(item.address_details?.area_name || 'area').toLowerCase()}/${item.slug || `property-${index}`}.html`
          }
        }) || []
      },
      ...itemSchema(visibleItems || []),
    ]
  }

  const applicationSchema = JSON.stringify(pageSchema);;
  
  // console.log("schema : ", pageSchema);
  // console.log("visibleItems : ", visibleItems);



  useEffect(() => {
    if (visibleItems && Array.isArray(visibleItems) && filtereddataList && Array.isArray(filtereddataList)) {
      if (visibleItems.length < filtereddataList.length) {
        setShowPagination(true)
      } else {
        setShowPagination(false)
      }
    } else {
      setShowPagination(false)
    }
  }, [visibleItems, filtereddataList]);

  useEffect(() => {
    if (dataList && Array.isArray(dataList)) {
      setFiltereddataList(dataList)
    } else {
      setFiltereddataList([])
    }
  }, [dataList]);

  const getVisibleItems = async (PageNumber) => {
    if (!filtereddataList || !Array.isArray(filtereddataList)) {
      setVisibleItems([])
      return
    }

    setPage(PageNumber)
    let newPageNumber = PageNumber - 1
    let sliceStart = newPageNumber * perPage;
    let sliceEnd = sliceStart + 1 * perPage;

    let newVisibleItems = filtereddataList.slice(sliceStart, sliceEnd)
    if (PageNumber == 1) {
      setVisibleItems(newVisibleItems)
    } else {
      setVisibleItems(prevItems => Array.isArray(prevItems) ? prevItems.concat(newVisibleItems) : newVisibleItems)
    }
  }

  useEffect(() => {
    getVisibleItems(1)
  }, [filtereddataList]);

  const searchReset = (newListData) => {
    if (newListData && Array.isArray(newListData)) {
      setFiltereddataList(newListData)
    } else {
      setFiltereddataList([])
    }
  }

  useEffect(() => {
    getVisibleItems(1)
  }, [resetData]);

  const sortReset = (sortedData) => {
    if (sortedData && Array.isArray(sortedData)) {
      setFiltereddataList(sortedData)
    } else {
      setFiltereddataList([])
    }
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
        <meta property="og:logo" content="http://instafarms.in/logo.webp"/>
        <meta property="og:type" content="All Properties Page" />
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
          <h2>All Properties</h2>
        </div>
        <div className={'right'}>
        </div>

      </div>}
      <div className={'inner_section'}>
        <div className='breadcrum'>
          <Link scroll={true} aria-label='Home' href={`/`}>Home</Link>/
          <span>All Properties</span>
        </div>
      </div>
      <div className={'inner_section'}>
        <div className='header row_column'>
          <div className='header_left'>
            {!isMobile && <h2>All Properties</h2>}
            <p>Explore Our Serene Farmhouses & Play Areas</p>
          </div>
          <div className='header_right'>
            <SearchProperty searchReset={searchReset} dataList={dataList} />
            <SortProperty sortReset={sortReset} dataList={filtereddataList} orderByOptions={['price', 'rating']} />

          </div>
        </div>
        {visibleItems && Array.isArray(visibleItems) && visibleItems.length > 0 && <div className='properties search'>
          {visibleItems.map((property, index) => {
            const finalSlug = property.slug || `property-${index}`;
            const linkHref = `/${(property.address_details?.city_name || 'hyderabad').toLowerCase()}/${(property.address_details?.area_name || 'area').toLowerCase()}/${finalSlug}.html`;
            
            // Debug log for link generation
            // console.log('🔗 LINK DEBUG:', {
            //   index,
            //   property_name: property.name,
            //   database_slug: property.slug,
            //   final_slug_used: finalSlug,
            //   generated_href: linkHref
            // });
            
            return (<div className='property' key={'all-property-' + index}>
              <Link aria-label={property?.property_code_name} className="link_only" href={linkHref}>
                <PropertyItem property={property} />
              </Link>
            </div>)
          })}
        </div>}

        {showPagination && <div className='load_more' onClick={() => getVisibleItems(page + 1)}>
          Load More
        </div>}

      </div>
    </>
  )
}
