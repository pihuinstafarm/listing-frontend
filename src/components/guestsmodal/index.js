import React, { useEffect, useState ,useRef} from 'react'

import {Input } from '@mui/material'
import styles from './index.module.scss'
function guestsmodal({maxguestcount,guest,updatePayload}) {

   
    const updateValue=(type,value)=>{
        let guestPayload = {
            adult:parseInt(guest.adult),
            children:parseInt(guest.children),
            infant:parseInt(guest.infant)
        }
        if(type !='infant' && maxguestcount && value ==1 && parseInt(parseInt(guestPayload.adult)+parseInt(guestPayload.children)) >=maxguestcount){
                return
        }
         if(type =='adult'){
            let newValue = parseInt(guestPayload.adult)+value
            guestPayload.adult = newValue>=2?newValue:2
         }
         if(type =='children'){
            let newValue = parseInt(guestPayload.children)+value
            guestPayload.children = newValue>=0?newValue:0
         }
         if(type =='infant'){
            let newValue = parseInt(guestPayload.infant)+value
            guestPayload.infant = newValue>=0?newValue:0
         }
         updatePayload('guest',guestPayload)
         let guestCount = parseInt(guestPayload.adult)+parseInt(guestPayload.children)+parseInt(guestPayload.infant)
         updatePayload('guestcount',guestCount)

         
    }
    return (
        <div className='optionList' >
            <div className={styles.row} >
                    <div className={styles.label} >
                        <span className={styles.heading}>Adults</span>
                        <span className={styles.sub_heading}>Age 13 years and more</span>
                    </div>
                    <div className={styles.value} >
                    {guest.adult >2?<span className={styles.btn} onClick={(e)=>updateValue('adult',-1)}>-</span>:<span className={styles.btn+' '+styles.disabled}>-</span>}
                    <span>{guest.adult}</span>
                    <span className={styles.btn} onClick={(e)=>updateValue('adult',1)}>+</span>
                    </div>
            </div>

            <div className={styles.row} >
                    <div className={styles.label} >
                        <span className={styles.heading}>Children</span>
                        <span className={styles.sub_heading}>Age 3 - 12 years</span>
                    </div>
                    <div className={styles.value} >
                    <span className={styles.btn} onClick={(e)=>updateValue('children',-1)}>-</span>
                    <span>{guest.children}</span>
                    <span className={styles.btn} onClick={(e)=>updateValue('children',1)}>+</span>
                    </div>
            </div>

            <div className={styles.row} >
                    <div className={styles.label} >
                        <span className={styles.heading}>Infants</span>
                        <span className={styles.sub_heading}>Age 0-2 years</span>
                    </div>
                    <div className={styles.value} >
                    <span className={styles.btn} onClick={(e)=>updateValue('infant',-1)}>-</span>
                    <span>{guest.infant}</span>
                    <span className={styles.btn} onClick={(e)=>updateValue('infant',1)}>+</span>
                    </div>
            </div>
        
        </div>
    )
}


export default guestsmodal
