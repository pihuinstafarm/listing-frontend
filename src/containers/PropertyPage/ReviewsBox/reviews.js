import React, { useEffect, useRef, useState } from 'react'
import styles from './ReviewsBox.module.scss'
function ReviewsBox({reviews}) {
   
  const getFormattedDate=(dateString)=>{
    var dayNames = ["Sun","Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
    let date  = new Date(new Date(dateString)); 
    let formattedDate = dayNames[date.getDay()]+' '+date.getDate()+' '+date.toLocaleString('default', { month: 'short'})+' '+date.getFullYear()
    return formattedDate
}
    return (
       <>
        <div className={styles.sectionReviews}>
        {reviews.map((review, index) => (
          <div className={styles.reviewsBox} key={'review_'+index}>
              <div className={styles.reviewsBoxHeader}>
                <div className={styles.reviewsBoxHeaderLeft}>
                  <p className={styles.authorThumbnail}></p>
                </div>
                <div className={styles.reviewsBoxHeaderRight}>
                  <p className={styles.authorName}>{review.user.name}</p>
                  {review.created_at &&<p className={styles.postDate}>{getFormattedDate(review.created_at)}</p>}
                </div>
              </div>
              <div className={styles.reviewsBoxContnet}>
              <p>{review.content}</p>
              </div>
           </div>
        ))}


          
          
        </div>
        {reviews.length>4 &&<button className='plainbtn' aria-label="Show All">Show All {reviews.length} Reviews</button>}
        </>
    )
}

export default ReviewsBox
