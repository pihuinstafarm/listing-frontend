import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link';
import CollectionItem from 'containers/CollectionItem'
import { settingsServices, collectionsSerivces, metadataServices, faqServices } from 'utils/services'
import SearchProperty from 'containers/SearchFilter/SearchProperty'
import SortProperty from 'containers/SearchFilter/SortProperty'
import FAQSection from 'containers/Faqs'


export async function getStaticProps() {
  let siteSettings = await settingsServices.getSettings();
  let dataList = await collectionsSerivces.getAllCollections();
  let metadata = await metadataServices.getMetadata("fZKeIXFiGIY3OWxOlfWr");
  let faqList = await faqServices.getfaqs("Meh1XjnTziuLDcf0FTJS")

  return { props: { siteSettings, metadata, faqList, dataList }, revalidate: 10 }
}


export default function AllCollections({ siteSettings, metadata, faqList, dataList }) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const router = useRouter()

  const [showPagination, setShowPagination] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(8);
  const [visibleItems, setVisibleItems] = useState([]);
  const [filtereddataList, setFiltereddataList] = useState(dataList);
  const [resetData, setResetData] = useState(false);

  // Metadata
  const siteName = siteSettings.site_title || 'InstaFarms';
  const metaTitle = metadata?.metadata?.metaTitle || "Luxury Farmhouses in Hyderabad | Best for Family & Events";
  const metaKeywords = siteSettings.meta_keywords ? siteSettings.meta_keywords : '';
  const metaDescription = metadata?.metadata?.metaDescription || "Experience the best luxury farmhouses for rent in Hyderabad. Enjoy premium stays with pools, perfect for family events and relaxing retreats. Book now!";
  const metaUrl = metadata?.metadata?.metaUrl || 'https://instafarms.in/all-collections';
  const metaImage = metadata?.metadata?.metaImage || dataList[0].logo;


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

  const pageSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
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
        "name": "InstaFarms – Farmhouse Collections Hub",
        "image": "https://instafarms.in/logo.webp",
        "priceRange": "₹₹₹",
        "url": "https://instafarms.in/all-collections",
        "telephone": "+91-94038-92058",
        "address": {
          "@type": "PostalAddress",
          "streetAddress" : "Instafarms Hyderabad, Telangana",
          "addressLocality": "Hyderabad",
          "addressRegion": "Telangana",
          "postalCode": "500001",
          "addressCountry": "IN"
        },
        "openingHoursSpecification": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": [
            "Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"
          ],
          "opens": "09:00",
          "closes": "21:00"
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": faqsSchemaList(faqList.faqs || []) || []
      }
    ]
  }

  // console.log("faqList : " ,faqList)
  // console.log("schema : ", pageSchema);
  const applicationSchema = JSON.stringify(pageSchema);


  useEffect(() => {
    if (visibleItems.length < filtereddataList.length) {
      setShowPagination(true)
    } else {
      setShowPagination(false)
    }
  }, [visibleItems]);

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
        <meta property="og:type" content="All Collection Page" />
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
          <h2>All Collections</h2>
        </div>
        <div className={'right'}>
        </div>

      </div>}

      <div className={'inner_section'}>
        <div className='breadcrum'>
          <Link scroll={true} aria-label='Home' href={`/`}>Home</Link>/
          <span>All Collections</span>
        </div>
      </div>


      <div className={'inner_section'}>
        <div className='header row_column'>
          <div className='header_left'>
            {!isMobile && <h2>All Collections</h2>}
            <p>Explore Our Serene Farmhouses & Play Areas</p>
          </div>
          <div className='header_right'>
            <SearchProperty searchReset={searchReset} dataList={dataList} />
            <SortProperty sortReset={sortReset} dataList={filtereddataList} orderByOptions={[]} />

          </div>
        </div>
        {visibleItems && <div className='properties search'>
          {visibleItems.map((collection, index) => (
            <div className='property' key={'all-collection-' + index}>
              <Link scroll={true} aria-label={'View ' + collection.name} className="link_only" href={`/collections/${collection.slug}`}>
                <CollectionItem collection={collection} />
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
