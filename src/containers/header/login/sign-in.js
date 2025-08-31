import React, { useState, useEffect, useRef } from 'react'
import cx from 'classnames'
import Image from 'next/image'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'

import { authServices } from 'utils/services'
import { TextField, isValidPhone, Button, DotElastic } from 'utils/components'

import styles from './sign-in.module.scss'

function SignIn({handleSignUp, closeLogin }) {
    const otpRef = useRef(null)
    const [loading, setLoading] = useState(false)
    const [phone, setPhone] = useState('')
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
            setSeconds(30);
            setOtpSent(false)
          }
        
    }
    useEffect(() => {
        otpRef && otpRef.current && otpRef.current.focus()
    }, [disablePhone])

    function getOtp() {
        try {
            setLoading(true)
            setLoginError(null)
            let payload={
                phone:phone
            }

            authServices
                .isRegisterd(payload)
                .then((res) => {
                if(res.success){
                    if (res?.is_registered) {
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
                    } else {
                        handleSignUp()
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
        authServices
            .confirmOtp({ otp,phone })
            .then((res) => {
                if(res.success){
                setLoading(false)
                 localStorage.setItem('token', res.accessToken)
                 localStorage.setItem('documentId', res.documentId)
                 window.dispatchEvent(new Event('storage'))
                 closeLogin()
                }else{
                    setLoading(false)
                    setLoginError(res.message)
                }
            })
    }

   

    return (
        <div className={styles.wrapper}>
            <Image alt="logo" width="146" height="85" src="/assets/images/svg/logo.webp"/>
            <p className={styles.header}>
                Please fill your details to login to your account
            </p>
            <div id="recaptcha"></div>
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
            {!otpSent ?<div
                className={cx(styles.label, {
                    [styles.enable]: isValidPhone(phone) && !disablePhone,
                })}
                onClick={isValidPhone(phone)?getOtp:''}
            >
                {loading && !disablePhone ? <DotElastic /> : 'Get OTP'}
            </div>:<div className={cx(styles.label)} >
             Time Left: <span>{seconds}</span>
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
            <Button
                loading={disablePhone && loading}
                width={isMobile ? 240 : 360}
                label="Sign In"
                aria-label='Sign In'
                disabled={!(otp.length === 6)}
                onClick={handleSubmit}
            />
            {loginError &&<div className={styles.login_error}>
                Oops! {loginError}
            </div>}
            <div className={styles.footer}>
                <p>Don’t have an account?</p>{' '}
                <p className={styles.button} onClick={handleSignUp}>
                    Sign up
                </p>
            </div>
        </div>
    )
}

export default SignIn
