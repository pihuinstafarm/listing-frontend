import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { isLoggedIn, getPropertyPrice } from 'utils/components'
import { authServices } from 'utils/services'
import styles from './index.module.scss'
import LocationOnIcon from '@mui/icons-material/LocationOn'

// Dynamically import the Login component
const Login = dynamic(() => import('../../containers/header/login'))

function PropertyItem({ property }) {
    // State to control the visibility of the Login modal
    const [showLogin, setShowLogin] = useState(false)

    // --- All your existing logic for dates, prices, etc. remains the same ---
    let TodayDate = new Date()
    let yyyy = TodayDate.getFullYear()
    let mm = TodayDate.getMonth() + 1
    let dd = TodayDate.getDate()
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    let tomorrowYear = tomorrow.getFullYear()
    let tomorrowmm = tomorrow.getMonth() + 1
    let tomorrowdd = tomorrow.getDate()

    // Only calculate OneDayePrice if PropertyPrice is not already set (prevents duplicate pricing)
    if (!property.PropertyPrice) {
        let payload = {
            propertyItem: property,
            startdate: yyyy + '-' + mm + '-' + dd,
            enddate: tomorrowYear + '-' + tomorrowmm + '-' + tomorrowdd,
            adult: 0,
            children: 0,
            infant: 0,
        }

        const OneDayePrice = getPropertyPrice(payload)
        property['OneDayePrice'] = OneDayePrice
    }

    const getFormattedCurrency = (price) => {
        const numericPrice = parseFloat(price)

        if (numericPrice >= 1000) {
            const kValue = numericPrice / 1000
            // Remove trailing zeros after decimal point
            const formattedK =
                kValue % 1 === 0
                    ? kValue.toString()
                    : kValue.toFixed(3).replace(/\.?0+$/, '')
            return '₹' + formattedK + 'K'
        }

        return '₹' + new Intl.NumberFormat().format(numericPrice.toFixed(2))
    }

    const formatCurrency = (num, currency = 'INR') => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency,
            notation: 'compact',
            compactDisplay: 'short',
            maximumFractionDigits: 1,
        }).format(num)
    }

    // This function now just toggles the state
    const addToFavorite = () => {
        if (isLoggedIn()) {
            let payload = {
                id: property.id,
                name: property.name,
                slug: property.slug,
                address_details: property.address_details,
                caretaker: property.caretaker,
                featured_image: property.featured_image,
                type: property.type,
                max_guest_count: property.max_guest_count,
                rooms: property.rooms,
                price_detail: property.price_detail,
            }
            authServices.addItemToFavorite(payload).then((res) => {
                localStorage.setItem('favorites', res.favorites)
                window.dispatchEvent(new Event('storage'))
            })
        } else {
            // If not logged in, set state to true to show the modal
            setShowLogin(true)
        }
    }

    return (
        <div className={styles.propertyCard}>
            {/* SOLUTION: Render the Login modal here, inside the card div.
              It will only be displayed when showLogin is true.
            */}
            {showLogin && (
                <Login closeLogin={() => setShowLogin(false)} isOpen={showLogin} />
            )}

            {/* The Property Card content */}
            <div className={styles.tagSection}>
                <Image
                    alt={'InstaFarms ' + property?.property_code_name + ' like'}
                    className="smallIcon"
                    width={25}
                    height={25}
                    src={'/assets/images/fav_icon.webp'}
                />
            </div>

            <div className={styles.imageContainer}>
                <picture>
                    {(() => {
                        const candidateSrc = property?.featured_image
                            ? Array.isArray(property.featured_image)
                                ? property.featured_image[0]?.url
                                : property.featured_image?.url
                            : property?.gallery?.[0]?.url
                        const safeSrc = typeof candidateSrc === 'string' && candidateSrc.trim().length > 0 ? candidateSrc : '/placeholder-image.jpg'
                        const altText = property?.allText || property?.property_code_name || 'InstaFarms property'
                        return (
                            <Image
                                className={styles.thumbnail}
                                src={safeSrc}
                                alt={altText}
                                width={400}
                                height={300}
                                loading="lazy"
                            />
                        )
                    })()}
                </picture>
            </div>

            <div className={styles.locationinfo}>
                <div>
                    {property?.property_code_name && (
                        <h5 className={styles.titleElegant}>
                            {property?.property_code_name}
                        </h5>
                    )}

                    {property.address_details && (
                        <h5 className={styles.address}>
                            <LocationOnIcon className="text-[#8C684D] w-[20px]" />
                            {property.address_details.area_name},{' '}
                            {property.address_details.city_name}
                        </h5>
                    )}

                    <h6 className={styles.features}>
                        {property.max_guest_count && (
                            <span>Upto {property.max_guest_count} Guests</span>
                        )}
                        {property.bedroom_count > 0 && (
                            <span>
                                + {property.bedroom_count} Bedroom
                                {property.bedroom_count > 1 ? 's' : ''}
                            </span>
                        )}
                        {property.bathroom_count > 0 && (
                            <span>
                                + {property.bathroom_count} Bathroom
                                {property.bathroom_count > 1 ? 's' : ''}
                            </span>
                        )}
                    </h6>
                </div>

                {/* Price Section */}
                {property.PropertyPrice ? (
                    <div className={styles.priceSection}>
                        <div className={`${styles.price} ${styles.oneDayPrice}`}>
                            <span className={styles.regularPrice}>
                                {getFormattedCurrency(
                                    property.PropertyPrice.bookingAmount /
                                        (property.PropertyPrice.bookingDays || 1),
                                )}
                            </span>
                            {property.PropertyPrice.PriceBreakDown &&
                                property.PropertyPrice.PriceBreakDown.totalPriceOrigional !==
                                property.PropertyPrice.bookingAmount && (
                                <span className={styles.oldPrice}>
                                    {getFormattedCurrency(
                                        property.PropertyPrice.PriceBreakDown
                                            .totalPriceOrigional /
                                            (property.PropertyPrice.bookingDays || 1),
                                    )}
                                </span>
                            )}
                            <span className={styles.nightText}>/ night</span>
                        </div>
                        <div
                            className={`${styles.totalPrice} ${styles.propertyPrice}`}
                        >
                            <h6>
                                <span className={styles.regularPrice}>
                                    {formatCurrency(
                                        property.PropertyPrice.bookingAmount,
                                    )}
                                </span>
                                {property.PropertyPrice.PriceBreakDown &&
                                    property.PropertyPrice.PriceBreakDown.totalPriceOrigional !==
                                    property.PropertyPrice.bookingAmount && (
                                    <span className={styles.oldPrice}>
                                        {formatCurrency(
                                            property.PropertyPrice.PriceBreakDown
                                                .totalPriceOrigional,
                                        )}
                                    </span>
                                )}
                            </h6>
                            <span className={styles.durationText}>
                                for {property.PropertyPrice.bookingDays || 1} night
                                {(property.PropertyPrice.bookingDays || 1) > 1
                                    ? 's'
                                    : ''}
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className={styles.priceSection}>
                        {property.OneDayePrice && (
                            <div
                                className={`${styles.price} ${styles.oneDayPrice}`}
                            >
                                <span className={styles.regularPrice}>
                                    {getFormattedCurrency(
                                        property.OneDayePrice
                                            .oneDayPriceAfterDiscount,
                                    )}
                                </span>
                                {property.OneDayePrice.oneDayPrice !==
                                    property.OneDayePrice
                                        .oneDayPriceAfterDiscount && (
                                    <span className={styles.oldPrice}>
                                        {getFormattedCurrency(
                                            property.OneDayePrice.oneDayPrice,
                                        )}
                                    </span>
                                )}
                                <span className={styles.nightText}>
                                    {' '}
                                    for 1 night
                                </span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default PropertyItem
