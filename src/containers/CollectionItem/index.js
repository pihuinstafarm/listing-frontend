import React from 'react'
import Image from 'next/image'
import styles from './index.module.scss'
function CollectionItem({ collection }) {
    return (
        <div className={styles.collection_box}>
            <picture>
                {(() => {
                    const candidateSrc = collection?.logo || collection?.image || collection?.img || ''
                    const safeSrc = typeof candidateSrc === 'string' && candidateSrc.trim().length > 0 ? candidateSrc : '/placeholder-image.jpg'
                    const altText = collection?.altText || collection?.name || 'Instafarms Collection'
                    return (
                        <Image
                            src={safeSrc}
                            alt={altText}
                            width={400}
                            height={300}
                            loading="lazy"
                        />
                    )
                })()}
            </picture>
        </div>
    )
}


export default CollectionItem
