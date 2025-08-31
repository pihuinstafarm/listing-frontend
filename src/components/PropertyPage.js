import Image from 'next/image';
import { useEffect, useState } from 'react';

import CloseIcon from '@mui/icons-material/Close';
import Paper from '@mui/material/Paper';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Modal, ModalFour } from 'components';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Button } from 'utils/components';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CircularLoader, isLoggedIn } from 'utils/components';
import { authServices, propertiesServices } from 'utils/services';
import styles from '../pages/property.module.scss';

import PropertySlider from 'containers/PropertyPage/bannerlider/banners';
import PropertyBanners from 'containers/PropertyPage/banners/banners';

const Login = dynamic(() => import('containers/header/login'));
const PropertyPriceBox = dynamic(() => import('containers/PropertyPage/PropertyPriceBox'))
const ReviewsBox = dynamic(() => import('containers/PropertyPage/ReviewsBox/reviews'))
const ReviewsSlider = dynamic(() => import('containers/PropertyPage/reviewsslider/reviews'))
const RoomSlider = dynamic(() => import('containers/PropertyPage/roomslider/slider'))
const NearByLocations = dynamic(() => import('containers/NearByLocations'))


// This component just receives the props and renders the UI
export default function PropertyPage({pageType, siteSettings, propertyDetail }) {
    const router = useRouter();

    const siteName = siteSettings ? siteSettings.site_title ? siteSettings.site_title : 'InstaFarms' : 'InstaFarms';
    const metaTitle = propertyDetail ? propertyDetail.meta_title ? propertyDetail.meta_title : propertyDetail.property_code_name : '';
    const metaDescription = propertyDetail ? propertyDetail.meta_description ? propertyDetail.meta_description : propertyDetail.description ? getShortDescription(propertyDetail.description) : '' : '';
    const metaKeywords = propertyDetail ? propertyDetail.meta_keywords ? propertyDetail.meta_keywords : '' : '';
    const metaUrl = propertyDetail ? propertyDetail.meta_url ? propertyDetail.meta_url : '' : '';
    const metaImage = propertyDetail ? propertyDetail.featured_image ? propertyDetail.featured_image.url : '' : '';
    const address = propertyDetail?.address_details || {};

    const [propertyItem, setPropertyItem] = useState(propertyDetail);
    const [loading, setLoading] = useState(false);
    const [dataFetched, setDataFetched] = useState(false);
    const [showLogin, setShowLogin] = useState(false)
    const searchParams = useSearchParams()
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))

    const [SafetyHygieneLength, setSafetyHygieneLength] = useState(5);
    const [AmenitiesLength, setAmenitiesLength] = useState(5);
    const [galleryModal, setGalleryModal] = useState();
    const [roomsSlider, setRoomsSlider] = useState();
    const [isFavorites, setFavorites] = useState(false)
    const [visibleToolTip, setVisibleToolTip] = useState('');
    const [OtherPropertiesList, setOtherPropertiesList] = useState([]);

    const [galleryTags, setGalleryTags] = useState([]);
    const [filteredGalleryItems, setFilteredGalleryItems] = useState([]);
    const [showAllGallery, setShowAllGallery] = useState(false);

    const [amenitiesModal, setAmenitiesModal] = useState(false);
    const [activitiesModal, setActivitiesModal] = useState(false);
    const [safetyHygieneModal, setSafetyHygieneModal] = useState(false);


    const [roomsTags, setRoomsTags] = useState([]);
    const [filteredRoomsItems, setFilteredRoomsItems] = useState([]);
    const [galleryItems, setGalleryItems] = useState(false);
    const [contentModal, setContentModal] = useState(false);
    const [selectedFaqCat, setSelectedFaqCat] = useState('all');
    const [showDropdown, setShowDropdown] = useState(false)
    const [shareModal, setShareModal] = useState(false)
    const [shareStatus, setSharestatus] = useState(false)

    function shareWhatsapp() {
        if (typeof window !== 'undefined') {
            const pageURL = window.location.href;
            const message = encodeURIComponent("Check this out: " + pageURL);
            window.open(`https://api.whatsapp.com/send?text=${message}`, '_blank');
        }
    }

    function shareInstagram() {

        // Instagram does not support direct web URL sharing like WhatsApp
        setSharestatus("Instagram does not allow direct URL sharing. You can copy the link and post it manually!");
        setTimeout(function () {
            setSharestatus('')
            if (typeof window !== 'undefined') {
                window.open('https://www.instagram.com/', '_blank');
            }
        }, 10000)
    }

    function shareEmail() {
        if (typeof window !== 'undefined') {
            const pageURL = window.location.href;
            const message = encodeURIComponent("Check this out: " + pageURL);
            window.location.href = `mailto:?subject=Property at InstaFarms&body=${message}`;
        }
    }

    function copyURL() {
        const pageURL = window.location.href;
        navigator.clipboard.writeText(pageURL)
            .then(() => {
                setSharestatus("URL copied to clipboard!");
            })
            .catch(err => {
                setSharestatus('Failed to copy:', err);
            });
        setTimeout(function () {
            setSharestatus('')
        }, 10000)
    }

    const faqsKeys = [
        { label: 'Rooms', value: 'Rooms' },
        { label: 'Amenities', value: 'Amenities' },
        { label: 'Food & Kitchen', value: 'Food & Kitchen' },
        { label: 'Location', value: 'Location' },
        { label: 'Commercials', value: 'Commercials' },
        { label: 'Others', value: 'Others' }
    ]

    const queryData = {
        startdate: searchParams.get('startdate') ? searchParams.get('startdate') : '',
        enddate: searchParams.get('enddate') ? searchParams.get('enddate') : '',
        adult: searchParams.get('adult') ? searchParams.get('adult') : 0,
        children: searchParams.get('children') ? searchParams.get('children') : 0,
        infant: searchParams.get('infant') ? searchParams.get('infant') : 0,
    }

    useEffect(() => {
        if (propertyDetail) {
            setLoading(false)

            propertiesServices.getById(propertyDetail.id).then((property) => {
                setPropertyItem(property)
                setDataFetched(true)
            })
        }
    }, [propertyDetail]);

    useEffect(() => {
        if (propertyItem) {

            if (propertyItem && propertyItem.gallery && propertyItem.gallery.length > 0) {
                let AllGalleryItems = propertyItem.gallery
                AllGalleryItems = AllGalleryItems.filter(img => img.waterMarked === true || img.waterMarked === undefined);
                AllGalleryItems.sort((a, b) => a.order ? a.order : 0 - b.order ? b.order : 0)
                setGalleryItems(AllGalleryItems)
            }


            const relatedPayload = {
                pageNumber: 1,
                totalPages: 0,
                LastDocument: false,
                moveTo: false,
                perPage: 7,
                orderBy: 'weight',
                searchBy: 'address_details.area_slug',
                searchKey: propertyItem.address_details.area_slug,
                attributes: "plans,property_code_name,name,slug,max_guest_count,address_details,price_detail,caretaker,featured_image,type,bathroom_count,bedroom_count,rooms",
            };

            propertiesServices.getAllProperties(relatedPayload).then((AllOtherPropertiesList) => {
                if (AllOtherPropertiesList && AllOtherPropertiesList.length > 0) {
                    let othersList = []
                    AllOtherPropertiesList.forEach(item => {
                        if (item.slug !== propertyItem.slug && item.address_details?.area_slug == propertyItem.address_details?.area_slug) {
                            othersList.push(item)
                        }
                    })
                    setOtherPropertiesList(othersList)
                }
            })


            if (propertyItem.reviews && propertyItem.reviews.length > 0) {
                let allReview = []
                propertyItem.reviews.forEach(review => {
                    allReview.push(review.reviews)
                })
                let combinedReviews = allReview.flat();
                let groupedData = combinedReviews.reduce((map, item) => {
                    if (!map.has(item.label)) {
                        map.set(item.label, { label: item.label, total: 0, count: 0 });
                    }
                    let entry = map.get(item.label);
                    entry.total += item.value;
                    entry.count += 1;
                    return map;
                }, new Map());

                let labelAverages = Array.from(groupedData.values()).map(entry => ({
                    label: entry.label,
                    average: (entry.total / entry.count).toFixed(2)
                }));

                // Calculate overall average
                let totalValue = combinedReviews.reduce((sum, item) => sum + item.value, 0);
                let totalCount = combinedReviews.length;
                let overallAverage = (totalValue / totalCount).toFixed(2);
                propertyItem['labelAverages'] = labelAverages
                propertyItem['overallAverage'] = overallAverage

            }

        }
    }, [propertyItem]);

    useEffect(() => {
        if (visibleToolTip != '') {
            setTimeout(
                function () {
                    setVisibleToolTip('');
                }
                , 5000
            );
        }

    }, [visibleToolTip]);


    useEffect(() => {
        if (galleryItems) {
            let galleryTagsItems = []
            galleryItems.forEach(galleryItem => {
                if (galleryItem.tag) {
                    const found = galleryTagsItems.some(el => el.name === galleryItem.tag);
                    if (!found) {
                        galleryTagsItems.push({ name: galleryItem.tag, selected: false })
                    }
                }

            });
            setGalleryTags(galleryTagsItems)
            setFilteredGalleryItems(galleryItems)
        }

    }, [galleryItems]);

    useEffect(() => {
        if (propertyItem && propertyItem.amenities) {
            let amenitiesList = propertyItem.amenities.filter(row => row.type != 'activities')
            let activitiesList = propertyItem.amenities.filter(row => row.type == 'activities')

            amenitiesList = amenitiesList.sort((a, b) => a?.weight - b?.weight);
            activitiesList = activitiesList.sort((a, b) => a?.weight - b?.weight);
            propertyItem['amenitiesList'] = amenitiesList
            propertyItem['activitiesList'] = activitiesList

        }

        let roomsTagsList = []
        let filteredRoomsList = []
        if (propertyItem && propertyItem.rooms) {
            Object.keys(propertyItem.rooms).forEach(key => {
                if (propertyItem.rooms[key].length > 0) {
                    const found = roomsTagsList.some(el => el.name === key);
                    if (!found) {
                        roomsTagsList.push({ name: key, selected: false })
                    }
                    propertyItem.rooms[key].forEach(galleryItem => {
                        filteredRoomsList.push({ thumbnail: galleryItem.thumbnail, tag: key })
                    })
                }

            });
        }
        setRoomsTags(roomsTagsList)
        setFilteredRoomsItems(filteredRoomsList)


        setFilteredGalleryItems(galleryItems)
        setShowAllGallery(true)


    }, [propertyItem]);



    const toggleTag = (tagName) => {

        let galleryTagsItems = []


        galleryTags.forEach(item => {
            item.selected = false
            if (item.name == tagName) {
                item.selected = true
            }
            const found = galleryTagsItems.some(el => el.name === item.name);
            if (!found) {
                galleryTagsItems.push(item)
            }
        });
        setGalleryTags(galleryTagsItems)
        resetGalleryItems()
    }

    const resetGalleryItems = () => {


        let selectedTags = []
        galleryTags.forEach(item => {
            if (item.selected) {
                selectedTags.push(item.name)
            }
        });

        if (selectedTags.length > 0) {
            let galleryNewItems = []
            if (galleryItems) {
                galleryItems.forEach(galleryItem => {
                    if (galleryItem.tag) {
                        if (selectedTags.includes(galleryItem.tag)) {
                            galleryNewItems.push(galleryItem)
                        }
                    }

                });
                setFilteredGalleryItems(galleryNewItems)
                setShowAllGallery(false)
            }

        } else {
            setFilteredGalleryItems(galleryItems)
            setShowAllGallery(true)
        }
    }

    const toggleRoomsTag = (tagName) => {
        let roomsTagsItems = []

        roomsTags.forEach(item => {
            item.selected = false
            if (item.name == tagName) {
                item.selected = true
            }
            const found = roomsTagsItems.some(el => el.name === item.name);
            if (!found) {
                roomsTagsItems.push(item)
            }
        });

        setRoomsTags(roomsTagsItems)
        resetRoomsaItems()
    }

    const resetRoomsaItems = () => {
        let selectedTags = []
        roomsTags.forEach(item => {
            if (item.selected) {
                selectedTags.push(item.name)
            }
        });
        if (selectedTags.length > 0) {
            let galleryItems = []
            Object.keys(propertyItem.rooms).forEach(key => {
                if (selectedTags.includes(key)) {
                    if (propertyItem.rooms[key].length > 0) {
                        propertyItem.rooms[key].forEach(galleryItem => {
                            galleryItems.push({ thumbnail: galleryItem.thumbnail, tag: key })
                        })
                    }
                }

            });
            setFilteredRoomsItems(galleryItems)
            setShowAllGallery(false)
        } else {
            let galleryItems = []
            Object.keys(propertyItem.rooms).forEach(key => {
                if (propertyItem.rooms[key].length > 0) {
                    propertyItem.rooms[key].forEach(galleryItem => {
                        galleryItems.push({ thumbnail: galleryItem.thumbnail, tag: key })
                    })
                }
            });
            setFilteredRoomsItems(galleryItems)
            setShowAllGallery(true)
        }
    }
    const getFormattedCurrency = (price) => {
        return '₹' + new Intl.NumberFormat().format(parseInt(price))
    }
    const toggleGallery = () => {
        setGalleryModal(true)
    }

    const toggleRoomsSlider = () => {
        setRoomsSlider(true)
    }
    useEffect(() => {
        if (isLoggedIn) {
            getProfile()
        }
    }, [])


    const getProfile = async () => {

        const token = localStorage.getItem('token')
        const documentId = localStorage.getItem('documentId')
        if (documentId && token && propertyItem) {
            authServices.getProfile().then((res) => {

                if (res.error) {

                } else {
                    if (res.favorites && res.favorites.length > 0) {
                        res.favorites.forEach(item => {
                            if (item.slug == propertyItem.slug) {
                                setFavorites(true)
                            }
                        })
                    }

                }
            })
        }
    }
    const getKeyName = (key, index) => {
        let newindex = index != '' ? parseInt(index) + 1 : ''
        switch (key) {
            case 'bathrooms':
                return 'Bathroom ' + newindex
                break;
            case 'bedrooms':
                return 'Bedroom ' + newindex
                break;
            case 'diningrooms':
                return 'Dining Room ' + newindex
                break;

            case 'kitchen':
                return 'Kitchen ' + newindex
                break;

            case 'leavingrooms':
                return 'Living Room ' + newindex
                break;
            case 'other':
                return 'Others ' + newindex
                break;
            default:
                return key + ' ' + newindex
        }
    }

    const formatedName = (name) => {
        return name.replace('_', ' ')
    }

    const removeFromFavorite = (property) => {
        if (isLoggedIn()) {
            setFavorites(false)
            let payload = {
                id: property.id,
                name: property.name,
                property_code_name: property?.property_code_name,
                slug: property.slug,
                address_details: property.address_details,
                caretaker: property.caretaker,
                featured_image: property.featured_image,
                type: property.type,
                max_guest_count: property.max_guest_count,
                rooms: property.rooms,
                price_detail: property.price_detail
            }

            authServices.removeItemFromFavorite(payload).then((res) => {
                localStorage.setItem('favorites', res.favorites)
                window.dispatchEvent(new Event('storage'))
            })

        } else {
            setShowLogin(true)
        }
    }

    const addToFavorite = (property) => {
        if (isLoggedIn()) {
            setFavorites(true)
            let payload = {
                id: property.id,
                name: property.name,
                property_code_name: property?.property_code_name,
                slug: property.slug,
                address_details: property.address_details,
                caretaker: property.caretaker,
                featured_image: property.featured_image,
                type: property.type,
                max_guest_count: property.max_guest_count,
                rooms: property.rooms,
                price_detail: property.price_detail
            }

            authServices.addItemToFavorite(payload).then((res) => {
                localStorage.setItem('favorites', res.favorites)
                window.dispatchEvent(new Event('storage'))
            })

        } else {
            setShowLogin(true)
        }
    }

    function getShortDescription(description) {
        description = description.replaceAll(/<a.*?>/ig, '')
        let htmlData = description
        htmlData = htmlData + ' '
        htmlData = htmlData.replaceAll(/(?:\r\n|\r|\n)/g, '<br>')
        htmlData = htmlData.replaceAll('<br><br>', '<br>')
        htmlData = htmlData.replaceAll('</p><br><p>', '</p><p>')
        htmlData = `<p>${htmlData}</p>`; // Wrap the entire string in <p> tags
        htmlData = htmlData.replace(/<style[^>]*>.*<\/style>/g, '')
            // Remove script tags and content
            .replace(/<script[^>]*>.*<\/script>/g, '')
            // Remove all opening, closing and orphan HTML tags
            .replace(/<[^>]+>/g, '')
            // Remove leading spaces and repeated CR/LF
            .replace(/([\r\n]+ +)+/g, '');
        htmlData = htmlData.slice(0, 160) + ' ...'
        return htmlData
    }
    function renderStars(rating, maxStars = 5) {
        let innerHTML = ''
        for (let i = 1; i <= maxStars; i++) {
            let star = 'star_blank'

            if (rating >= i) {
                star = 'star_full'
            } else if (rating > i - 1) {
                star = 'star_half'
            } else {
                star = 'star_blank'
            }

            innerHTML = innerHTML + star
        }

    }

    const showAmenitiesModal = () => {
        setAmenitiesModal(true)
    }
    const showActivitiesModal = () => {
        setActivitiesModal(true)
    }

    function handleLogout() {
        let payload = {
            documentId: localStorage.getItem('documentId')
        }
        authServices.logoutUser(payload)
            .then((res) => {
                if (res.success) {
                    localStorage.clear()
                    setShowDropdown(false)
                    setLoggedIn(false)
                } else {
                    localStorage.clear()
                    setShowDropdown(false)
                    setLoggedIn(false)
                }

            })

    }

    const formatCityName = (city) => {
        return city.replaceAll(" ", "").toLowerCase();
    }

    function faqsList(faqlist){
        const faqs = [];

        for (const faqType in faqlist){
            for (const faq of faqlist[faqType]){
                faqs.push({
                    "@type": "Question",
                    "name": faq.title,
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": faq.description,
                    }
                })
            }
        }
        return faqs;
    }

    function bedType(bedTypeText){
        if (bedTypeText.includes("queen") || bedTypeText.includes("Queen")  ) return "Queen";
        if (bedTypeText.includes("king") || bedTypeText.includes("King")  ) return "King";
        return "Queen";
    }

    function getSafeImageSrc(src) {
        if (typeof src !== 'string') return '/assets/images/placeholder-image.jpg';
        const trimmed = src.trim();
        if (
            trimmed.startsWith('/') ||
            trimmed.startsWith('http://') ||
            trimmed.startsWith('https://')
        ) {
            return trimmed;
        }
        return '/assets/images/placeholder-image.jpg';
    }

    const galleryUrls = Array.isArray(propertyDetail?.gallery)
        ? propertyDetail.gallery.map(item => item?.url).filter(Boolean)
        : []
    const imageUrls = [
        propertyDetail?.featured_image?.url,
        propertyDetail?.cover_1?.url,
        propertyDetail?.cover_2?.url,
        propertyDetail?.cover_3?.url,
        propertyDetail?.cover_4?.url,
        propertyDetail?.cover_5?.url,
        ...galleryUrls,
    ].filter((u) => typeof u === 'string' && u.trim().length > 0)

    const bedrooms = Array.isArray(propertyDetail?.rooms?.bedrooms)
        ? propertyDetail.rooms.bedrooms
        : []
    const bathrooms = Array.isArray(propertyDetail?.rooms?.bathrooms)
        ? propertyDetail.rooms.bathrooms
        : []
    const amenities = Array.isArray(propertyDetail?.amenities)
        ? propertyDetail.amenities
        : []
    const primaryPrice = propertyDetail?.price_detail?.weekPrice?.[0]?.price || "28000"

    const pageSchema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Organization",
                "@id": "https://instafarms.in/#organization",
                "name": "InstaFarms",
                "url": "https://instafarms.in/",
                "logo": "https://instafarms.in/logo.webp",
                "description": metaDescription,
                "sameAs": [
                    "https://www.instagram.com/instafarms.in",
                    "https://www.facebook.com/instafarms"
                ],
                "contactPoint": {
                    "@type": "ContactPoint",
                    "telephone": "+91-8019127474",
                    "contactType": "Customer Service",
                    "areaServed": "IN",
                    "availableLanguage": ["English", "Hindi"]
                }
            },
            {
                "@type": "LocalBusiness",
                "@id": "https://instafarms.in/#localbusiness",
                "name": "InstaFarms Hyderabad",
                "image": "https://instafarms.in/logo.webp",
                "address": {
                    "@type": "PostalAddress",
                    "streetAddress" : "Instafarms Hyderabad, Telangana",
                    "addressLocality": "Hyderabad",
                    "addressRegion": "Telangana",
                    "postalCode": "500001",
                    "addressCountry": "IN"
                },
                "telephone": "+91-8019127474",
                "openingHours": "Mo-Su 09:00-21:00",
                "priceRange": "₹₹₹",
                "url": "https://instafarms.in/"
            },
            {
                "@type": "VacationRental",
                "@id": `${metaUrl}#vacationrental`,
                "name": propertyDetail.name,
                "identifier": propertyDetail.code_name,
                "description": metaDescription,
                "additionalType": propertyDetail.type,
                "image": imageUrls,
                "geo": {
                    "@type": "GeoCoordinates",
                    "latitude": address.latitude || "17.2300",
                    "longitude": address.longitude || "78.4300"
                },
                "address": {
                    "@type": "PostalAddress",
                    "streetAddress" : address.address || "",
                    "addressLocality": address.area_slug || "Shamshabad",
                    "addressRegion": address.state_slug || "Telangana",
                    "postalCode": "500108",
                    "addressCountry": "IN"
                },
                "numberOfRooms": propertyDetail.bedroom_count,
                "petsAllowed": true,
                "checkinTime": propertyDetail.check_in_time ||  "14:00",
                "checkoutTime": propertyDetail.check_out_time || "11:00",
                "telephone": `+91-8019127474`,
                "priceRange": "₹₹₹",
                "aggregateRating": {
                    "@type": "AggregateRating",
                    "ratingValue": "4",
                    "reviewCount": "4"
                },
                "review": {
                    "@type": "Review",
                    "author": { "@type": "Person", "name": "Ravi Kumar" },
                    "datePublished": "2025-06-15",
                    "reviewBody": "Amazing stay, clean pool and great service!",
                    "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" }
                },
                "offers": {
                    "@type": "Offer",
                    "url": metaUrl,
                    "price": primaryPrice,
                    "priceCurrency": "INR",
                    "priceValidUntil": "2025-12-31",
                    "availability": "https://schema.org/InStock",
                    "itemCondition": "https://schema.org/NewCondition"
                },
                "containsPlace": {
                    "@type": "Accommodation",
                    "additionalType": "EntirePlace",
                    "bed": bedrooms.map((item, index)=>{
                        return {
                            "@type": "BedDetails",
                            "numberOfBeds": 1,
                            "typeOfBed": bedType(item.description),
                        }
                    }) || []
                    ,
                    "numberOfBedrooms" : bedrooms.length || 1,
                    "numberOfBathroomsTotal" : bathrooms.length || 1,
                    "occupancy": {
                        "@type": "QuantitativeValue",
                        "value": propertyDetail.max_guest_count || 4,
                    },
                    "amenityFeature": amenities.map((item, index)=>{
                        return {
                            "@type": "LocationFeatureSpecification",
                            "name": item.name,
                            "value": true
                        }
                    }) || [],
                }
            },
            {
                "@type": "Product",
                "@id":  `${metaUrl}#product`,
                "name": propertyDetail.name,
                "image": propertyDetail?.featured_image?.url || imageUrls[0] || "https://instafarms.in/logo.webp",
                "description": metaDescription,
                "sku": "GA-001-SHAM-2BR",
                "brand": { "@type": "Brand", "name": "InstaFarms" },
                "offers": {
                    "@type": "Offer",
                    "url": metaUrl,
                    "priceCurrency": "INR",
                    "price": primaryPrice,
                    "priceValidUntil": "2025-12-31",
                    "availability": "https://schema.org/InStock",
                    "itemCondition": "https://schema.org/NewCondition"
                },
                "aggregateRating": {
                    "@type": "AggregateRating",
                    "ratingValue": "4.6",
                    "reviewCount": "15"
                },
                "review": {
                    "@type": "Review",
                    "author": { "@type": "Person", "name": "Ravi Kumar" },
                    "datePublished": "2025-06-15",
                    "reviewBody": "Amazing stay, clean pool and great service!",
                    "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" }
                },
            },
            {
                "@type": "BreadcrumbList",
                "@id": `${metaUrl}#breadcrumb`,
                "itemListElement": [
                    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://instafarms.in/" },
                    { "@type": "ListItem", "position": 2, "name": propertyDetail.address_details.city_name, "item": `https://instafarms.in/${propertyDetail.address_details.state_slug}/${formatCityName(propertyDetail.address_details.city_name)}` },
                    { "@type": "ListItem", "position": 3, "name": `Farmhouses in ${propertyDetail.address_details.area_name}`, "item": `https://instafarms.in/${propertyDetail.address_details.state_slug}/${formatCityName(propertyDetail.address_details.city_name)}/${propertyDetail.address_details?.area_slug}` },
                    { "@type": "ListItem", "position": 4, "name": propertyDetail.name, "item": metaUrl }
                ]
            },
            {
                "@type": "FAQPage",
                "@id": `${metaUrl}#faq`,
                "mainEntity": faqsList( propertyDetail.faqs || [])
            }
        ]
    }

    // console.log("propertyDetail", propertyDetail);
    // console.log("Schema", pageSchema);

    const applicationSchema = JSON.stringify(pageSchema);

    return (
        <>
            {showLogin ? (
                <Login
                    closeLogin={() => setShowLogin(false)}
                    isOpen={showLogin}
                />
            ) : null}

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
                <meta property="og:type" content="Property Page" />
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
            {loading && <div className="full_screen_loading flex justify-center items-center h-[75%] w-full">
                <CircularLoader />
            </div>}
            {propertyItem && <>
                {isMobile && <div className={'customHeader'}>
                    {queryData.startdate ? <div className={'left'} onClick={() => router.back()} >
                        <Image alt="InstaFarms" width={30} height={30} src={'/assets/images/arrowsBack.png'} />
                        {propertyItem.code_name + " " + propertyItem.address_details.city_name + ", " + propertyItem.address_details.state_name}
                    </div> : <div className={'left'} onClick={() => router.push('/')} >
                        <Image alt="InstaFarms" width={30} height={30} src={'/assets/images/arrowsBack.png'} />
                        {propertyItem.code_name + " " + propertyItem.address_details.city_name + ", " + propertyItem.address_details.state_name}
                    </div>}
                    <div className={'center'}>

                    </div>
                    <div className={'right'}>
                        <span onClick={(e) => setShareModal(!shareModal)}>
                            <svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.93555 0.611317C7.91406 0.619911 7.83672 0.637098 7.76367 0.654285C7.66914 0.67577 7.21797 1.09686 6.0707 2.23554C5.21133 3.09061 4.45508 3.86835 4.38633 3.95858C4.2832 4.09608 4.26172 4.16913 4.26172 4.35819C4.26172 4.6246 4.33477 4.78788 4.51953 4.94257C4.67422 5.07577 4.88477 5.12304 5.1125 5.08007C5.25 5.05429 5.41758 4.90389 6.29414 4.03593L7.3125 3.02186V7.59374C7.3125 12.0668 7.3125 12.1699 7.39844 12.3375C7.51875 12.591 7.7293 12.7199 8.01719 12.7199C8.31367 12.7199 8.51992 12.5953 8.64023 12.3461C8.73047 12.1656 8.73047 12.1269 8.73047 7.59374V3.02186L9.75313 4.03593C10.7328 5.01132 10.7801 5.05429 10.9734 5.08007C11.0895 5.09725 11.2355 5.08866 11.3172 5.06288C11.4848 5.00702 11.7125 4.78358 11.7598 4.63319C11.8156 4.44843 11.7855 4.15624 11.6996 4.01444C11.6523 3.9371 10.8918 3.15936 10.0109 2.2785C8.65742 0.933582 8.38242 0.67577 8.23633 0.637098C8.06016 0.589832 8.01289 0.585536 7.93555 0.611317Z" />
                                <path d="M2.53496 6.26169C1.70996 6.36052 0.979492 7.04373 0.80332 7.88162C0.708789 8.3156 0.708789 17.3133 0.80332 17.7472C0.979492 18.5851 1.67988 19.2469 2.52207 19.3672C2.92598 19.423 13.0752 19.423 13.4791 19.3672C14.3213 19.2469 15.0217 18.5851 15.1979 17.7472C15.2924 17.3133 15.2924 8.3156 15.1979 7.88162C15.0432 7.15544 14.5361 6.59255 13.8057 6.33904C13.535 6.24451 13.4619 6.24021 12.2932 6.24021H11.0686L10.9096 6.34763C10.6904 6.49373 10.5615 6.76873 10.5916 7.02224C10.6131 7.24138 10.7162 7.40037 10.9225 7.53787C11.06 7.6324 11.0943 7.63669 12.1213 7.63669C12.7014 7.63669 13.2471 7.65818 13.3287 7.67966C13.5049 7.72693 13.7326 7.94177 13.7971 8.12224C13.8314 8.20388 13.8443 9.69919 13.8443 12.823C13.8443 17.3691 13.8443 17.4078 13.7541 17.5883C13.7025 17.7 13.5994 17.816 13.5092 17.8719L13.3502 17.9707H8.00059H2.65098L2.49199 17.8719C2.40176 17.816 2.29863 17.7 2.24707 17.5883C2.15684 17.4078 2.15684 17.3691 2.15684 12.823C2.15684 9.69919 2.16973 8.20388 2.2041 8.12224C2.26855 7.94177 2.49629 7.72693 2.67246 7.67966C2.7541 7.65818 3.29121 7.63669 3.86699 7.63669C5.00996 7.63669 5.05723 7.6281 5.26348 7.37888C5.39238 7.22419 5.44395 7.01365 5.40098 6.79451C5.3623 6.57966 5.10449 6.30896 4.88535 6.26169C4.6791 6.21443 2.94746 6.21443 2.53496 6.26169Z" />
                            </svg>
                        </span>

                        <span onClick={() => {
                            if (isLoggedIn()) {
                                setShowDropdown(!showDropdown)
                            } else {
                                setShowLogin(true)
                            }
                        }}
                        ><Image priority src="/assets/images/svg/PersonIcon.png" width="20" height="20" alt="profile" className={styles.profileIcon} />
                        </span>
                        {showDropdown ? (
                            <Paper
                                className={'menudropdown'}
                                elevation={4}
                                onClick={() => {
                                    setShowDropdown(!showDropdown)
                                }}
                            >
                                <Link scroll={true} aria-label='My Profile' href="/my-profile">My Profile</Link>
                                <Link scroll={true} aria-label='Shortlisted properties' href="/shortlisted-properties">Shortlisted Properties</Link>
                                <Link scroll={true} aria-label='My Enquiries' href="/my-enquiries">My Enquiries</Link>
                                <Link scroll={true} aria-label='My Bookings' href="/my-bookings">My Bookings</Link>

                                <Link aria-label='Log Out' onClick={handleLogout} href="javascript:void(0)">Log Out</Link>
                            </Paper>
                        ) : null}
                    </div>
                </div>}

                {isMobile ?
                    <PropertySlider showGallery={toggleGallery} propertyItem={propertyItem} galleryItems={galleryItems} />
                    : <PropertyBanners showGallery={toggleGallery} propertyItem={propertyItem} galleryItems={galleryItems} />
                }

                <section className={styles.view_gallery_section}>
                    <div className={styles.view_gallery} onClick={(e) => setGalleryModal(true)}>
                        <Image width={20} height={20} alt='Show All Photos' src={'/assets/images/all_gallery_icon.png'} />
                        Show All Photos
                    </div>
                </section>
                <div className={'inner_section'}>
                    <div className='breadcrum'>
                        <Link prefetch={true} locale="en" scroll={true} aria-label='Home' href={`/`}>Home</Link>/
                        {queryData.startdate && <><span className='link' onClick={() => router.back()}>Search</span>/</>}
                        {propertyItem && <>
                            <Link prefetch={true} locale="en" scroll={true} aria-label={propertyItem.address_details?.city_name} href={`/city/${propertyItem.address_details?.city_slug}`}>{propertyItem.address_details?.city_name}</Link>/
                            <Link prefetch={true} locale="en" scroll={true} aria-label={propertyItem.address_details?.area_name} href={`/location/${propertyItem.address_details?.area_slug}`}>{propertyItem.address_details?.area_name}</Link>/
                            <span>{propertyItem.code_name}</span>
                        </>}
                    </div>
                </div>

                <section className={styles.contentsection}>
                    <div className={styles.contentsectionLeft}>

                        <div className={styles.section}>
                            <div className={styles.sectionProperty}>
                                <div className={styles.PropertyLeft}>
                                    <h1 className={styles.PropertyName}>{propertyItem.property_code_name ? propertyItem.property_code_name : propertyItem.name}</h1>
                                    {/* <p className={styles.PropertyHeading}>{propertyItem.heading}</p> */}
                                    <p className={styles.PropertyAddress}><Image alt="InstaFarms Property Location" className='smallIcon' width={20} height={20} src={'/assets/images/user_location.webp'} /> {propertyItem.address_details?.area_name}, {propertyItem.address_details?.city_name}</p>
                                    <p className={styles.features}>
                                        {propertyItem.max_guest_count && <span>Upto {propertyItem.max_guest_count} Guests</span>}

                                        {propertyItem.bedroom_count > 0 && <span>+ {propertyItem.bedroom_count} Bedroom{propertyItem.bedroom_count > 1 ? 's' : ''}</span>}
                                        {propertyItem.bathroom_count > 0 && <span>+ {propertyItem.bathroom_count} Bathroom{propertyItem.bathroom_count > 1 ? 's' : ''}</span>}

                                        {propertyItem.check_in_time && <span>Check-in :  {propertyItem.check_in_time} </span>}
                                        {propertyItem.check_out_time && <span> Check-out : {propertyItem.check_out_time} </span>}

                                    </p>

                                </div>
                                {!isMobile && <div className={styles.PropertyRight}>
                                    {!isFavorites ? <p><Image style={{ cursor: 'pointer' }} onClick={(e) => addToFavorite(propertyItem)} alt="InstaFarms Like Property" width={20} height={20} src={'/assets/images/Heart.webp'} /></p>
                                        : <p><Image style={{ cursor: 'pointer' }} onClick={(e) => removeFromFavorite(propertyItem)} alt="InstaFarms Like Property" width={25} height={25} src={'/assets/images/fav_icon.webp'} /></p>}
                                    <p><Image alt="InstaFarms Share Property" onClick={(e) => setShareModal(!shareModal)} width={20} height={20} src={'/assets/images/share.webp'} /></p>
                                </div>}
                            </div>
                        </div>



                        {propertyItem.amenitiesList && propertyItem.amenitiesList.length > 0 && <div className={styles.section}>
                            <h4>Offered Amenities</h4>
                            <div className={styles.sectionAmenities}>
                                {propertyItem.amenitiesList.slice(0, AmenitiesLength).map((amenity, index) => (
                                    <div className={styles.itemBox} key={'offered_amenities_' + index}>
                                        <div className={styles.imgsection}>
                                            {amenity.paid == 1 && <span className={styles.paid_icon} onClick={() => setVisibleToolTip('offered_amenities_' + index)}>₹</span>}
                                            {visibleToolTip == 'offered_amenities_' + index && <span onClick={() => setVisibleToolTip('')} className={styles.paid_tool_tip}>This can be availed at an additional cost.</span>}
                                            {amenity.icon && <Image alt={'InstaFarms ' + amenity.name} width={50} height={50} src={getSafeImageSrc(amenity.icon)} />}
                                        </div>
                                        <span>{amenity.name}</span>
                                    </div>
                                ))}

                                {propertyItem.amenitiesList.length > AmenitiesLength && AmenitiesLength < 100 && <button onClick={() => showAmenitiesModal()} className='plainbtn' aria-label="Show All">+{propertyItem.amenitiesList.length - AmenitiesLength} more</button>}
                            </div>
                        </div>
                        }

                        {propertyItem.activitiesList && propertyItem.activitiesList.length > 0 && <div className={styles.section}>
                            <h4>Offered Activities</h4>
                            <div className={styles.sectionAmenities}>
                                {propertyItem.activitiesList.slice(0, AmenitiesLength).map((amenity, index) => (
                                    <div className={styles.itemBox} key={'offered_activities_' + index}>
                                        <div className={styles.imgsection}>
                                            {amenity.paid == 1 && <span className={styles.paid_icon} onClick={() => setVisibleToolTip('offered_activities_' + index)}>₹</span>}
                                            {visibleToolTip == 'offered_activities_' + index && <span onClick={() => setVisibleToolTip('')} className={styles.paid_tool_tip}>This can be availed at an additional cost.</span>}
                                            {amenity.icon && <Image alt={'InstaFarms ' + amenity.name} width={50} height={50} src={getSafeImageSrc(amenity.icon)} />}
                                        </div>
                                        <span>{amenity.name}</span>
                                    </div>
                                ))}
                                {propertyItem.activitiesList.length > AmenitiesLength && AmenitiesLength < 100 && <button onClick={() => showActivitiesModal()} className='plainbtn' aria-label="Show All">+{propertyItem.activitiesList.length - AmenitiesLength} more</button>}
                            </div>

                        </div>
                        }

                        <div className={styles.section}>
                            <h4>
                                Property Highlights
                            </h4>
                            <div className={styles.htmlcontent} dangerouslySetInnerHTML={{ __html: propertyItem.description }} />
                        </div>
                        <div className={styles.section}>
                            <div className={styles.extrainfo_button}>
                                <span onClick={() => setContentModal('faq')}>FAQs {isMobile && <Image alt="FAQ" width={15} height={10} src={'/assets/images/arrow_forward_icon.svg'} />}</span>
                                <span onClick={() => setContentModal('hommerule')}>House Rules and Truths {isMobile && <Image alt="Home Rules and Truths" width={15} height={10} src={'/assets/images/arrow_forward_icon.svg'} />}</span>
                                <span onClick={() => setContentModal('booking')}>Booking & Cancellation Policy {isMobile && <Image alt="Cancellation Policy" width={15} height={10} src={'/assets/images/arrow_forward_icon.svg'} />}</span>
                            </div>

                        </div>
                        {shareModal && <ModalFour classname={styles.shareModal} onClose={(e) => setShareModal(false)}>
                            <Button
                                aria-label="Close"
                                width={32}
                                height={32}
                                label={<CloseIcon variant="alert" />}
                                className={styles.close}
                                onClick={(e) => setShareModal(false)}
                            />
                            <div className={styles.content}>
                                <h4>Share</h4>
                                <Image
                                    className={styles.featuredimage}
                                    loading="eager"
                                    src={getSafeImageSrc(propertyItem.cover_1 ? propertyItem.cover_1?.url : galleryItems?.[0]?.url)}
                                    alt={(propertyItem.cover_1 ? propertyItem.cover_1?.tag : propertyItem.property_code_name) || 'InstaFarms Property'}
                                    width={600} height={400}
                                />
                                {shareStatus && <p>{shareStatus}</p>}
                                <div className={styles.share_btn}>
                                    <span onClick={(e) => copyURL()}>Copy Link</span>
                                    <span onClick={(e) => shareWhatsapp()}>Whatsapp </span>
                                    <span onClick={(e) => shareInstagram()}>Instagram </span>
                                    <span onClick={(e) => shareEmail()}>Email </span>
                                </div>
                            </div>
                        </ModalFour>}

                        {contentModal && contentModal == 'explore' && <ModalFour classname={styles.contentModal} onClose={(e) => setContentModal(false)}>
                            <Button
                                aria-label="Close"
                                width={32}
                                height={32}
                                label={<CloseIcon variant="alert" />}
                                className={styles.close}
                                onClick={(e) => setContentModal(false)}
                            />
                            <div className={styles.content}>
                                <h4>Explore Your Stay</h4>
                                <div className={styles.htmlcontent} dangerouslySetInnerHTML={{ __html: propertyItem?.explore_your_stay }} />

                            </div>
                        </ModalFour>}

                        {contentModal && contentModal == 'hommerule' && <ModalFour classname={styles.contentModal} onClose={(e) => setContentModal(false)}>
                            <Button
                                width={32}
                                height={32}
                                label={<CloseIcon variant="alert" />}
                                className={styles.close}
                                onClick={(e) => setContentModal(false)}
                            />
                            <div className={styles.content}>
                                <h4>House Rules and Truths</h4>
                                <div className={styles.htmlcontent} dangerouslySetInnerHTML={{ __html: propertyItem?.home_rules_truths }} />

                            </div>
                        </ModalFour>}

                        {contentModal && contentModal == 'booking' && <ModalFour classname={styles.contentModal} onClose={(e) => setContentModal(false)}>
                            <Button
                                aria-label="Close"
                                width={32}
                                height={32}
                                label={<CloseIcon variant="alert" />}
                                className={styles.close}
                                onClick={(e) => setContentModal(false)}
                            />
                            <div className={styles.content}>
                                <h4>Booking & Cancellation Policy</h4>

                                {propertyItem.plans.shortterm_cancellation_plan && <div className={styles.section_block}>
                                    <div className={styles.column}>
                                        <p>Short Term Cancellation Policy <b>(For 1 or 2 Nights Booking)</b></p>
                                        <div className={styles.FormRow + ' ' + styles.row}>
                                            {propertyItem.plans.shortterm_cancellation_plan.refunds.map((rate, index) => (<div className={styles.column}>
                                                {rate.refund == 0 ?
                                                    <p className={styles.no_refund}><Image alt="refund" width={15} height={10} src={'/assets/images/calendar_icon_1.svg'} /></p>
                                                    : rate.refund == 100 ? <p className={styles.full_refund}><Image alt="refund" width={15} height={10} src={'/assets/images/calendar_icon_3.svg'} /></p>
                                                        : <p className={styles.half_refund}><Image alt="refund" width={15} height={10} src={'/assets/images/calendar_icon_2.svg'} /></p>}

                                                <p className={styles.heading}>{rate.beforeAfter == "lessthan" ? 'Before' : 'Before'} {rate.days} {rate.beforeAfter == "lessthan" ? '' : '+'} days</p>
                                                <p className={styles.value}> {rate.refund == 0 ? 'No' : rate.refund == 100 ? 'Full' : rate.refund + '%'} <span> Refund</span></p>
                                                <p className={styles.border_line}></p>
                                            </div>))}
                                        </div>
                                    </div>
                                </div>}

                                {propertyItem.plans.longterm_cancellation_plan && <div className={styles.section_block}>
                                    <div className={styles.column}>
                                        <p>Long Term Cancellation Policy <b>(Booking for 3 Nights & More)</b></p>
                                        <div className={styles.FormRow + ' ' + styles.row}>
                                            {propertyItem.plans.longterm_cancellation_plan.refunds.map((rate, index) => (<div className={styles.column}>
                                                {rate.refund == 0 ?
                                                    <p className={styles.no_refund}><Image alt="refund" width={15} height={10} src={'/assets/images/calendar_icon_1.svg'} /></p>
                                                    : rate.refund == 100 ? <p className={styles.full_refund}><Image alt="refund" width={15} height={10} src={'/assets/images/calendar_icon_3.svg'} /></p>
                                                        : <p className={styles.half_refund}><Image alt="refund" width={15} height={10} src={'/assets/images/calendar_icon_2.svg'} /></p>}

                                                <p className={styles.heading}>{rate.beforeAfter == "lessthan" ? 'Before' : 'Before'} {rate.days}{rate.beforeAfter == "lessthan" ? '' : '+'} days</p>
                                                <p className={styles.value}> {rate.refund == 0 ? 'No' : rate.refund == 100 ? 'Full' : rate.refund + '%'} <span> Refund</span></p>
                                                <p className={styles.border_line}></p>
                                            </div>))}
                                        </div>
                                    </div>
                                </div>}





                                <div className={styles.htmlcontent} dangerouslySetInnerHTML={{ __html: propertyItem?.booking_cancellation_policy }} />

                            </div>
                        </ModalFour>}

                        {contentModal && contentModal == 'faq' && <ModalFour classname={styles.contentModal} onClose={(e) => setContentModal(false)}>
                            <Button
                                aria-label="Close"
                                width={32}
                                height={32}
                                label={<CloseIcon variant="alert" />}
                                className={styles.close}
                                onClick={(e) => setContentModal(false)}
                            />
                            <div className={styles.content}>
                                <h4>Frequently Asked Questions</h4>
                                <div className={styles.faq_tabs}>
                                    <span onClick={() => setSelectedFaqCat('all')} className={selectedFaqCat == 'all' ? styles.active : ''} key={'faq_cat_all'}> All </span>
                                    {faqsKeys.map((key, i) => (<>
                                        {key.label && <span onClick={() => setSelectedFaqCat(key.value)} className={selectedFaqCat == key.value ? styles.active : ''} key={'faq_cat_' + i}> {key.label}</span>}
                                    </>))}
                                </div>
                                {propertyItem.faqs &&
                                    <div className={styles.faq_content}>
                                        {selectedFaqCat == 'all' ? <ul>
                                            {Object.keys(propertyItem.faqs).map((key, i) => (<>
                                                {propertyItem.faqs[key].length > 0 && <>
                                                    {(propertyItem.faqs[key] || [])
                                                        .slice() // Creates a shallow copy to prevent mutation
                                                        .sort((a, b) => a.weight - b.weight)
                                                        .map((faq, index) => (<>
                                                            {faq.title && <li key={key + '-' + index}>
                                                                <p className={styles.faq_question}>{faq.title}</p>
                                                                <div className={styles.htmlcontent} dangerouslySetInnerHTML={{ __html: faq.description }} />
                                                            </li>}
                                                        </>))}

                                                </>}

                                            </>))}
                                        </ul> : <ul>
                                            {propertyItem.faqs[selectedFaqCat] && <>
                                                {(propertyItem.faqs[selectedFaqCat] || [])
                                                    .slice() // Creates a shallow copy to prevent mutation
                                                    .sort((a, b) => a.weight - b.weight)
                                                    .map((faq, index) => (<>
                                                        {faq.title && <li key={selectedFaqCat + '-' + index}>
                                                            <p className={styles.faq_question}>{faq.title}</p>
                                                            <div className={styles.htmlcontent} dangerouslySetInnerHTML={{ __html: faq.description }} />
                                                        </li>}
                                                    </>))}
                                            </>}
                                        </ul>}

                                    </div>}

                            </div>
                        </ModalFour>}

                        {amenitiesModal && <ModalFour classname={styles.contentModal} onClose={(e) => setAmenitiesModal(false)}>
                            <Button
                                aria-label="Close"
                                width={32}
                                height={32}
                                label={<CloseIcon variant="alert" />}
                                className={styles.close}
                                onClick={(e) => setAmenitiesModal(false)}
                            />
                            <div className={styles.content}>
                                <h4>Amenities</h4>

                                <div className={styles.faq_content}>
                                    <div className={styles.sectionAmenities}>

                                        {propertyItem.amenitiesList.map((amenity, index) => (
                                            <div className={styles.itemBox} key={'offered_amenities_' + index}>
                                                <div className={styles.imgsection}>
                                                    {amenity.paid == 1 && <span className={styles.paid_icon} onClick={() => setVisibleToolTip('offered_amenities_' + index)}>₹</span>}
                                                    {visibleToolTip == 'offered_amenities_' + index && <span onClick={() => setVisibleToolTip('')} className={styles.paid_tool_tip}>This can be availed at an additional cost.</span>}
                                                    {amenity.icon && <Image alt={'InstaFarms ' + amenity.name} width={50} height={50} src={getSafeImageSrc(amenity.icon)} />}
                                                </div>
                                                <span>{amenity.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </ModalFour>}

                        {activitiesModal && <ModalFour classname={styles.contentModal} onClose={(e) => setActivitiesModal(false)}>
                            <Button
                                aria-label="Close"
                                width={32}
                                height={32}
                                label={<CloseIcon variant="alert" />}
                                className={styles.close}
                                onClick={(e) => setActivitiesModal(false)}
                            />
                            <div className={styles.content}>
                                <h4>Activities</h4>

                                <div className={styles.faq_content}>
                                    <div className={styles.sectionAmenities}>

                                        {propertyItem.activitiesList.map((amenity, index) => (
                                            <div className={styles.itemBox} key={'offered_amenities_' + index}>
                                                <div className={styles.imgsection}>
                                                    {amenity.paid == 1 && <span className={styles.paid_icon} onClick={() => setVisibleToolTip('offered_amenities_' + index)}>₹</span>}
                                                    {visibleToolTip == 'offered_amenities_' + index && <span onClick={() => setVisibleToolTip('')} className={styles.paid_tool_tip}>This can be availed at an additional cost.</span>}
                                                    {amenity.icon && <Image alt={'InstaFarms ' + amenity.name} width={50} height={50} src={getSafeImageSrc(amenity.icon)} />}
                                                </div>
                                                <span>{amenity.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </ModalFour>}

                        {safetyHygieneModal && <ModalFour classname={styles.contentModal} onClose={(e) => setSafetyHygieneModal(false)}>
                            <Button
                                aria-label="Close"
                                width={32}
                                height={32}
                                label={<CloseIcon variant="alert" />}
                                className={styles.close}
                                onClick={(e) => setSafetyHygieneModal(false)}
                            />
                            <div className={styles.content}>
                                <h4>Safety and Hygiene</h4>

                                <div className={styles.faq_content}>
                                    <div className={styles.sectionAmenities}>

                                        {propertyItem.safety_hygiene.map((safety, index) => (
                                            <div className={styles.itemBox} key={'propertY_safety_and_hygiene' + index}>
                                                <div className={styles.imgsection}>
                                                    {safety.icon && <Image alt={'InstaFarms ' + safety.name} width={20} height={20} src={getSafeImageSrc(safety.icon)} />}
                                                </div>
                                                <span>{safety.name}</span>
                                            </div>

                                        ))}
                                    </div>
                                </div>
                            </div>
                        </ModalFour>}

                        {dataFetched && propertyItem.show_spaces == 1 && propertyItem.rooms && <div className={styles.section}>
                            <h4>Spaces</h4>
                            <RoomSlider showRoomsGallery={toggleRoomsSlider} rooms={propertyItem.rooms} />
                        </div>}







                        {propertyItem.safety_hygiene && propertyItem.safety_hygiene.length > 0 && <div className={styles.section}>
                            <h4>Safety and Hygiene</h4>
                            <div className={styles.sectionAmenities}>
                                {propertyItem.safety_hygiene.slice(0, SafetyHygieneLength).map((safety, index) => (
                                    <div className={styles.itemBox} key={'propertY_safety_and_hygiene' + index}>
                                        <div className={styles.imgsection}>
                                            {safety.icon && <Image alt={'InstaFarms ' + safety.name} width={20} height={20} src={getSafeImageSrc(safety.icon)} />}
                                        </div>
                                        <span>{safety.name}</span>
                                    </div>

                                ))}
                                {propertyItem.safety_hygiene.length > SafetyHygieneLength && SafetyHygieneLength < 100 && <button onClick={() => setSafetyHygieneModal(true)} className='plainbtn'>+{propertyItem.safety_hygiene.length - SafetyHygieneLength} more</button>}
                            </div>
                        </div>
                        }

                        {propertyItem.labelAverages && <div className={styles.section}>
                            <h4 className={styles.reviewHeading}>Reviews
                                <span className={styles.reviewStars}>
                                    {renderStars(propertyItem.overallAverage)}
                                    {propertyItem.overallAverage < 0.30 && <Image alt="InstaFarms" width={20} height={20} src={'/assets/images/star_filled.png'} />}
                                    {propertyItem.overallAverage > 1 && <Image alt="InstaFarms" width={20} height={20} src={'/assets/images/star_filled.png'} />}

                                    <Image alt="InstaFarms" width={20} height={20} src={'/assets/images/star_filled.png'} />
                                    <Image alt="InstaFarms" width={20} height={20} src={'/assets/images/star_filled.png'} />
                                    <Image alt="InstaFarms" width={20} height={20} src={'/assets/images/star_half.png'} />
                                    <Image alt="InstaFarms" width={20} height={20} src={'/assets/images/star_blank.png'} />

                                    {propertyItem.overallAverage}
                                </span>
                            </h4>
                            <ul className={styles.sectionReviews}>
                                {propertyItem.labelAverages.map((review, index) => (
                                    <li key={'avg_' + index}><p className={styles.review_item}>{review.label}</p><p className={styles.review_item}><span></span> {review.average}</p></li>
                                ))}
                            </ul>
                        </div>}

                        {propertyItem.reviews && <div className={styles.section}>
                            {isMobile ? <ReviewsSlider reviews={propertyItem.reviews} /> : <ReviewsBox reviews={propertyItem.reviews} />}
                        </div>}



                    </div>

                    <div className={styles.contentsectionRight}>
                        <div className={styles.priceBox}>
                            {propertyItem.id && <PropertyPriceBox siteSettings={siteSettings} propertyItem={propertyItem} queryData={queryData} />}
                        </div>
                    </div>

                </section>
                {OtherPropertiesList && OtherPropertiesList.length > 1 && <NearByLocations titleTag={'h4'} title={'Other Properties in the ' + propertyItem.address_details?.area_name} subtitle={''} propertiesList={OtherPropertiesList} />}

                {roomsSlider && <Modal classname={styles.modalwrapper} onClose={(e) => setRoomsSlider(false)} isOpen={roomsSlider}>
                    <Button
                        aria-label="Close"
                        width={32}
                        height={32}
                        label={<CloseIcon variant="alert" />}
                        className={styles.close}
                        onClick={(e) => setRoomsSlider(false)}
                    />
                    <div className={styles.content}>
                        <div className={styles.gallery_section}>
                            {roomsTags && roomsTags.length > 0 && <div className={styles.gallery_tags}>
                                <span onClick={() => toggleRoomsTag('showall')} className={showAllGallery ? styles.active : ''} key={'rooms_tag_showAll'}>All</span>
                                {roomsTags.map((tag, index) => (
                                    <span onClick={() => toggleRoomsTag(tag.name)} className={tag['selected'] ? styles.active : ''} key={'rooms_tag_' + index}>{getKeyName(tag.name, '')}</span>
                                ))}
                            </div>}

                            {filteredRoomsItems.map((item, index) => (<div className={styles.gallery_box} key={'rooms_gallery_item_' + index}>
                                <picture>
                                    <Image
                                        alt={getKeyName(item.tag, index)}
                                        src={getSafeImageSrc(item.thumbnail)}
                                        loading="lazy"
                                        width={800} height={600}
                                    />
                                </picture>
                                <p className={styles.gallery_tag}>{item.title ? item.title : getKeyName(item.tag, index)}</p>
                            </div>
                            ))}



                        </div>
                    </div>
                </Modal>}

                {galleryModal && <Modal classname={styles.modalwrapper} onClose={(e) => setGalleryModal(false)} isOpen={galleryModal}>
                    <Button
                        aria-label="Close"
                        width={32}
                        height={32}
                        label={<CloseIcon variant="alert" />}
                        className={styles.close}
                        onClick={(e) => setGalleryModal(false)}
                    />
                    <div className={styles.content}>
                        <div className={styles.gallery_section}>
                            {galleryTags && galleryTags.length > 0 && <div className={styles.gallery_tags}>
                                <span onClick={() => toggleTag('showall')} className={showAllGallery ? styles.active : ''} key={'gallery_tag_showAll'}>All</span>
                                {galleryTags.map((tag, index) => (
                                    <span onClick={() => toggleTag(tag.name)} className={tag['selected'] ? styles.active : ''} key={'gallery_tag_' + index}>{tag.name}</span>
                                ))}
                            </div>}
                            {filteredGalleryItems.map((img, index) => (
                                <div className={styles.gallery_box} key={'gallery_item_' + index}>

                                    <picture>
                                        <Image
                                            src={getSafeImageSrc(img.url)} // Default image
                                            alt={img.tag || propertyItem.property_code_name || 'InstaFarms Property'}
                                            width={800} height={600}
                                            loading="lazy"

                                        />
                                    </picture>


                                    {img.tag ? <p className={styles.gallery_tag}>{img.tag}</p> : <p className={styles.gallery_tag}>{propertyItem.property_code_name} {index + 1}</p>}
                                </div>
                            ))}
                        </div>
                    </div>
                </Modal>}
            </>}
        </>
    )

}