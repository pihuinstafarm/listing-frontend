import React from 'react';
import styles from './index.module.scss';

// Import Material-UI Icons
import LocationOnIcon from '@mui/icons-material/LocationOn';
import StarIcon from '@mui/icons-material/Star';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import TitleDescription from 'components/TitleDescription';

const LocationInfoSection = ({ pageContent }) => {
    // Check if pageContent is empty object or null/undefined
    if (!pageContent || Object.keys(pageContent).length === 0) {
        return null;
    }

    // Extract data from pageContent
    const attractions = pageContent.nearByLocation || [];
    const reachInfo = pageContent.howToReach || {};
    const mapKey = pageContent.mapSearchKey || "";

    return (
        <div className={styles.shamshabad_info_section}>

            <div className={styles.section_header} >
                <TitleDescription title={pageContent.title || ""} description={pageContent.description || ""}/>
            </div>
            {/* Content Grid */}
            <div className={styles.content_grid}>
                {/* Nearby Attractions Card */}
                {
                    attractions.length > 0 && (
                        <div className={styles.info_card}>

                            <div className={styles.card_header}>
                                <h4>Nearby Attractions</h4>
                            </div>
                            <ul className={styles.attractions_list}>
                                {attractions.map((attraction, index) => (
                                    <li key={index} className={styles.attraction_item}>
                                        <StarIcon className={styles.attraction_icon} />
                                        <span>{attraction}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )
                }
                {/* How to Reach Card */}
                {
                    reachInfo && reachInfo.title && reachInfo.description  &&
                    (<div className={styles.info_card}>
                        <div className={styles.card_header}>
                            <h3>{reachInfo.title}</h3>
                        </div>
                        <p className={styles.card_description}>
                            {reachInfo.description}
                        </p>
                        <div className={styles.stats}>
                            {reachInfo.nearByPlaces.map((place, index) => (
                                <div key={index} className={styles.stat}>
                                    {place.name.toLowerCase().includes('airport') ? (
                                        <DirectionsCarIcon className={styles.stat_icon} />
                                    ) : (
                                        <LocationOnIcon className={styles.stat_icon} />
                                    )}
                                    <div className={styles.stat_content}>
                                        <div className={styles.stat_label}>{place.name}</div>
                                        <div className={styles.stat_value}>{place.distance}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    )
                }

                {/* Location Map Card */}
                {
                    mapKey !== "" &&
                    <div className={`${styles.info_card} ${styles.map_card}`}>
                        <div className={styles.card_header}>
                            <h4>View on Map</h4>
                        </div>
                        <div className={styles.map_container}>
                            <iframe
                                src={`https://maps.google.com/maps?q=${encodeURIComponent(mapKey)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                                title={`Location of ${mapKey}`}
                                frameBorder="0"
                                allowFullScreen=""
                                loading="lazy"
                            ></iframe>
                        </div>
                    </div>
                }
            </div>
        </div>
    );
};

export default LocationInfoSection;