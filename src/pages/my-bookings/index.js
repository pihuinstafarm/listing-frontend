import React, { useState, useEffect, useRef } from 'react'
import { CircularLoader, isLoggedIn, getPropertyPrice } from 'utils/components'
import { authServices } from 'utils/services'
import Image from 'next/image'
import { Col, Container, Row } from 'react-bootstrap'
import Head from 'next/head'
import { Modal } from 'components'
import styles from './my-profile.module.scss'
import { bookingsServices, propertiesServices } from 'utils/services'
import Login from '../../containers/header/login'
import { useRouter } from 'next/router'
import { Link } from '@mui/material'

function MyBookings() {
  const router = useRouter()
  const [loading, setloading] = useState(true)
  const [showLogin, setShowLogin] = useState(false)
  const [isSubmitted, setisSubmitted] = useState(false)
  const [dataList, setDataList] = useState([])
  const [userId, setUserId] = useState([])

  const [upcomingList, setUpcomingList] = useState([])
  const [completedList, setCompletedList] = useState([])
  const [cancelledList, setCancelledList] = useState([])

  const [showBookingDetails, setshowBookingDetails] = useState(false)
  const [selectedItem, setSelectedItem] = useState()
  const [propertyDetail, setPropertyDetail] = useState()
  const [selectedTab, setSelectedTab] = useState()
  const [NightsCount, setNightsCount] = useState(0)
  const [propertyPrice, setPropertyPrice] = useState({ price: 0, days: '' })

  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const [shoReviewSection, setShoReviewSection] = useState(false)
  const [reviewDetail, setReviewDetail] = useState('')
  const [reviewSubmitted, setReviewSubmitted] = useState('')
  const [amountToRefund, setAmountToRefund] = useState(0)
  const [cancelError, setCancelError] = useState('')
  const [oldReviewsOptions, setOldReviewsOptions] = useState([
    { id: 1, label: 'Cleanliness', value: 0 },
    { id: 2, label: 'Staff Service', value: 0 },
    { id: 3, label: 'Value for Money', value: 0 },
    { id: 4, label: 'Location', value: 0 },
    { id: 5, label: 'Communication', value: 0 },
    { id: 6, label: 'Overall Rating', value: 0 }
  ])

  const [reviewsOptions, setReviewsOptions] = useState([
    { id: 1, label: 'Cleanliness', value: 0 },
    { id: 2, label: 'Staff Service', value: 0 },
    { id: 3, label: 'Value for Money', value: 0 },
    { id: 4, label: 'Location', value: 0 },
    { id: 5, label: 'Communication', value: 0 },
    { id: 6, label: 'Overall Rating', value: 0 }
  ])


  const metaTitle = 'My Bookings - Insta Farms'
  const metaDescription = ''
  const metaUrl = 'https://instafarms.in/my-bookings';
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




  const updatedReating = (item, value) => {
    let updatedReview = []
    reviewsOptions.forEach(element => {
      if (element.id == item.id) {
        element.value = value
      }
      updatedReview.push(element)

    });
    setReviewsOptions(updatedReview)

  }
  const updatedReviewText = (value) => {
    setReviewDetail(value)
  }

  const submitReview = () => {

    const isAuthUser = isLoggedIn()
    if (!isAuthUser) {
      setShowLogin(true)
      setloading(false)
    } else {
      let payload = {
        reviews: reviewsOptions,
        content: reviewDetail,
        booking_doc_id: selectedItem.id,
        booking_id: selectedItem.booking_id,
        property: selectedItem.property,
        user: selectedItem.user
      }
      propertiesServices.postReview(payload).then((submitReviewApiRes) => {
        setShoReviewSection(false)
        setSelectedItem([])
      })
    }

  }
  const showBookingReviewSection = (item) => {
    if (isReviewSubmitted(item)) {
      setReviewsOptions(item.reviews[item.reviews.length - 1].reviews)
      setReviewDetail(item.reviews[item.reviews.length - 1].content)
    } else {
      let updatedReview = []
      reviewsOptions.forEach(element => {
        element.value = 0
        updatedReview.push(element)

      });
      setReviewsOptions(updatedReview)
      setReviewDetail('')

    }
    setShoReviewSection(true)
    setSelectedItem(item)
  }
  const closeReviewModal = () => {
    setShoReviewSection(false)
    setSelectedItem([])
  }


  function datediff(first, second) {
    return Math.ceil((second - first) / (1000 * 60 * 60 * 24));
  }


  const getBeforeDate = (days) => {
    let d = new Date(selectedItem.from_date)
    console.log('=== getBeforeDate DEBUG ===');
    console.log('Input days:', days);
    console.log('Original from_date:', selectedItem.from_date);
    console.log('Original date object:', d);
    
    d.setDate(d.getDate() - days);
    console.log('Date after subtracting days:', d);
    
    let dateDIff = datediff(new Date(), d);
    console.log('Date difference:', dateDIff);
    console.log('Date difference > 1:', dateDIff > 1);
    console.log('Date difference >= -1:', dateDIff >= -1);
    
    if (dateDIff > 1) {
      const result = getFormattedDateNoDay(d);
      console.log('Returning formatted date:', result);
      console.log('=== END getBeforeDate DEBUG ===');
      return result
    } else if (dateDIff >= -1) {
      const result = getFormattedDateNoDay(d);
      console.log('Returning formatted date (within range):', result);
      console.log('=== END getBeforeDate DEBUG ===');
      return result
    } else {
      console.log('Returning false (too far in past)');
      console.log('=== END getBeforeDate DEBUG ===');
      return false
    }
  }
  const getFormattedDateNoDay = (dateString) => {
    let date = new Date(new Date(dateString));
    let formattedDate = date.getDate() + ' ' + date.toLocaleString('default', { month: 'short' }) + ' ' + date.getFullYear()
    return formattedDate
  }
  function hideBookingDetailsSection() {
    setSelectedItem('')
    setPropertyDetail('')
    setshowBookingDetails(false)
  }
  async function showBookingDetailsSection(item) {
    console.log("ITEM IN SHOW BOOKING DETAILS:", item);
    setloading(true)
    setSelectedItem(item)

    let second = new Date(item.to_date)
    let first = new Date(item.from_date)
    let nigths = Math.ceil((second - first) / (1000 * 60 * 60 * 24));

    // Debug: Log the night count calculation
    console.log('=== NIGHT COUNT DEBUG ===');
    console.log('Check-in date:', item.from_date);
    console.log('Check-out date:', item.to_date);
    console.log('First date object:', first);
    console.log('Second date object:', second);
    console.log('Time difference (ms):', second - first);
    console.log('Time difference (days):', (second - first) / (1000 * 60 * 60 * 24));
    console.log('Calculated nights (Math.ceil):', nigths);
    console.log('=== END NIGHT COUNT DEBUG ===');

    setNightsCount(nigths)

    // Debug: Check what property data is available in booking
    // console.log('Booking property data:', item.property);
    // console.log('Has featured_image:', !!item.property?.featured_image);
    // console.log('Has address_details:', !!item.property?.address_details);
    // console.log('Has caretaker:', !!item.property?.caretaker);
    // console.log('Has plans:', !!item.property?.plans);
    // console.log('Plans content:', item.property?.plans);
    // console.log('Shortterm cancellation plan:', item.property?.plans?.shortterm_cancellation_plan);
    // console.log('Longterm cancellation plan:', item.property?.plans?.longterm_cancellation_plan);

    // // Additional debugging for cancellation plans
    // console.log('=== CANCELLATION PLAN DEBUG ===');
    // console.log('Property ID:', item.property?.id);
    // console.log('Property plans object:', item.property?.plans);
    // console.log('Property plans keys:', item.property?.plans ? Object.keys(item.property?.plans) : 'No plans');
    
    // if (item.property?.plans) {
    //   console.log('Shortterm plan exists:', !!item.property.plans.shortterm_cancellation_plan);
    //   console.log('Longterm plan exists:', !!item.property.plans.longterm_cancellation_plan);
      
    //   if (item.property.plans.shortterm_cancellation_plan) {
    //     console.log('Shortterm plan details:', item.property.plans.shortterm_cancellation_plan);
    //     console.log('Shortterm refunds:', item.property.plans.shortterm_cancellation_plan.refunds);
    //   }
      
    //   if (item.property.plans.longterm_cancellation_plan) {
    //     console.log('Longterm plan details:', item.property.plans.longterm_cancellation_plan);
    //     console.log('Longterm refunds:', item.property.plans.longterm_cancellation_plan.refunds);
    //   }
    // }
    // console.log('=== END CANCELLATION PLAN DEBUG ===');

    let payload = {
      propertyItem: item.property,
      startdate: item.from_date,
      enddate: item.to_date,
      adult: item.guests.adult,
      children: item.guests.children,
      infant: item.guests.infant,
    }

    const PropertyPrice = getPropertyPrice(payload);

    // Debug: Log the propertyPrice calculation
    console.log('=== PROPERTY PRICE DEBUG ===');
    console.log('Payload sent to getPropertyPrice:', payload);
    console.log('PropertyPrice result:', PropertyPrice);
    console.log('PropertyPrice.bookingDays:', PropertyPrice?.bookingDays);
    console.log('PropertyPrice.allGuestCount:', PropertyPrice?.allGuestCount);
    console.log('PropertyPrice.bookingAmount:', PropertyPrice?.bookingAmount);
    console.log('=== END PROPERTY PRICE DEBUG ===');

    // Try to fetch complete property details if property ID is available
    const needsCompleteData = !item.property?.featured_image || 
                             !item.property?.address_details || 
                             !item.property?.plans ||
                             !item.property?.plans?.shortterm_cancellation_plan ||
                             !item.property?.plans?.longterm_cancellation_plan;
    
    // console.log('Needs complete data?', needsCompleteData);
    // console.log('Missing featured_image?', !item.property?.featured_image);
    // console.log('Missing address_details?', !item.property?.address_details);
    // console.log('Missing plans?', !item.property?.plans);
    // console.log('Missing shortterm plan?', !item.property?.plans?.shortterm_cancellation_plan);
    // console.log('Missing longterm plan?', !item.property?.plans?.longterm_cancellation_plan);
    

    setshowBookingDetails(true)
    
    // Ensure we have a valid propertyPrice with correct night count
    if (PropertyPrice && PropertyPrice.bookingDays > 0) {
      setPropertyPrice(PropertyPrice)
    } else {
      // Fallback: create a basic propertyPrice object with the calculated night count
      const fallbackPropertyPrice = {
        allGuestCount: (item.guests.adult || 0) + (item.guests.children || 0) + (item.guests.infant || 0),
        bookingDays: nigths,
        bookingAmount: item.booking_amount || 0,
        PriceBreakDown: {
          totalPriceOrigional: item.booking_amount || 0,
          totalExtraPrice: 0,
          totalDiscount: 0,
          nightsDiscountsFee: 0,
          nightsDiscountsFeePer: 0,
          coupon: null,
          couponDiscount: 0
        }
      }
      setPropertyPrice(fallbackPropertyPrice)
    }
    
    // setPropertyDetail(item.property)
    // console.log('Setting property detail with booking property data');  
    // console.log('Property detail being set:', item.property);


    if (item.property?.id && needsCompleteData) {
      console.log('Fetching complete property details for ID:', item.property.id);
      try {
        const apiResponse = await propertiesServices.getById(item.property.id);
        console.log('API Response:', apiResponse);
        const completePropertyData = apiResponse?.data || apiResponse;
        // console.log('Complete property data:', completePropertyData);
        
        // Debug the API response structure
        // console.log('=== API RESPONSE DEBUG ===');
        // console.log('API Response structure:', {
        //   hasData: !!apiResponse?.data,
        //   hasSuccess: !!apiResponse?.success,
        //   responseKeys: Object.keys(apiResponse || {}),
        //   dataKeys: apiResponse?.data ? Object.keys(apiResponse.data) : 'No data'
        // });
        
        // if (apiResponse?.data) {
        //   console.log('Data plans:', apiResponse.data.plans);
        //   console.log('Data shortTermCancellationPlan:', apiResponse.data.shortTermCancellationPlan);
        //   console.log('Data longTermCancellationPlan:', apiResponse.data.longTermCancellationPlan);
        // }
        // console.log('=== END API RESPONSE DEBUG ===');

        // if (completePropertyData.success && completePropertyData) {
        //   const apiData = completePropertyData;
        //   console.log('Starting mapping process with apiData:', apiData);
        //   console.log('apiData.propertyName:', apiData.propertyName);
        //   console.log('apiData.images:', apiData.images);
        //   console.log('apiData.area:', apiData.area);
        //   console.log('apiData.city:', apiData.city);

        //   // Map API response to UI expected structure
        //   const mappedPropertyData = {
        //     ...apiData,
        //     property_code_name: apiData.propertyName || apiData.name || apiData.heading,
        //     featured_image: apiData.images && apiData.images.length > 0 ? apiData.images[0] :
        //       apiData.featuredImage ? apiData.featuredImage : null,
        //     address_details: {
        //       area_name: apiData.area?.name || apiData.areaName || '',
        //       city_name: apiData.city?.name || apiData.cityName || '',
        //       latitude: apiData.latitude,
        //       longitude: apiData.longitude
        //     },
        //     caretaker: apiData.caretaker || apiData.propertyManager || null,
        //     plans: apiData.plans
        //   };

        //   console.log('MAPPED PROPERTY DATA RESULT:', {
        //     property_code_name: mappedPropertyData.property_code_name,
        //     featured_image: mappedPropertyData.featured_image,
        //     address_details: mappedPropertyData.address_details,
        //     caretaker: mappedPropertyData.caretaker,
        //     plans: mappedPropertyData.plans
        //   });

        //   console.log('About to set property detail with mapped data');
        //   setPropertyDetail(mappedPropertyData);
        // } else {
          // setPropertyDetail(item.property);
          // console.log('Setting property detail with complete data');
          // console.log('Complete data plans:', completePropertyData?.plans);
          setPropertyDetail(completePropertyData);
          
          // Debug the final propertyDetail object
          // console.log('=== FINAL PROPERTY DETAIL DEBUG ===');
          // console.log('Final propertyDetail object:', completePropertyData);
          // console.log('Final plans:', completePropertyData?.plans);
          // console.log('Final shortterm plan:', completePropertyData?.plans?.shortterm_cancellation_plan);
          // console.log('Final longterm plan:', completePropertyData?.plans?.longterm_cancellation_plan);
          // console.log('=== END FINAL PROPERTY DETAIL DEBUG ===');
        // }
      } catch (error) {
        console.error('Error fetching complete property details:', error);
        // console.log('Falling back to booking property data');
        setPropertyDetail(item.property);
      }
    } else {
      // console.log('Using booking property data directly');
      setPropertyDetail(item.property);
    }

    // setshowBookingDetails(true)
    // setPropertyPrice(PropertyPrice)
    setloading(false)
  }

  async function cancelBooking() {
    let booking_amount = selectedItem.booking_amount
    let booking_day = selectedItem.booking_days
    let from_date = selectedItem.from_date
    let amounttoRefund = 0
    let refunds = ''
    if (booking_day > 3) {
      refunds = propertyDetail.plans?.longterm_cancellation_plan ? propertyDetail.plans?.longterm_cancellation_plan.refunds : ''
    } else {
      refunds = propertyDetail.plans?.shortterm_cancellation_plan ? propertyDetail.plans?.shortterm_cancellation_plan.refunds : ''
    }
    if (refunds) {
      let today = new Date();
      let start_date = new Date(from_date); // Make sure 'from_date' is in a valid date format
      let timeDifference = start_date - today; // Difference in milliseconds
      let daysLeft = Math.ceil(timeDifference / (1000 * 60 * 60 * 24)); // Convert to days and round up
      let activeRefund = refunds.find(refund => {
        if (refund.beforeAfter === "lessthan") {
          return daysLeft < refund.days;
        } else if (refund.beforeAfter === "morethan") {
          return daysLeft > refund.days;
        }
        return false;
      });
      amounttoRefund = (booking_amount * activeRefund.refund) / 100
    }
    setAmountToRefund(amounttoRefund)

    const isAuthUser = isLoggedIn()
    if (!isAuthUser) {
      setShowLogin(true)
      setloading(false)
    } else {
      setShowConfirmationModal(true)
    }
  }
  async function ContinueCancelBooking() {
    setCancelError('')
    setloading(true)
    propertiesServices.cancelBookingApi(selectedItem.id).then((apiResponse) => {
      setloading(false)
      if (apiResponse.success) {
        setCancelError('')
        setShowConfirmationModal(false)
        setSelectedItem('')
        setPropertyDetail('')
        setshowBookingDetails(false)
        setShowConfirmationModal(false)
        loadMyBookings()
      } else {
        setCancelError(apiResponse.message)
      }
    })


  }
  const closeModal = () => {
    setShowConfirmationModal(false)
  }

  useEffect(() => {

    const isAuthUser = isLoggedIn()
    if (!isAuthUser) {
      setShowLogin(true)
      setloading(false)
    } else {
      setSelectedItem('')
      setPropertyDetail('')
      setshowBookingDetails(false)
      setShowConfirmationModal(false)

      if (selectedTab) {
        if (selectedTab == 'Upcoming') {
          // console.log('=== SWITCHING TO UPCOMING TAB ===');
          // console.log('Upcoming list:', upcomingList);
          // console.log('Upcoming list length:', upcomingList.length);
          setDataList(upcomingList)
        }
        if (selectedTab == 'Completed') {
          // console.log('=== SWITCHING TO COMPLETED TAB ===');
          // console.log('Completed list:', completedList);
          // console.log('Completed list length:', completedList.length);
          setDataList(completedList)
        }
        if (selectedTab == 'Cancelled') {
          // console.log('=== SWITCHING TO CANCELLED TAB ===');
          // console.log('Cancelled list:', cancelledList);
          // console.log('Cancelled list length:', cancelledList.length);
          setDataList(cancelledList)
        }

      }
    }

  }, [selectedTab])

  function handleStorageChange() {
    const isAuthUser = isLoggedIn()
    if (isAuthUser) {
      loadMyBookings()
    } else {
      setShowLogin(true)
    }

  }
  useEffect(() => {
    window.addEventListener('storage', handleStorageChange)
    const isAuthUser = isLoggedIn()
    if (!isAuthUser) {
      setShowLogin(true)
      setloading(false)
    } else {
      loadMyBookings()
    }
  }, [])



  function loadMyBookings() {
    setloading(true)
    authServices.getProfile().then((data) => {
      setUserId(data.id)
      let bookingsResponse = data.bookings

      // Debug: Log the bookings data to see what we're receiving
      // console.log('=== BOOKINGS DATA DEBUG ===');
      // console.log('Raw bookings response:', bookingsResponse);
      // if (bookingsResponse && bookingsResponse.length > 0) {
        // console.log('First booking sample:', bookingsResponse[0]);
        // console.log('First booking keys:', Object.keys(bookingsResponse[0]));
        // console.log('First booking isPaid:', bookingsResponse[0].isPaid);
        // console.log('First booking status:', bookingsResponse[0].status);
        // console.log('First booking cancelled_at:', bookingsResponse[0].cancelled_at);
        // console.log('First booking refund_amount:', bookingsResponse[0].refund_amount);
        // console.log('First booking refund_status:', bookingsResponse[0].refund_status);
      // }
      // console.log('=== END BOOKINGS DATA DEBUG ===');

      setSelectedTab('Upcoming')
      setDataList([])
      let UpcomingDataList = []
      let CompletedDataList = []
      let CancelledDataList = []
      if (bookingsResponse && bookingsResponse.length > 0) {
        bookingsResponse.forEach(element => {
          // Debug: Log the status value to see what we're getting
          // console.log(`=== BOOKING STATUS DEBUG ===`);
          // console.log(`Booking ID: ${element.booking_id}`);
          // console.log(`Status: "${element.status}"`);
          // console.log(`Status type: ${typeof element.status}`);
          // console.log(`Status length: ${element.status?.length}`);
          // console.log(`Cancelled at: ${element.cancelled_at}`);
          // console.log(`Refund amount: ${element.refund_amount}`);
          // console.log(`Refund status: ${element.refund_status}`);
          // console.log(`=== END BOOKING STATUS DEBUG ===`);
          
          if (element.status !== 'cancelled') {
            let dateStatus = checkDateStatus(element.to_date)
            // console.log(`Date status for non-cancelled booking: ${dateStatus}`);
            if (dateStatus == 'Upcoming') {
              element['booking_status'] = 'Upcoming'
              UpcomingDataList.push(element)
              // console.log(`Added to Upcoming list: ${element.booking_id}`);
            }
            if (dateStatus == 'Passed') {
              element['booking_status'] = 'Completed'
              if (element.property && element.property.id) {
                propertiesServices.getById(element.property.id).then((property) => {
                  element['reviews'] = property.reviews
                })
              }
              CompletedDataList.push(element)
              // console.log(`Added to Completed list: ${element.booking_id}`);
            }
          } else if (element.status === 'cancelled') {
            element['booking_status'] = 'Cancelled'
            CancelledDataList.push(element)
            // console.log(`Added to Cancelled list: ${element.booking_id}`);
          }
        });
      }

      UpcomingDataList.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      CancelledDataList.sort((a, b) => {
        // Handle cases where cancelled_at might be null
        const aDate = a.cancelled_at ? new Date(a.cancelled_at) : new Date(a.created_at);
        const bDate = b.cancelled_at ? new Date(b.cancelled_at) : new Date(b.created_at);
        return bDate - aDate;
      });
      CompletedDataList.sort((a, b) => new Date(b.to_date) - new Date(a.to_date));

      // Debug: Log the final categorized lists
      // console.log('=== FINAL CATEGORIZED LISTS ===');
      // console.log('UpcomingDataList:', UpcomingDataList);
      // console.log('UpcomingDataList length:', UpcomingDataList.length);
      // console.log('CompletedDataList:', CompletedDataList);
      // console.log('CompletedDataList length:', CompletedDataList.length);
      // console.log('CancelledDataList:', CancelledDataList);
      // console.log('CancelledDataList length:', CancelledDataList.length);
      // console.log('=== END FINAL CATEGORIZED LISTS ===');

      setUpcomingList(UpcomingDataList)
      setCompletedList(CompletedDataList)
      setCancelledList(CancelledDataList)
      setDataList(UpcomingDataList)
      setloading(false)

    })



  }

  function checkDateStatus(inputDate) {
    const today = new Date();
    const dateToCheck = new Date(inputDate);

    if (dateToCheck > today) {
      return 'Upcoming';
    } else if (dateToCheck < today) {
      return 'Passed';
    } else {
      return 'Upcoming';
    }
  }

  const getFormattedCurrency = (price) => {
    return '₹' + new Intl.NumberFormat().format(parseFloat(price).toFixed(2));
  }


  const getFormattedDate = (dateStringBH) => {
    let dateString = new Date(dateStringBH)
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
    return dayNames[dateString.getDay()] + ', ' + dateString.toLocaleString('default', { month: 'short' }) + ' ' + dateString.getDate().toString().padStart(2, '0') + ' ' + dateString.getFullYear()
  }


  const isReviewSubmitted = (item) => {
    let returnValue = false
    if (item.reviews && item.reviews.length > 0) {
      let reviews = item.reviews
      reviews.forEach(review => {
        if (review.user.id == userId) {
          returnValue = true
        }
      })
    }
    return returnValue


  }
  const checkValidBeforeDate = (refundsList) => {
    let returnVale = false
    // console.log('=== checkValidBeforeDate DEBUG ===');
    // console.log('refundsList:', refundsList);
    // console.log('selectedItem.from_date:', selectedItem.from_date);
    
    if (refundsList && refundsList.length > 0) {
      let d = new Date(selectedItem.from_date)
      // console.log('Original date:', d);
      refundsList.forEach(refund => {
        // console.log('Processing refund:', refund);
        d.setDate(d.getDate() - refund.days);
        // console.log('Date after subtracting days:', d);
        let dateDIff = datediff(new Date(), d);
        // console.log('Date difference:', dateDIff);
        if (dateDIff > 1) {
          returnVale = true
          // console.log('Setting returnVale to true');
        }
      })
    } else {
      console.log('No refunds list or empty list');
    }
    
    // console.log('Final returnVale:', returnVale);
    // console.log('=== END checkValidBeforeDate DEBUG ===');
    return returnVale
  }
  if (loading) {
    return (
      <div className="full_screen_loading flex justify-center items-center h-[75%] w-full">
        <CircularLoader />
      </div>
    )
  }

  if (showBookingDetails) {
    return (
      <Container className="page_content">
        {showConfirmationModal && <Modal classname={styles.bookingWrapper} onClose={closeModal} isOpen={showConfirmationModal}>
          <div className={styles.header}>
            <h1>Please Confirm Booking Cancellation For</h1>
            <h2>Property {selectedItem.property?.property_code_name}</h2>
          </div>

          {cancelError != '' ? <div className={styles.content}>
            <p className={styles.success_mesage}>
              {cancelError}
            </p>
            <div className={styles.row_btns}>
              <button className={' plainbtn'} aria-label='Close' onClick={() => closeModal()}>
                Ok
              </button>
            </div>
          </div> : <div className={styles.content}>
            <p className={styles.success_mesage}>
              Are you sure you want to cancel this booking? Cancellation will not be undone.
            </p>
            <p>On this Cancellation you will get {getFormattedCurrency(amountToRefund)} refund</p>
            <div className={styles.row_btns}>
              <button className={' solidbtn'} aria-label='Yes Cancel' onClick={() => ContinueCancelBooking()}>
                Yes Cancel
              </button>
              <button className={' plainbtn'} aria-label='Close' onClick={() => closeModal()}>
                No
              </button>
            </div>
          </div>}

        </Modal>}

        <section className='inner_section'>
          <div className={styles.profile_page_content}>
            <p onClick={() => hideBookingDetailsSection()}>Back to bookings</p>
          </div>

          {propertyDetail && <div className={styles.booking_detail}>
            {/* {console.log('propertyDetail keys:', Object.keys(propertyDetail))} */}

            <div className={styles.detail_section}>
              <h3>Property Info</h3>
              <div className={styles.detail_section_inner}>
                {/* {console.log('Rendering with values:', {
                  property_code_name: propertyDetail.property_code_name,
                  featured_image: propertyDetail.featured_image,
                  address_details: propertyDetail.address_details,
                  caretaker: propertyDetail.caretaker
                })} */}
                <div className={styles.left_section}>
                  {/* <p style={{ color: 'red', fontWeight: 'bold' }}>DEBUG: Left section rendering</p> */}
                  {/* {propertyDetail.featured_image ? ( */}
                    <Image src={propertyDetail.featured_image.url}
                      alt={propertyDetail.property_code_name + ' at Instafarms'}
                      width={400} height={300}
                      loading="lazy" />
                  {/* ) : (
                    <p style={{ color: 'orange' }}>No featured image available</p>
                  )} */}
                </div>
                <div className={styles.right_section}>
                  {/* <p style={{ color: 'red', fontWeight: 'bold' }}>DEBUG: Right section rendering</p> */}
                  <h4>{propertyDetail.property_code_name || 'No property name'}</h4>
                  {/* {propertyDetail.address_details ? ( */}
                    <p className={styles.address}>
                      <Image className='smallIcon' alt={'InstaFarms ' + propertyDetail.property_code_name + ' address'} width={12} height={12} src={'/assets/images/user_location.webp'} />
                      {propertyDetail.address_details.area_name || 'No area'}, {propertyDetail.address_details.city_name || 'No city'}
                    </p>
                  {/* ) : (
                    <p style={{ color: 'orange' }}>No address details available</p>
                  )} */}
                  {/* {propertyDetail.caretaker ? ( */}
                    <p className={styles.address}>
                      <Image className='smallIcon' alt={'InstaFarms ' + propertyDetail.property_code_name + ' address'} width={12} height={12} src={'/assets/images/svg/PhoneIcon.png'} />
                      <a href={'tel:+91' + propertyDetail.caretaker.phone}>+91-{propertyDetail.caretaker.phone}</a>
                    </p>
                  {/* ) : (
                    <p style={{ color: 'orange' }}>No caretaker info available</p>
                  )} */}
                  {/* {propertyDetail.address_details?.latitude ? ( */}
                    <p className={styles.address}>
                      <a className={'solidbtn'} href={'https://www.google.com/maps?q=' + propertyDetail.address_details?.latitude + ',' + propertyDetail.address_details?.longitude}>View on Map</a>
                    </p>
                  {/* ) : (
                    <p style={{ color: 'orange' }}>No map coordinates available</p>
                  )} */}
                </div>
                <div className={styles.map_section}>
                </div>

              </div>

            </div>

            <div className={styles.detail_section}>
              <h3>Booking Info</h3>
              <div className={styles.detail_section_inner}>

                <div className={styles.full_section}>
                  <h4>ID: {selectedItem.booking_id}</h4>
                  <div className={styles.detail_section_inner}>
                    <div className={styles.item_row_dates}>
                      <div className={styles.date}>
                        <p>Check in</p>
                        <p className={styles.strong}>{getFormattedDate(selectedItem.from_date)}</p>
                      </div>
                      <div className={styles.date}>
                        <p>Check out</p>
                        <p className={styles.strong}>{getFormattedDate(selectedItem.to_date)}</p>
                      </div>

                    </div>
                  </div>

                </div>


              </div>

            </div>

            <div className={styles.detail_section}>
              <h3>Guest Info</h3>
              <div className={styles.detail_section_inner}>
                <div className={styles.full_section}>
                  <h4>Lead Guest Info: {selectedItem.user.name}</h4>
                  <p><b>Booked Capacity:</b> {selectedItem.guests.adult} Adults, {selectedItem.guests.children} Children, {selectedItem.guests.infant} Infant </p>
                </div>
              </div>
            </div>

            <div className={styles.detail_section}>
              <h3>Cancellation Policy</h3>
              <div className={styles.detail_section_inner + ' ' + styles.CancellationPlans}>
                {/* Debug cancellation policy data
                {console.log('=== CANCELLATION POLICY RENDER DEBUG ===')}
                {console.log('propertyDetail:', propertyDetail)}
                {console.log('propertyDetail.plans:', propertyDetail?.plans)}
                {console.log('NightsCount:', NightsCount)}
                {console.log('Shortterm plan exists:', !!propertyDetail?.plans?.shortterm_cancellation_plan)}
                {console.log('Longterm plan exists:', !!propertyDetail?.plans?.longterm_cancellation_plan)}
                {console.log('=== END CANCELLATION POLICY RENDER DEBUG ===')} */}
                
                {/* Show debug info in UI for development
                {typeof window !== 'undefined' && window.location.hostname === 'localhost' && (
                  <div style={{ background: '#f0f0f0', padding: '10px', margin: '10px 0', fontSize: '12px' }}>
                    <strong>DEBUG INFO:</strong><br/>
                    Plans object: {JSON.stringify(propertyDetail?.plans, null, 2)}<br/>
                    Nights count: {NightsCount}<br/>
                    Has shortterm plan: {!!propertyDetail?.plans?.shortterm_cancellation_plan}<br/>
                    Has longterm plan: {!!propertyDetail?.plans?.longterm_cancellation_plan}
                  </div>
                )} */}
                
                {NightsCount > 0 && NightsCount < 3 ? <>
                  {propertyDetail.plans?.shortterm_cancellation_plan && <>
                    {checkValidBeforeDate(propertyDetail.plans.shortterm_cancellation_plan.refunds) ? <>
                      {propertyDetail.plans.shortterm_cancellation_plan.refunds.map((rate, index) => (<>
                        {getBeforeDate(rate.days) && <div
                          className={`${styles.right_section}  
                                          ${rate.refund == 0 ? styles.NonRefundable : ""
                            } ${rate.refund == 100 ? styles.FullyRefundabl : ""
                            } ${rate.refund > 0 && rate.refund < 100 ? styles.PartiallyRefundable : ""
                            }  
                                          `}>
                          <p className={styles.value}> {rate.refund == 0 ? 'Non Refundable' : rate.refund == 100 ? 'Fully Refundable' : 'Partially Refundable'}</p>
                          <p className={styles.heading}>{rate.refund + '% refundable if you cancel the booking '}{rate.beforeAfter == "lessthan" ? 'on/after ' : 'before '} {getBeforeDate(rate.days)} 11:59 PM IST</p>

                        </div>}
                      </>))}
                    </> : <>
                      <div className={styles.right_section + ' ' + styles.NonRefundable}>
                        <p className={styles.value}>Non Refundable</p>
                        <p className={styles.heading}>0% Refund if you cancel this booking as the booking date is very close to the date of staying.</p>

                      </div>
                    </>}
                  </>}

                </> : <>
                  {propertyDetail.plans?.longterm_cancellation_plan && <>
                    {checkValidBeforeDate(propertyDetail.plans.longterm_cancellation_plan.refunds) ? <>
                      {propertyDetail.plans.longterm_cancellation_plan.refunds.map((rate, index) => (<>
                        {getBeforeDate(rate.days) && <div className={`${styles.right_section}  
                                          ${rate.refund == 0 ? styles.NonRefundable : ""
                          } ${rate.refund == 100 ? styles.FullyRefundabl : ""
                          } ${rate.refund > 0 && rate.refund < 100 ? styles.PartiallyRefundable : ""
                          }  
                                          `}>
                          <p className={styles.value}> {rate.refund == 0 ? 'Non Refundable' : rate.refund == 100 ? 'Fully Refundable' : 'Partially Refundable'}</p>
                          <p className={styles.heading}>{rate.refund + '% refundable if you cancel the booking '}{rate.beforeAfter == "lessthan" ? 'on/after ' : 'before '} {getBeforeDate(rate.days)} 11:59 PM IST</p>

                        </div>}
                      </>))}
                    </> : <>
                      <div className={styles.right_section + ' ' + styles.NonRefundable}>
                        <p className={styles.value}>Non Refundable</p>
                        <p className={styles.heading}>0% Refund if you cancel this booking as the booking date is very close to the date of staying.</p>

                      </div>
                    </>}
                  </>}
                </>}
                
                {/* Debug the cancellation policy logic
                {console.log('=== CANCELLATION POLICY LOGIC DEBUG ===')}
                {console.log('NightsCount > 0 && NightsCount < 3:', NightsCount > 0 && NightsCount < 3)}
                {console.log('Shortterm plan exists:', !!propertyDetail?.plans?.shortterm_cancellation_plan)}
                {console.log('Longterm plan exists:', !!propertyDetail?.plans?.longterm_cancellation_plan)}
                {console.log('Shortterm refunds:', propertyDetail?.plans?.shortterm_cancellation_plan?.refunds)}
                {console.log('Longterm refunds:', propertyDetail?.plans?.longterm_cancellation_plan?.refunds)}
                {console.log('=== END LOGIC DEBUG ===')} */}
              </div>
              
              {/* Fallback message when no cancellation plans */}
              {(!propertyDetail?.plans?.shortterm_cancellation_plan && !propertyDetail?.plans?.longterm_cancellation_plan) && (
                <div className={styles.detail_section_inner}>
                  <div className={styles.right_section}>
                    <p className={styles.value}>Cancellation Policy Not Configured</p>
                    <p className={styles.heading}>
                      This property does not have a cancellation policy configured yet. 
                      <br/><br/>
                      {/* <strong>What this means:</strong>
                      <br/>• Cancellation terms are not defined
                      <br/>• Refund policies are not established
                      <br/>• Contact the property owner for cancellation terms
                      <br/><br/>
                      <strong>Recommendation:</strong> Contact the property owner or InstaFarms support to understand the cancellation terms for this booking. */}
                    </p>
                    
                    {/* Test button to manually fetch property data
                    <button 
                      onClick={async () => {
                        try {
                          console.log('=== MANUAL PROPERTY FETCH TEST ===');
                          const testResponse = await propertiesServices.getById(selectedItem.property.id);
                          console.log('Manual test response:', testResponse);
                          console.log('Manual test data:', testResponse?.data);
                          console.log('Manual test plans:', testResponse?.plans);
                          console.log('Manual test shortTerm:', testResponse?.shortTermCancellationPlan);
                          console.log('Manual test longTerm:', testResponse?.longTermCancellationPlan);
                          
                          // Show the difference between raw API response and expected structure
                          console.log('=== STRUCTURE ANALYSIS ===');
                          console.log('Raw API response keys:', Object.keys(testResponse || {}));
                          console.log('Expected plans structure:', {
                            plans: {
                              shortterm_cancellation_plan: 'should exist',
                              longterm_cancellation_plan: 'should exist'
                            }
                          });
                          console.log('Actual plans structure:', testResponse?.plans);
                          console.log('=== END STRUCTURE ANALYSIS ===');
                          
                          console.log('=== END MANUAL TEST ===');
                        } catch (error) {
                          console.error('Manual test error:', error);
                        }
                      }}
                      style={{ marginTop: '10px', padding: '5px 10px', fontSize: '12px' }}
                    >
                      Test Property Data Fetch
                    </button> */}
                  </div>
                </div>
              )}
              
              {selectedItem.booking_status == 'Upcoming' && <div className={styles.item_row_btns}>
                <button className={'solidbtn'} onClick={() => cancelBooking()}>Cancel my booking</button>
              </div>}
            </div>

            <div className={styles.detail_section}>
              <h3>Payment Info</h3>
              <div className={styles.detail_section_payment}>
                {propertyPrice.allGuestCount > 0 &&
                  <p>
                    <span>Rental Charges ({propertyPrice.allGuestCount} Guest{propertyPrice.allGuestCount > 1 ? 's' : ''} X {propertyPrice.bookingDays} Night{propertyPrice.bookingDays > 1 ? 's' : ''})</span>
                    {getFormattedCurrency(
                      parseFloat(propertyPrice.PriceBreakDown?.totalPriceOrigional || 0) -
                      parseFloat(propertyPrice.PriceBreakDown?.totalExtraPrice > 0
                        ? propertyPrice.PriceBreakDown.totalExtraPrice
                        : 0)
                    )}

                  </p>}


                {propertyPrice.PriceBreakDown?.totalExtraPrice > 0 && <p>
                  <span>Extra Guest Price for {propertyPrice.bookingDays} night{propertyPrice.bookingDays > 1 ? 's' : ''}</span>
                  + {getFormattedCurrency(propertyPrice.PriceBreakDown?.totalExtraPrice)}
                </p>}

                {propertyPrice.PriceBreakDown?.totalDiscount > 0 && <p>
                  <span>Discount</span>
                  - {getFormattedCurrency(propertyPrice.PriceBreakDown?.totalDiscount)}
                </p>}



                {propertyPrice.PriceBreakDown?.nightsDiscountsFee > 0 && <p>
                  <span>{propertyPrice.bookingDays} Night{propertyPrice.bookingDays > 1 ? 's' : ''} Discounts ({propertyPrice.PriceBreakDown?.nightsDiscountsFeePer}%)</span>
                  - {getFormattedCurrency(propertyPrice.PriceBreakDown?.nightsDiscountsFee)}
                </p>}

                {propertyPrice.PriceBreakDown?.coupon?.id && <p>
                  <span>Coupon Discounts ({propertyPrice.PriceBreakDown.coupon.coupon_code})</span>
                  - {getFormattedCurrency(propertyPrice.PriceBreakDown?.couponDiscount)}
                </p>}
                <p>
                  <span>Total Price</span>
                  {getFormattedCurrency(propertyPrice.bookingAmount)}
                </p>
              </div>


            </div>

          </div>}


        </section>
      </Container>
    )
  } else {
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
        <meta property="og:type" content="Profile Bookings Page" />
        <meta property="og:logo" content="http://instafarms.in/logo.webp" />
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
      {showLogin && <Login
        closeLogin={() => setShowLogin(false)}
        isOpen={showLogin}
      />}
      <Container className="page_content">
        <div className={'inner_section'}>
          <div className='breadcrum'>
            <Link scroll={true} aria-label='Home' href={`/`}>Home</Link>/
            <span>My Bookings</span>
          </div>
        </div>

        {shoReviewSection && selectedItem && <Modal classname={styles.bookingWrapper} onClose={closeReviewModal} isOpen={shoReviewSection}>
          <div className={styles.header}>
            {isReviewSubmitted(selectedItem) ? <h1>Update Review For</h1> : <h1>Submit Review For</h1>}
            <h2>Property {selectedItem.property?.property_code_name}</h2>
          </div>

          <div className={styles.content}>
            <div className={styles.review_options}>
              {reviewsOptions.map((item) => <div className={styles.review_option} key={item.label}>
                <p className={styles.review_label}>{item.label} </p>
                <p className={styles.review_starts}>
                  <Image onClick={() => updatedReating(item, 1)} alt={'1 Star Rating'} width={12} height={12} src={item.value > 0 ? '/assets/images/star_filled.png' : '/assets/images/star_blank.png'} />
                  <Image onClick={() => updatedReating(item, 2)} alt={'2 Star Rating'} width={12} height={12} src={item.value > 1 ? '/assets/images/star_filled.png' : '/assets/images/star_blank.png'} />
                  <Image onClick={() => updatedReating(item, 3)} alt={'3 Star Rating'} width={12} height={12} src={item.value > 2 ? '/assets/images/star_filled.png' : '/assets/images/star_blank.png'} />
                  <Image onClick={() => updatedReating(item, 4)} alt={'4 Star Rating'} width={12} height={12} src={item.value > 3 ? '/assets/images/star_filled.png' : '/assets/images/star_blank.png'} />
                  <Image onClick={() => updatedReating(item, 5)} alt={'5 Star Rating'} width={12} height={12} src={item.value > 4 ? '/assets/images/star_filled.png' : '/assets/images/star_blank.png'} />
                </p>
              </div>)}



              <div className={styles.review_option}>
                <p className={styles.review_label}>Detailed Review </p>
              </div>
              <div className={styles.review_option}>
                <div className={styles.textarea}>
                  <textarea className={styles.textareainput} onChange={(e) => updatedReviewText(e.target.value)} value={reviewDetail}></textarea>
                </div>
              </div>


            </div>

            <div className={styles.row_btns}>
              {isReviewSubmitted(selectedItem) ? <button className={' solidbtn'} aria-label='Yes Cancel' onClick={() => submitReview()}>
                Update Review
              </button> : <button className={' solidbtn'} aria-label='Yes Cancel' onClick={() => submitReview()}>
                Submit Review
              </button>}
              <button className={' plainbtn'} aria-label='Close' onClick={() => closeReviewModal()}>
                Cancel
              </button>
            </div>
          </div>

        </Modal>}

        <section className='inner_section'>
          <h1>My Bookings</h1>
          <div className={styles.profile_page_content}>
            <div className={styles.tabs}>
              <div className={selectedTab == 'Upcoming' ? styles.tab + ' ' + styles.active : styles.tab} onClick={() => setSelectedTab('Upcoming')}>Upcoming</div>
              <div className={selectedTab == 'Completed' ? styles.tab + ' ' + styles.active : styles.tab} onClick={() => setSelectedTab('Completed')}>Completed </div>
              <div className={selectedTab == 'Cancelled' ? styles.tab + ' ' + styles.active : styles.tab} onClick={() => setSelectedTab('Cancelled')}>Cancelled</div>
            </div>


            <div className={styles.list_section}>
              {dataList.map((item) =>
                <div className={styles.item} key={'selectedTab_' + item.booking_id}>

                  <div className={styles.item_row}>
                    <p className={styles.strong}>ID: {item.booking_id}</p>
                    <p className={styles.status}>
                      {/* Debug: Log the values being used for status calculation */}
                      {(() => {
                        const debugInfo = {
                          isPaid: item.isPaid,
                          status: item.status,
                          booking_id: item.booking_id
                        };
                        console.log('Payment status debug for booking:', debugInfo);
                        
                        const finalStatus = item.isPaid ? 'Paid' : 
                         item.status === 'Created' ? 'Confirmed' : 
                         item.status === 'pending' ? 'Pending Payment' : 
                         item.status === 'cancelled' ? 'Cancelled' : 
                         item.status || 'Not Paid';
                        
                        console.log('Final status calculated:', finalStatus);
                        return finalStatus;
                      })()}
                    </p>
                  </div>
                  <div className={styles.item_contnet}>
                    <div className={styles.item_row}>
                      <h3 >{item.property?.property_code_name}</h3>
                    </div>
                    <div className={styles.item_row_dates}>
                      <div className={styles.date}>
                        <p>Check in</p>
                        <p className={styles.strong}>{getFormattedDate(item.from_date)}</p>
                      </div>
                      <div className={styles.date}>
                        <p>Check out</p>
                        <p className={styles.strong}>{getFormattedDate(item.to_date)}</p>
                      </div>

                    </div>
                  </div>

                  <div className={styles.item_row_btns}>
                    <button className={'solidbtn'} onClick={() => showBookingDetailsSection(item)}>
                      Manage Booking
                    </button>
                    {item.booking_status == 'Completed' && <>
                      {isReviewSubmitted(item) ? <button onClick={() => showBookingReviewSection(item)} className={'plainbtn'}>
                        View your review
                      </button> : <button onClick={() => showBookingReviewSection(item)} className={'plainbtn'}>
                        Submit your review
                      </button>}
                    </>}


                  </div>

                </div>
              )}
            </div>


          </div>




        </section>
      </Container>
    </>
    )
  }
}

export default MyBookings
