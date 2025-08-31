import React, { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link';


import styles from './index.module.scss'
import { Input } from '@mui/material'
import Image from 'next/image'
import { Modal } from 'components'
import { Button } from 'utils/components'
import CloseIcon from '@mui/icons-material/Close'
import LocationsModal from 'components/locationsmodal'
import GuestsModal from 'components/guestsmodal'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { enquiryTrackingService } from 'utils/services';

function SearchBox({ allLocations }) {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))
    const router = useRouter()
    const refLocation = useRef(null);
    const refGuest = useRef(null);
    const [queryString, setQueryString] = useState('');
    const [AllSearchLocations, setAllLocations] = useState(allLocations)
    const [showModal, setShowModal] = useState(false)

    const [searhKey, setSearhKey] = useState('')
    const [searchModal, setSearchModal] = useState(false)

    const [allSelectedLocations, setAllSelectedLocations] = useState('')
    const [searchPayload, setSearchPayload] = useState({
        location: '', guestcount: 2, guest: { adult: 2, children: 0, infant: 0 }
    })

    useEffect(() => {
        if (searhKey.length > 1) {
            searchLocation()
        }
    }, [searhKey])

    const selectLocation = (location) => {
        let SelectedLocations = ''
        if (location == 'all') {
            let allSelcted = 0
            AllSearchLocations.forEach(element => {
                if (element['selected']) {
                    allSelcted++
                }
            });
            if (allSelcted == AllSearchLocations.length) {
                AllSearchLocations.forEach(element => {
                    element['selected'] = false;
                    if (element['selected']) {
                        SelectedLocations = SelectedLocations + " " + element.name + ','
                    }
                });
            } else {
                AllSearchLocations.forEach(element => {
                    element['selected'] = true;
                    if (element['selected']) {
                        SelectedLocations = SelectedLocations + " " + element.name + ','
                    }
                });
            }
        } else {
            location['selected'] = !location['selected']
            AllSearchLocations.forEach(element => {
                if (element['selected']) {
                    SelectedLocations = SelectedLocations + " " + element.name + ','
                }
            });
        }
        setAllSelectedLocations(SelectedLocations.slice(0, -1))
    }

    const openModal = async (modalName) => {
        setShowModal(modalName)
    }

    const clearSearch = () => {
        let SelectedLocations = []
        AllSearchLocations.forEach(element => {
            element['selected'] = false
            SelectedLocations.push(element)
        });
        setAllLocations(SelectedLocations)
        setAllSelectedLocations('')
        setSearchPayload({
            location: '', guestcount: 0, guest: { adult: 0, children: 0, infant: 0 }
        })
    }

    useEffect(() => {
        let SelectedLocations = ''
        AllSearchLocations.forEach(element => {
            if (element['selected']) {
                SelectedLocations = SelectedLocations + " " + element.slug + ','
            }
        });
        if (SelectedLocations == '') {
            AllSearchLocations.forEach(element => {
                SelectedLocations = SelectedLocations + " " + element.slug + ','
            });
        }
        let locations = SelectedLocations.slice(0, -1).replaceAll(' ', '');
        let adult = parseInt(searchPayload.guest.adult);
        let children = parseInt(searchPayload.guest.children);
        let infant = parseInt(searchPayload.guest.infant);

        let SearchData = {
            adult: adult,
            children: children,
            infant: infant
        }
        localStorage.setItem('searchPayload', SearchData)
        let searchQueryString = '?location=' + locations + '&adult=' + adult + '&children=' + children + '&infant=' + infant
        setQueryString(searchQueryString);
    });

    const updatePayload = (inputType, value) => {
        setSearchPayload((prev) => ({
            ...prev,
            [inputType]: value
        }))
    }

    const handleSearch = async () => {
        try {
            // Prepare search query data for logging
            let SelectedLocations = ''
            AllSearchLocations.forEach(element => {
                if (element['selected']) {
                    SelectedLocations = SelectedLocations + " " + element.slug + ','
                }
            });
            if (SelectedLocations == '') {
                AllSearchLocations.forEach(element => {
                    SelectedLocations = SelectedLocations + " " + element.slug + ','
                });
            }
            let locations = SelectedLocations.slice(0, -1).replaceAll(' ', '');
            let guestCount = searchPayload.guestcount;
            
            // Log search query to backend
            const logPayload = {
                location: locations || undefined,
                guestCount: guestCount || undefined
            }
            
            // Call search query logging API (non-blocking)
            await enquiryTrackingService.logSearchQuery(logPayload)
            
            // Redirect to search page
            router.push(`/search/${queryString}`)
        } catch (error) {
            console.error('Search logging failed:', error)
            // Continue with search even if logging fails
            router.push(`/search/${queryString}`)
        }
    }

    useEffect(() => {
        const handleOutSideClick = (event) => {
            if (!refLocation.current?.contains(event.target) && !refGuest.current?.contains(event.target)) {
                setShowModal(false)
            }
        };
        window.addEventListener("mousedown", handleOutSideClick);
        return () => {
            window.removeEventListener("mousedown", handleOutSideClick);
        };
    }, [refLocation, refGuest]);

    if (!isMobile) {
        return (
            <div className={styles.searchbox + ' ' + styles.desktopview}>
                <div className={styles.innnerwrapper}>
                    <h2>Pick Your Location- Best Farmhouses in Hyderabad</h2>
                    <h6>Explore the farmhouse at all the popular locations in Hyderabad</h6>
                    <div className={styles.searchitme} ref={refLocation} id="LocationsModal">
                        <p className={styles.label}>Location</p>
                        <Input readOnly onClick={(e) => openModal('LocationsModal')} className={styles.searchinput} type="text" placeholder='You Can Choose Multiple Options' name="location" value={allSelectedLocations} />
                        {showModal == 'LocationsModal' && <LocationsModal locationLists={AllSearchLocations} selectLocation={selectLocation} />}
                    </div>
                    <div className={styles.searchitme} ref={refGuest} id="GuestsModal">
                        <p className={styles.label}>Guests</p>
                        <Input readOnly onClick={(e) => openModal('GuestsModal')} className={styles.searchinput} type="text" name="adults" value={searchPayload.guestcount + ' Guests'} />
                        {showModal == 'GuestsModal' && <GuestsModal guest={searchPayload.guest} updatePayload={updatePayload} />}
                    </div>
                    <button className={styles.searchsubmit} aria-label='Search' onClick={handleSearch}>
                        <p>Search</p>
                    </button>
                </div>
            </div>
        )
    } else {
        return (<>
            <div className={styles.searchboxMobile + ' ' + styles.mobileview}>
                <Image priority alt="search" width={20} height={20} src={'/assets/images/search-icon.png'} />
                <Input onClick={(e) => setSearchModal(true)} readOnly className={styles.searchinput} type="text" placeholder='Search' />
                <Image priority alt="search" width={35} height={30} src={'/assets/images/filter.png'} />
            </div>

            {searchModal && <Modal classname={styles.modalwrapper} onClose={(e) => setSearchModal(false)} isOpen={searchModal}>
                <Button
                    aria-label="close"
                    width={32}
                    label={<CloseIcon variant="alert" />}
                    className={styles.close}
                    onClick={(e) => setSearchModal(false)}
                />
                <div className={styles.content}>
                    <div className={styles.searchbox}>
                        <div className={styles.innnerwrapper}>
                            <h2>Find Your Next Stay</h2>
                            <p>Experience Life & Explore the Nature</p>
                            <div className={styles.searchitme + ' inneroptionList'} ref={refLocation} onClick={() => openModal('LocationsModal')}  >
                                <div className={styles.searchitmeInner}>
                                    <p className={styles.label}>Location</p>
                                    <p className={styles.searchinput}>{allSelectedLocations}</p>
                                </div>
                                {showModal == 'LocationsModal' && <LocationsModal locationLists={AllSearchLocations} selectLocation={selectLocation} />}
                            </div>
                            <div className={styles.searchitme + ' inneroptionList'} ref={refGuest} onClick={(e) => openModal('GuestsModal')} >
                                <div className={styles.searchitmeInner}>
                                    <p className={styles.label}>Guests</p>
                                    <p className={styles.searchinput}>{searchPayload.guestcount + ' Guests'}</p>
                                </div>
                                {showModal == 'GuestsModal' && <GuestsModal guest={searchPayload.guest} updatePayload={updatePayload} />}
                            </div>
                            <div className={styles.btn_section} >
                                <p className={styles.clearAll} onClick={() => clearSearch()}>Clear All</p>
                                <button className={styles.searchsubmit} aria-label='Search' onClick={handleSearch}>Search</button>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>}
        </>)
    }
}

export default SearchBox
