import React, { useState, useEffect, useRef } from 'react'
import { CircularLoader, isLoggedIn } from 'utils/components'

import { Col, Container, Row } from 'react-bootstrap'
import { TextField, Button } from 'utils/components'
import styles from './my-profile.module.scss'
import { enquiryServices } from 'utils/services'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link';

function MyEnquiries() {
    const router = useRouter()
    const [loading, setloading] = useState(true)
    const [isSubmitted, setisSubmitted] = useState(false)
    const [dataList, setDataList] = useState([])  // Fix: Initialize as empty array, not true
    const [error, setError] = useState(null)  // Add error state

    const metaTitle = 'My Enquiries - Insta Farms'
    const metaDescription = ''
    const metaUrl = 'https://instafarms.in/my-enquiries';
    const metaKeywords = '';
    const metaImage = ''
    const siteName = 'InstaFarms'

    let BreadcrumItems = [{
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": 'https://instafarms.in'
    }]

    let OrganizationSchema = {
        "@context": "http://schema.org",
        "@type": "Organization",
        "name": "InstaFarms",
        "url": 'https://instafarms.in'

    }

    let WebPageSchema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": metaTitle,
        "url": metaUrl
    }

    let BreadcrumSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": BreadcrumItems
    }


    const schemaOrgArray = [OrganizationSchema, WebPageSchema, BreadcrumSchema];
    let schemaString = JSON.stringify(schemaOrgArray);
    const applicationSchema = schemaString

    useEffect(() => {
        const fetchEnquiries = async () => {
            const isAuthUser = isLoggedIn()
            // console.log('=== MY ENQUIRIES PAGE DEBUG ===');
            // console.log('isAuthUser:', isAuthUser);
            // console.log('localStorage documentId:', localStorage.getItem('documentId'));
            // console.log('localStorage token:', localStorage.getItem('token') ? 'Present' : 'Missing');
            
            if (!isAuthUser) {
                // console.log('User not authenticated, redirecting to home');
                router.push('/');
                return;
            }
            
            // Check if we have the required user data
            const documentId = localStorage.getItem('documentId');
            const token = localStorage.getItem('token');
            
            if (!documentId || !token) {
                // console.log('Missing required user data, redirecting to home');
                setError('User session incomplete. Please login again.');
                setloading(false);
                return;
            }
            
            // console.log('User authenticated, proceeding to fetch enquiries');
            
            // First, test if the API endpoint is accessible
            try {
                // console.log('Testing API endpoint accessibility...');
                const healthCheck = await fetch(process.env.NEXT_PUBLIC_DEV_BASE_URL + '/api/enquiry/myenquiry', {
                    method: 'OPTIONS'
                });
                // console.log('API endpoint health check status:', healthCheck.status);
            } catch (healthError) {
                // console.log('API endpoint health check failed:', healthError.message);
            }
            
            // Add timeout to prevent infinite loading
            const timeoutId = setTimeout(() => {
                // console.log('Enquiry fetch timeout - forcing loading to false');
                setloading(false);
                setError('Request timed out. Please try again.');
                setDataList([]);
            }, 30000); // 30 second timeout
            
            let payload = {
                pageNumber: 1,
                totalPages: 0,
                LastDocument: false,
                moveTo: false,
                perPage: 5,
                orderBy: 'created_at',
                searchBy: '',
                searchKey: '',
                searchByUserId: documentId
            }
            
            // console.log('Fetching enquiries with payload:', payload);
            // console.log('User document ID:', documentId);
            
            try {
                const enquiryres = await enquiryServices.getAll(payload);
                clearTimeout(timeoutId); // Clear timeout on success
                // console.log('Enquiry API response:', enquiryres);
                setloading(false)
                setDataList(enquiryres || [])  // Ensure we always set an array
            } catch (err) {
                clearTimeout(timeoutId); // Clear timeout on error
                console.error('Error fetching enquiries:', err);
                setError(err.message || 'Failed to fetch enquiries');
                setloading(false);
                setDataList([]);  // Set empty array on error
            }
        };
        
        fetchEnquiries();
        
        // console.log('=== END MY ENQUIRIES PAGE DEBUG ===');
    }, [])


    const getFormattedCurrency = (price) => {
        return '₹' + new Intl.NumberFormat().format(parseInt(price))
    }


    const getPropertyUrl = (url) => {
        return url
            .toLowerCase() // Convert to lowercase
            .replace(/%20| /g, '-') // Replace spaces and %20 with hyphens
            .replace(/[^a-z0-9/-]+/g, '') // Remove special characters except hyphens and slashes
            .replace(/\/+/g, '/') // Ensure single slashes
            .replace(/-+/g, '-') // Ensure single hyphens
            .replace(/\/-|-\/|^-|-$/g, '') + '.html';
    }


    if (loading) {
        return (
            <div className="full_screen_loading flex justify-center items-center h-[75%] w-full">
                <CircularLoader />
                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                    <p>Loading your enquiries...</p>
                    <p style={{ fontSize: '12px', color: '#666' }}>This may take a few moments</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <Container className="page_content contact_us">
                <div className={'inner_section'}>
                    <div className='breadcrum'>
                        <Link scroll={true} aria-label='Home' href={`/`}>Home</Link>/
                        <span>My Enquiries</span>
                    </div>
                </div>
                <section className='inner_section'>
                    <h1>My Enquiries</h1>
                    <div style={{ 
                        background: '#fff3cd', 
                        border: '1px solid #ffeaa7', 
                        borderRadius: '4px', 
                        padding: '20px', 
                        margin: '20px 0',
                        textAlign: 'center'
                    }}>
                        <h3 style={{ color: '#856404', marginBottom: '10px' }}>Error Loading Enquiries</h3>
                        <p style={{ color: '#856404', marginBottom: '15px' }}>{error}</p>
                        <button 
                            onClick={() => window.location.reload()} 
                            style={{
                                background: '#007bff',
                                color: 'white',
                                border: 'none',
                                padding: '10px 20px',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Try Again
                        </button>
                    </div>
                </section>
            </Container>
        )
    }

    return (<>
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
            <meta property="og:type" content="My Enquiries Page" />
            <meta property="og:site_name" content={siteName} />
            <meta property="og:locale" content="en_US" />

            {/* Twitter Tags */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={metaTitle} />
            <meta name="twitter:description" content={metaDescription} />
            <meta name="twitter:image" content={metaImage} />
            <meta name="twitter:url" content={metaUrl} />
            <meta name="twitter:site" content="@instafarms"/>

            <meta itemProp="name" content={metaTitle} />
            <meta itemProp="description" content={metaDescription} />
            <meta itemProp="image" content={metaImage} />
        </Head>

        <Container className="page_content contact_us">
            <div className={'inner_section'}>
                <div className='breadcrum'>
                    <Link scroll={true} aria-label='Home' href={`/`}>Home</Link>/
                    <span>My Enquiries</span>
                </div>
            </div>

            <section className='inner_section'>

           
            <h1>My Enquiries</h1>
            <section className='table_section'>
            <table className={styles.table}>
            <thead>
                <tr>
                <th >Property</th>
                <th >Check-in </th>
                <th >Check-out</th>
                <th >Amount</th>
                <th >Guests</th>
                </tr>
            </thead>
            {dataList && dataList.length>0 &&<tbody>
            {dataList.map((item) =>
           <tr>
             <td>
            {item.property ?<Link aria-label={item.property?.property_code_name} className={styles.link+" link_only"}  href={getPropertyUrl(`/${item.property.address_details.city_name}/${item.property.address_details.area_name}/${item.property.type}/${item.property.slug}`)}>
             {item.property?.property_code_name}</Link>:<>{item.property_name}</>}
             </td>
            <td >{item.booking_start_date}</td>
            <td >{item.booking_end_date}</td>
            <td >{getFormattedCurrency(item.booking_amount)}</td>
            <td >{item.booking_guests.adult} Adult {item.booking_guests.children>0 &&<>+ {item.booking_guests.children} Children</>} {item.booking_guests.infant>0 &&<>+ {item.booking_guests.infant} Infant</>}</td>
            </tr>
            )}
             </tbody>}
            </table>
            </section>


            </section>
        </Container>
    </>
    )
}

export default MyEnquiries
