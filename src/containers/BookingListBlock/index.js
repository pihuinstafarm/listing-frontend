import Image from 'next/image'
import Link from 'next/link'

import styles from './index.module.scss'

function BookingListBlock() {
    return (
        <section className='inner_section'>
            <div className={styles.contentblock}>
                <Link href="/register-event" className={styles.block}>
                    <h3>Looking for Events?</h3>
                    <picture>
                        <Image
                            className={styles.thumbnail}
                            src="/assets/images/looking_for_event.webp" // Default image
                            alt="Looking for Events"
                            layout="responsive"
                            width="600"
                            height="500"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
                        />
                    </picture>
                </Link>
                <Link href="/partner-with-us" className={styles.block}>
                    <h3>List your Farmhouse?</h3>
                    <picture>
                        <Image
                            className={styles.thumbnail}
                            alt="List Your Farm"
                            layout="responsive"
                            width="600"
                            height="500"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
                            src="/assets/images/Home_List_Your_Farm.webp" />
                    </picture>
                </Link>
            </div>

        </section>
    )
}

export default BookingListBlock
