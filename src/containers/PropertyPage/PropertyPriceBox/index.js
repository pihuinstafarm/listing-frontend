import React, { useEffect, useState, useRef } from 'react'

import { isLoggedIn, getPropertyPrice } from 'utils/components'

import styles from './index.module.scss'
import { Input } from '@mui/material'
import Image from 'next/image'
import { getLocalTimeZone, parseDate, today } from "@internationalized/date";
import GuestsModal from 'components/guestsmodal'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { Modal } from 'components'
import { enquiryServices, enquiryTrackingService } from 'utils/services'
import Login from '../../../containers/header/login'
import { propertiesServices } from 'utils/services'
import Link from 'next/link'
import Calendar from "./Calendar"

function PropertyPriceBox({ siteSettings, propertyItem, queryData }) {

  const CalendarRef = useRef(null)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const refGuest = useRef(null);
  const [propertyPrice, setPropertyPrice] = useState({ price: 0, days: '' })
  // Commented out unused states for booking flow
  // const [showModal, setShowModal] = useState(false)
  // const [showSummary, setShowSummary] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  // const [callBookingModal, setCallBookingModal] = useState(false)
  // const [callSupportModal, setCallSupportModal] = useState(false)
  // const [enquirySubmitted, setEnquirySubmitted] = useState(false)
  // const [formSubmmited, setFormSubmmited] = useState(false)
  // const [enquirySubmittedMessage, setEnquirySubmittedMessage] = useState(false)
  // const [bookedDates, setBookedDates] = useState(propertyItem.bookedDates ? propertyItem.bookedDates : []);
  // const [datesAvaliable, setDatesAvaliable] = useState(true);
  // const [queryString, setQueryString] = useState('');
  // const [CheckInOpen, setCheckInOpen] = useState(false)
  // const [showPriceBrakDown, setShowPriceBrakDown] = useState(false)
  
  // New states for Contact Property functionality
  const [showContactModal, setShowContactModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [contactFormData, setContactFormData] = useState({
    checkInDate: today(getLocalTimeZone()),
    checkOutDate: today(getLocalTimeZone()).add({ days: 1 }),
    guestCount: 2,
    eventType: ''
  })
  const [showContactCalendar, setShowContactCalendar] = useState(false)
  const [showContactGuests, setShowContactGuests] = useState(false)

  // Commented out unused booking payload states
  // const [searchPayload, setSearchPayload] = useState({
  //   dates: {
  //     start: today(getLocalTimeZone()),
  //     end: today(getLocalTimeZone()).add({ days: 1 }),
  //   },
  //   guestcount: 2,
  //   guest: { adult: 2, children: 0, infant: 0 }
  // })
  // const [selected, setSelected] = useState({
  //   start: today(getLocalTimeZone()),
  //   end: today(getLocalTimeZone()).add({ days: 1 })
  // })

  // Commented out old booking useEffect
  // useEffect(() => {
  //   if (queryData.startdate && queryData.enddate) {
  //     setSelected({
  //       start: parseDate(queryData.startdate),
  //       end: parseDate(queryData.enddate)
  //     })
  //     setSearchPayload({
  //       dates: {
  //         start: parseDate(queryData.startdate),
  //         end: parseDate(queryData.enddate),
  //       },
  //       guestcount: parseInt(queryData.adult) + parseInt(queryData.children) + parseInt(queryData.infant),
  //       guest: { adult: queryData?.adult, children: queryData?.children, infant: queryData?.infant }
  //     })
  //   }
  // }, [queryData])

  // Commented out old booking overlap function
  // function hasOverlap(newStartDate, newEndDate) {
  //   const allBlockedDates = getAllBlockedDates(bookedDates);
  //   const checkInBlockedDates = getCheckInBlockedDates(bookedDates);
  //   const excludeDates = allBlockedDates.map(date => formatDate(date))
  //   const excludeCheckInDates = checkInBlockedDates.map(date => formatDate(date))

  //   const bookingRange = generateDateRange(new Date(newStartDate), new Date(newEndDate));
  //   let newRangeTest = bookingRange.length > 0 ? bookingRange.slice(0, -1) : [];
  //   let blockedDates = [...excludeDates, ...excludeCheckInDates];
  //   return newRangeTest.some(date => blockedDates.includes(date));
  // }
  // Commented out old booking utility functions
  // function generateDateRange(startDate, endDate) {
  //   const dates = [];
  //   let currentDate = new Date(startDate);
  //   while (currentDate <= endDate) {
  //     dates.push(formatDate(currentDate));
  //     currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
  //   }

  //   return dates;
  // }
  // function formatDate(date) {
  //   let d = new Date(date)
  //   const year = d.getFullYear();
  //   const month = (d.getMonth() + 1).toString().padStart(2, "0");
  //   const day = d.getDate().toString().padStart(2, "0");
  //   return `${year}-${month}-${day}`;
  // }

  // New Contact Property functions
  const handleContactProperty = () => {
    const isAuthUser = isLoggedIn()
    if (isAuthUser) {
      setShowContactModal(true)
    } else {
      setShowLogin(true)
    }
  }

  const handleContactFormSubmit = async () => {
    try {
      // Helper function to format date to YYYY-MM-DD
      const formatDateToString = (dateObj) => {
        if (!dateObj) return null
        // Handle @internationalized/date objects
        if (dateObj.year && dateObj.month && dateObj.day) {
          const year = dateObj.year
          const month = String(dateObj.month).padStart(2, '0')
          const day = String(dateObj.day).padStart(2, '0')
          return `${year}-${month}-${day}`
        }
        // Fallback for regular Date objects
        if (dateObj instanceof Date) {
          return dateObj.toISOString().split('T')[0]
        }
        // If it's already a string, return as is
        if (typeof dateObj === 'string') {
          return dateObj
        }
        return null
      }

      const checkInDateString = formatDateToString(contactFormData.checkInDate)
      const checkOutDateString = formatDateToString(contactFormData.checkOutDate)
      
      // Console log the contact form data
      console.log('Contact Property Form Data:', {
        propertyName: propertyItem.property_code_name,
        checkInDate: checkInDateString,
        checkOutDate: checkOutDateString,
        guestCount: contactFormData.guestCount,
        eventType: contactFormData.eventType || 'Not specified'
      })
      
      // Helper function to normalize gathering type to match backend enum
      const normalizeGatheringType = (eventType) => {
        if (!eventType) return 'Friends'
        
        const lowerType = eventType.toLowerCase()
        if (lowerType.includes('wedding')) return 'Wedding'
        if (lowerType.includes('corporate') || lowerType.includes('business') || lowerType.includes('work')) return 'Corporate'
        if (lowerType.includes('family') || lowerType.includes('reunion')) return 'Family'
        
        // Default to Friends for any other type
        return 'Friends'
      }
      
      // Task 4: Create ContactEnquiry entry before showing success popup
      console.log("property id calling contact enquiry ", propertyItem.id)
      const contactEnquiryData = {
        propertyId: propertyItem.id,
        guestSize: contactFormData.guestCount,
        gatheringType: normalizeGatheringType(contactFormData.eventType),
        checkInDate: checkInDateString,
        checkOutDate: checkOutDateString,
      }
      
      const result = await enquiryTrackingService.createContactEnquiry(contactEnquiryData)
      
      if (result.success) {
        console.log('Contact enquiry tracked successfully:', result.data)
      } else {
        console.error('Failed to track contact enquiry:', result.error)
        // Continue with success flow even if tracking fails
      }
      
    } catch (error) {
      console.error('Error tracking contact enquiry:', error)
      // Continue with success flow even if tracking fails
    }
    
    // Close contact modal and show success modal
    setShowContactModal(false)
    setShowSuccessModal(true)
  }

  const updateContactFormData = (field, value) => {
    setContactFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleContactDateChange = (dates) => {
    setContactFormData(prev => ({
      ...prev,
      checkInDate: dates.start,
      checkOutDate: dates.end
    }))
    setShowContactCalendar(false)
  }

  const handleContactGuestChange = (guestData) => {
    const totalGuests = parseInt(guestData.adult || 0) + parseInt(guestData.children || 0) + parseInt(guestData.infant || 0)
    setContactFormData(prev => ({
      ...prev,
      guestCount: totalGuests
    }))
    setShowContactGuests(false)
  }
  function getAllBlockedDates(dates) {
    const dateSet = new Set(dates); // Convert array to Set for fast lookup
    return dates.filter(dateStr => {
      const date = new Date(dateStr);
      date.setUTCDate(date.getUTCDate() - 1); // Subtract 1 day
      return dateSet.has(date.toISOString()); // Keep only if previous day exists
    });
  }

  function getCheckInBlockedDates(dates) {
    const dateSet = new Set(dates); // Convert array to Set for fast lookup
    return dates.filter(dateStr => {
      const date = new Date(dateStr);
      date.setUTCDate(date.getUTCDate() - 1); // Subtract 1 day
      return !dateSet.has(date.toISOString()); // Keep only if previous day exists
    });
  }
  // Commented out old booking useEffect that depends on removed variables
  // useEffect(() => {
  //   setDatesAvaliable(true)
  //   if (searchPayload.dates) {

  //     let smonth = parseInt(searchPayload.dates.start.month)
  //     let emonth = parseInt(searchPayload.dates.end.month)

  //     let startdate = searchPayload.dates.start.year + '-' + smonth.toString().padStart(2, '0') + '-' + searchPayload.dates.start.day.toString().padStart(2, '0');
  //     let enddate = searchPayload.dates.end.year + '-' + emonth.toString().padStart(2, '0') + '-' + searchPayload.dates.end.day.toString().padStart(2, '0');
  //     if (hasOverlap(startdate, enddate)) {
  //       setDatesAvaliable(false)
  //     } else {
  //       const datesList = []
  //       for (const dt = new Date(startdate); dt <= new Date(enddate); dt.setDate(dt.getDate() + 1)) {
  //         let yyyy = dt.getFullYear();
  //         let mm = dt.getMonth() + 1; // Months start at 0!
  //         let dd = dt.getDate();

  //         if (dd < 10) dd = '0' + dd;
  //         if (mm < 10) mm = '0' + mm;

  //         let formattedToday = yyyy + '-' + mm + '-' + dd;
  //         datesList.push(formattedToday);
  //       }




  //       let adult = parseInt(searchPayload.guest.adult);
  //       let children = parseInt(searchPayload.guest.children);
  //       let infant = parseInt(searchPayload.guest.infant);
  //       let propertyId = propertyItem.id
  //       let searchQueryString = '?property=' + propertyId + '&startdate=' + startdate + '&enddate=' + enddate + '&adult=' + adult + '&children=' + children + '&infant=' + infant
  //       setQueryString(searchQueryString);
  //     }
  //   }

  // }, [bookedDates, searchPayload])

  // Commented out old price calculation useEffect that depends on removed searchPayload
  // useEffect(() => {
  //   let payload = {
  //     propertyItem: propertyItem,
  //     startdate: searchPayload.dates.start.year + '-' + parseInt(searchPayload.dates.start.month).toString().padStart(2, '0') + '-' + searchPayload.dates.start.day.toString().padStart(2, '0'),
  //     enddate: searchPayload.dates.end.year + '-' + parseInt(searchPayload.dates.end.month).toString().padStart(2, '0') + '-' + searchPayload.dates.end.day.toString().padStart(2, '0'),
  //     adult: searchPayload.guest.adult,
  //     children: searchPayload.guest.children,
  //     infant: searchPayload.guest.infant,
  //   }
  //   const PropertyPrice = getPropertyPrice(payload);

  //   setPropertyPrice(PropertyPrice)


  // }, [searchPayload])


  // Commented out old booked dates fetching useEffect that depends on removed setBookedDates
  // useEffect(() => {
  //   if (propertyItem.id) {
  //     propertiesServices.getById(propertyItem.id).then(async (result) => {
  //       if (result) {
  //         propertyItem['bookedDates'] = result.bookedDates ?? [];
  //         setBookedDates(result.bookedDates ?? [])
  //       }
  //     });
  //   }
  // }, [propertyItem.id]);

  const getFormattedDate = (dateString) => {
    if (dateString) {
      var dayNames = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
      let DateStr = dateString.year + '-' + dateString.month.toString().padStart(2, '0') + '-' + dateString.day.toString().padStart(2, '0');
      const date = new Date(DateStr);
      return dateString.day.toString().padStart(2, '0') + ' ' + date.toLocaleString('default', { month: 'short' }) + ' ' + dayNames[date.getDay()] + ' ' + dateString.year
    } else {
      return ''
    }
  }

  const getFormattedSmallDate = (dateString) => {
    if (dateString) {
      var dayNames = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
      let DateStr = dateString.year + '-' + dateString.month.toString().padStart(2, '0') + '-' + dateString.day.toString().padStart(2, '0');
      const date = new Date(DateStr);
      return dateString.day.toString().padStart(2, '0') + ' ' + date.toLocaleString('default', { month: 'short' }) + ' ' + dateString.year
    } else {
      return ''
    }
  }







  const updatePayload = (inputType, value) => {
    setSearchPayload((prev) => ({
      ...prev,
      [inputType]: value
    }))
  }


  // Commented out old useEffect that depends on removed setShowModal
  // useEffect(() => {
  //   const handleOutSideClick = (event) => {
  //     if (!refGuest.current?.contains(event.target)) {
  //       setShowModal(false)
  //     }
  //   };
  //   window.addEventListener("mousedown", handleOutSideClick);
  //   return () => {
  //     window.removeEventListener("mousedown", handleOutSideClick);
  //   };
  // }, [refGuest]);



  const openModal = async (modalName) => {
    setShowModal(modalName)
  }
  const getFormattedCurrency = (price) => {
    // Handle undefined, null, or NaN values
    if (!price || isNaN(price)) {
      return 'Price on request';
    }
    return '₹' + new Intl.NumberFormat().format(parseFloat(price).toFixed(2));
  }

  // Function to get property price from weekPrice array
  const getPropertyPriceValue = () => {
    // Check if weekPrice array exists and has data
    if (propertyItem.price_detail?.weekPrice && Array.isArray(propertyItem.price_detail.weekPrice)) {
      const weekPrices = propertyItem.price_detail.weekPrice;
      
      // Get the first day's price or find the minimum price
      const firstDayPrice = weekPrices[0]?.price || weekPrices[0]?.amount;
      
      if (firstDayPrice) {
        console.log('Using weekPrice array, first day price:', firstDayPrice);
        return firstDayPrice;
      }
      
      // Try to find any valid price in the array
      for (let dayPrice of weekPrices) {
        if (dayPrice.price || dayPrice.amount) {
          console.log('Using weekPrice array, found price:', dayPrice.price || dayPrice.amount);
          return dayPrice.price || dayPrice.amount;
        }
      }
    }
    
    // Fallback to other price fields
    const fallbackPrice = propertyItem.weekPrice || 
                         propertyItem.price ||
                         propertyItem.price_detail?.price ||
                         propertyItem.basePrice ||
                         propertyItem.nightPrice;
    
    console.log('Using fallback price:', fallbackPrice);
    return fallbackPrice;
  }

  // Function to get weekly price breakdown
  const getWeeklyPriceBreakdown = () => {
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    // Check if weekPrice array exists and has data
    if (propertyItem.price_detail?.weekPrice && Array.isArray(propertyItem.price_detail.weekPrice)) {
      const weekPrices = propertyItem.price_detail.weekPrice;
      
      return dayNames.map((dayName, index) => {
        const dayPrice = weekPrices[index];
        const price = dayPrice?.price || dayPrice?.amount || 0;
        
        return {
          day: dayName,
          price: price,
          shortDay: dayName.substring(0, 3)
        };
      });
    }
    
    // Fallback: create array with same price for all days
    const fallbackPrice = getPropertyPriceValue();
    return dayNames.map((dayName, index) => ({
      day: dayName,
      price: fallbackPrice,
      shortDay: dayName.substring(0, 3)
    }));
  }

  // Commented out old booking modal functions that depend on removed state variables
  // const showCallBookingModal = () => {
  //   setCallBookingModal(true)
  // }
  // const closeCallBookingModal = () => {
  //   setCallBookingModal(false)
  // }

  // const showCallSupprtyModal = () => {
  //   setCallSupportModal(true)
  // }
  // const closeCallSupprtyModal = () => {
  //   setCallSupportModal(false)
  // }



  // const closeSummary = () => {
  //   setShowSummary(false)
  // }

  // const openSummary = () => {
  //   const isAuthUser = isLoggedIn()
  //   const token = localStorage.getItem('token')
  //   const documentId = localStorage.getItem('documentId')
  //   if (isAuthUser && documentId && token) {
  //     setEnquirySubmitted(false)
  //     setShowSummary(true)
  //   } else {
  //     setShowLogin(true)
  //   }
  // }

  // const ConfirmEnquiry = () => {
  //   setFormSubmmited(true)
  //   setEnquirySubmitted(false)
  //   setEnquirySubmittedMessage('')
  //   let payloady = propertyPrice
  //   payloady['start_date'] = getFormattedDate(searchPayload.dates.start)
  //   payloady['end_date'] = getFormattedDate(searchPayload.dates.end)
  //   payloady['property_id'] = propertyItem.id
  //   payloady['user_id'] = localStorage.getItem('documentId')
  //   payloady['guests'] = searchPayload.guest

  //   enquiryServices.confirm(payloady).then((res) => {
  //     setFormSubmmited(false)
  //     if (!res.status) {
  //       setEnquirySubmittedMessage(res.error)
  //     } else {
  //       setEnquirySubmittedMessage('Thank You. Your enquiry has been successfully registered. Our team will get in touch with you shortly. You can also reach out to our team directly on this number 9154855985!')
  //     }
  //     setEnquirySubmitted(true)
  //   })


  // }


  Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
  }





  // Commented out old selectedChange function that depends on removed state variables
  // const selectedChange = (ev) => {
  //   if (ev.start) {
  //     let startDate = ev.start.year + '-' + ev.start.month.toString().padStart(2, "0") + '-' + ev.start.day.toString().padStart(2, "0")
  //     let endDate = ev.end.year + '-' + ev.end.month.toString().padStart(2, "0") + '-' + ev.end.day.toString().padStart(2, "0")
  //     if (startDate === endDate) {
  //       setCheckInOpen(true)
  //     } else {
  //       setSearchPayload((prev) => ({
  //         ...prev,
  //         ['dates']: { start: ev.start, end: ev.end }
  //       }))

  //       setSelected(ev)
  //       setCheckInOpen(false)
  //     }
  //   } else {
  //     setSelected('')
  //   }
  // }




  function goToPayment(url) {
    window.location = '/payment' + url
  }

  // Commented out old calendar click handler that depends on removed setCheckInOpen
  // function handleOutsideCalendarClick(e) {
  //   if (!CalendarRef.current?.contains(e.target)) {
  //     setCheckInOpen(false)
  //   }
  // }
  // useEffect(() => {
  //   document.addEventListener('mousedown', handleOutsideCalendarClick)
  //   return () => {
  //     document.removeEventListener('mousedown', handleOutsideCalendarClick)
  //   }
  // }, [])

  // Ref for the main card to scroll into view
  const priceBoxRef = useRef(null);

  // Commented out old scroll function that depends on removed setCheckInOpen
  // const scrollToPriceBox = () => {
  //   if (priceBoxRef.current) {
  //     priceBoxRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
  //     setCheckInOpen(true);
  //   }
  // };

  return (
    <>
      <div className={styles.searchbox} ref={priceBoxRef}>
        {/* Simplified mobile footer for Contact Property */}
        {isMobile && (
          <div className={styles.mobileFooter}>
            <div className={styles.mobilePriceRow}>
              <div className={styles.mobilePriceRowLeft}>
                <p>
                  {getFormattedCurrency(getPropertyPriceValue())} <span>Per Night</span>
                </p>
              </div>
              <button className="solidbtn" onClick={handleContactProperty} aria-label="Contact Property">
                Contact Property
              </button>
            </div>
          </div>
        )}
        {/* Commented out old price breakdown modal */}
        {/* {showPriceBrakDown && (
          <div className={styles.PriceBrakDown}>
            <p className={styles.closeIcon} onClick={() => setShowPriceBrakDown(false)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </p>
            <h1>Price breakdown</h1>
            <div className={styles.priceRowDetails}>
              <span>
                {propertyPrice.allGuestCount} Guest{propertyPrice.allGuestCount > 1 ? 's' : ''} X {propertyPrice.bookingDays} Night{propertyPrice.bookingDays > 1 ? 's' : ''}
              </span>
              {getFormattedCurrency(
                parseFloat(propertyPrice.PriceBreakDown?.totalPriceOrigional || 0) -
                parseFloat(
                  propertyPrice.PriceBreakDown?.totalExtraPrice > 0
                    ? propertyPrice.PriceBreakDown.totalExtraPrice
                    : 0
                )
              )}
            </div>
            {propertyPrice.PriceBreakDown?.totalExtraPrice > 0 && (
              <div className={styles.priceRowDetails}>
                <span>
                  Extra Guest Price for {propertyPrice.bookingDays} night{propertyPrice.bookingDays > 1 ? 's' : ''}
                </span>
                + {getFormattedCurrency(propertyPrice.PriceBreakDown?.totalExtraPrice)}
              </div>
            )}
            {propertyPrice.PriceBreakDown?.totalDiscount > 0 && (
              <div className={styles.priceRowDetails}>
                <span>Discount</span>
                - {getFormattedCurrency(propertyPrice.PriceBreakDown?.totalDiscount)}
              </div>
            )}
            {propertyPrice.PriceBreakDown?.nightsDiscountsFee > 0 && (
              <div className={styles.priceRowDetails}>
                <span>
                  {propertyPrice.bookingDays} Night{propertyPrice.bookingDays > 1 ? 's' : ''} Discounts ({propertyPrice.PriceBreakDown?.nightsDiscountsFeePer}%)
                </span>
                - {getFormattedCurrency(propertyPrice.PriceBreakDown?.nightsDiscountsFee)}
              </div>
            )}
            <div className={styles.priceRow + ' ' + styles.priceRowDetails}>
              <span></span>
              {getFormattedCurrency(propertyPrice.bookingAmount)}
            </div>
            <button className="solidbtn" onClick={() => goToPayment(queryString)} aria-label="Book Now">
              Book Now
            </button>
          </div>
        )} */}

        {/* Weekly price breakdown */}
        <div className={styles.weeklyPriceContainer}>
          <div className={styles.weeklyPriceHeader}>
            <h3>Weekly Pricing</h3>
          </div>
          <div className={styles.weeklyPriceGrid}>
            {getWeeklyPriceBreakdown().map((dayData, index) => (
              <div key={index} className={styles.dayPriceItem}>
                <div className={styles.dayName}>{dayData.shortDay}</div>
                <div className={styles.dayPrice}>{getFormattedCurrency(dayData.price)}</div>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.seprator}></div>

        {/* Commented out old booking form */}
        {/* <div className={styles.innnerwrapper}>
          <div className={styles.formRow}>
            <div className={styles.searchitme + ' checkin'}>
              <p className={styles.label}>Check In Dates</p>
              <p onClick={() => setCheckInOpen(!CheckInOpen)} className={styles.searchinput}>
                {selected.start && selected.end && (
                  <>
                    {getFormattedDate(selected.start)} - {getFormattedDate(selected.end)}
                  </>
                )}
              </p>
              {CheckInOpen && (
                <div ref={CalendarRef} className={styles.DateRangePickerSection}>
                  <Calendar propertyItem={propertyItem} selected={selected} selectedChange={selectedChange} />
                </div>
              )}
            </div>
          </div>

          <div className={styles.searchitme} ref={refGuest} id="GuestsModal">
            <p className={styles.label}>Guests</p>
            <Input
              readOnly
              onClick={e => openModal('GuestsModal')}
              className={styles.searchinput}
              type="text"
              value={searchPayload.guestcount + ' Guests'}
            />
            {showModal == 'GuestsModal' && (
              <GuestsModal maxguestcount={propertyItem.max_guest_count} guest={searchPayload.guest} updatePayload={updatePayload} />
            )}
          </div>
        </div> */}
        {/* Commented out old price breakdown and booking buttons */}
        {/* {selected.start && selected.end && propertyPrice.bookingDays > 0 && (
          <>
            <div className={styles.seprator}></div>
            {propertyPrice.allGuestCount > 0 && (
              <div className={styles.priceRowDetails}>
                <span>
                  {propertyPrice.allGuestCount} Guest{propertyPrice.allGuestCount > 1 ? 's' : ''} X {propertyPrice.bookingDays} Night{propertyPrice.bookingDays > 1 ? 's' : ''}
                </span>
                {getFormattedCurrency(
                  parseFloat(propertyPrice.PriceBreakDown?.totalPriceOrigional || 0) -
                  parseFloat(
                    propertyPrice.PriceBreakDown?.totalExtraPrice > 0
                      ? propertyPrice.PriceBreakDown.totalExtraPrice
                      : 0
                  )
                )}
              </div>
            )}
            {propertyPrice.PriceBreakDown?.totalExtraPrice > 0 && (
              <div className={styles.priceRowDetails}>
                <span>
                  Extra Guest Price for {propertyPrice.bookingDays} night{propertyPrice.bookingDays > 1 ? 's' : ''}
                </span>
                + {getFormattedCurrency(propertyPrice.PriceBreakDown?.totalExtraPrice)}
              </div>
            )}
            {propertyPrice.PriceBreakDown?.totalDiscount > 0 && (
              <div className={styles.priceRowDetails}>
                <span>Discount</span>
                - {getFormattedCurrency(propertyPrice.PriceBreakDown?.totalDiscount)}
              </div>
            )}
            {propertyPrice.PriceBreakDown?.nightsDiscountsFee > 0 && (
              <div className={styles.priceRowDetails}>
                <span>
                  {propertyPrice.bookingDays} Night{propertyPrice.bookingDays > 1 ? 's' : ''} Discounts ({propertyPrice.PriceBreakDown?.nightsDiscountsFeePer}%)
                </span>
                - {getFormattedCurrency(propertyPrice.PriceBreakDown?.nightsDiscountsFee)}
              </div>
            )}
            <div className={styles.priceRow + ' ' + styles.priceRowDetails}>
              <span></span>
              {getFormattedCurrency(propertyPrice.bookingAmount)}
            </div>
          </>
        )} */}
        
        {/* New Contact Property Button */}
        <button className="solidbtn fullwidth" onClick={handleContactProperty} aria-label="Contact Property">
          Contact Property
        </button>
        {isMobile ? (
          <Link
            ttile="Call Us"
            className="solidbtn fullwidth"
            href={`tel:${siteSettings.support_phone ? siteSettings.support_phone : '8019127474'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 2 4" width="16" height="16">
              <path d="M6.62 10.79a15.91 15.91 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1-.26 11.36 11.36 0 0 0 3.57.57 1 1 0 0 1 1 1v3.59a1 1 0 0 1-1 1A19 19 0 0 1 3 4a1 1 0 0 1 1-1H7.5a1 1 0 0 1 1 1 11.36 11.36 0 0 0 .57 3.57 1 1 0 0 1-.26 1Z" />
            </svg>
            Contact Support
          </Link>
        ) : (
          <button onClick={() => showCallSupprtyModal()} className="solidbtn fullwidth">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
              <path d="M6.62 10.79a15.91 15.91 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1-.26 11.36 11.36 0 0 0 3.57.57 1 1 0 0 1 1 1v3.59a1 1 0 0 1-1 1A19 19 0 0 1 3 4a1 1 0 0 1 1-1H7.5a1 1 0 0 1 1 1 11.36 11.36 0 0 0 .57 3.57 1 1 0 0 1-.26 1Z" />
            </svg>
            Contact Support
          </button>
        )}
      </div >
      {showLogin && (
        <Login closeLogin={() => setShowLogin(false)} onClose={() => setShowLogin(false)} />
      )}
      
      {/* New Contact Property Modal */}
      {showContactModal && (
        <Modal classname={styles.contactModalWrapper} onClose={() => setShowContactModal(false)} isOpen={showContactModal}>
          <div className={styles.contactModalHeader}>
            <div className={styles.contactModalIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="#8C684D"/>
              </svg>
            </div>
            <h1>Contact Property Owner</h1>
            <p>Send your enquiry for <strong>{propertyItem.property_code_name}</strong></p>
          </div>
          
          <div className={styles.contactModalContent}>
            <div className={styles.contactFormSection}>
              <div className={styles.contactFormRow}>
                <div className={styles.contactFormField}>
                  <label className={styles.contactFieldLabel}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 11H7V9H9V11ZM13 11H11V9H13V11ZM17 11H15V9H17V11ZM19 4H18V2H16V4H8V2H6V4H5C3.89 4 3.01 4.9 3.01 6L3 20C3 21.1 3.89 22 5 22H19C20.1 22 21 21.1 21 20V6C21 4.9 20.1 4 19 4ZM19 20H5V9H19V20Z" fill="#8C684D"/>
                    </svg>
                    Check-in & Check-out Dates
                  </label>
                  <div 
                    onClick={() => setShowContactCalendar(!showContactCalendar)} 
                    className={styles.contactDateInput}
                  >
                    <div className={styles.contactDateDisplay}>
                      <span className={styles.contactDateText}>
                        {contactFormData.checkInDate.day}/{contactFormData.checkInDate.month}/{contactFormData.checkInDate.year}
                      </span>
                      <span className={styles.contactDateSeparator}>→</span>
                      <span className={styles.contactDateText}>
                        {contactFormData.checkOutDate.day}/{contactFormData.checkOutDate.month}/{contactFormData.checkOutDate.year}
                      </span>
                    </div>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7 10L12 15L17 10H7Z" fill="#8C684D"/>
                    </svg>
                  </div>
                  {showContactCalendar && (
                    <div className={styles.contactCalendarWrapper}>
                      <Calendar 
                        propertyItem={propertyItem} 
                        selected={{start: contactFormData.checkInDate, end: contactFormData.checkOutDate}} 
                        selectedChange={handleContactDateChange} 
                      />
                    </div>
                  )}
                </div>
              </div>
              
              <div className={styles.contactFormRow}>
                <div className={styles.contactFormField}>
                  <label className={styles.contactFieldLabel}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16 4C16.55 4 17 4.45 17 5V7H20C20.55 7 21 7.45 21 8V19C21 19.55 20.55 20 20 20H4C3.45 20 3 19.55 3 19V8C3 7.45 3.45 7 4 7H7V5C7 4.45 7.45 4 8 4H16ZM15 6H9V7H15V6ZM12 17C13.1 17 14 16.1 14 15C14 13.9 13.1 13 12 13C10.9 13 10 13.9 10 15C10 16.1 10.9 17 12 17Z" fill="#8C684D"/>
                    </svg>
                    Number of Guests
                  </label>
                  <div 
                    onClick={() => setShowContactGuests(!showContactGuests)}
                    className={styles.contactGuestInput}
                  >
                    <span className={styles.contactGuestText}>
                      {contactFormData.guestCount} {contactFormData.guestCount === 1 ? 'Guest' : 'Guests'}
                    </span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7 10L12 15L17 10H7Z" fill="#8C684D"/>
                    </svg>
                  </div>
                  {showContactGuests && (
                    <div className={styles.contactGuestsWrapper}>
                      <GuestsModal 
                        maxguestcount={propertyItem.max_guest_count} 
                        guest={{adult: contactFormData.guestCount, children: 0, infant: 0}} 
                        updatePayload={(type, value) => {
                          if (type === 'guest') {
                            handleContactGuestChange(value)
                          }
                        }} 
                      />
                    </div>
                  )}
                </div>
              </div>
              
              <div className={styles.contactFormRow}>
                <div className={styles.contactFormField}>
                  <label className={styles.contactFieldLabel}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z" fill="#8C684D"/>
                    </svg>
                    Event Type <span className={styles.optionalText}>(Optional)</span>
                  </label>
                  <input
                    className={styles.contactTextInput}
                    type="text"
                    placeholder="e.g., Wedding, Corporate Event, Family Vacation"
                    value={contactFormData.eventType}
                    onChange={(e) => updateContactFormData('eventType', e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <div className={styles.contactModalActions}>
              <button 
                className={styles.contactCancelBtn} 
                onClick={() => setShowContactModal(false)}
                aria-label="Cancel Contact Request"
              >
                Cancel
              </button>
              <button 
                className={styles.contactSubmitBtn} 
                onClick={handleContactFormSubmit} 
                aria-label="Submit Contact Request"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z" fill="white"/>
                </svg>
                Send Enquiry
              </button>
            </div>
          </div>
        </Modal>
      )}
      
      {/* Success Modal */}
      {showSuccessModal && (
        <Modal classname={styles.summaryWrapper} onClose={() => setShowSuccessModal(false)} isOpen={showSuccessModal}>
          <div className={styles.header}>
            <h1>Success!</h1>
            <h2>Your contact request has been submitted</h2>
          </div>
          <div className={styles.content}>
            <p className={styles.success_mesage}>
              Thank you for your interest in {propertyItem.property_code_name}. The property owner will contact you soon with more details.
            </p>
            <button className="solidbtn" onClick={() => setShowSuccessModal(false)} aria-label="Close">
              Close
            </button>
          </div>
        </Modal>
      )}
      
      {/* Commented out old booking modals */}
      {/* {
        callBookingModal && (
          <Modal classname={styles.summaryWrapper} onClose={closeCallBookingModal} isOpen={callBookingModal}>
            <div className={styles.header}>
              <h1>Call & Book</h1>
              <h2>
                Call {siteSettings.central_phone ? siteSettings.central_phone : '8019127474'} to make a booking in this property.
              </h2>
            </div>
          </Modal>
        )
      } */}
      {/* {
        callSupportModal && (
          <Modal classname={styles.summaryWrapper} onClose={closeCallSupprtyModal} isOpen={callSupportModal}>
            <div className={styles.header}>
              <h1>Contact Support</h1>
              <h2>
                Call {siteSettings.support_phone ? siteSettings.support_phone : '8019127474'} to contact our support team.
              </h2>
            </div>
          </Modal>
        )
      }
      {
        showSummary && (
          <Modal classname={styles.summaryWrapper} onClose={closeSummary} isOpen={showSummary}>
            {!enquirySubmitted && (
              <div className={styles.header}>
                <h1>Enquiry Summary For</h1>
                <h2>Property {propertyItem.property_code_name}</h2>
              </div>
            )}
            {!enquirySubmitted ? (
              <div className={styles.content}>
                <p>
                  <span>Booking Dates</span>
                  {getFormattedDate(searchPayload.dates.start)} - {getFormattedDate(searchPayload.dates.end)} ({propertyPrice.bookingDays} Nights)
                </p>
                <p>
                  <span>Guests Details</span>
                  {parseInt(searchPayload.guest.adult) +
                    parseInt(searchPayload.guest.children) +
                    parseInt(searchPayload.guest.infant)}{' '}
                  Guests ({parseInt(searchPayload.guest.adult)} Adults + {parseInt(searchPayload.guest.children)} Kids +{' '}
                  {parseInt(searchPayload.guest.infant)} Infants)
                </p>
                {propertyPrice.PriceBreakDown?.ServiceFee > 0 && (
                  <p>
                    <span>InstaFarms Service Fee ({propertyPrice.PriceBreakDown?.ServiceFeePer}%)</span>
                    + {getFormattedCurrency(propertyPrice.PriceBreakDown?.ServiceFee)}
                  </p>
                )}
                {propertyPrice.PriceBreakDown?.totalDiscount > 0 && (
                  <p>
                    <span>Discount</span>
                    - {getFormattedCurrency(propertyPrice.PriceBreakDown?.totalDiscount)}
                  </p>
                )}
                {propertyPrice.PriceBreakDown?.nightsDiscountsFee > 0 && (
                  <p>
                    <span>
                      {propertyPrice.bookingDays} Night Discounts ({propertyPrice.PriceBreakDown?.nightsDiscountsFeePer}%)
                    </span>
                    - {getFormattedCurrency(propertyPrice.PriceBreakDown?.nightsDiscountsFee)}
                  </p>
                )}
                <p>
                  <span>Total Amount</span>
                  {getFormattedCurrency(propertyPrice.bookingAmount)}{' '}
                </p>
                {formSubmmited ? (
                  <button className="solidbtn" aria-label="Confirm Enquiry">
                    Please wait...{' '}
                  </button>
                ) : (
                  <button className="solidbtn" onClick={() => ConfirmEnquiry()} aria-label="Confirm Enquiry">
                    Confirm Enquiry{' '}
                  </button>
                )}
              </div>
            ) : (
              <div className={styles.content}>
                <div className={styles.header}>
                  <h1>Enquiry Confirmation For</h1>
                  <h2>Property {propertyItem.property_code_name}</h2>
                </div>
                <p className={styles.success_mesage}>{enquirySubmittedMessage}</p>
                <button className="solidbtn" onClick={() => closeSummary()} aria-label="Close Enquiry">
                  Close{' '}
                </button>
              </div>
            )}
          </Modal>
        )
      } */}
    </>
  );

}
export default PropertyPriceBox
