import React, { useEffect, useState } from 'react'
import { CircularLoader } from 'utils/components'
import { useRouter } from 'next/router'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import Link from 'next/link'
import Head from 'next/head'
import Image from 'next/image'
import styles from './index.module.scss'
import { bookingsServices } from 'utils/services'

// Add getServerSideProps for [slug].js route
export async function getServerSideProps(context) {
    const { slug } = context.params || {}
    
    if (!slug) {
        return {
            notFound: true
        }
    }

    try {
        // Fetch booking data on server side
        // Replace this with your actual API call
        const booking = await bookingsServices.getById(slug)
        
        if (!booking) {
            return {
                notFound: true
            }
        }

        return {
            props: {
                bookingId: slug,
                initialBooking: booking,
                initialProperty: booking.property || null
            }
        }
    } catch (error) {
        console.error('Error fetching booking:', error)
        return {
            props: {
                bookingId: slug,
                initialBooking: null,
                initialProperty: null
            }
        }
    }
}

export default function BookingConfirmed({ bookingId, initialBooking, initialProperty }) {
    const router = useRouter()
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))
    
    // Get bookingId from router slug parameter if not passed as prop
    const actualBookingId = bookingId || router.query.slug
    
    const [loading, setLoading] = useState(!initialBooking)
    const [bookingItem, setBookingItem] = useState(initialBooking)
    const [propertyItem, setPropertyItem] = useState(initialProperty)
    const [error, setError] = useState(null)

    // If router is not ready yet, show loading
    if (router.isFallback) {
        return (
            <div className="full_screen_loading flex justify-center items-center h-[75%] w-full">
                <CircularLoader />
            </div>
        )
    }

    const metaTitle = 'Booking Confirmed - InstaFarms'
    const metaDescription = 'Your booking has been confirmed successfully'
    const metaUrl = `https://instafarms.in/booking-confirmed/${actualBookingId}`
    const metaKeywords = '';
    const metaImage = ''
    const siteName = 'InstaFarms'

    useEffect(() => {
        // Only fetch if we don't have initial data and we have a booking ID
        if (!initialBooking && actualBookingId) {
            fetchBookingDetails()
        } else if (!actualBookingId) {
            setError('No booking ID provided')
        }
    }, [actualBookingId, initialBooking])

    const fetchBookingDetails = async () => {
        try {
            setLoading(true)
            setError(null)
            const booking = await bookingsServices.getById(actualBookingId)
            if (booking) {
                setBookingItem(booking)
                setPropertyItem(booking.property)
            } else {
                setError('Booking not found')
            }
        } catch (err) {
            setError('Failed to load booking details')
            console.error('Error fetching booking:', err)
        } finally {
            setLoading(false)
        }
    }

    function goToPageURL(url) {
        router.push(url)
    }

    const getFormattedDate = (dateString) => {
        if (!dateString) return ''
        
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        const date = new Date(dateString)
        
        // Check if date is valid
        if (isNaN(date.getTime())) return dateString
        
        return `${dayNames[date.getDay()]} ${date.getDate()} ${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`
    }

    const getGuestCount = () => {
        if (!bookingItem?.guests) return 0
        return (
            parseInt(bookingItem.guests.adult || 0) +
            parseInt(bookingItem.guests.children || 0) +
            parseInt(bookingItem.guests.infant || 0)
        )
    }

    const getFormattedCurrency = (price) => {
        if (!price) return '₹0'
        return '₹' + new Intl.NumberFormat('en-IN').format(parseFloat(price))
    }

    function convertToAmPm(time24) {
        if (!time24) return ''
        
        const [hours, minutes] = time24.split(':').map(Number)
        const amPm = hours >= 12 ? 'PM' : 'AM'
        const displayHours = hours % 12 || 12
        return `${displayHours}:${String(minutes).padStart(2, '0')} ${amPm}`
    }

    if (loading) {
        return (
            <>
                <Head>
                    <title>{metaTitle}</title>
                    <meta name="title" content={metaTitle} />
                    <meta name="description" content={metaDescription} />
                </Head>
                <div className="full_screen_loading flex justify-center items-center h-[75%] w-full">
                    <CircularLoader />
                </div>
            </>
        )
    }

    if (error || !bookingItem) {
        return (
            <>
                <Head>
                    <title>Booking Not Found - InstaFarms</title>
                </Head>
                <div className="inner_section">
                    <div className="flex justify-center items-center h-[50vh] flex-col">
                        <h1>Booking Not Found</h1>
                        <p>{error || 'The booking you\'re looking for could not be found.'}</p>
                        <button
                            className="solidbtn"
                            onClick={() => goToPageURL('/')}
                        >
                            Return Home
                        </button>
                    </div>
                </div>
            </>
        )
    }

    return (
        <>
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
                <meta property="og:type" content="website" />
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

            {isMobile && (
                <div className={'customHeader'}>
                    <div className={'left'} onClick={() => router.push('/')}>
                        <Image
                            alt="Insta Farms"
                            width={30}
                            height={30}
                            src={'/assets/images/close_icon.webp'}
                        />
                    </div>
                    <div className={'center'}>
                        <h2>Booking Confirmation</h2>
                    </div>
                    <div className={'right'}></div>
                </div>
            )}

            <div className={'inner_section'}>
                <div className="breadcrum">
                    <Link scroll={true} aria-label="Home" href={`/`}>
                        Home
                    </Link>
                    /
                    <span>Booking Confirmation</span>
                </div>
            </div>

            <section className="inner_section">
                <div className={styles.booking_section}>
                    <div className={styles.left}>
                        <h1>
                            Your booking is <span>confirmed</span>.
                        </h1>
                        <p>
                            In the next 10 minutes you will receive a
                            booking confirmation with booking details in
                            your inbox at{' '}
                            <span>{bookingItem.user?.email}</span> and
                            Whatsapp number{' '}
                            <span>{bookingItem.user?.phone}</span>
                        </p>
                        <div className={styles.booking_details}>
                            <div className={styles.detail_item}>
                                <span>Booking ID</span>
                                <p>{bookingItem.booking_id}</p>
                            </div>
                            <div className={styles.detail_item}>
                                <span>Property Name</span>
                                <p>{bookingItem.property?.name || propertyItem?.name}</p>
                            </div>
                            <div className={styles.detail_item}>
                                <span>Date</span>
                                <p>
                                    {getFormattedDate(bookingItem.from_date)}{' '}
                                    {propertyItem?.check_in_time
                                        ? convertToAmPm(propertyItem.check_in_time)
                                        : '02:00 PM'}{' '}
                                    -{' '}
                                    {getFormattedDate(bookingItem.to_date)}{' '}
                                    {propertyItem?.check_out_time
                                        ? convertToAmPm(propertyItem.check_out_time)
                                        : '11:00 AM'}
                                </p>
                            </div>
                            <div className={styles.detail_item}>
                                <span>Guests</span>
                                <p>{getGuestCount()}</p>
                            </div>
                        </div>
                        <p>
                            Please go through the booking confirmation
                            document thoroughly for a hassle free
                            experience during your stay.
                        </p>
                        <div className={styles.row_btns}>
                            <button
                                className={'solidbtn'}
                                onClick={() => goToPageURL('/my-bookings')}
                            >
                                View booking details
                            </button>
                            <button
                                className={'solidbtn'}
                                onClick={() => goToPageURL('/')}
                            >
                                Return home
                            </button>
                        </div>
                    </div>
                    <div className={styles.right}>
                        <h2>Price information</h2>
                        <div className={styles.detail_section_payment}>
                            {bookingItem.price_details?.totalDaysPrice && (
                                <p>
                                    <span>Rental Charges</span>
                                    {getFormattedCurrency(bookingItem.price_details.totalDaysPrice)}
                                </p>
                            )}

                            {bookingItem.price_details?.totalExtraPrice > 0 && (
                                <p>
                                    <span>Extra Guest Price</span>
                                    + {getFormattedCurrency(bookingItem.price_details.totalExtraPrice)}
                                </p>
                            )}

                            {bookingItem.price_details?.totalDiscount > 0 && (
                                <p>
                                    <span>Discount</span>
                                    - {getFormattedCurrency(bookingItem.price_details.totalDiscount)}
                                </p>
                            )}

                            {bookingItem.price_details?.nightsDiscountsFee > 0 && (
                                <p>
                                    <span>Nights Discount</span>
                                    - {getFormattedCurrency(bookingItem.price_details.nightsDiscountsFee)}
                                </p>
                            )}

                            {bookingItem.price_details?.couponDiscount > 0 && (
                                <p>
                                    <span>
                                        Coupon Discount
                                        {bookingItem.coupon_code && ` (${bookingItem.coupon_code})`}
                                    </span>
                                    - {getFormattedCurrency(bookingItem.pricing.couponDiscount)}
                                </p>
                            )}

                            <p>
                                <span>Total Price</span>
                                {getFormattedCurrency(bookingItem.booking_amount)}
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

