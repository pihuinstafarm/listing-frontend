import React, { useEffect, useState } from 'react'
import Image from 'next/image'



import styles from './index.module.scss'
function PickFromNearByLocations() {
    
    useEffect(() => {
        
    }, [])

    return (
        <>
           <div className={'header'}>
            <h2>Our Top Pick from Nearby Your Location</h2>
            <p>Going somewhere to celebrate this season? Whether you’re going home or somewhere to roam, we’ve got the travel tools to get you to your destination.</p>
            </div>

            <div className={styles.contentblock}>
           <div className={styles.blockleft}>
            <h3>Backpacking to Serene Farms <p><span>From</span>₹7000</p></h3>
            <p>Traveling is a unique experience as it's the best way to unplug from the pushes and pulls of daily life. It helps us to forget about our problems, frustrations, and fears at home. During our journey, we experience life in different ways. We explore new places, cultures, cuisines, traditions, and ways of living.</p>
            <button aria-label="Book Farm House">Book Farm House</button>
           </div>
           <div className={styles.blockright}>
           <Image alt="Insta Farms"  width={300} height={200} className={styles.thumbnail} src="/assets/images/List_Your_Farm.webp" />
           <Image alt="Insta Farms"  width={300} height={200} className={styles.thumbnail} src="/assets/images/List_Your_Farm.webp" />
           <Image alt="Insta Farms"  width={300} height={200} className={styles.thumbnail} src="/assets/images/List_Your_Farm.webp" />
           <Image alt="Insta Farms"  width={300} height={200} className={styles.thumbnail} src="/assets/images/List_Your_Farm.webp" />
           </div>
            </div>
        </>
    )
}


export default PickFromNearByLocations
