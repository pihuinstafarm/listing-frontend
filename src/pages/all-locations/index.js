import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link';
import { settingsServices, locationsSerivces, metadataServices, faqServices } from 'utils/services'
import SearchProperty from 'containers/SearchFilter/SearchProperty'
import SortProperty from 'containers/SearchFilter/SortProperty'
import styles from './index.module.scss'
import FAQSection from 'containers/Faqs'


export async function getStaticProps() {
  let siteSettings = await settingsServices.getSettings();
  let dataList = await locationsSerivces.getAllArea();
  let metadata = await metadataServices.getMetadata("pJ8j0Dyoyl4qrvj2DU6U");
  let faqList = await faqServices.getfaqs("pwuKxHlEAcEYIeV7Y7qE")

  return { props: { siteSettings, metadata, faqList, dataList }, revalidate: 10 }
}

export default function AllLocations({ siteSettings, metadata, faqList, dataList }) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const router = useRouter()
  const [showPagination, setShowPagination] = useState(false);
  const [page, setPage] = useState(1);
  const [resetData, setResetData] = useState(false);
  const [perPage, setPerPage] = useState(12);
  const [visibleItems, setVisibleItems] = useState([]);
  const [filtereddataList, setFiltereddataList] = useState(dataList);

  // Metadata
  const siteName = siteSettings.site_title ? siteSettings.site_title : 'InstaFarms';
  const metaTitle = metadata?.metadata?.metaTitle || 'All Locations - ' + siteName;
  const metaKeywords = siteSettings.meta_keywords ? siteSettings.meta_keywords : '';
  const metaDescription = metadata?.metadata?.metaDescription || 'All Locations at Insta Farms';
  const metaUrl = metadata?.metadata?.metaUrl || 'https://instafarms.in/all-locations';
  const metaImage = metadata?.metadata?.metaImage || '';


  function faqsSchemaList(faqList){
    if (faqList.length!==0){
      return faqList.map((item, index)=>{
        return {
            "@type": "Question",
            "name": item.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": item.answer
            }
          }
      })
    }
    return [];
  }

  const formatCityName = (city) => {
    return city.replaceAll(" ", "").toLowerCase();
  }

  function itemSchema(items){
    if (items.length!==0){
      return items.map((item, index)=>{
        return {
          "@type": "ListItem",
          "position": index+1,
          "url": `https://instafarms.in/${item.state_slug}/${formatCityName(item.city_name)}/${item.slug}`
        }
      })
    }
    return []
  }


  const pageSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://instafarms.in/all-locations#webpage",
        "url": "https://instafarms.in/all-locations",
        "name": "All Locations - InstaFarms",
        "description": metaDescription,
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
            "name": "All Locations",
            "item": "https://instafarms.in/all-locations"
          }
        ]
      },
      {
        "@type": "ItemList",
        "name": "InstaFarms Locations",
        "itemListOrder": "https://schema.org/ItemListOrderAscending",
        "numberOfItems": visibleItems.length,
        "itemListElement": itemSchema(visibleItems || []),
      },
      {
        "@type": "FAQPage",
        "mainEntity": faqsSchemaList(faqList.faqs || []) || []
      }
    ]
  }


  // console.log("faqList : ", faqList);
  // console.log("visibleItems : ", visibleItems);
  // console.log("schema : ", pageSchema);

  const applicationSchema = JSON.stringify(pageSchema);


  useEffect(() => {
    if (visibleItems.length < filtereddataList.length) {

      setShowPagination(true)
    } else {
      setShowPagination(false)
    }
  }, [visibleItems]);

  useEffect(() => {
    if (dataList) {
      setFiltereddataList(dataList)
    }
  }, [dataList]);

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
    getVisibleItems(1)
  }, [filtereddataList]);





  const searchReset = (newListData) => {
    setFiltereddataList(newListData)

  }

  useEffect(() => {
    getVisibleItems(1)
  }, [resetData]);
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
        <meta property="og:logo" content="http://instafarms.in/logo.webp"/>
        <meta property="og:type" content="All Locations Page" />
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
          <h2>All Locations</h2>
        </div>
        <div className={'right'}>
        </div>

      </div>}

      <div className={'inner_section'}>
        <div className='breadcrum'>
          <Link scroll={true} aria-label='Home' href={`/`}>Home</Link>/
          <span>All Locations</span>
        </div>
      </div>

      <div className={'inner_section'}>
        <div className='header row_column'>
          <div className='header_left'>
            {!isMobile && <h2>All Locations</h2>}
            <p>Explore Our Serene Farmhouses & Play Areas</p>
          </div>
          <div className='header_right'>
            <SearchProperty searchReset={searchReset} dataList={dataList} />
            <SortProperty sortReset={sortReset} dataList={filtereddataList} orderByOptions={['name']} />
          </div>
        </div>
        {visibleItems && <div className={styles.locations}>
          {visibleItems.map((location, index) => (
            <div className={styles.locationItem} key={'all-locations-' + location.slug + '_' + index}>
              <Link scroll={true} aria-label={location.name} className="link_only" href={`/${location.state_slug}/${formatCityName(location.city_name)}/${location.slug}`}>
                <p>{location.name}</p>
              </Link>

            </div>
          ))}
        </div>}

        {showPagination && <div className='load_more' onClick={() => getVisibleItems(page + 1)}>
          Load More
        </div>}

        <FAQSection faqData={faqList.faqs || []} />
      </div>
    </>
  )
}
