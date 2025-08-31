import React from 'react'
import styles from './../containers/LocationInfo/index.module.scss'

export default function TitleDescription ({title, description}) {

    if (!title && !description) {
        return null
    }
    return (
        <div className={styles.section_header}>
            {title && description && (
                <>
                    <h2>{title}</h2>
                    <div className="px-4 text-black [&_a]:underline [&_a:hover]:no-underline [&_p]:m-0 [&_p]:p-0 [&_p]:inline"
                        dangerouslySetInnerHTML={{ __html: description }}
                    />
                </>
            )}
        </div>
    )
}