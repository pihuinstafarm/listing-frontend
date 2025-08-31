import Paper from '@mui/material/Paper'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { isLoggedIn } from 'utils/components'

import styles from './content.module.scss'

import { authServices } from 'utils/services'
function Content({ allCity, siteSettings, openLogin }) {
    const dropdownRef = useRef(null)
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))
    const [showDropdown, setShowDropdown] = useState(false)
    const [loggedIn, setLoggedIn] = useState(false)
    const [defaultLocation, setDefaultLocation] = useState()
    const [homePage, setHomePage] = useState('/')
    const [profile, setProfile] = useState('')
    const [sideBar, setSideBar] = useState(false)
    const [favCount, setFavCount] = useState(0)

    const getProfile = async () => {
        const token = localStorage.getItem('token')
        const documentId = localStorage.getItem('documentId')
        if (documentId && token) {
            authServices.getProfile().then((res) => {
                if (res.error) {
                    handleLogout()
                } else {
                    setProfile(res)
                    setFavCount(res.favorites ? res.favorites.length : 0)
                }
            })
        }
    }
    useEffect(() => {
        setSideBar(false)
        document.addEventListener('mousedown', handleOutsideClick)
        window.addEventListener('storage', handleStorageChange)
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick)
        }
    }, [])

    useEffect(() => {
        getProfile()
    }, [loggedIn])

    useEffect(() => {
        if (allCity && allCity.length > 0) {
            getDefaultCity()
        }
    }, [allCity])

    useEffect(() => {
        if (defaultLocation) {
            localStorage.setItem('defaultLocation', JSON.stringify(defaultLocation))
            setHomePage('/')
        }
    }, [defaultLocation])


    const reSetDefaultLocation = (newCity) => {
        setDefaultLocation(newCity)
    }

    const getDefaultCity = async () => {
        var newCity = allCity.reduce(function (result, option) {
            if (option.featured) {
                return option
            }
            return result;
        }, []);
        setDefaultLocation(newCity ? newCity : '')

    }
    useEffect(() => {
        setLoggedIn(isLoggedIn())
    }, [])

    function handleStorageChange() {
        setLoggedIn(isLoggedIn())
        getProfile()
    }

    function handleOutsideClick(e) {
        if (!dropdownRef.current?.contains(e.target)) {
            setShowDropdown(false)
        }
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

    function toggleSideBar() {
        if (loggedIn) {
            setSideBar(!sideBar)
        } else {
            openLogin()
        }
    }
    return (
        <div className={styles.wrapper}>

            {isMobile ? (
                <div className={styles.header}>
                    <p onClick={() => toggleSideBar()}><Image priority className={styles.handburger} alt="menu" src="/assets/images/svg/handburger.png" width="56" height="56" /></p>
                    {/*                    
                       <DefaultCity allCity={allCity} defaultLocation={defaultLocation} reSetDefaultLocation={reSetDefaultLocation}/>
                    */}
                    <p style={{ display: 'flex' }}>
                        <Link href={`tel:${siteSettings.home_phone ? siteSettings.home_phone : '8019127474'}`} className={styles.button} style={{ paddingLeft: '0px' }}><Image priority className={styles.phoneIcon} alt="phone" src="/assets/images/svg/PhoneIcon.png" width="20" height="20" />Call Us</Link>

                        <Link scroll={true} href={homePage} aria-label='InstaFarms Home' className={styles.logo}><Image priority width="146" height="85" alt="logo" src="/assets/images/svg/logo.webp" /></Link>
                    </p>
                    <div onClick={() => toggleSideBar()} className={sideBar ? styles.sidebar_menu + ' ' + styles.open : styles.sidebar_menu}>
                        {loggedIn && (<>
                            <p>
                                {profile && profile.first_name ? 'Welcome ' + profile.first_name : 'Welcome Back'}
                            </p>
                            <Link aria-label='My Profile' href="/my-profile">My Profile</Link>
                            <Link aria-label='Shortlisted properties' href="/shortlisted-properties">Shortlisted Properties <span className={styles.favSpan}>{favCount}</span></Link>
                            <Link aria-label='My Enquiries' href="/my-enquiries">My Enquiries</Link>
                            <Link aria-label='My Bookings' href="/my-bookings">My Bookings</Link>
                            <Link aria-label='Log Out' onClick={handleLogout} href="javascript:void(0)">Log Out</Link>

                        </>)}

                    </div>
                </div>
            ) : (
                <div className={styles.header}>
                    <div className={styles.header_left}>
                        <Link scroll={true} href={homePage} aria-label='InstaFarms Home' className={styles.logo}><Image priority width="146" height="85" alt="logo" src="/assets/images/svg/logo.webp" /></Link>
                        <div className={styles.box}>
                            <Link href="/register-event" className='solidbtn'>Planning for a Event ?</Link>
                            <Link href="/partner-with-us" className='plainbtn'>List Your Farm</Link>
                        </div>
                    </div>
                    <div className={styles.header_center}>
                        {/* <DefaultCity allCity={allCity} defaultLocation={defaultLocation}  reSetDefaultLocation={reSetDefaultLocation}/> */}
                    </div>
                    <div className={styles.header_right}>
                        <Link href={`tel:${siteSettings.home_phone ? siteSettings.home_phone : '8019127474'}`} className={styles.button} style={{ paddingLeft: '0px' }}><Image priority className={styles.phoneIcon} alt="phone" src="/assets/images/svg/PhoneIcon.png" width="20" height="20" />+91{siteSettings.home_phone ? siteSettings.home_phone : '8019127474'}</Link>
                        {loggedIn ? (
                            <div className={styles.logout}>
                                <span className={styles.plainbutton} style={{ paddingLeft: '0px' }}
                                    onClick={() => {
                                        setShowDropdown(!showDropdown)
                                    }}
                                ><Image priority src="/assets/images/svg/PersonIcon.png" width="20" height="20" alt="profile" className={styles.profileIcon} /> {profile && profile.first_name ? 'Welcome ' + profile.first_name : 'Welcome Back'}</span>
                                {showDropdown ? (
                                    <Paper
                                        className={styles.dropdown}
                                        elevation={4}
                                        ref={dropdownRef}
                                        onClick={() => {
                                            setShowDropdown(!showDropdown)
                                        }}
                                    >
                                        <Link scroll={true} aria-label='My Profile' href="/my-profile">My Profile</Link>
                                        <Link scroll={true} aria-label='Shortlisted properties' href="/shortlisted-properties">Shortlisted Properties<span className={styles.favSpan}>{favCount}</span></Link>
                                        <Link scroll={true} aria-label='My Enquiries' href="/my-enquiries">My Enquiries</Link>
                                        <Link scroll={true} aria-label='My Bookings' href="/my-bookings">My Bookings</Link>

                                        <Link aria-label='Log Out' onClick={handleLogout} href="javascript:void(0)">Log Out</Link>
                                    </Paper>
                                ) : null}
                            </div>
                        ) : (
                            <span className={styles.plainbutton} style={{ paddingLeft: '0px' }}
                                onClick={openLogin}
                            ><Image priority src="/assets/images/svg/PersonIcon.png" width="20" height="20" alt="profile" className={styles.profileIcon} />Login</span>
                        )}
                    </div>

                </div>
            )}

        </div>
    )
}

export default Content
