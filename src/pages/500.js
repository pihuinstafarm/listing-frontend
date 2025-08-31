import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import styles from './404.module.scss'

export default function Custom500() {
    const siteName = 'InstaFarms';

    const pageMeta = {
        metaTitle: '500 - Internal Server Error | InstaFarms',
        metaDescription: 'Something went wrong on our end. Our team is working to fix the issue. Please try again later or explore our premium farmhouses.',
        metaUrl: "https://instafarms.in/500",
        metaKeywords : '',
        metaImage: '/images/500-og-image.jpg',
        siteName: siteName,
    }

    return (
        <>
            <Head>
                <title>{pageMeta.metaTitle}</title>
                <meta name="title" content={pageMeta.metaTitle} />
                <meta name="description" content={pageMeta.metaDescription} />
                <meta name="robots" content="noindex, follow" />
                <meta name="keywords" content={pageMeta.metaKeywords} />
                <link rel="canonical" href={pageMeta.metaUrl} />

                {/* OG Tags */}
                <meta property="og:title" content={pageMeta.metaTitle} />
                <meta property="og:description" content={pageMeta.metaDescription} />
                <meta property="og:url" content={pageMeta.metaUrl} />
                <meta property="og:image" content={pageMeta.metaImage} />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta property="og:type" content="500 Page" />
                <meta property="og:site_name" content={pageMeta.siteName} />
                <meta property="og:locale" content="en_US" />
                
                {/* Twitter Tags */}
                <meta name="twitter:card" content="summary" />
                <meta name="twitter:title" content={pageMeta.metaTitle} />
                <meta name="twitter:description" content={pageMeta.metaDescription} />
                <meta name="twitter:image" content={pageMeta.metaImage} />
                <meta name="twitter:url" content={pageMeta.metaUrl} />
                <meta name="twitter:site" content="@instafarms" />
                
                <meta itemProp="name" content={pageMeta.metaTitle} />
                <meta itemProp="description" content={pageMeta.metaDescription} />
                <meta itemProp="image" content={pageMeta.metaImage} />
            </Head>

            <div className={styles.errorPage}>

                <main className={styles.mainContent}>
                    <div className={styles.errorContainer}>
                        {/* 500 Illustration */}
                        <div className={styles.errorIllustration}>
                            <div className={styles.farmhouseIcon}>
                                <svg viewBox="0 0 200 150" className={styles.farmhouseSvg}>
                                    {/* Broken/damaged farmhouse illustration */}
                                    <rect x="50" y="80" width="100" height="60" fill="#D4A574" opacity="0.7" />
                                    <polygon points="50,80 100,40 150,80" fill="#8B4513" opacity="0.8" />
                                    <rect x="70" y="100" width="20" height="40" fill="#654321" />
                                    <rect x="110" y="100" width="20" height="25" fill="#4A90E2" opacity="0.5" />
                                    <rect x="20" y="130" width="160" height="10" fill="#90C695" />

                                    {/* Crack/damage lines */}
                                    <line x1="75" y1="80" x2="85" y2="140" stroke="#654321" strokeWidth="2" opacity="0.8" />
                                    <line x1="120" y1="75" x2="130" y2="135" stroke="#654321" strokeWidth="2" opacity="0.8" />

                                    {/* Warning/tools icons */}
                                    <circle cx="30" cy="120" r="8" fill="#FFB84D" />
                                    <text x="30" y="125" textAnchor="middle" fontSize="10" fill="#FFF">!</text>
                                    <circle cx="170" cy="125" r="6" fill="#E74C3C" />
                                    <text x="170" y="128" textAnchor="middle" fontSize="8" fill="#FFF">×</text>
                                </svg>
                            </div>

                            <div className={styles.errorNumber}>
                                <span className={styles.digit}>5</span>
                                <span className={styles.digit}>0</span>
                                <span className={styles.digit}>0</span>
                            </div>
                        </div>

                        {/* Error Message */}
                        <div className={styles.errorContent}>
                            <h1 className={styles.errorTitle}>
                                Our Farm is Under Maintenance
                            </h1>
                            <p className={styles.errorDescription}>
                                Something went wrong on our end. Our technical team is working hard to fix the issue.
                                Please try refreshing the page or come back in a few minutes to continue your farmhouse journey!
                            </p>

                            {/* Action Buttons */}
                            <div className={styles.actionButtons}>
                                <button
                                    className={styles.primaryBtn}
                                    onClick={() => window.location.reload()}
                                    aria-label="Refresh the page"
                                >
                                    <svg className={styles.btnIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0V9a8 8 0 1115.357 2m-15.357-2H15" />
                                    </svg>
                                    Try Again
                                </button>

                                <Link aria-label="Go back to homepage" href="/" className={styles.secondaryBtn}>
                                    <svg className={styles.btnIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                    Back to Home
                                </Link>
                            </div>

                            {/* Help Section */}
                            <div className={styles.helpSection}>
                                <p className={styles.helpText}>
                                    Need immediate assistance? Our team is available 24/7 to help you.
                                </p>
                                <Link aria-label="Get immediate help" href="/contact-us" className={styles.helpLink}>
                                    Get Help Now
                                </Link>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Background Elements */}
                <div className={styles.backgroundPattern}>
                    <div className={styles.patternElement}></div>
                    <div className={styles.patternElement}></div>
                    <div className={styles.patternElement}></div>
                </div>
            </div>
        </>
    )
}