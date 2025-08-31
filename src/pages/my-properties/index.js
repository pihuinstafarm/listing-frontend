import React, { useState, useEffect, useRef } from 'react'
import { CircularLoader } from 'utils/components'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useRouter } from 'next/router'
import PropertyItem from 'containers/PropertyItem'
import SearchProperty from 'containers/SearchFilter/SearchProperty'
import SortProperty from 'containers/SearchFilter/SortProperty'
import { Modal } from 'components'
import styles from './my-profile.module.scss'
import { Input } from '@mui/material'
import InputAdornment from '@mui/material/InputAdornment';

import {propertiesServices,locationsSerivces} from 'utils/services'

function MyProperty() {
    const router = useRouter()
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))
    const [showPagination, setShowPagination] = useState(false);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(8);
    const [data, setData] = useState([]);
    const [visibleItems, setVisibleItems] = useState([]);
    const [filtereddataList, setFiltereddataList] = useState([]);
    const [resetData, setResetData] = useState(true);
    const [loading, setLoading] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [phone, setPhone] = useState('')
    const [otp, setOtp] = useState('')

    const metaTitle='My Properties - Insta Farms'
    const metaDescription=''
    const metaUrl='https://instafarms.in/my-properties';
    const metaKeywords = '';
    const metaImage=''
    const siteName='InstaFarms'

    let BreadcrumItems=[{
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": 'https://instafarms.in'
    }]
    
    let OrganizationSchema={
    "@context": "http://schema.org",
    "@type": "Organization",
    "name": "InstaFarms",
    "url":'https://instafarms.in'

    }

    let WebPageSchema={
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": metaTitle,
    "url": metaUrl
    }

    let BreadcrumSchema={
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": BreadcrumItems
    }


    const schemaOrgArray = [ OrganizationSchema,WebPageSchema,BreadcrumSchema ];
    let schemaString = JSON.stringify(schemaOrgArray);
    const applicationSchema=schemaString

    const getPropertyUrl=(url)=>{
      return url
      .toLowerCase() // Convert to lowercase
      .replace(/%20| /g, '-') // Replace spaces and %20 with hyphens
      .replace(/[^a-z0-9/-]+/g, '') // Remove special characters except hyphens and slashes
      .replace(/\/+/g, '/') // Ensure single slashes
      .replace(/-+/g, '-') // Ensure single hyphens
      .replace(/\/-|-\/|^-|-$/g, '')+'.html'; 
    }

    useEffect(() => {
      const phone = localStorage.getItem('phone');
        if (phone) {
          setPhone(phone)
          setShowLoginModal(true);
        } else {
          setShowLoginModal(true);
        }
          
    }, [])

    const getOtp=async ()=>{
      localStorage.setItem('phone', phone)
      fetchData()
    } 

    const closeModal=()=>{
      setShowLoginModal(false)
    } 
    const fetchData=async()=>{
      let PropertiesList =await propertiesServices.getAllByOwner(phone);
      setShowLoginModal(false)
      
      if(PropertiesList && PropertiesList.length>0){
      setData(PropertiesList)
      }
      
    }
     useEffect(() => {
             if(data.length){
             setFiltereddataList(data)
             }
         }, [data])
   

    useEffect(() => {
      if(filtereddataList && visibleItems){  
      if(visibleItems.length < filtereddataList.length){
        setShowPagination(true)
      }else{
        setShowPagination(false)
      }
    }
    }, [visibleItems,filtereddataList]);

    useEffect(() => {
        getVisibleItems(1)
      }, [filtereddataList]);


    const getVisibleItems=async (PageNumber)=>{
      if(filtereddataList && filtereddataList.length>0){
      setPage(PageNumber)
      let newPageNumber = PageNumber-1
      let sliceStart = newPageNumber * perPage;
      let sliceEnd = sliceStart + 1 *perPage;
      let newVisibleItems = filtereddataList.slice(sliceStart,sliceEnd)
      if(PageNumber == 1){
        setVisibleItems(newVisibleItems)
      }else{
        setVisibleItems(visibleItems.concat(newVisibleItems))
      }
    }else{
      setVisibleItems()
    }
      
      
     }

     
  
    const searchReset=(newListData)=>{
      
      setFiltereddataList(newListData)
      setResetData(!resetData)
    }
  
    useEffect(() => {
      getVisibleItems(1)
    }, [resetData]);
    
    const sortReset=(sortedData)=>{
      setFiltereddataList(sortedData)
      setResetData(!resetData)
    }
    
    
    if (loading) {
        return (
            <div className="full_screen_loading flex justify-center items-center h-[75%] w-full">
                <CircularLoader />
            </div>
        )
    }

    
    return (
        <>
        <script
       type="application/ld+json"
       dangerouslySetInnerHTML={{ __html: applicationSchema }}
     />
        <Head>
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
      <meta property="og:type" content="My Properties Page" />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />
      <meta name="twitter:url" content={metaUrl} />
      <meta name="twitter:site" content="@instafarms"/>

      <meta itemProp="name"  content={metaTitle}  />
      <meta itemProp="description" content={metaDescription}/>
      <meta itemProp="image" content={metaImage} />

      </Head>
        {isMobile && <div className={'customHeader'} >
        <div className={'left'} onClick={()=>router.push('/')}>
        <Image alt="Insta Farms"  width={30} height={30} src={'/assets/images/close_icon.webp'} />
        </div>
        <div className={'center'}>
        <h2>My Properties</h2>
        </div>
        <div className={'right'}>
        </div>
        
      </div>}
      <div className={'inner_section'}>
            <div className='breadcrum'>
            <Link  scroll={true}  aria-label='Home' href={`/`}>Home</Link>/
            <span>My Properties</span>
          </div>
      </div>
      
      {showLoginModal &&<Modal classname={styles.bookingWrapper} onClose={closeModal} isOpen={showLoginModal}>
                    <div className={styles.header}>
                        <h1>Please enter your phone number</h1>
                        <h2>Linked with Properties</h2>
                    </div>
      
                    <div className={styles.content}>
                    <Input 
                    placeholder="Phone Number"  
                    className={styles.textInput}  
                    value={phone}
                    onChange={(e) =>setPhone(e.target.value)}
                    startAdornment={<InputAdornment position="start">+91</InputAdornment>}

                      
                    inputProps={{
                      maxLength: 10, // Limit to 10 characters
                      type: 'tel',  // Type of input, could also be 'number', 'email', etc.
                    }}
                   />
                    <div className={styles.row_btns}>
                    <button className={' solidbtn'}  aria-label='Yes Cancel' onClick={()=>getOtp()}>
                                  Submit
                    </button>
                    <button className={' plainbtn'}  aria-label='Close' onClick={()=>closeModal()}>
                                  Cancel
                    </button>
                    </div>
                    </div>
      
                 </Modal>}

      <div className={'inner_section'}>
      <div className='header row_column'>
      <div className='header_left'>
      {!isMobile &&<h2>My Properties linked with {phone}</h2>}
      </div>
      <div className='header_right'>
          
          <SearchProperty searchReset={searchReset} dataList={data}/>
          <SortProperty sortReset={sortReset} dataList={filtereddataList} orderByOptions={[]}/>
      </div>
      </div>

      {visibleItems  &&<div className='properties search'>
        {visibleItems.map((property, index) => (<>
                    <div className='property'  key={'favorite-slide-' + index}>
                    <Link aria-label={property?.property_code_name} className="link_only" target="_blank" href={getPropertyUrl(`/${property.address_details.city_name}/${property.address_details.area_name}/${property.type}/${property.slug}`)}>
                      <PropertyItem property={property}/>
                    </Link>
                   </div>
        </>))}

        {showPagination &&<div className='load_more' onClick={()=>getVisibleItems(page+1)}>
          Load More
        </div>}


        
        </div>}
       </div>
        </>
    )

    
}

export default MyProperty
