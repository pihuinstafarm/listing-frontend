import React from 'react'
import Image from 'next/image'

import styles from './right-section.module.scss'

const cards = [
    {
        id: 'send-gift-cards',
        text: 'Send gift cards',
        img: '/assets/images/login/send.svg',
    },
    {
        id: 'manage-from-anywhere',
        text: `Manage from <br /> anywhere`,
        img: '/assets/images/login/manage.svg',
    },
    {
        id: 'add-your-card',
        text: 'Add your card',
        img: '/assets/images/login/add.svg',
    },
]

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
