import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import styles from './404.module.scss'

export default function Custom404() {
    const router = useRouter()
    const siteName = 'InstaFarms'
    const [countdown, setCountdown] = useState(3)
    const [redirectUrl, setRedirectUrl] = useState(null)
    const [isCheckingRoute, setIsCheckingRoute] = useState(true)
    const [routeCheckError, setRouteCheckError] = useState(false)
    const [shouldRedirect, setShouldRedirect] = useState(false)

    // Function to check if route exists in backend
    const checkRouteInBackend = async (currentPath) => {
        try {
            
            const response = await fetch(process.env.NEXT_PUBLIC_DEV_BASE_URL + "/api/url-redirects/find-by-url", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-App-Type': 'listing'
                },
                body: JSON.stringify({ oldurl: currentPath }),
            })

            
            if (response.status === 404) {
                // Route doesn't exist in redirects collection
                return { exists: false, newRoute: null }
            }
            
            if (!response.ok) {
                throw new Error('Failed to check route')
            }
            
            const data = await response.json()
            
            // Assuming your database returns an object with newurl field
            return { 
                exists: true, 
                newRoute: data.newURL || null 
            }
            
        } catch (error) {
            console.error('Error checking route:', error)
            setRouteCheckError(true)
            return { exists: false, newRoute: null }
        }
    }

    // Check route and set redirect URL
    useEffect(() => {
        const checkAndSetRedirect = async () => {
            const currentPath = router.asPath
            
            try {
                const routeData = await checkRouteInBackend(currentPath)
                
                if (routeData.exists && routeData.newRoute) {
                    // Route exists and has a new destination
                    setRedirectUrl(routeData.newRoute)
                    setShouldRedirect(true) // Only redirect if we found a valid redirect
                } else {
                    // Route doesn't exist, stay on 404 page
                    setRedirectUrl(null)
                    setShouldRedirect(false)
                }
            } catch (error) {
                // Stay on 404 page on error
                setRedirectUrl(null)
                setShouldRedirect(false)
            } finally {
                setIsCheckingRoute(false)
            }
        }

        if (router.isReady) {
            checkAndSetRedirect()
        }
    }, [router.isReady, router.asPath])

    // Auto-redirect with countdown (only if shouldRedirect is true)
    useEffect(() => {
        if (isCheckingRoute || !shouldRedirect || !redirectUrl) return

        const countdownInterval = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(countdownInterval)
                    router.push(redirectUrl)
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        // Cleanup interval if component unmounts
        return () => clearInterval(countdownInterval)
    }, [router, redirectUrl, isCheckingRoute, shouldRedirect])

    // Manual redirect function
    const handleManualRedirect = () => {
        if (redirectUrl) {
            router.push(redirectUrl)
        }
    }

    const pageMeta = {
        metaTitle: '404 - Page Not Found | InstaFarms',
        metaDescription: 'The page you are looking for could not be found. Explore our premium farmhouses and find your perfect getaway destination.',
        metaUrl: "https://instafarms.in/404",
        metaKeywords : '',
        metaImage: '/images/404-og-image.jpg',
        siteName: siteName,
    }

    // Determine redirect message based on redirect URL
    const getRedirectMessage = () => {
        if (redirectUrl === '/') {
            return 'homepage'
        }
        return 'the correct page'
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
                <meta property="og:type" content="400 Page" />
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
                        {/* 404 Illustration */}
                        <div className={styles.errorIllustration}>
                            <div className={styles.farmhouseIcon}>
                                <svg viewBox="0 0 200 150" className={styles.farmhouseSvg}>
                                    <rect x="50" y="80" width="100" height="60" fill="#D4A574" />
                                    <polygon points="50,80 100,40 150,80" fill="#8B4513" />
                                    <rect x="70" y="100" width="20" height="40" fill="#654321" />
                                    <rect x="110" y="100" width="20" height="25" fill="#4A90E2" />
                                    <rect x="20" y="130" width="160" height="10" fill="#90C695" />
                                    <circle cx="30" cy="120" r="8" fill="#90C695" />
                                    <circle cx="170" cy="125" r="6" fill="#90C695" />
                                </svg>
                            </div>

                            <div className={styles.errorNumber}>
                                <span className={styles.digit}>4</span>
                                <span className={styles.digit}>0</span>
                                <span className={styles.digit}>4</span>
                            </div>
                        </div>

                        {/* Error Message */}
                        <div className={styles.errorContent}>
                            <h1 className={styles.errorTitle}>
                                Oops! This Farmhouse Doesn't Exist
                            </h1>
                            <p className={styles.errorDescription}>
                                It seems like the page you're looking for has wandered off into the fields.
                                Don't worry - let's help you find the perfect farmhouse for your getaway!
                            </p>

                            {/* Loading or Countdown Notice */}
                            <div className={styles.redirectNotice}>
                                {isCheckingRoute ? (
                                    <p>Checking for redirects...</p>
                                ) : shouldRedirect && redirectUrl ? (
                                    <p>
                                        Redirecting to {getRedirectMessage()} in <strong>{countdown}</strong> seconds...
                                    </p>
                                ) : (
                                    <p>
                                        Page not found. Please use the navigation below to find what you're looking for.
                                    </p>
                                )}
                                
                                {routeCheckError && (
                                    <p className={styles.errorText}>
                                        Unable to check for redirects.
                                    </p>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className={styles.actionButtons}>
                                {/* Only show redirect button if we have a valid redirect URL */}
                                {!isCheckingRoute && shouldRedirect && redirectUrl && (
                                    <button 
                                        onClick={handleManualRedirect}
                                        className={styles.primaryBtn}
                                        aria-label={redirectUrl === '/' ? 'Go to homepage' : 'Go to correct page'}
                                    >
                                        <svg className={styles.btnIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                        </svg>
                                        {redirectUrl === '/' ? 'Go Home' : 'Go Now'}
                                    </button>
                                )}

                                {/* Always show these navigation buttons */}
                                <Link aria-label="Go to homepage" href="/" className={styles.primaryBtn}>
                                    <svg className={styles.btnIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                    Go Home
                                </Link>

                                <Link aria-label="Browse all locations" href="/all-locations" className={styles.secondaryBtn}>
                                    <svg className={styles.btnIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    Browse Locations
                                </Link>
                            </div>

                            {/* Help Section */}
                            <div className={styles.helpSection}>
                                <p className={styles.helpText}>
                                    Need assistance? Our team is here to help you find the perfect farmhouse.
                                </p>
                                <Link aria-label="Contact support" href="/contact-us" className={styles.helpLink}>
                                    Contact Support
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