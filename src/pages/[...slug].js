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
        const areaData = await locationsSerivces.getAllArea()
        const locationPaths = areaData.map((area) => ({
            params: {
                // Note: This generates URLs like /telangana/hyderabad/shamshabad
                // If you want /telangana/hyderabad/farmhouses-in-shamshabad, you would modify area.slug here.
                // For example: slug: [area.state_slug, area.city_name.toLowerCase(), `farmhouses-in-${area.slug}`]
                slug: [
                    area.state_slug || 'telangana',
                    area.city_name || 'hyderabad',
                    area.slug, // Assuming area.slug is already in the desired format
                ],
            },
        }))

        // 2. Get all paths for Individual Property Pages
        // URL structure: /[city]/[area]/[property-slug].html
        const payload = {
            pageNumber: 1,
            totalPages: 0,
            LastDocument: false,
            moveTo: false,
            perPage: 1000, // Fetch a large number for build time
            orderBy: 'weight',
            searchBy: '',
            searchKey: '',
            attributes: 'plans,slug,type,address_details',
        }
        const dataList = await propertiesServices.getAllProperties(payload)

        if (!dataList || !Array.isArray(dataList)) {
            console.error(
                'Error: Property data list is empty or not an array in getStaticPaths.',
            )
            // Return only location paths if properties fetch fails
            return {
                paths: locationPaths,
                fallback: 'blocking',
            }
        }

        const propertyPaths = dataList
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

        // 3. Get all paths for Individual CMS Pages
        // URL structure : /[cms-slug]
        let cmsPages = await cmsServices.getAllPages()
        const cmsPaths = cmsPages.map((page) => ({
            params: { slug: [page.slug] },
        }))

        // 4. Combine both sets of paths
        const paths = [...locationPaths, ...propertyPaths, ...cmsPaths]

        return {
            paths,
            fallback: 'blocking',
        }
    }
    catch (error) {
        console.error('Error in getStaticPaths:', error)
        return {
            paths: [],
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
            let pageData = await cmsServices.SearchPage(searchPayload)

            // CRITICAL FIX: Check if the page exists AND the slug matches exactly
            if (!pageData || pageData.length === 0) {
                return { notFound: true }
            }

            // // Additional validation: Ensure exact slug match
            const exactMatch = pageData[0].slug === cmsSlug ? true : false;
            if (!exactMatch) {
                return { notFound: true }
            }

            let siteSettings = await settingsServices.getSettings()
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
            
            // console.log('🔍 DEBUG: Property page detected')
            // console.log('🔍 DEBUG: Full URL slug array:', slug)
            // console.log('🔍 DEBUG: Extracted propertySlug:', propertySlug)

            // if (!propertySlug) {
            //     console.log('❌ DEBUG: No propertySlug found, returning 404')
            //     return { notFound: true }
            // }

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
            const propertyDetails = await propertiesServices.getAllProperties(payload)
            
            // console.log('🔍 DEBUG: Property search results:', propertyDetails?.length || 0, 'properties found')
            // if (propertyDetails && propertyDetails.length > 0) {
            //     console.log('🔍 DEBUG: Found property slugs in database:', propertyDetails.map(p => p.slug))
            // }

            // if (!propertyDetails || propertyDetails.length === 0) {
            //     console.log('❌ DEBUG: No properties found for slug:', propertySlug)
            //     return { notFound: true }
            // }

            // CRITICAL FIX: Ensure exact slug match
            const exactPropertyMatch = propertyDetails.find(property => property.slug === propertySlug)
            // console.log('🔍 DEBUG: Looking for exact slug:', propertySlug)
            // console.log('🔍 DEBUG: Exact property match found:', !!exactPropertyMatch)
            // if (exactPropertyMatch) {
            //     console.log('🔍 DEBUG: Property details:', {
            //         slug: exactPropertyMatch.slug,
            //         city_name: exactPropertyMatch.address_details?.city_name,
            //         area_name: exactPropertyMatch.address_details?.area_name,
            //         city_slug: exactPropertyMatch.address_details?.city_slug,
            //         area_slug: exactPropertyMatch.address_details?.area_slug
            //     })
            // }
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
                
                // console.log('🔍 DEBUG: URL vs Property validation:')
                // console.log('  URL city:', urlCitySlug)
                // console.log('  Property city (lowercase):', propertyCity)
                // console.log('  URL area:', urlAreaSlug)
                // console.log('  Property area (lowercase):', propertyArea)
                
                // Validate that the URL structure matches the property's actual location
                if (propertyCity && propertyCity !== urlCitySlug) {
                    // console.log('❌ DEBUG: City mismatch! URL:', urlCitySlug, 'vs Property:', propertyCity)
                    return { notFound: true }
                }
                if (propertyArea && propertyArea !== urlAreaSlug) {
                    // console.log('❌ DEBUG: Area mismatch! URL:', urlAreaSlug, 'vs Property:', propertyArea)
                    return { notFound: true }
                }
                
                // console.log('✅ DEBUG: URL validation passed!')
            }

            const siteSettings = await settingsServices.getSettings()

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
            const areaPayload = {
                pageNumber: 1,
                perPage: 1,
                searchBy: 'slug',
                searchKey: areaSlug,
            }
            const areaDetails = await locationsSerivces.SearchAreas(areaPayload)
            
            // If no area is found for this slug, it's a 404
            if (!areaDetails || areaDetails.length === 0) {
                return { notFound: true }
            }
            // CRITICAL FIX: Ensure exact slug match and validate state/city structure
            const exactAreaMatch = (areaDetails[0].slug===areaSlug) ? true : false;
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
            const searchPayload = {
                pageNumber: 1,
                perPage: 500, // Fetch a good number of properties for the list page
                orderBy: 'weight',
                searchBy: 'address_details.area_slug',
                searchKey: areaSlug,
                attributes:
                    'plans,name,property_code_name,slug,max_guest_count,address_details,price_detail,caretaker,featured_image,type,bedroom_count,rooms,check_in_time,check_out_time,max_guest_count,bathroom_count,amenities,faqs,meta_url,meta_description,manager',
            }
            const dataList = await propertiesServices.getAllProperties(searchPayload)
            const siteSettings = await settingsServices.getSettings()

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