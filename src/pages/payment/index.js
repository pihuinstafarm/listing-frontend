import React, { useEffect, useState, useRef } from 'react'
import { CircularLoader, isLoggedIn, getPropertyPrice } from 'utils/components'
import { Input } from '@mui/material'
import { useRouter } from 'next/router'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import Link from 'next/link'
import Head from 'next/head'
import Image from 'next/image'
import styles from './index.module.scss'
import { useSearchParams } from 'next/navigation'
import Login from '../../containers/header/login'
import { propertiesServices, bookingsServices } from 'utils/services'
import Script from 'next/script'
import { Modal } from 'components'
import { Checkbox } from '@mui/material'
import GuestsModal from 'components/guestsmodal'
import Calendar from './../../containers/PropertyPage/PropertyPriceBox/Calendar'
import { getLocalTimeZone, parseDate, today } from '@internationalized/date'

export default function Payment() {
    const CalendarRef = useRef(null)
    const timeoutRef = useRef(null)
    const GuestsModalRef = useRef(null)
    const searchParams = useSearchParams()
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [payload, setPayload] = useState()
    const [propertyItem, setPropertyItem] = useState()
    const [propertyPrice, setPropertyPrice] = useState({ price: 0, days: '' })
    const [NightsCount, setNightsCount] = useState(0)
    const [showLogin, setShowLogin] = useState(false)
    const [paymentOption, setPaymentOption] = useState('')
    const [paymentOptionError, setPaymentOptionError] = useState('')
    const [specialRequests, setSpecialRequests] = useState('')
    const [loadingPayment, setLoadingPayment] = useState(false)
    const [successModal, setSuccessModal] = useState(false)
    const [errorModal, setErrorModal] = useState(false)
    const [bookingStatusMessage, setBookingStatusMessage] = useState(false)

    const [checkedTandCond, setCheckedTandCond] = useState(false)
    const [pendingBookingId, setPendingBookingId] = useState()

    const [couponCode, setCouponCode] = useState('')
    const [couponCodeError, setCouponCodeError] = useState('')
    const [checkOutStatus, setCheckOutStatus] = useState('')
    const [bookedDates, setBookedDates] = useState([])
    const [CheckInOpen, setCheckInOpen] = useState(false)
    const [showGuestsModal, setShowGuestsModal] = useState(false)
    const [selected, setSelected] = useState({
        start: null,
        end: null,
    })

    const metaTitle = 'Checkout - InstaFarms'
    const metaDescription = ''
    const metaUrl = 'https://instafarms.in/payment'
    const metaImage = ''
    const metaKeywords = '';
    const siteName = 'InstaFarms'

    function handleOutsideCalendarClick(e) {
        if (!CalendarRef.current?.contains(e.target)) {
            setCheckInOpen(false)
        }
    }

    function handleOutsideGuestModal(e) {
        if (!GuestsModalRef.current?.contains(e.target)) {
            setShowGuestsModal(false)
        }
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleOutsideCalendarClick)
        document.addEventListener('mousedown', handleOutsideGuestModal)
        return () => {
            document.removeEventListener('mousedown', handleOutsideCalendarClick)
            document.removeEventListener('mousedown', handleOutsideGuestModal)
        }
    }, [])

    useEffect(() => {
        if (pendingBookingId && pendingBookingId != '') {
            const handleBeforeUnload = (event) => {
                // Optionally show a confirmation dialog
                propertiesServices
                    .deletePendingBookingApi(pendingBookingId)
                    .then((delres) => {})
                    .catch((error) => {})

                event.preventDefault()
                event.returnValue = ''
            }

            window.addEventListener('beforeunload', handleBeforeUnload)

            return () => {
                window.removeEventListener('beforeunload', handleBeforeUnload)
            }
        }
    }, [pendingBookingId])

    useEffect(() => {
        if (pendingBookingId && pendingBookingId != '') {
            const handleRouteChange = (url) => {
                if (pendingBookingId) {
                    if (!confirm('Are you sure you want to leave this page?')) {
                        router.events.emit('routeChangeError')
                        throw 'Route change aborted.'
                    } else {
                        propertiesServices
                            .deletePendingBookingApi(pendingBookingId)
                            .then((delres) => {})
                            .catch((error) => {})
                    }
                }
            }

            router.events.on('routeChangeStart', handleRouteChange)

            return () => {
                router.events.off('routeChangeStart', handleRouteChange)
            }
        }
    }, [router, pendingBookingId])

    useEffect(() => {
        setLoading(true)
        let propertyId = searchParams.get('property')
            ? searchParams.get('property')
            : ''
        let startdate = searchParams.get('startdate')
            ? searchParams.get('startdate')
            : ''
        let enddate = searchParams.get('enddate') ? searchParams.get('enddate') : ''
        let adult = searchParams.get('adult') ? searchParams.get('adult') : 0
        let children = searchParams.get('children')
            ? searchParams.get('children')
            : 0
        let infant = searchParams.get('infant') ? searchParams.get('infant') : 0
        if (propertyId) {
            setPayload({
                propertyId: propertyId,
                startdate: startdate,
                enddate: enddate,
                adult: adult,
                children: children,
                infant: infant,
                totalguests: parseInt(adult) + parseInt(children) + parseInt(infant),
            })

            setSelected({
                start: parseDate(startdate),
                end: parseDate(enddate),
            })
            propertiesServices
                .getBookingByPropertyId(propertyId)
                .then(async (result) => {
                    if (result) {
                        let bookingDates = []
                        result.forEach((date) => {
                            bookingDates.push(date)
                        })
                        setBookedDates(bookingDates)
                    }
                })

            propertiesServices.getById(propertyId).then((property) => {
                setPropertyItem(property)
            })
        }
    }, [searchParams])

    const isValidCouponCode = (couponCodeItem) => {
        const validFrom = new Date(couponCodeItem.valid_from)
        const validUntill = new Date(couponCodeItem.valid_untill)
        const currentDate = new Date()
        if (currentDate >= validFrom && currentDate <= validUntill) {
            return true
        }
        {
            return false
        }
    }

    const removeCoupon = () => {
        setPayload((prev) => ({
            ...prev,
            ['coupon']: '',
        }))
    }

    const applyCoupon = (couponCode) => {
        setCouponCodeError('')
        setPayload((prev) => ({
            ...prev,
            ['coupon']: '',
        }))
        if (couponCode && couponCode != '') {
            propertiesServices.getCouponCode(couponCode).then((result) => {
                if (result && result.length > 0) {
                    let couponCodeItem = result[0]
                    if (isValidCouponCode(couponCodeItem)) {
                        setCouponCode('')
                        setPayload((prev) => ({
                            ...prev,
                            ['coupon']: couponCodeItem,
                        }))
                    } else {
                        setCouponCodeError('Coupon code is invalid or expired.')
                    }
                } else {
                    setCouponCodeError('Coupon code is invalid or expired.')
                }
            })
        }
    }

    useEffect(() => {
        if (payload && payload.startdate && propertyItem && propertyItem.id) {
            getNightsCountOnly(payload.startdate, payload.enddate)
            payload['propertyItem'] = propertyItem
            const PropertyPrice = getPropertyPrice(payload)

            setPropertyPrice(PropertyPrice)
            setLoading(false)
        }
    }, [propertyItem, payload])

    function goToProperty(property) {
        let url = getPropertyUrl(
            `/${property.address_details.city_name}/${property.address_details.area_name}/${property.type}/${property.slug}`,
        )
        window.location = url
    }

    const getNightsCountOnly = (startdate, enddate) => {
        let second = new Date(enddate)
        let first = new Date(startdate)
        let nigths = Math.round((second - first) / (1000 * 60 * 60 * 24))
        setNightsCount(nigths)
    }

    const getFormattedCurrency = (price) => {
        return '₹' + new Intl.NumberFormat().format(parseFloat(price).toFixed(2))
    }

    function updateBookingOrder(payload, booking) {
        console.log('=== updateBookingOrder Debug ===');
        console.log('Payload being sent to updateBooking:', payload);
        console.log('Booking object:', booking);
        console.log('Token from localStorage:', localStorage.getItem('token'));
        
        setCheckOutStatus('Please wait... We are fetching the order details.You will be redirected to the booking details shortly.');
        setLoadingPayment(false)
        setSuccessModal(false)
        setErrorModal(false)
        setBookingStatusMessage(false)
        setLoading(true)

        propertiesServices.updateBooking(payload).then((resUpdate) => {
            console.log('updateBooking API response:', resUpdate);
            
            if (resUpdate.success) {
                console.log('Booking update successful, redirecting to confirmation page');
                // Redirect to booking confirmation page
                setCheckOutStatus('');
                setLoading(false);
                setPendingBookingId('')
                setLoadingPayment(false)
                window.location.href = `/booking-confirmed/${booking.booking_id}`
            } else {
                console.error('Booking update failed:', resUpdate.message);
                console.error('Full error response:', resUpdate);
                setCheckOutStatus('')
                setLoading(false);
                setPendingBookingId('')
                setLoadingPayment(false)
                setSuccessModal(false)
                setErrorModal(true)
                setBookingStatusMessage(resUpdate.message || 'Failed to create booking')
            }
        }).catch((error) => {
            console.error('updateBooking API call failed with error:', error);
            setCheckOutStatus('')
            setLoading(false);
            setPendingBookingId('')
            setLoadingPayment(false)
            setSuccessModal(false)
            setErrorModal(true)
            setBookingStatusMessage('Network error: Failed to create booking')
        })
    }

    useEffect(() => {
        // Clean up on unmount
        return () => cancelTimeout()
    }, [])

    const cancelTimeout = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
            timeoutRef.current = null
        }
    }

    const checkout = () => {
        try {
            const isAuthUser = isLoggedIn()
            const token = localStorage.getItem('token')
            const documentId = localStorage.getItem('documentId')
            if (isAuthUser && documentId && token) {
                timeoutRef.current = setTimeout(function () {
                    setCheckOutStatus('')
                    setLoadingPayment(false)
                    setLoading(false)
                    setBookingStatusMessage(false)
                    goToProperty(propertyItem)
                }, 60000)

                setCheckOutStatus(
                    'Please wait... You will be redirected to the payment gateway soon.',
                )
                setLoading(true)
                setPaymentOptionError('')
                setLoadingPayment(true)
                setSuccessModal(false)
                setErrorModal(false)
                let bookingPayload = {
                    propertyId: payload.propertyId,
                    customerId: documentId,
                    bookingType: paymentOption === 'full' ? 'Online' : 'Online', // Map payment option to booking type
                    adultCount: parseInt(payload.adult) || 0,
                    childrenCount: parseInt(payload.children) || 0,
                    infantCount: parseInt(payload.infant) || 0,
                    totalguests: payload.totalguests,
                    checkinDate: payload.startdate,
                    checkoutDate: payload.enddate,
                    special_requests: specialRequests,
                    // Keep original fields for backward compatibility if needed
                    startdate: payload.startdate,
                    enddate: payload.enddate,
                    adult: payload.adult,
                    children: payload.children,
                    infant: payload.infant,
                    payment_option: paymentOption,
                    userId: documentId,
                }
                if (payload.coupon && payload.coupon.id) {
                    bookingPayload['couponItem'] = {
                        coupon_code: payload.coupon?.coupon_code,
                        coupon_type: payload.coupon?.coupon_type,
                        value: payload.coupon?.value,
                        id: payload.coupon?.id,
                    }
                }

                propertiesServices.createBooking(bookingPayload).then((res) => {
                    if (res.success) {
                        let bookingId;
                        let newBooking;
                        if (res.order.id && res.newBooking.booking_id) {
                            if (res.newBooking.booking_id) {
                                bookingId = res.newBooking.booking_id
                                newBooking = res.newBooking
                                setPendingBookingId(res.newBooking.booking_id)
                                cancelTimeout()
                                timeoutRef.current = setTimeout(function () {
                                    if (res.newBooking.booking_id) {
                                        deleteBooking(res.newBooking.booking_id)
                                        setPendingBookingId('')
                                    }
                                    setCheckOutStatus('')
                                    setLoadingPayment(false)
                                    setLoading(false)
                                    setBookingStatusMessage(false)
                                    goToProperty(propertyItem)
                                }, 300000)
                            }

                            const options = {
                                order_id: res.order.id,
                                handler: function (response) {
                                    cancelTimeout()
                                    setPendingBookingId('')
                                    setCheckOutStatus(
                                        'Please wait... We are fetching the order details.You will be redirected to the booking details shortly.',
                                    )
                                    response['payment_option'] = paymentOption
                                    updateBookingOrder(response, newBooking)
                                },
                                modal: {
                                    ondismiss: function () {
                                        cancelTimeout()
                                        setLoading(false)
                                        setBookingStatusMessage(false)
                                        if (res.newBooking.booking_id) {
                                            setCheckOutStatus('')
                                            setPendingBookingId('')
                                            deleteBooking(res.newBooking.booking_id)
                                            setLoadingPayment(false)
                                        } else {
                                            setCheckOutStatus('')
                                            setLoadingPayment(false)
                                        }
                                    },
                                },
                            }

                            const paymentObject = new window.Razorpay(options)
                            paymentObject.open()
                            paymentObject.on('payment.failed', function (response) {
                                setLoadingPayment(false)
                                setSuccessModal(false)
                                setErrorModal(true)
                                setBookingStatusMessage(
                                    'Payment failed! Please try again!',
                                )
                            })
                        } else {
                            setLoading(false)
                            setLoadingPayment(false)
                            setSuccessModal(false)
                            setErrorModal(true)
                            setBookingStatusMessage(
                                'Payment failed! Please try again!',
                            )
                        }
                    } else {
                        setLoading(false)
                        if (res.newBooking && res.newBooking.booking_id) {
                            deleteBooking(res.newBooking.booking_id)
                        }
                        setLoadingPayment(false)
                        setSuccessModal(false)
                        setErrorModal(true)
                        setBookingStatusMessage(res.message)
                    }
                })
            } else {
                setShowLogin(true)
            }
        } catch (error) {
            setLoading(false)
            setLoadingPayment(false)
            setSuccessModal(false)
            setErrorModal(true)
            setBookingStatusMessage(error.message)
        }
    }

    function deleteBooking(bookingID) {
        propertiesServices.deletePendingBookingApi(bookingID).then((delres) => {})
    }

    const closeModal = () => {
        setSuccessModal(false)
        setErrorModal(false)
    }

    const getPropertyUrl = (url) => {
        return (
            url
                .toLowerCase() // Convert to lowercase
                .replace(/%20| /g, '-') // Replace spaces and %20 with hyphens
                .replace(/[^a-z0-9/-]+/g, '') // Remove special characters except hyphens and slashes
                .replace(/\/+/g, '/') // Ensure single slashes
                .replace(/-+/g, '-') // Ensure single hyphens
                .replace(/\/-|-\/|^-|-$/g, '') + '.html'
        )
    }

    function formatDateRange(startDate, endDate) {
        const start = new Date(startDate)
        const end = new Date(endDate)

        const options = { month: 'short' }
        const startMonth = new Intl.DateTimeFormat('en-US', options).format(start)
        const endMonth = new Intl.DateTimeFormat('en-US', options).format(end)

        if (
            start.getMonth() === end.getMonth() &&
            start.getFullYear() === end.getFullYear()
        ) {
            return `${start.getDate()} - ${end.getDate()} ${startMonth}`
        } else {
            return `${start.getDate()} ${startMonth} - ${end.getDate()} ${endMonth}`
        }
    }

    const selectedChange = (ev) => {
        if (ev.start) {
            let startDate =
                ev.start.year +
                '-' +
                ev.start.month.toString().padStart(2, '0') +
                '-' +
                ev.start.day.toString().padStart(2, '0')
            let endDate =
                ev.end.year +
                '-' +
                ev.end.month.toString().padStart(2, '0') +
                '-' +
                ev.end.day.toString().padStart(2, '0')
            if (startDate === endDate) {
                setCheckInOpen(true)
            } else {
                setPayload((prev) => ({
                    ...prev,
                    ['startdate']: startDate,
                    ['enddate']: endDate,
                }))
                setSelected(ev)
                setCheckInOpen(false)
            }
        } else {
            setSelected('')
        }
    }

    const updateGuestPayload = (inputType, value) => {
        if (inputType == 'guest') {
            setPayload((prev) => ({
                ...prev,
                ['adult']: value.adult,
                ['children']: value.children,
                ['infant']: value.infant,
                ['totalguests']:
                    parseInt(value.adult) +
                    parseInt(value.children) +
                    parseInt(value.infant),
            }))
        }
    }

    return (
        <>
            {showLogin && (
                <Login closeLogin={() => setShowLogin(false)} isOpen={showLogin} />
            )}
            
            {successModal && (
                <Modal
                    classname={styles.bookingWrapper}
                    onClose={closeModal}
                    isOpen={successModal}
                >
                    <div className={styles.header}>
                        <h1>Booking Confirmation For</h1>
                        <h2>Property {propertyItem.property_code_name}</h2>
                    </div>

                    <div className={styles.content}>
                        <p className={styles.success_mesage}>
                            {bookingStatusMessage}
                        </p>
                        <button
                            className={styles.solidbtn + ' solidbtn'}
                            aria-label="Close Enquiry"
                            onClick={() => goToProperty(propertyItem)}
                        >
                            OK
                        </button>
                    </div>
                </Modal>
            )}

            {errorModal && (
                <Modal
                    classname={styles.bookingWrapper}
                    onClose={closeModal}
                    isOpen={errorModal}
                >
                    <div className={styles.header}>
                        <h1>Oops!</h1>
                    </div>

                    <div className={styles.content}>
                        <p className={styles.success_mesage}>
                            {bookingStatusMessage}
                        </p>
                        <button
                            className={styles.solidbtn + ' solidbtn'}
                            aria-label="Close Enquiry"
                            onClick={() => goToProperty(propertyItem)}
                        >
                            OK
                        </button>
                    </div>
                </Modal>
            )}

            <Script
                id="razorpay-checkout-js"
                src="https://checkout.razorpay.com/v1/checkout.js"
            />

            <Head>
                <title>{metaTitle}</title>
                <meta name="title" content={metaTitle} />
                <meta name="description" content={metaDescription} />
                <meta name="robots" content="index, follow" />
                <meta name="keywords" content={metaKeywords} />
                <link rel="canonical" href={metaUrl} />

                {/* OG Tags */}
                <meta property="og:title" content={metaTitle} />
                <meta property="og:description" content={metaDescription} />
                <meta property="og:url" content={metaUrl} />
                <meta property="og:image" content={metaImage} />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta property="og:type" content="Payment Page" />
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
                        <h2>Payment</h2>
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
                    {propertyItem && (
                        <>
                            <Link
                                aria-label={propertyItem.property_code_name}
                                className="link_only"
                                href={getPropertyUrl(
                                    `/${propertyItem.address_details.city_name}/${propertyItem.address_details.area_name}/${propertyItem.type}/${propertyItem.slug}`,
                                )}
                            >
                                {propertyItem.property_code_name}
                            </Link>
                            /
                            <span>Checkout</span>
                        </>
                    )}
                </div>
            </div>

            {loading && (
                <div className="full_screen_loading flex justify-center items-center h-[75%] w-full">
                    <CircularLoader />
                    {checkOutStatus && <p>{checkOutStatus}</p>}
                </div>
            )}

            {propertyItem && (
                <section className="inner_section">
                    <div
                        className={styles.payment_section + ' ' + styles.row}
                    >
                        <div
                            className={
                                styles.payment_section_left +
                                ' ' +
                                styles.column
                            }
                        >
                            <div
                                className={
                                    styles.section_block + ' ' + styles.row
                                }
                            >
                                <div
                                    className={
                                        styles.PropertyDetails +
                                        ' ' +
                                        styles.column
                                    }
                                >
                                    <h1 className={styles.PropertyName}>
                                        {propertyItem.property_code_name}
                                    </h1>
                                    <p className={styles.PropertyHeading}>
                                        {propertyItem.heading}
                                    </p>
                                    <p className={styles.PropertyAddress}>
                                        <Image
                                            alt="InstaFarms Property Location"
                                            className="smallIcon"
                                            width={20}
                                            height={20}
                                            src={
                                                '/assets/images/user_location.webp'
                                            }
                                        />{' '}
                                        {
                                            propertyItem.address_details
                                                ?.area_name
                                        }
                                        ,{' '}
                                        {
                                            propertyItem.address_details
                                                ?.city_name
                                        }
                                    </p>
                                    <h4>Your trip</h4>
                                    <div
                                        className={
                                            styles.FormRow + ' ' + styles.row
                                        }
                                    >
                                        <div className={styles.column}>
                                            <p className={styles.heading}>
                                                Dates
                                            </p>
                                            <p>
                                                {formatDateRange(
                                                    payload.startdate,
                                                    payload.enddate,
                                                )}
                                            </p>
                                        </div>
                                        <div className={styles.column}>
                                            <p
                                                className={styles.link}
                                                onClick={() => {
                                                    setCheckInOpen(
                                                        !CheckInOpen,
                                                    )
                                                    setShowGuestsModal(false)
                                                }}
                                            >
                                                Edit
                                            </p>
                                        </div>
                                    </div>

                                    <div
                                        className={
                                            styles.FormRow + ' ' + styles.row
                                        }
                                    >
                                        <div className={styles.column}>
                                            <p className={styles.heading}>
                                                Guests
                                            </p>
                                            <p>
                                                {payload.totalguests} Guest
                                                {payload.totalguests > 1
                                                    ? 's'
                                                    : ''}
                                            </p>
                                        </div>
                                        <div className={styles.column}>
                                            <p
                                                className={styles.link}
                                                onClick={() => {
                                                    setShowGuestsModal(
                                                        !showGuestsModal,
                                                    ),
                                                        setCheckInOpen(false)
                                                }}
                                            >
                                                Edit
                                            </p>
                                        </div>
                                    </div>
                                    {CheckInOpen && (
                                        <div
                                            ref={CalendarRef}
                                            className={
                                                styles.DateRangePickerSection
                                            }
                                        >
                                            <Calendar
                                                propertyItem={propertyItem}
                                                selected={selected}
                                                bookedDates={bookedDates}
                                                selectedChange={
                                                    selectedChange
                                                }
                                            />
                                        </div>
                                    )}
                                    {showGuestsModal && (
                                        <div
                                            ref={GuestsModalRef}
                                            className={
                                                styles.DateRangePickerSection
                                            }
                                        >
                                            <GuestsModal
                                                maxguestcount={
                                                    propertyItem.max_guest_count
                                                }
                                                guest={payload}
                                                updatePayload={
                                                    updateGuestPayload
                                                }
                                            />
                                        </div>
                                    )}
                                </div>
                                <div
                                    className={
                                        styles.PropertyImages +
                                        ' ' +
                                        styles.column
                                    }
                                >
                                    <Image
                                        src={propertyItem.featured_image.url} // Default image
                                        alt={
                                            propertyItem.property_code_name +
                                            ' at Instafarms'
                                        }
                                        width={400}
                                        height={300}
                                        loading="lazy"
                                    />
                                </div>
                            </div>

                            {propertyItem.plans.extras_plan && (
                                <div
                                    className={
                                        styles.section_block +
                                        ' ' +
                                        styles.column
                                    }
                                >
                                    <div className={styles.column}>
                                        <h3>Extra Guest Tariffs</h3>
                                        <div
                                            className={
                                                styles.FormRow +
                                                ' ' +
                                                styles.row
                                            }
                                        >
                                            {propertyItem.plans.extras_plan.rates.map(
                                                (rate, index) => (
                                                    <div
                                                        key={index}
                                                        className={
                                                            styles.column
                                                        }
                                                    >
                                                        <p
                                                            className={
                                                                styles.heading
                                                            }
                                                        >
                                                            {rate.label} (
                                                            {rate.minAge}-
                                                            {rate.maxAge}{' '}
                                                            Years)
                                                        </p>
                                                        <p
                                                            className={
                                                                styles.value
                                                            }
                                                        >
                                                            {getFormattedCurrency(
                                                                rate.rate,
                                                            )}
                                                            <span>
                                                                /night
                                                            </span>
                                                        </p>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div
                            className={
                                styles.payment_section_right +
                                ' ' +
                                styles.column
                            }
                        >
                            <div
                                className={
                                    styles.section_block +
                                    ' ' +
                                    styles.column
                                }
                            >
                                <h3>Price details</h3>
                                <p className={styles.sub_heading}>
                                    You pay zero convenience fee on this
                                    booking.
                                </p>
                                <div className={styles.priceRowDetails}>
                                    <span>
                                        Rental Charges (
                                        {propertyPrice.allGuestCount} Guest
                                        {propertyPrice.allGuestCount > 1
                                            ? 's'
                                            : ''}{' '}
                                        X {propertyPrice.bookingDays} Night
                                        {propertyPrice.bookingDays > 1
                                            ? 's'
                                            : ''}
                                        )
                                    </span>
                                    {getFormattedCurrency(
                                        parseFloat(
                                            propertyPrice.PriceBreakDown
                                                ?.totalPriceOrigional || 0,
                                        ) -
                                            parseFloat(
                                                propertyPrice.PriceBreakDown
                                                    ?.totalExtraPrice > 0
                                                    ? propertyPrice
                                                          .PriceBreakDown
                                                          .totalExtraPrice
                                                    : 0,
                                            ),
                                    )}
                                </div>

                                {propertyPrice.PriceBreakDown
                                    ?.totalExtraPrice > 0 && (
                                    <div className={styles.priceRowDetails}>
                                        <span>
                                            Extra Guest Price for{' '}
                                            {propertyPrice.bookingDays} night
                                            {propertyPrice.bookingDays > 1
                                                ? 's'
                                                : ''}
                                        </span>
                                        +{' '}
                                        {getFormattedCurrency(
                                            propertyPrice.PriceBreakDown
                                                ?.totalExtraPrice,
                                        )}
                                    </div>
                                )}

                                {propertyPrice.PriceBreakDown
                                    ?.totalDiscount > 0 && (
                                    <div className={styles.priceRowDetails}>
                                        <span>Discount</span>-{' '}
                                        {getFormattedCurrency(
                                            propertyPrice.PriceBreakDown
                                                ?.totalDiscount,
                                        )}
                                    </div>
                                )}

                                {propertyPrice.PriceBreakDown
                                    ?.nightsDiscountsFee > 0 && (
                                    <div className={styles.priceRowDetails}>
                                        <span>
                                            {propertyPrice.bookingDays} Night
                                            {propertyPrice.bookingDays > 1
                                                ? 's'
                                                : ''}{' '}
                                            Discounts (
                                            {
                                                propertyPrice.PriceBreakDown
                                                    ?.nightsDiscountsFeePer
                                            }
                                            %)
                                        </span>
                                        -{' '}
                                        {getFormattedCurrency(
                                            propertyPrice.PriceBreakDown
                                                ?.nightsDiscountsFee,
                                        )}
                                    </div>
                                )}

                                {propertyPrice.PriceBreakDown?.coupon &&
                                    propertyPrice.PriceBreakDown?.coupon
                                        ?.id && (
                                        <div
                                            className={
                                                styles.priceRowDetails
                                            }
                                        >
                                            <span>
                                                Coupon Discounts (
                                                {
                                                    propertyPrice
                                                        .PriceBreakDown
                                                        .coupon.coupon_code
                                                }
                                                )
                                            </span>
                                            -{' '}
                                            {getFormattedCurrency(
                                                propertyPrice.PriceBreakDown
                                                    ?.couponDiscount,
                                            )}
                                        </div>
                                    )}

                                <div className={styles.innnerwrapper}>
                                    <div className={styles.searchitme}>
                                        <div
                                            className={
                                                styles.coupon_code_dev
                                            }
                                        >
                                            <Input
                                                placeholder="Enter Coupon Code"
                                                onChange={(evt) =>
                                                    setCouponCode(
                                                        evt.target.value,
                                                    )
                                                }
                                                className={
                                                    styles.searchinput
                                                }
                                                type="text"
                                                value={couponCode}
                                            />
                                            <button
                                                className={
                                                    styles.code_button +
                                                    ' solidbtn fullwidth'
                                                }
                                                aria-label="Apply Coupon"
                                                onClick={() =>
                                                    applyCoupon(couponCode)
                                                }
                                            >
                                                Apply
                                            </button>
                                        </div>
                                        {couponCodeError && (
                                            <p className={styles.error}>
                                                {couponCodeError}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {propertyPrice.PriceBreakDown?.coupon
                                    ?.id && (
                                    <div className={styles.priceRowDetails}>
                                        <span
                                            className={styles.removeCoupon}
                                            onClick={() => removeCoupon()}
                                        >
                                            {
                                                propertyPrice.PriceBreakDown
                                                    .coupon.coupon_code
                                            }{' '}
                                            X
                                        </span>
                                    </div>
                                )}

                                <div
                                    className={
                                        styles.priceRow +
                                        ' ' +
                                        styles.priceRowDetails
                                    }
                                >
                                    <span>Total Price</span>
                                    {getFormattedCurrency(
                                        propertyPrice.bookingAmount,
                                    )}
                                </div>

                                <div className={styles.term_condition}>
                                    <Checkbox
                                        onClick={() =>
                                            setCheckedTandCond(
                                                !checkedTandCond,
                                            )
                                        }
                                        checked={
                                            checkedTandCond ? true : false
                                        }
                                    />
                                    <p>
                                        I have read and accepted the{' '}
                                        <Link
                                            href="/pages/terms-conditions"
                                            target="_blank"
                                        >
                                            Terms & Conditions
                                        </Link>
                                        ,{' '}
                                        <Link
                                            href="/pages/privacy-policy"
                                            target="_blank"
                                        >
                                            Privacy Policies
                                        </Link>
                                        ,{' '}
                                        <Link
                                            href="/pages/cancellation-refund-policy"
                                            target="_blank"
                                        >
                                            Cancellation Policy
                                        </Link>{' '}
                                        and{' '}
                                        <Link
                                            href="/pages/indemnity-form"
                                            target="_blank"
                                        >
                                            Indemnity Form
                                        </Link>
                                    </p>
                                </div>
                                {loadingPayment ? (
                                    <button
                                        className="solidbtn fullwidth"
                                        aria-label="Processing Payment"
                                    >
                                        Please Wait...
                                    </button>
                                ) : (
                                    <>
                                        {checkedTandCond ? (
                                            <button
                                                className="solidbtn fullwidth"
                                                onClick={() => checkout()}
                                                aria-label="Continue to Payment"
                                            >
                                                Continue
                                            </button>
                                        ) : (
                                            <button
                                                className="solidbtn fullwidth disabled"
                                                aria-label="Continue to Payment"
                                            >
                                                Continue
                                            </button>
                                        )}
                                    </>
                                )}
                                <div className={styles.secore_payment}>
                                    <div
                                        className={
                                            styles.secore_payment_left
                                        }
                                    >
                                        <img
                                            src={
                                                '/assets/images/shield_icon.png'
                                            }
                                        />
                                    </div>
                                    <div
                                        className={
                                            styles.secore_payment_right
                                        }
                                    >
                                        <p>100% Secure payment</p>
                                        <span>Trusted by 1Lakh+ guests</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}
        </>
    )
}