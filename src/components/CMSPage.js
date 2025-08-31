import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import styles from '../pages/index.module.scss'

export default function Page({ pageType, siteSettings, pageData }) {
    //  Metadata
    const siteName = siteSettings.site_title || 'InstaFarms'
    const collectionData = pageData && pageData[0] ? pageData[0] : {}
    const collectionMetadata = collectionData.metadata || {}

    const pageMeta = {
        metaTitle: collectionMetadata.metaTitle || siteName,
        metaDescription: collectionMetadata.metaDescription || '',
        metaUrl: collectionMetadata.metaUrl || 'https://instafarms.in/page/',
        metaImage: collectionMetadata.metaImage || '',
        metaKeywords : '',
        siteName: siteName,
    }
    let pageSchema;

    if (pageData[0].menu_name==='Our Story'){
        pageSchema={
            "@context": "https://schema.org",
            "@type": "AboutPage",
            "@id": "https://instafarms.in/our-story",
            "name": "Our Story - Instafarms",
            "url": "https://instafarms.in/our-story",
            "description": "Discover Instafarms' journey and mission to transform Indian agriculture through sustainable, tech-driven farming solutions.",
            "datePublished": "2023-01-01",
            "dateModified": "2025-07-30",
            "publisher": {
                "@type": "Organization",
                "@id": "https://instafarms.in#organization",
                "name": "Instafarms",
                "url": "https://instafarms.in",
                "logo": {
                "@type": "ImageObject",
                "url": "https://instafarms.in/assets/logo.webp",
                "width": 200,
                "height": 60
                },
                "sameAs": [
                "https://www.facebook.com/Instafarms",
                "https://www.instagram.com/Instafarms",
                "https://www.linkedin.com/company/instafarms"
                ],
                "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+91-9876543210",
                "contactType": "Customer Support",
                "areaServed": "IN",
                "availableLanguage": ["English", "Hindi", "Telugu"]
                }
            }
        }
    }
    if (pageData[0].menu_name!=='Our Story'){
        pageSchema = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": pageMeta.metaUrl,
        "url": pageMeta.metaUrl,
        "name": pageMeta.metaTitle,
        "description": pageMeta.metaDescription,
        "inLanguage": "en",
        "about": {
            "@type": "Organization",
            "name": "InstaFarms",
            "url": "https://instafarms.in",
            "logo": {
                "@type": "ImageObject",
                "url": "https://instafarms.in/logo.webp",
                "width": 200,
                "height": 60
            }
        }
        }
    }

    // console.log("schema :", pageSchema);

    const applicationSchema = JSON.stringify(pageSchema)

    if (pageData[0]) {
        return (
            <>
                <Head>
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{ __html: applicationSchema }}
                    />
                    <title>{pageMeta.metaTitle}</title>
                    <meta name="title" content={pageMeta.metaTitle} />
                    <meta name="description" content={pageMeta.metaDescription} />
                    <meta name="keywords" content={pageMeta.metaKeywords} />
                    <meta name="robots" content="index, follow" />
                    <link rel="canonical" href={pageMeta.metaUrl} />

                    {/* OG Tags */}
                    <meta property="og:title" content={pageMeta.metaTitle} />
                    <meta property="og:description" content={pageMeta.metaDescription}/>
                    <meta property="og:url" content={pageMeta.metaUrl} />
                    <meta property="og:image" content={pageMeta.metaImage} />
                    <meta property="og:image:width" content="1200" />
                    <meta property="og:image:height" content="630" />
                    <meta property="og:type" content="CMS page" />
                    <meta property="og:logo" content="http://instafarms.in/logo.webp"/>
                    <meta property="og:site_name" content={pageMeta.siteName} />
                    <meta property="og:locale" content="en_US" />
                    
                    {/* Twitter Tags */}
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:title" content={pageMeta.metaTitle} />
                    <meta
                        name="twitter:description"
                        content={pageMeta.metaDescription}
                        />
                    <meta name="twitter:image" content={pageMeta.metaImage} />
                    <meta itemProp="name" content={pageMeta.metaTitle} />
                    <meta name="twitter:url" content={pageMeta.metaUrl} />
                    <meta name="twitter:site" content="@instafarms" />


                    <meta
                        itemProp="description"
                        content={pageMeta.metaDescription}
                    />
                    <meta itemProp="image" content={pageMeta.metaImage} />
                </Head>

                <div className={'inner_section'}>
                    <div className={styles.contentsection}>
                        <div
                            className={styles.contentherosection}
                            style={{
                                backgroundImage: `url(${pageData[0].hero_banner})`,
                            }}
                        >
                            <h1>{pageData[0].title} </h1>
                        </div>
                        <div className="breadcrum">
                            <Link scroll={true} aria-label="Home" href={`/`}>
                                Home
                            </Link>
                            /<span>{pageData[0].title}</span>
                        </div>

                        {pageData[0].sub_title && <h2>{pageData[0].sub_title} </h2>}
                        <div
                            className={styles.htmlcontent}
                            dangerouslySetInnerHTML={{ __html: pageData[0].content }}
                        />
                    </div>
                </div>
            </>
        )
    }
}
