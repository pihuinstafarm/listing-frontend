import React, { useState, useEffect } from 'react'
import CloseIcon from '@mui/icons-material/Close'

import {DateRangePicker} from "@nextui-org/date-picker";
import {getLocalTimeZone, parseDate, today} from "@internationalized/date";
import { Modal } from 'components'
import { Button ,TextField, isValidPhone, isValidEmail, isValidName,} from 'utils/components'



import styles from './index.module.scss'
import { Checkbox,Input } from '@mui/material'
import { contactServices } from 'utils/services'
function ContactUs({closeLogin, isOpen }) {
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)

    const [openBox, setOpenBox] = useState()
    const [formError, setFormError] = useState({full_name:'',contact_number:'',email:''})
   
    const [formData, setFormData] = useState({viewed:0,request_type:'contactRequest',full_name:'',contact_number:'',email:'',message:''})
    

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
          setFormData({viewed:0,request_type:'contactRequest',full_name:'',contact_number:'',email:'',message:''})
      
      }else{
          setError(response.message)
      }
      }
     
  }

    return (
        <Modal classname={styles.wrapper} onClose={closeLogin} isOpen={isOpen}>
            <Button
                width={32}
                label={<CloseIcon variant="alert" />}
                className={styles.close}
                onClick={closeLogin}
            />
            <div className={styles.content}>
                <h2>Contact Us</h2>
                <span>Submit contact request</span>

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
                  <textarea onChange={(e)=>updateForData(e.target.name,e.target.value)} placeholder="Message" className={styles.input_textarea} type="textarea" name="message" value={formData.message} />
                </div>

                

                {error &&<div className={styles.form_row}>
                        <p className='form_error'>{error}</p>
                </div>}

                {success &&<div className={styles.form_row}>
                    <p className='form_success'>{success}</p>
                </div>}

                <div className={styles.form_row}>
                  <button  className={styles.submit+ ' solidbtn'} onClick={()=>submitForm()} aria-label='submit'>SUBMIT</button>
                  
                </div>

                


            </div>
           
        </Modal>
    )
}

export default ContactUs
