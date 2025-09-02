import React from 'react'
import dynamic from 'next/dynamic'
import {
    authServices,
    settingsServices,
    propertiesServices,
    locationsSerivces,
    cmsServices,
} from 'utils/services'

// Dynamically import components for better performance
const LocationPage = dynamic(() => import('components/LocationPage'))
const PropertyPage = dynamic(() => import('components/PropertyPage'))
const CMSPage = dynamic(() => import('components/CMSPage'))

/**
 * Helper function to generate clean, URL-friendly slugs.
 * This avoids repeating the same logic and makes the code cleaner.
 * @param {string} str The input string.
 * @returns {string} The sanitized slug.
*/

export async function getStaticPaths() {
    try {
        // 1. Get all paths for Location Listing Pages
        // URL structure: /[state]/[city]/[area]
        let locationPaths = []
        try {
            const areaData = await locationsSerivces.getAllArea()
            if (areaData && Array.isArray(areaData)) {
                locationPaths = areaData.map((area) => ({
                    params: {
                        slug: [
                            area.state_slug || 'telangana',
                            area.city_name || 'hyderabad',
                            area.slug,
                        ],
                    },
                }))
            }
        } catch (error) {
            console.error('Error fetching location paths:', error)
            // Continue with empty location paths
        }

        // 2. Get all paths for Individual Property Pages
        let propertyPaths = []
        try {
            const payload = {
                pageNumber: 1,
                totalPages: 0,
                LastDocument: false,
                moveTo: false,
                perPage: 1000,
                orderBy: 'weight',
                searchBy: '',
                searchKey: '',
                attributes: 'plans,slug,type,address_details',
            }
            const dataList = await propertiesServices.getAllProperties(payload)

            if (dataList && Array.isArray(dataList)) {
                propertyPaths = dataList
                    .filter((post) => post.slug && post.address_details?.city_name && post.address_details?.area_name)
                    .map((post) => ({
                        params: {
                            slug: [
                                post.address_details.city_name.toLowerCase(),
                                post.address_details.area_name.toLowerCase(),
                                `${post.slug.toLowerCase()}.html`,
                            ],
                        },
                    }))
            }
        } catch (error) {
            console.error('Error fetching property paths:', error)
            // Continue with empty property paths
        }

        // 3. Get all paths for Individual CMS Pages
        let cmsPaths = []
        try {
            const cmsPages = await cmsServices.getAllPages()
            if (cmsPages && Array.isArray(cmsPages)) {
                cmsPaths = cmsPages
                    .filter((page) => page && page.slug && typeof page.slug === 'string')
                    .map((page) => ({
                        params: { slug: [page.slug] },
                    }))
            }
        } catch (error) {
            console.error('Error fetching CMS pages:', error)
            // Continue with empty CMS paths
        }
        
        // 4. Combine both sets of paths
        const paths = [...locationPaths, ...propertyPaths, ...cmsPaths]
        
        console.log('Generated paths summary:', {
            locationPaths: locationPaths.length,
            propertyPaths: propertyPaths.length,
            cmsPaths: cmsPaths.length,
            totalPaths: paths.length
        })

        // Ensure we have at least some paths to prevent build failure
        if (paths.length === 0) {
            console.warn('No paths generated, using fallback paths')
            return {
                paths: [
                    { params: { slug: ['home'] } },
                    { params: { slug: ['about'] } }
                ],
                fallback: 'blocking',
            }
        }

        return {
            paths,
            fallback: 'blocking',
        }
    }
    catch (error) {
        console.error('Error in getStaticPaths:', error)
        // Return fallback paths to prevent build failure
        return {
            paths: [
                { params: { slug: ['home'] } },
                { params: { slug: ['about'] } }
            ],
            fallback: 'blocking',
        }
    }
}

export async function getStaticProps({ params }) {
    const { slug } = params // slug is an array of URL parts

    try {
        //---- CONDITION 1: Get all paths for Individual CMS Pages (e.g. /[cms-slug]) ----
        if (slug.length === 1) {
            const [cmsSlug] = slug;
            let searchPayload = {
                pageNumber: 1,
                totalPages: 0,
                LastDocument: false,
                moveTo: false,
                perPage: 1,
                orderBy: '',
                searchBy: 'slug',
                searchKey: cmsSlug,
            }
            let pageData
            try {
                pageData = await cmsServices.SearchPage(searchPayload)
            } catch (error) {
                console.error('Error fetching CMS page:', error)
                return { notFound: true }
            }

            // CRITICAL FIX: Check if the page exists AND the slug matches exactly
            if (!pageData || !Array.isArray(pageData) || pageData.length === 0) {
                return { notFound: true }
            }

            // Additional validation: Ensure exact slug match
            const exactMatch = pageData[0] && pageData[0].slug === cmsSlug
            if (!exactMatch) {
                return { notFound: true }
            }

            let siteSettings = {}
            try {
                siteSettings = await settingsServices.getSettings()
            } catch (error) {
                console.error('Error fetching site settings:', error)
                // Continue with empty settings
            }
            
            return { 
                props: { 
                    pageType: 'cms',
                    siteSettings, 
                    pageData,
                } 
            }
        }

        // ---- CONDITION 2: Individual Property Page (e.g., /hyderabad/shamshabad/farm-houses/my-property.html) ----
        if (slug[slug.length - 1].endsWith('.html')) {
            // The actual property slug is the last part of the URL, without '.html'
            const propertySlug = slug[slug.length - 1].replace('.html', '')
            
            if (!propertySlug) {
                return { notFound: true }
            }

            const payload = {
                pageNumber: 1,
                totalPages: 0,
                LastDocument: false,
                moveTo: false,
                perPage: 1,
                orderBy: 'weight',
                searchBy: 'slug',
                searchKey: propertySlug,
            }
            
            let propertyDetails
            try {
                propertyDetails = await propertiesServices.getAllProperties(payload)
            } catch (error) {
                console.error('Error fetching property details:', error)
                return { notFound: true }
            }
            
            if (!propertyDetails || !Array.isArray(propertyDetails)) {
                console.error('Property details is not an array:', propertyDetails)
                return { notFound: true }
            }

            // CRITICAL FIX: Ensure exact slug match
            const exactPropertyMatch = propertyDetails.find(property => property.slug === propertySlug)
            if (!exactPropertyMatch) {
                console.log('❌ DEBUG: No exact property match found for slug:', propertySlug)
                return { notFound: true }
            }

            // Additional validation: Check if the URL structure matches the property's actual location
            if (slug.length >= 3) {
                const urlCitySlug = slug[slug.length - 3]
                const urlAreaSlug = slug[slug.length - 2]
                
                const propertyCity = exactPropertyMatch.address_details?.city_name?.toLowerCase()
                const propertyArea = exactPropertyMatch.address_details?.area_name?.toLowerCase()
                
                // Validate that the URL structure matches the property's actual location
                if (propertyCity && propertyCity !== urlCitySlug) {
                    return { notFound: true }
                }
                if (propertyArea && propertyArea !== urlAreaSlug) {
                    return { notFound: true }
                }
            }

            let siteSettings = {}
            try {
                siteSettings = await settingsServices.getSettings()
            } catch (error) {
                console.error('Error fetching site settings:', error)
                // Continue with empty settings
            }

            return {
                props: {
                    pageType: 'property',
                    siteSettings,
                    propertyDetail: exactPropertyMatch,
                },
            }
        }

        // ---- CONDITION 3: Location Listing Page (e.g., /telangana/hyderabad/shamshabad) ----
        if (slug.length === 3) {
            const [stateSlug, citySlug, areaSlug] = slug

            // Fetch area details to confirm it's a valid location page
            let areaDetails = []
            try {
                const areaPayload = {
                    pageNumber: 1,
                    perPage: 1,
                    searchBy: 'slug',
                    searchKey: areaSlug,
                }
                areaDetails = await locationsSerivces.SearchAreas(areaPayload)
            } catch (error) {
                console.error('Error fetching area details:', error)
                return { notFound: true }
            }
            
            // If no area is found for this slug, it's a 404
            if (!areaDetails || areaDetails.length === 0) {
                return { notFound: true }
            }
            
            // CRITICAL FIX: Ensure exact slug match and validate state/city structure
            const exactAreaMatch = (areaDetails[0].slug === areaSlug) ? true : false;
            if (!exactAreaMatch) {
                return { notFound: true }
            }
            
            // Additional validation: Check if state and city slugs match the area's data
            const areaStateSlug = areaDetails[0].state_name?.toLowerCase() || 'telangana';
            const areaCitySlug = areaDetails[0].city_name?.toLowerCase() || 'hyderabad';
            
            if (areaStateSlug !== stateSlug || areaCitySlug !== citySlug) {
                return { notFound: true }
            }

            // Fetch all properties for this area
            let dataList = []
            try {
                const searchPayload = {
                    pageNumber: 1,
                    perPage: 500, // Fetch a good number of properties for the list page
                    orderBy: 'weight',
                    searchBy: 'address_details.area_slug',
                    searchKey: areaSlug,
                    attributes:
                        'plans,name,property_code_name,slug,max_guest_count,address_details,price_detail,caretaker,featured_image,type,bedroom_count,rooms,check_in_time,check_out_time,max_guest_count,bathroom_count,amenities,faqs,meta_url,meta_description,manager',
                }
                dataList = await propertiesServices.getAllProperties(searchPayload)
            } catch (error) {
                console.error('Error fetching properties for area:', error)
                // Continue with empty data list
            }
            
            let siteSettings = {}
            try {
                siteSettings = await settingsServices.getSettings()
            } catch (error) {
                console.error('Error fetching site settings:', error)
                // Continue with empty settings
            }

            return {
                props: {
                    pageType: 'location',
                    siteSettings,
                    dataList: dataList || [],
                    areaDetails,
                    citySlug,
                    areaSlug,
                },
            }
        }
        
        // If slug length doesn't match any condition, return 404
        return { notFound: true }
    } catch (error) {
        console.error('Error in getStaticProps for slug:', slug, error)
        return { notFound: true }
    }
}

// The main component that decides which page to render
export default function CatchAllPage(props) {
    const { pageType } = props

    if (pageType === 'location') {
        return <LocationPage {...props} />
    }

    if (pageType === 'property') {
        return <PropertyPage {...props} />
    }

    if (pageType === 'cms') {
        // Render CMS page component here
        return <CMSPage {...props}/>
    }

    // Fallback in case pageType is not defined, though getStaticProps should prevent this.
    return <div>Page not found.</div>
}