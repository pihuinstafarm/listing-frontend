import React, { useState, useEffect, isValidElement } from 'react'
import CloseIcon from '@mui/icons-material/Close'


import { Modal } from 'components'

import { Button ,TextField, isValidPhone, isValidEmail, isValidName,} from 'utils/components'

import styles from './index.module.scss'
import { Checkbox, Input } from '@mui/material'
import { contactServices } from 'utils/services'
function RegisterFarm({closeLogin, isOpen }) {
    const [openBox, setOpenBox] = useState()
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)
    const [formError, setFormError] = useState({full_name:'',contact_number:'',email:''})
    const [formData, setFormData] = useState({viewed:0,request_type:'propertyRequest',full_name:'',contact_number:'',email:'',city:'',property_name:'',rooms_count:'',property_details:''})
    

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
        updateForData('checkin',value.start.day+'/'+value.start.month+'/'+value.start.year)
        updateForData('checkout',value.end.day+'/'+value.end.month+'/'+value.end.year)
        
    }
    const submitForm=async()=>{
            setFormError({property_name:'',full_name:'',contact_number:'',email:''})
            setSuccess(null)
            setError(null)
            let errorCount=0
            let payLoad = formData
            if(!isValidName(payLoad.property_name)){

              errorCount++
              setFormError((prev) => ({
                ...prev,
                ['property_name']:'Please enter valid property name'
              }))
            }
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
                setFormData({viewed:0,request_type:'propertyRequest',full_name:'',contact_number:'',email:'',city:'',property_name:'',rooms_count:'',property_details:''})
            
            }else{
                setError(response.message)
            }
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
                <h2>List New Property</h2>
                <span>List in the market where peace seekers are waiting!</span>
                
                <div className={styles.form_row}>
                  <TextField  width={'100%'} height={50} onChange={(e)=>updateForData('property_name',e.target.value)} placeholder="Property Name *" className={styles.input_text} type="text" name="property_name" value={formData.property_name} />
                  {formError.property_name &&<p className='error_input_message'>{formError.property_name}</p>}
                </div>

                <div className={styles.form_row}>
                  <TextField  width={'100%'} height={50} onChange={(e)=>updateForData('full_name',e.target.value)}placeholder="Full Name *" className={styles.input_text} type="text" name="full_name" value={formData.full_name} />
                  {formError.full_name &&<p className='error_input_message'>{formError.full_name}</p>}
                </div>

                <div className={styles.form_row}>
                  <TextField  width={'100%'} height={50} suffix="+91" onChange={(e)=>updateForData('contact_number',e.target.value)} placeholder="Contact Number *" className={styles.input_text} type="tel" name="contact_number" value={formData.contact_number} />
                  {formError.contact_number &&<p className='error_input_message'>{formError.contact_number}</p>}
                </div>

                <div className={styles.form_row}>
                  <TextField  width={'100%'} height={50} onChange={(e)=>updateForData('email',e.target.value)} placeholder="Email" className={styles.input_text} type="text" name="email" value={formData.email} />
                  {formError.email &&<p className='error_input_message'>{formError.email}</p>}
                </div>

                <div className={styles.form_row}>
                  <TextField  width={'100%'} height={50} onChange={(e)=>updateForData('city',e.target.value)} placeholder="Nearest City" className={styles.input_text} type="text" name="city" value={formData.city} />
                </div>

                
                
                
                <div className={styles.form_row}>
                  <label>Number of Bedrooms</label>
                </div>
                <div className={styles.form_row}>
                <div className={styles.custom_select_box} onClick={()=>setOpenBox('rooms_count')}>
                        {formData.rooms_count?formData.rooms_count:'Select Count'}
                </div>
                {openBox =='rooms_count' &&<div className={styles.custom_select_box_option} onClick={()=>setOpenBox('')}>
                    <p className={styles.item} onClick={()=>updateForData('rooms_count','Up to 2 Rooms')}>Up to 2 Rooms</p>
                    <p className={styles.item} onClick={()=>updateForData('rooms_count','3-6 Rooms')}>3 - 6 Rooms</p>
                    <p className={styles.item} onClick={()=>updateForData('rooms_count','7-14 Rooms')}>7 - 14 Rooms</p>
                    <p className={styles.item} onClick={()=>updateForData('rooms_count','15-30 Rooms')}>15 - 30 Rooms</p>
                    <p className={styles.item} onClick={()=>updateForData('rooms_count','31-50 Rooms')}>31 - 50 Rooms</p>
                    <p className={styles.item} onClick={()=>updateForData('rooms_count','More than 50 Rooms')}>More than 50 Rooms</p>

                </div>}
                </div>
                
                <div className={styles.form_row}>
                  <textarea onChange={(e)=>updateForData(e.target.name,e.target.value)} placeholder="Property Details" className={styles.input_textarea} type="textarea" name="property_details" value={formData.property_details} />
                </div>

                

               

                {error &&<div className={styles.form_row}>
                        <p className='form_error'>{error}</p>
                </div>}

                {success &&<div className={styles.form_row}>
                    <p className='form_success'>{success}</p>
                </div>}

                <div className={styles.form_row}>
                  <button  className={styles.submit+ ' solidbtn'} onClick={()=>submitForm()} aria-label="SUBMIT">SUBMIT</button>
                  
                </div>


            </div>
           
        </Modal>
    )
}

export default RegisterFarm
