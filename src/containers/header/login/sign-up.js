import React, { useState, useEffect, useRef } from 'react'
import cx from 'classnames'
import Image from 'next/image'

import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { Snackbar, Alert, AlertTitle } from '@mui/material'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'

import { authServices } from 'utils/services'
import {
    TextField,
    isValidPhone,
    isValidEmail,
    isValidName,
    Button,
    DotElastic,
} from 'utils/components'

import styles from './sign-up.module.scss'
import { findAllByTestId } from '@testing-library/dom'

function SignIn({handleSignIn, closeLogin }) {
    const otpRef = useRef(null)
    const [loading, setLoading] = useState(false)
    const [phone, setPhone] = useState('')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [otp, setOtp] = useState('')
    const [disablePhone, setDisablePhone] = useState(false)
    const [otpVisibility, setOtpVisibility] = useState(false)
    const [loginError, setLoginError] = useState(null)
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))
    const [otpSent, setOtpSent] = useState(false)
    const [seconds, setSeconds] = useState(0);
    let countDownDate = new Date().getTime();
    let interval
   
     

    useEffect(() => {
        
        if(otpSent){
            interval = setInterval(countDownTimer, 1000);
            return ()=> {
                clearInterval(interval);
            };
         }
        
      }, [otpSent]);

    function countDownTimer(){
        var now = new Date().getTime();
        var difference =  now-countDownDate;
        var newSeconds = Math.floor((difference % (1000 * 60)) / 1000);
        newSeconds=30-newSeconds
        setSeconds(newSeconds);
        if (newSeconds <=0) {
            clearInterval(interval);
            setDisablePhone(false)
            setSeconds(0);
            setOtpSent(false)
          }
        
    }
    useEffect(() => {
        otpRef && otpRef.current && otpRef.current.focus()
    }, [disablePhone])

    function getOtp() {
        try {
            let payload={
                phone:phone
            }
            authServices
                .isRegisterd(payload)
                .then((res) => {
                if(res.success){
                    if (res?.is_registered) {
                        setLoginError('There is already an existing Profile with this Phone Number') 
                    }else{
                            setLoginError(false)
                            setLoading(true)
                            authServices
                                .getOTP(payload)
                                .then((res) => {
                                if (res.success){
                                    countDownDate = new Date().getTime();
                                    setOtpSent(true)
                                    setDisablePhone(true)
                                    setLoading(false)
                                }else{
                                    setLoading(false)
                                    setLoginError(res.message)
                                }
                                })
                    }
                }else{
                    setLoginError(res.message)
                }
            })
        } catch (err) {
            setLoginError(err.message)
        }
        
    }

    function handleSubmit() {
        setLoading(true)
        setLoginError(false)
        authServices.registerUser({ otp, phone, email, name })
                    .then((res) => {
                        
                        setLoading(false)
                        
                        if(res.success){
                            localStorage.setItem('token', res.accessToken)
                            localStorage.setItem('documentId', res.documentId)
                            window.dispatchEvent(new Event('storage'))
                            closeLogin()
                        }else{
                            localStorage.clear()
                            setLoginError(res.message) 
                        }
                       
                    })
           
    }

    
    return (
        <div className={styles.wrapper}>
            <Image alt="logo" width="146" height="85" src="/assets/images/svg/logo.webp"/>
            <p className={styles.header}>
                Please fill your details to register your account 
            </p>
            
            <div className={styles.fields}>
                <TextField
                    disabled={disablePhone}
                    label="Display Name"
                    placeholder="abc xyz"
                    width={isMobile ? 240 : 360}
                    height={50}
                    value={name}
                    onChange={(e) => !loading && setName(e.target.value)}
                />
                <TextField
                    disabled={disablePhone}
                    label="Mail Id"
                    placeholder="xyz@abc.com"
                    width={isMobile ? 240 : 360}
                    height={50}
                    value={email}
                    onChange={(e) => !loading && setEmail(e.target.value)}
                />
                <TextField
                    disabled={disablePhone}
                    label="Phone Number"
                    placeholder="9900000000"
                    suffix="+91"
                    width={isMobile ? 240 : 360}
                    height={50}
                    value={phone}
                    onChange={(e) => !loading && setPhone(e.target.value)}
                />
            </div>

            {!otpSent ?<div
                className={cx(styles.label, {
                    [styles.enable]:
                        isValidPhone(phone) && !disablePhone,
                })}
                onClick={isValidPhone(phone)?getOtp:''}
            >
                {loading && !disablePhone ? <DotElastic /> : 'Get OTP'}
                
            </div>:<div className={cx(styles.label)} >
             Time Left:<span>{seconds}</span>
             </div>}
             {otpSent &&<TextField
                disabled={!disablePhone}
                inputRef={otpRef}
                type={otpVisibility ? 'text' : 'password'}
                label="OTP"
                placeholder="999999"
                prefix={
                    !otpVisibility ? (
                        <VisibilityOffOutlinedIcon
                            style={{ cursor: 'pointer' }}
                            onClick={() => setOtpVisibility(true)}
                        />
                    ) : (
                        <VisibilityOutlinedIcon
                            style={{ cursor: 'pointer' }}
                            onClick={() => setOtpVisibility(false)}
                        />
                    )
                }
                width={isMobile ? 240 : 360}
                height={50}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                style={{ marginBottom: '20px' }}
            />}
            {loginError ?<div className={styles.login_error} onClick={handleSignIn}>
                {loginError}
            </div>:<Button
                loading={disablePhone && loading}
                width={isMobile ? 240 : 360}
                label="Sign Up"
                aria-label="Sign Up"
                className={styles.button}
                disabled={!(otp.length === 6)}
                onClick={handleSubmit}
            /> }
            <div className={styles.footer}>
                <p>Already have an account?</p>{' '}
                <p className={styles.button} onClick={handleSignIn}>
                    Sign in
                </p>
            </div>
        </div>
    )
}

export default SignIn
