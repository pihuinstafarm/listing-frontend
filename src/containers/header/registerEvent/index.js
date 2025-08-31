import React, { useState, useEffect } from 'react'
import CloseIcon from '@mui/icons-material/Close'

import {DateRangePicker} from "@nextui-org/date-picker";
import {getLocalTimeZone, parseDate, today} from "@internationalized/date";
import { Modal } from 'components'
import { Button ,TextField, isValidPhone, isValidEmail, isValidName,} from 'utils/components'



import styles from './index.module.scss'
import { Checkbox,Input } from '@mui/material'
import { contactServices } from 'utils/services'
function RegisterEvent({closeLogin, isOpen }) {
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)
    const [CheckInOpen, setCheckInOpen] = useState(false)
    const [openBox, setOpenBox] = useState()
    const [dates, setDates] = useState('')
    const [formError, setFormError] = useState({full_name:'',contact_number:'',email:''})
   
    const [formData, setFormData] = useState({viewed:0,request_type:'eventRequest',full_name:'',contact_number:'',email:'',event_type:'',checkin:'',checkout:'',guest_counts:''})
    

    const updateForData=(inputName,value)=>{
        setFormData((prev) => ({
            ...prev,
            [inputName]:value
          }))
          setFormError((prev) => ({
            ...prev,
            [inputName]:''
          }))
          
    }

    const updateDateRange=(value)=>{
        setDates(value)
        updateForData('checkin',value.start.day+'/'+value.start.month+'/'+value.start.year)
        updateForData('checkout',value.end.day+'/'+value.end.month+'/'+value.end.year)
        setCheckInOpen(false)
        
    }
    const submitForm=async()=>{
      setFormError({full_name:'',contact_number:'',email:''})
      setSuccess(null)
      setError(null)
      let errorCount=0
      let payLoad = formData
      if(!isValidName(payLoad.full_name)){

        errorCount++
        setFormError((prev) => ({
          ...prev,
          ['full_name']:'Please enter valid first name and last name'
        }))
      }

      

      if(!isValidPhone(payLoad.contact_number)){

        errorCount++
        setFormError((prev) => ({
            ...prev,
            ['contact_number']:'Please enter valid contact number'
          }))
      }

      if(errorCount==0){
      
      let response =await contactServices.submitForm(payLoad);
      if(response.id){
          setSuccess('Request submitted...We will get back to you soon.')
          setFormData({viewed:0,request_type:'eventRequest',full_name:'',contact_number:'',email:'',event_type:'',checkin:'',checkout:'',guest_counts:''})
      
      }else{
          setError(response.message)
      }
      }
     
  }
  const getFormattedDate=(dateString)=>{
    if(dateString){
    var dayNames = ["Sun","Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
    let DateStr = dateString.year+'-'+dateString.month.toString().padStart(2, '0')+'-'+dateString.day.toString().padStart(2, '0');
    const date = new Date(DateStr); 
    return dateString.day.toString().padStart(2, '0')+' '+date.toLocaleString('default', { month: 'short'}) +' '+dayNames[date.getDay()]+' '+dateString.year
    }else{
      return ''
    } 
  }
    return (
        <Modal classname={styles.wrapper} onClose={closeLogin} isOpen={isOpen}>
            <Button
                aria-label="close"
                width={32}
                label={<CloseIcon variant="alert" />}
                className={styles.close}
                onClick={closeLogin}
            />
            <div className={styles.content}>
                <h2>Make Your Event Memorable</h2>
                <span>Register Today</span>

                <div className={styles.form_row}>
                  <TextField  width={'100%'} height={50} onChange={(e)=>updateForData('full_name',e.target.value)} placeholder="Full Name *" className={styles.input_text} type="text" name="full_name" value={formData.full_name} />
                  {formError.full_name &&<p className='error_input_message'>{formError.full_name}</p>}
               </div>

                <div className={styles.form_row}>
                  <TextField  width={'100%'} height={50} onChange={(e)=>updateForData('contact_number',e.target.value)} placeholder="Contact Number *" className={styles.input_text} type="tel" name="contact_number" value={formData.contact_number} />
                  {formError.contact_number &&<p className='error_input_message'>{formError.contact_number}</p>}
               </div>

                <div className={styles.form_row}>
                  <TextField  width={'100%'} height={50} onChange={(e)=>updateForData('email',e.target.value)} placeholder="Email" className={styles.input_text} type="text" name="email" value={formData.email} />
                  {formError.email &&<p className='error_input_message'>{formError.email}</p>}
               </div>
                <div className={styles.form_row}>
                  <label>Event Type</label>
                </div>
                <div className={styles.form_row}>
                <div className={styles.custom_select_box} onClick={()=>setOpenBox('event_type')}>
                        {formData.event_type?formData.event_type:'Select Event'}
                </div>
                {openBox =='event_type' &&<div className={styles.custom_select_box_option} onClick={()=>setOpenBox('')}>
                  
                    <p className={styles.item} onClick={()=>updateForData('event_type','Sangeet')}>Sangeet</p>
                    <p className={styles.item} onClick={()=>updateForData('event_type','Pre-Wedding')}>Pre-Wedding</p>
                    <p className={styles.item} onClick={()=>updateForData('event_type','Wedding')}>Wedding</p>
                    <p className={styles.item} onClick={()=>updateForData('event_type','Birthday')}>Birthday</p>
                    <p className={styles.item} onClick={()=>updateForData('event_type','Corporate Gathering')}>Corporate Gathering</p>
                    <p className={styles.item} onClick={()=>updateForData('event_type','Others')}>Others</p>

                </div>}
                </div>

                <div className={styles.form_row}>
                  <label>Guests Count</label>
                </div>
                <div className={styles.form_row}>
                <div className={styles.custom_select_box} onClick={()=>setOpenBox('guest_counts')}>
                        {formData.guest_counts?formData.guest_counts:'Select Guest Counts'}
                </div>
                {openBox =='guest_counts' &&<div className={styles.custom_select_box_option} onClick={()=>setOpenBox('')}>
                    <p className={styles.item} onClick={()=>updateForData('guest_counts','Up to 25 Guests')}>Up to 25 Guests</p>
                    <p className={styles.item} onClick={()=>updateForData('guest_counts','26-50 Guests')}>26 - 50 Guests</p>
                    <p className={styles.item} onClick={()=>updateForData('guest_counts','51-100 Guests')}>51 - 100 Guests</p>
                    <p className={styles.item} onClick={()=>updateForData('guest_counts','101-150 Guests')}>101 - 150 Guests</p>
                    <p className={styles.item} onClick={()=>updateForData('guest_counts','151-200 Guests')}>151 - 200 Guests</p>
                    <p className={styles.item} onClick={()=>updateForData('guest_counts','201-250 Guests')}>201 - 250 Guests</p>
                    <p className={styles.item} onClick={()=>updateForData('guest_counts','Around 300 Guests or higher')}>Around 300 Guests or higher</p>

                </div>}
                </div>

                <div className={styles.form_row}>
                  <label>Stay Duration</label>
                </div>

                <div className={styles.form_row} onClick={()=>setCheckInOpen(!CheckInOpen)}>
                <div className={styles.custom_select_box}>
                    {dates.start ? <>{getFormattedDate(dates.start)} - {getFormattedDate(dates.end)} </>:<>Select Dates</>}
                </div>
                 
                

                </div>
                {CheckInOpen &&<div className={styles.DateRangePickerSection}>
                <DateRangePicker 
                  isOpen={CheckInOpen}
                  minValue={today(getLocalTimeZone())}
                  onChange={(value)=>updateDateRange(value)} 
                />
                </div>}
                

                {error &&<div className={styles.form_row}>
                        <p className='form_error'>{error}</p>
                </div>}

                {success &&<div className={styles.form_row}>
                    <p className='form_success'>{success}</p>
                </div>}

                <div className={styles.form_row}>
                  <button  className={styles.submit+ ' solidbtn'} onClick={()=>submitForm()} aria-label="Make an Enquiryss">Make an Enquiry</button>
                  
                </div>

                


            </div>
           
        </Modal>
    )
}

export default RegisterEvent
