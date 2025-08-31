import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { cmsServices, collectionsSerivces, locationsSerivces, settingsServices } from 'utils/services'

import styles from './footer.module.scss'

import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'



export default function Footer() {
    const [cmsPages, setCmsPages] = useState('')
    const [topLocation, setTopLocation] = useState('')
    const [topCollections, setTopCollections] = useState('')
    const [siteSettings, setSiteSettings] = useState('')
    const [showMoreLocations, setShowMoreLocations] = useState(false)
    const [showMoreCollections, setShowMoreCollections] = useState(false)
    const d = new Date();
    const year = d.getFullYear();
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))
    const [activeMenu, setActiveMenu] = useState('none')
    const ITEMS_TO_SHOW = 7;

    useEffect(() => {
        let locationPayload = {
            pageNumber: 1,
            totalPages: 0,
            LastDocument: false,
            moveTo: false,
            orderBy: 'weight',
            searchBy: '',
            searchKey: '',
            attributes: "name,slug,city_name,state_slug"
        }
        let collectionsPayload = {
            pageNumber: 1,
            totalPages: 0,
            LastDocument: false,
            moveTo: false,
            orderBy: 'weight',
            searchBy: '',
            searchKey: '',
            attributes: "logo,name,slug,hpc"
        }
        settingsServices.getSettings().then((res) => {
            setSiteSettings(res)
        })
        cmsServices.getAllPages().then((res) => {

            setCmsPages(res)
        })

        locationsSerivces.getAllLocations(locationPayload).then((res) => {
            setTopLocation(res)
        })

        collectionsSerivces.paginateCollections(collectionsPayload).then((res) => {

            setTopCollections(res)
        })

    }, [])

    const getVisibleLocations = () => {
        if (!topLocation || topLocation.length === 0) return [];
        return showMoreLocations ? topLocation : topLocation.slice(0, ITEMS_TO_SHOW);
    }

    const getVisibleCollections = () => {
        if (!topCollections || topCollections.length === 0) return [];
        return showMoreCollections ? topCollections : topCollections.slice(0, ITEMS_TO_SHOW);
    }

    const formatCityName = (city) => {
        return city.replaceAll(" ", "").toLowerCase();
    }

    const shouldShowMoreButtonLocations = topLocation && topLocation.length > ITEMS_TO_SHOW;
    const shouldShowMoreButtonCollections = topCollections && topCollections.length > ITEMS_TO_SHOW;

    return (
        <div className={styles.wrapper}>
            <div className={styles.whatsapp_icon}>
                <Link title="InstaFarms Official Phone Number" href={`tel:${siteSettings.home_phone ? siteSettings.home_phone : '8019127474'}`} >
                    <svg className={styles.phone} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M18.333 14.1v2.5a1.667 1.667 0 0 1-1.816 1.667 16.5 16.5 0 0 1-7.192-2.559 16.25 16.25 0 0 1-5-5 16.5 16.5 0 0 1-2.558-7.225 1.666 1.666 0 0 1 1.658-1.816h2.5A1.67 1.67 0 0 1 7.592 3.1c.105.8.3 1.586.583 2.342A1.67 1.67 0 0 1 7.8 7.2L6.742 8.258a13.33 13.33 0 0 0 5 5L12.8 12.2a1.67 1.67 0 0 1 1.758-.375c.756.282 1.542.478 2.342.583a1.666 1.666 0 0 1 1.433 1.692"></path></svg>
                </Link>

                <Link title="InstaFarms Official Whatsapp Number" href={`https://wa.me/${siteSettings.whatsapp_phone ? siteSettings.whatsapp_phone : '7416500646'}`}>
                    <svg className={styles.whatsapp} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 737.509 740.824"><path fill-rule="evenodd" d="M630.056 107.658C560.727 38.271 468.525.039 370.294 0 167.891 0 3.16 164.668 3.079 367.072c-.027 64.699 16.883 127.855 49.016 183.523L0 740.824l194.666-51.047c53.634 29.244 114.022 44.656 175.481 44.682h.151c202.382 0 367.128-164.689 367.21-367.094.039-98.088-38.121-190.32-107.452-259.707m-259.758 564.8h-.125c-54.766-.021-108.483-14.729-155.343-42.529l-11.146-6.613-115.516 30.293 30.834-112.592-7.258-11.543c-30.552-48.58-46.689-104.729-46.665-162.379C65.146 198.865 202.065 62 370.419 62c81.521.031 158.154 31.81 215.779 89.482s89.342 134.332 89.311 215.859c-.07 168.242-136.987 305.117-305.211 305.117m167.415-228.514c-9.176-4.591-54.286-26.782-62.697-29.843-8.41-3.061-14.526-4.591-20.644 4.592-6.116 9.182-23.7 29.843-29.054 35.964-5.351 6.122-10.703 6.888-19.879 2.296-9.175-4.591-38.739-14.276-73.786-45.526-27.275-24.32-45.691-54.36-51.043-63.542s-.569-14.148 4.024-18.72c4.127-4.11 9.175-10.713 13.763-16.07 4.587-5.356 6.116-9.182 9.174-15.303 3.059-6.122 1.53-11.479-.764-16.07s-20.643-49.739-28.29-68.104c-7.447-17.886-15.012-15.466-20.644-15.746-5.346-.266-11.469-.323-17.585-.323s-16.057 2.296-24.468 11.478c-8.41 9.183-32.112 31.374-32.112 76.521s32.877 88.763 37.465 94.885c4.587 6.122 64.699 98.771 156.741 138.502 21.891 9.45 38.982 15.093 52.307 19.323 21.981 6.979 41.983 5.994 57.793 3.633 17.628-2.633 54.285-22.19 61.932-43.616 7.646-21.426 7.646-39.791 5.352-43.617s-8.41-6.122-17.585-10.714" class="whatsappRed_svg__color000000 whatsappRed_svg__svgShape" clip-rule="evenodd"></path></svg>
                </Link>
            </div>


            {!isMobile ? <div className={styles.subscribe}>
                <div className={styles.menus}>
                    {topLocation && topLocation.length > 0 && <ul className={activeMenu == 'menu1' ? styles.active : ""} >
                        <li onClick={() => setActiveMenu(activeMenu != 'menu1' ? 'menu1' : 'none')}>
                            <Image loading="lazy" alt="Top Locations at InstaFarms" width={20} height={20} src={'/assets/images/location.webp'} />
                            <h3 className='text-base text-black font-extrabold'>Top Locations</h3>
                        </li>
                        {getVisibleLocations().map((location, index) => (
                            <li key={'location_' + index}>
                                <Link scroll={true} aria-label={location.name} href={`/${location.state_slug}/${formatCityName(location.city_name)}/${location.slug}`} >
                                    <h6 className='text-sm font-[100]'>{location.name}</h6>
                                </Link>
                            </li>
                        ))}
                        {shouldShowMoreButtonLocations && (
                            <li className='mt-2'>
                                <div
                                    onClick={() => setShowMoreLocations(!showMoreLocations)}
                                    className='text-sm font-[500] text-blue-500 hover:text-blue-700 cursor-pointer border-none bg-transparent p-0'
                                >
                                    {showMoreLocations ? 'See Less' : 'See More'}
                                </div>
                            </li>
                        )}
                    </ul>}
                    {topCollections && topCollections.length > 0 && <ul className={activeMenu == 'menu2' ? styles.active : ""}>
                        <li onClick={() => setActiveMenu(activeMenu != 'menu2' ? 'menu2' : 'none')}>
                            <Image loading="lazy" alt="Top Collections at InstaFarms" width={20} height={20} src={'/assets/images/villa.webp'} />
                            <h3 className='text-base text-black font-extrabold'>Top Collections</h3>
                        </li>
                        {getVisibleCollections().map((collection, index) => (
                            <li key={'collection_' + index}>
                                <Link scroll={true} aria-label={collection.name} href={`/collections/${collection.slug}`} >
                                    <h6 className='text-sm font-[100]'>{collection.name}</h6>
                                </Link>
                            </li>
                        ))}
                        {shouldShowMoreButtonCollections && (
                            <li className='mt-2'>
                                <div
                                    onClick={() => setShowMoreCollections(!showMoreCollections)}
                                    className='text-sm font-[500] text-blue-500 hover:text-blue-700 cursor-pointer border-none bg-transparent p-0'
                                >
                                    {showMoreCollections ? 'See Less' : 'See More'}
                                </div>
                            </li>
                        )}
                    </ul>}
                    {cmsPages && cmsPages.length > 0 && <ul className={activeMenu == 'menu3' ? styles.active : ""} >
                        <li onClick={() => setActiveMenu(activeMenu != 'menu3' ? 'menu3' : 'none')}>
                            <Image loading="lazy" alt="About InstaFarms" width={20} height={20} src={'/assets/images/about.webp'} />
                            <h3 className='text-base text-black font-extrabold'>About</h3>
                        </li>
                        {cmsPages.map((page, index) => (
                            <li key={'smcpage_' + index}>
                                <Link scroll={true} aria-label={page.title} href={`/${page.slug}`} >
                                    <h6 className='text-sm font-[100]'>{page.menu_title ? page.menu_title : page.title}</h6>
                                </Link>
                            </li>
                        ))}
                        <li>
                            <Link scroll={true} href="/partner-with-us" title="partner-with-us">
                                <h6 className='text-sm font-[100]'>Partner with us</h6>
                            </Link>
                        </li>
                        <li>
                            <Link scroll={true} href="/blog" title="Contact Us at InstaFarms">
                                <h6 className='text-sm font-[100]'>Blog</h6>
                            </Link>
                        </li>
                    </ul>}
                    <ul className={activeMenu == 'menu4' ? styles.active : ""}>
                        <li onClick={() => setActiveMenu(activeMenu != 'menu4' ? 'menu4' : 'none')}>
                            <Image loading="lazy" alt="Support at InstaFarms" width={20} height={20} src={'/assets/images/support.webp'} />
                            <h3 className='text-base text-black font-extrabold'>Support</h3>
                        </li>
                        <li>
                            <Link href="/contact-us" title="Contact Us at InstaFarms">
                                <h6 className='text-sm font-[100]'>Contact Us</h6>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div> : <div className={styles.menus}>
                {topLocation && topLocation.length > 0 && <ul className={activeMenu == 'menu1' ? styles.active : ""} >
                    <li onClick={() => setActiveMenu(activeMenu != 'menu1' ? 'menu1' : 'none')}>
                        <Image loading="lazy" alt="Top Locations at InstaFarms" width={20} height={20} src={'/assets/images/location.webp'} />
                        <h3 className='text-base text-gray-900'>Top Locations</h3>
                    </li>
                    {getVisibleLocations().map((location, index) => (
                        <li key={'location_' + index}>
                            <Link scroll={true} aria-label={location.name} href={`/${location.state_slug}/${formatCityName(location.city_name)}}/${location.slug}`} >
                                <h6 className='text-xs font-[100]'>{location.name}</h6>
                            </Link>
                        </li>
                    ))}
                    {shouldShowMoreButtonLocations && (
                        <li className='mt-2'>
                            <div
                                onClick={() => setShowMoreLocations(!showMoreLocations)}
                                className='text-xs font-[500] text-blue-600 hover:text-blue-800 cursor-pointer border-none bg-transparent ml-8'
                            >
                                {showMoreLocations ? 'See Less' : 'See More'}
                            </div>
                        </li>
                    )}
                </ul>}
                {topCollections && topCollections.length > 0 && <ul className={activeMenu == 'menu2' ? styles.active : ""}>
                    <li onClick={() => setActiveMenu(activeMenu != 'menu2' ? 'menu2' : 'none')}>
                        <Image loading="lazy" alt="Top Collections at InstaFarms" width={20} height={20} src={'/assets/images/villa.webp'} />
                        <h3 className='text-base text-gray-900'>Top Collections</h3>
                    </li>
                    {getVisibleCollections().map((collection, index) => (
                        <li key={'collection_' + index}>
                            <Link scroll={true} aria-label={collection.name} href={`/collections/${collection.slug}`} >
                                <h6 className='text-xs font-[100]'>{collection.name}</h6>
                            </Link>
                        </li>
                    ))}
                    {shouldShowMoreButtonCollections && (
                        <li className='mt-2'>
                            <div
                                onClick={() => setShowMoreCollections(!showMoreCollections)}
                                className='text-xs font-[500] text-blue-600 hover:text-blue-800 cursor-pointer border-none bg-transparent ml-8'
                            >
                                {showMoreCollections ? 'See Less' : 'See More'}
                            </div>
                        </li>
                    )}
                </ul>}
                {cmsPages && cmsPages.length > 0 && <ul className={activeMenu == 'menu3' ? styles.active : ""} >
                    <li onClick={() => setActiveMenu(activeMenu != 'menu3' ? 'menu3' : 'none')}>
                        <Image loading="lazy" alt="About InstaFarms" width={20} height={20} src={'/assets/images/about.webp'} />
                        <h3 className='text-base text-gray-900'>About</h3>
                    </li>
                    {cmsPages.map((page, index) => (
                        <li key={'smcpage_' + index}>
                            <Link scroll={true} aria-label={page.title} href={`/${page.slug}`} >
                                <h6 className='text-xs font-[100]'>{page.menu_title ? page.menu_title : page.title}</h6>
                            </Link>
                        </li>

                    ))}
                    <li>
                        <Link scroll={true} href="/partner-with-us" title="partner-with-us">
                            <h6 className='text-xs font-[100]'>Partner with us</h6>
                        </Link>
                    </li>
                    <li>
                        <Link scroll={true} href="/blog" title="Blogs at InstaFarms">
                            <h6 className='text-sm font-[100]'>Blog</h6>
                        </Link>
                    </li>
                </ul>}
                <ul className={activeMenu == 'menu4' ? styles.active : ""}>
                    <li onClick={() => setActiveMenu(activeMenu != 'menu4' ? 'menu4' : 'none')}>
                        <Image loading="lazy" alt="Support at InstaFarms" width={20} height={20} src={'/assets/images/support.webp'} />
                        <h3 className='text-base text-gray-900'>Support</h3>
                    </li>
                    <li>
                        <Link scroll={true} href="/contact-us" title="Contact Us at InstaFarms">
                            <h6 className='text-xs font-[100]'>Contact Us</h6>
                        </Link>
                    </li>
                </ul>
            </div>}

            <div className={styles.staticmenu}>
                <div className={styles.staticmenuLeft}>
                    A InstaFarms Company. {year} All Rights Reserved | <Link scroll={true} title="Sitamep" href='/sitemap.xml'>Sitemap</Link>
                </div>
                <div className={styles.staticmenuRight}>
                    <a href="https://www.youtube.com/@instafarms" title="Youtube at InstaFarms" target="_blank" rel="noopener noreferrer">
                        <Image loading="lazy" alt="Youtube" width={20} height={20} src={'/assets/images/youtube.svg'} />
                    </a>
                    <a href="https://www.linkedin.com/company/instafarms" title="Linkedin at InstaFarms" target="_blank" rel="noopener noreferrer">
                        <Image loading="lazy" alt="linkedin" width={20} height={20} src={'/assets/images/linkedin.svg'} />
                    </a>
                    <a href="https://www.instagram.com/instafarms.in" title="Instagram at InstaFarms" target="_blank" rel="noopener noreferrer">
                        <Image loading="lazy" alt="Instagram" width={20} height={20} src={'/assets/images/Insta.svg'} />
                    </a>
                    <a href="https://www.facebook.com/profile.php?id=61574421929822#" title="Facebook at InstaFarms" target="_blank" rel="noopener noreferrer">
                        <Image loading="lazy" alt="Facebook" width={20} height={20} src={'/assets/images/Fb.svg'} />
                    </a>
                    <a href="https://www.twitter.com/instafarms" title="Twiter at InstaFarms" target="_blank" rel="noopener noreferrer">
                        <Image loading="lazy" alt="Twiter" width={20} height={20} src={'/assets/images/Twiter.svg'} />
                    </a>
                </div>
            </div>
        </div>
    )
}