import React from 'react'
import styles from './banners.module.scss'
import Image from 'next/image'

function PropertyBanners({propertyItem,showGallery,galleryItems}) {
 
    
  const getLogoFromName = (name = '') => {
    if (!name.trim()) return 'IF';
  
    let rgx = /\b\p{L}/gu; // Matches first letter of each word
    let initials = [...name.match(rgx)] || [];
  
    if (initials.length === 0) return 'IF'; // Fallback if no valid letters found
  
    return (initials[0] + (initials[1] || '')).toUpperCase();
  };
  

    const getFormattedCurrency=(price)=>{
      return '₹'+new Intl.NumberFormat().format(parseInt(price))
  }

    if(galleryItems){
      return (
        <div className={styles.headsection}>
          <div className={styles.headsectionLeft}>
              <Image
              onClick={showGallery}
              className={styles.featuredimage}
              loading="eager"
              src={propertyItem.cover_1
  ? (Array.isArray(propertyItem.cover_1)
      ? propertyItem.cover_1[0]?.url
      : propertyItem.cover_1.url)
  : galleryItems[0]?.url}
              alt={propertyItem.cover_1
  ? (Array.isArray(propertyItem.cover_1)
      ? propertyItem.cover_1[0]?.altText
      : propertyItem.cover_1.altText)
  :'InstaFarms '+propertyItem.property_code_name}
              width={600} height={400} 
              />

            <div className={styles.listedBy}>
            <div className={styles.left}>
              {propertyItem.logo ?<Image alt={'InstaFarms '+propertyItem.listed_by?propertyItem.listed_by:propertyItem.owner.name} loading="eager" width={100} height={100} src={propertyItem.logo}/>:<span>{getLogoFromName(propertyItem.listed_by?propertyItem.listed_by:propertyItem.owner.name)}</span>}
            </div>
            <div className={styles.right}>
              <span>Listed By:</span>
              <p className={styles.title}>{propertyItem.listed_by?propertyItem.listed_by:propertyItem.owner.name}</p>
              <p>For: {getFormattedCurrency(propertyItem.price_detail.weekPrice[0].price)}  -  {getFormattedCurrency(propertyItem.price_detail.weekPrice[6].price)}</p>
            </div>
            </div>

          </div>
          <div className={styles.headsectionRight}>
          
          
         
            <div className={styles.imgbox}>
              <Image
              onClick={showGallery}
              loading="eager"
              src={propertyItem.cover_2
  ? (Array.isArray(propertyItem.cover_2)
      ? propertyItem.cover_2[0]?.url
      : propertyItem.cover_2.url)
  : galleryItems[1]?.url}
              alt={propertyItem.cover_2
  ? (Array.isArray(propertyItem.cover_2)
      ? propertyItem.cover_2[0]?.altText
      : propertyItem.cover_2.altText)
  :'InstaFarms '+propertyItem.property_code_name}
              width={300} height={300} 
              />

            </div>
            <div className={styles.imgbox} >
              <Image
              onClick={showGallery}
              loading="eager"
              src={propertyItem.cover_3
  ? (Array.isArray(propertyItem.cover_3)
      ? propertyItem.cover_3[0]?.url
      : propertyItem.cover_3.url)
  : galleryItems[2]?.url}
             alt={propertyItem.cover_3
  ? (Array.isArray(propertyItem.cover_3)
      ? propertyItem.cover_3[0]?.altText
      : propertyItem.cover_3.altText)
  :'InstaFarms '+propertyItem.property_code_name}
              width={300} height={300} 
              />

            </div>
            <div className={styles.imgbox} >
              <Image
              onClick={showGallery}
              loading="eager"
              src={propertyItem.cover_4
  ? (Array.isArray(propertyItem.cover_4)
      ? propertyItem.cover_4[0]?.url
      : propertyItem.cover_4.url)
  : galleryItems[3]?.url}
              alt={propertyItem.cover_4
  ? (Array.isArray(propertyItem.cover_4)
      ? propertyItem.cover_4[0]?.altText
      : propertyItem.cover_4.altText)
  :'InstaFarms '+propertyItem.property_code_name}
              width={300} height={300} 
              />

            </div>
            <div className={styles.imgbox}>
              <Image
              onClick={showGallery}
              loading="eager"
              src={propertyItem.cover_5
  ? (Array.isArray(propertyItem.cover_5)
      ? propertyItem.cover_5[0]?.url
      : propertyItem.cover_5.url)
  : galleryItems[4]?.url}
              alt={propertyItem.cover_5
  ? (Array.isArray(propertyItem.cover_5)
      ? propertyItem.cover_5[0]?.altText
      : propertyItem.cover_5.altText)
  :'InstaFarms '+propertyItem.property_code_name}
              width={300} height={300} 
              />

            </div>
            
          
         
          </div>
            
        </div>
      )
    }
}

export default PropertyBanners
