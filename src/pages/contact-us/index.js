import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import styles from './index.module.scss'

import { Modal } from 'components'
import ContactUs from '../../containers/header/contactUs'
import RegisterEvent from '../../containers/header/registerEvent'
import RegisterFarm from '../../containers/header/registerFarm'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { collectionsSerivces, metadataServices, settingsServices } from 'utils/services'


export async function getStaticProps() {
    let siteSettings = await settingsServices.getSettings();
    let dataList = await collectionsSerivces.getAllCollections();
    let metadata = await metadataServices.getMetadata("UD0jom7xsUP507Q5nLL9");

    return { props: { siteSettings, metadata, dataList }, revalidate: 10 }
}

export default function ContactUsPage({ siteSettings, metadata, dataList }) {

    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))
    const [showContactUs, setShowContactUs] = useState(false)
    const [showRegisterEvent, setShowRegisterEvent] = useState(false)
    const [showRegisterFarm, setShowRegisterFarm] = useState(false)
    const [callSupportModal, setCallSupportModal] = useState(false)

    // Metadata
    const siteName = siteSettings.site_title || 'InstaFarms'
    const metaTitle = metadata?.metadata?.metaTitle || 'Contact InstaFarms | Plan Your Perfect Farmhouses Stay'
    const metaDescription = metadata?.metadata?.metaDescription || "Reach out to InstaFarms for hassle-free farmhouses bookings, event planning, and memorable stays. Let's make your next getaway unforgettable!"
    const metaKeywords = siteSettings.meta_keywords ? siteSettings.meta_keywords : '';
    const metaUrl = metadata?.metadata?.metaUrl || 'https://instafarms.in/contact-us'
    const metaImage = metadata?.metadata?.metaImage || dataList[0].logo;

    const closeCallModal = () => {
        setCallSupportModal(false)
    }
    const openCallModal = () => {
        setCallSupportModal(true)
    }

    const pageSchema =  {
        "@context": "https://schema.org",
        "@graph": [
            {
            "@type": "Organization",
            "@id": "https://instafarms.in#organization",
            "name": "InstaFarms",
            "url": "https://instafarms.in",
            "logo": "https://instafarms.in/logo.png",
            "sameAs": [
                "https://instagram.com/instafarms",
                "https://facebook.com/instafarms"
            ],
            "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "Customer Support",
                "telephone": "+91-9403892058",
                "email": "support@instafarms.in",
                "areaServed": "IN",
                "availableLanguage": ["English"]
            }
            },
            {
            "@type": "LocalBusiness",
            "name": "InstaFarms – Farmhouse Rentals",
            "url": "https://instafarms.in/contact-us",
            "image": "https://instafarms.in/logo.webp",
            "priceRange": "₹₹₹",
            "telephone": "+91-9403892058",
            "email": "support@instafarms.in",
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
                "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
                ],
                "opens": "09:00",
                "closes": "21:00"
            }
            },
            {
            "@type": "WebPage",
            "@id": "https://instafarms.in/contact-us#webpage",
            "url": "https://instafarms.in/contact-us",
            "name": "Contact InstaFarms – Customer Support",
            "description": "Need help booking or have a question? Contact InstaFarms customer support by phone, email, or chat."
            }
        ]
    }
    const applicationSchema = JSON.stringify(pageSchema);

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
            <meta property="og:type" content="Contact Us Page" />
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
        <section className='inner_section'>
            <div className={styles.contact_section}>
                <div className={styles.section_left}>
                    <h1>Connect with us!</h1>
                    <h4>We're always here to help, feel free to reach out and we will get back to you.</h4>
                    {siteSettings.support_phone && <>
                        {isMobile ? <a ttile="Call Us" href={`tel:${siteSettings.support_phone ? siteSettings.support_phone : '8019127474'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
                                <path d="M6.62 10.79a15.91 15.91 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1-.26 11.36 11.36 0 0 0 3.57.57 1 1 0 0 1 1 1v3.59a1 1 0 0 1-1 1A19 19 0 0 1 3 4a1 1 0 0 1 1-1H7.5a1 1 0 0 1 1 1 11.36 11.36 0 0 0 .57 3.57 1 1 0 0 1-.26 1Z" />
                            </svg>
                            +91{siteSettings.support_phone}
                        </a> : <p onClick={(e) => openCallModal()} >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" >
                                <path d="M6.62 10.79a15.91 15.91 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1-.26 11.36 11.36 0 0 0 3.57.57 1 1 0 0 1 1 1v3.59a1 1 0 0 1-1 1A19 19 0 0 1 3 4a1 1 0 0 1 1-1H7.5a1 1 0 0 1 1 1 11.36 11.36 0 0 0 .57 3.57 1 1 0 0 1-.26 1Z" />
                            </svg>
                            +91{siteSettings.support_phone}
                        </p>}
                    </>}

                    {siteSettings.support_email && <a href={'mailto:' + siteSettings.support_email}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
                            <polyline points="22,6 12,13 2,6" />
                        </svg>
                        {siteSettings.support_email}
                    </a>}
                </div>
                <div className={styles.section_right}>
                    <h2>Choose your reason for connecting</h2>
                    <div className={styles.section_right_grid}>
                        <div className={styles.grid_box} onClick={(e) => setShowRegisterEvent(true)}>
                            <svg width="59" height="42" viewBox="0 0 59 42" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M50.2593 40.9996H5.91626C4.61298 40.9978 3.36329 40.4794 2.44195 39.5581C1.52016 38.6363 1.0018 37.3866 1 36.0833V10.303C1.00176 8.99925 1.52016 7.75001 2.44195 6.82822C3.36331 5.90643 4.61298 5.38807 5.91626 5.38672H30.0335C30.5765 5.38672 31.0167 5.82699 31.0167 6.36997C31.0167 6.91295 30.5765 7.35322 30.0335 7.35322H5.91626C5.13449 7.3541 4.3843 7.66488 3.83166 8.21796C3.27857 8.77104 2.96736 9.5208 2.96648 10.303V36.0833C2.96736 36.8656 3.27857 37.6153 3.83166 38.168C4.3843 38.721 5.13449 39.0323 5.91626 39.0331H50.2593C51.0415 39.0322 51.7912 38.721 52.3443 38.168C52.8974 37.6153 53.2082 36.8656 53.2091 36.0833V27.4711C53.2091 26.9281 53.6493 26.4878 54.1923 26.4878C54.7353 26.4878 55.1756 26.9281 55.1756 27.4711V36.0833C55.1743 37.3866 54.6559 38.6363 53.7341 39.5581C52.8123 40.4795 51.563 40.9978 50.2593 40.9996Z" fill="#666666" stroke="#666666" stroke-width="0.8"></path><path d="M46.4343 23.5825C43.4398 23.5825 40.5677 22.3929 38.4502 20.2754C36.3326 18.1578 35.1431 15.2858 35.1431 12.2912C35.1431 9.29675 36.3326 6.42463 38.4502 4.3071C40.5677 2.18957 43.4397 1 46.4343 1C49.4289 1 52.3009 2.18957 54.4184 4.3071C56.536 6.42463 57.7255 9.29663 57.7255 12.2912C57.722 15.2849 56.5316 18.1548 54.4149 20.2714C52.2979 22.3881 49.428 23.579 46.4343 23.5825ZM46.4343 2.96673C43.9612 2.96673 41.5896 3.94911 39.8408 5.69793C38.0919 7.44675 37.1096 9.81837 37.1096 12.2915C37.1096 14.7645 38.0919 17.1361 39.8408 18.885C41.5896 20.6338 43.9612 21.6162 46.4343 21.6162C48.9074 21.6162 51.279 20.6338 53.0278 18.885C54.7767 17.1362 55.759 14.7645 55.759 12.2915C55.7564 9.81927 54.7731 7.4489 53.0248 5.70107C51.2768 3.95268 48.9066 2.96943 46.4344 2.96684L46.4343 2.96673Z" fill="#666666" stroke="#666666" stroke-width="0.8"></path><path d="M51.445 12.8493H41.4232C40.8802 12.8493 40.4399 12.409 40.4399 11.8661C40.4399 11.3226 40.8802 10.8828 41.4232 10.8828H51.445C51.9879 10.8828 52.4282 11.3226 52.4282 11.8661C52.4282 12.409 51.9879 12.8493 51.445 12.8493Z" fill="#666666" stroke="#666666" stroke-width="0.8"></path><path d="M46.4339 17.8594C46.1732 17.8594 45.923 17.7558 45.7386 17.5714C45.5543 17.3871 45.4507 17.1368 45.4507 16.8761V6.85435C45.4507 6.31137 45.891 5.87109 46.4339 5.87109C46.9769 5.87109 47.4172 6.31137 47.4172 6.85435V16.8761C47.4176 17.1368 47.314 17.3871 47.1297 17.5714C46.9449 17.7558 46.6947 17.8594 46.4339 17.8594Z" fill="#666666" stroke="#666666" stroke-width="0.8"></path></svg>
                            <p>Planning for a Event?</p>
                        </div>

                        <div className={styles.grid_box} onClick={(e) => setShowRegisterFarm(true)}>
                            <svg width="49" height="40" viewBox="0 0 49 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M25.1932 0.448224C24.9102 0.161495 24.5244 0 24.1215 0C23.7185 0 23.3327 0.161495 23.0497 0.448224L0.444222 23.0595C0.0610452 23.4423 -0.0884874 24.0004 0.0516952 24.5234C0.191878 25.0464 0.600482 25.455 1.12345 25.5951C1.64682 25.7353 2.20496 25.5858 2.58777 25.203L6.87526 20.9155V38.4938C6.87526 38.8934 7.03376 39.2763 7.31638 39.5589C7.59862 39.8411 7.9818 40 8.38105 40H39.8724C40.2716 40 40.6548 39.8411 40.937 39.5589C41.2193 39.2763 41.3782 38.8935 41.3782 38.4938V20.905L45.6657 25.1925C46.0485 25.5756 46.6066 25.7252 47.1296 25.585C47.653 25.4448 48.0616 25.0362 48.2017 24.5132C48.3419 23.9899 48.192 23.4317 47.8092 23.0489L25.1932 0.448224ZM38.3607 36.9877H9.88109V17.8868L24.1204 3.6475L38.3597 17.8868L38.3607 36.9877Z" fill="#666666"></path><path d="M22.6161 19.5331V23.2206H18.9234C18.3854 23.2206 17.8883 23.5073 17.6191 23.9735C17.3503 24.4393 17.3503 25.0135 17.6191 25.4792C17.8882 25.9454 18.3854 26.2321 18.9234 26.2321H22.6161V29.9248C22.6161 30.4628 22.9028 30.9599 23.369 31.2292C23.8348 31.4979 24.409 31.4979 24.8747 31.2292C25.3409 30.96 25.6276 30.4628 25.6276 29.9248V26.2378H29.3204C29.8583 26.2378 30.3554 25.9507 30.6247 25.4849C30.8934 25.0187 30.8934 24.4449 30.6247 23.9787C30.3555 23.5129 29.8583 23.2258 29.3204 23.2258H25.6276V19.5331C25.6276 18.9952 25.3409 18.498 24.8747 18.2292C24.4089 17.9601 23.8348 17.9601 23.369 18.2292C22.9028 18.498 22.6161 18.9952 22.6161 19.5331Z" fill="#666666"></path></svg>
                            <p>I want to list a farm</p>
                        </div>
                        <div className={styles.grid_box + ' ' + styles.grid_box_large} onClick={(e) => setShowContactUs(true)}>
                            <svg width="59" height="42" viewBox="0 0 59 42" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M50.2593 40.9996H5.91626C4.61298 40.9978 3.36329 40.4794 2.44195 39.5581C1.52016 38.6363 1.0018 37.3866 1 36.0833V10.303C1.00176 8.99925 1.52016 7.75001 2.44195 6.82822C3.36331 5.90643 4.61298 5.38807 5.91626 5.38672H30.0335C30.5765 5.38672 31.0167 5.82699 31.0167 6.36997C31.0167 6.91295 30.5765 7.35322 30.0335 7.35322H5.91626C5.13449 7.3541 4.3843 7.66488 3.83166 8.21796C3.27857 8.77104 2.96736 9.5208 2.96648 10.303V36.0833C2.96736 36.8656 3.27857 37.6153 3.83166 38.168C4.3843 38.721 5.13449 39.0323 5.91626 39.0331H50.2593C51.0415 39.0322 51.7912 38.721 52.3443 38.168C52.8974 37.6153 53.2082 36.8656 53.2091 36.0833V27.4711C53.2091 26.9281 53.6493 26.4878 54.1923 26.4878C54.7353 26.4878 55.1756 26.9281 55.1756 27.4711V36.0833C55.1743 37.3866 54.6559 38.6363 53.7341 39.5581C52.8123 40.4795 51.563 40.9978 50.2593 40.9996Z" fill="#666666" stroke="#666666" stroke-width="0.8"></path><path d="M46.4343 23.5825C43.4398 23.5825 40.5677 22.3929 38.4502 20.2754C36.3326 18.1578 35.1431 15.2858 35.1431 12.2912C35.1431 9.29675 36.3326 6.42463 38.4502 4.3071C40.5677 2.18957 43.4397 1 46.4343 1C49.4289 1 52.3009 2.18957 54.4184 4.3071C56.536 6.42463 57.7255 9.29663 57.7255 12.2912C57.722 15.2849 56.5316 18.1548 54.4149 20.2714C52.2979 22.3881 49.428 23.579 46.4343 23.5825ZM46.4343 2.96673C43.9612 2.96673 41.5896 3.94911 39.8408 5.69793C38.0919 7.44675 37.1096 9.81837 37.1096 12.2915C37.1096 14.7645 38.0919 17.1361 39.8408 18.885C41.5896 20.6338 43.9612 21.6162 46.4343 21.6162C48.9074 21.6162 51.279 20.6338 53.0278 18.885C54.7767 17.1362 55.759 14.7645 55.759 12.2915C55.7564 9.81927 54.7731 7.4489 53.0248 5.70107C51.2768 3.95268 48.9066 2.96943 46.4344 2.96684L46.4343 2.96673Z" fill="#666666" stroke="#666666" stroke-width="0.8"></path><path d="M51.445 12.8493H41.4232C40.8802 12.8493 40.4399 12.409 40.4399 11.8661C40.4399 11.3226 40.8802 10.8828 41.4232 10.8828H51.445C51.9879 10.8828 52.4282 11.3226 52.4282 11.8661C52.4282 12.409 51.9879 12.8493 51.445 12.8493Z" fill="#666666" stroke="#666666" stroke-width="0.8"></path><path d="M46.4339 17.8594C46.1732 17.8594 45.923 17.7558 45.7386 17.5714C45.5543 17.3871 45.4507 17.1368 45.4507 16.8761V6.85435C45.4507 6.31137 45.891 5.87109 46.4339 5.87109C46.9769 5.87109 47.4172 6.31137 47.4172 6.85435V16.8761C47.4176 17.1368 47.314 17.3871 47.1297 17.5714C46.9449 17.7558 46.6947 17.8594 46.4339 17.8594Z" fill="#666666" stroke="#666666" stroke-width="0.8"></path></svg>
                            <p>I have a query regarding my current/past booking</p>
                        </div>

                    </div>
                </div>
            </div>
        </section>


        {showContactUs && <ContactUs
            closeLogin={() => setShowContactUs(false)}
            isOpen={showContactUs}
        />}
        {showRegisterEvent && <RegisterEvent
            closeLogin={() => setShowRegisterEvent(false)}
            isOpen={showRegisterEvent}
        />}
        {showRegisterFarm && <RegisterFarm
            closeLogin={() => setShowRegisterFarm(false)}
            isOpen={showRegisterFarm}
        />}
        {callSupportModal && <Modal classname={styles.summaryWrapper} onClose={closeCallModal} isOpen={callSupportModal}>
            <div className={styles.header}>
                <h1>Contact Support</h1>
                <h2>Call {siteSettings.support_phone ? siteSettings.support_phone : '8019127474'} to contact our support team.</h2>
            </div>

        </Modal>}

    </>)

}
