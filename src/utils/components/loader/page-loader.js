import React from 'react'
import styles from './page-loader.module.scss'

function Loader() {
    return (
        <div className={styles.outerWrapper}>
            <div className={styles.wrapper}>
                <div className={styles.dot1}></div>
                <div className={styles.dot2}></div>
                <div className={styles.dot3}></div>
                <div className={styles.dot4}></div>
                <div className={styles.dot5}></div>
                <div className={styles.dot6}></div>
                <div className={styles.dot7}></div>
                <div className={styles.dot8}></div>
                <div className={styles.dot9}></div>
                <div className={styles.dot10}></div>
                <div className={styles.base1}></div>
                <div className={styles.base2}></div>
                <div className={styles.base3}></div>
                <div className={styles.base4}></div>
                <div className={styles.base5}></div>
            </div>
        </div>
    )
}

export default Loader
