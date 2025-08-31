import React from 'react'
import Image from 'next/image'

import styles from './right-section.module.scss'


function RightSection() {
    return (
        <div className={styles.wrapper}>
            <div>
                <p className={styles.header}>InstaFarms</p>
                <p className={styles.subHeader}>
                Your one stop destination for anything and everything related to Farmhouses!
                </p>
            </div>
           
            
        </div>
    )
}

export default RightSection
