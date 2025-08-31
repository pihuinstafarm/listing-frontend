import React, { useState, useEffect, useRef } from 'react'
import cx from 'classnames'
import Image from 'next/image'

import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'

import store from 'redux/configureStore'
import { TextField, isValidPhone, Button, DotElastic, Error } from 'utils/components'

import styles from './sign-in.module.scss'

function SignIn({ handleUserDetails, handleSignUp, closeLogin }) {
    const otpRef = useRef(null)
    const [loading, setLoading] = useState(false)
    const [phone, setPhone] = useState('')
    const [otp, setOtp] = useState('')
    const [disablePhone, setDisablePhone] = useState(false)
    const [otpVisibility, setOtpVisibility] = useState(false)
    const [otpCallback, setOtpCallback] = useState(null)
    const [error, setError] = useState(null)
    const [userData, setUserData] = useState(null)
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))

    useEffect(() => {
        otpRef && otpRef.current && otpRef.current.focus()
    }, [disablePhone])

    function getOtp() {
       
    }

    function handleSubmit() {
        setLoading(true)
        otpCallback
            .confirm(otp)
            .then((res) => {
                setLoading(false)
                handleUserDetails(userData)
                // localStorage.setItem('uid', userData.uuid)
                localStorage.setItem('token', res.user.accessToken)
                localStorage.setItem('phone', res.user.phoneNumber)
                window.dispatchEvent(new Event('storage'))
                closeLogin()
            })
            .catch((err) => {
                setLoading(false)
                setError(err.message)
            })
    }

    function resetError() {
        setError('')
    }

    return (
        <div className={styles.wrapper}>
            <Error error={error} resetError={resetError} />
            <Image alt="Insta Farms" 

                src="/assets/logos/ig-logo.svg"
                width={360}
                height={60}
            />
            <p className={styles.header}>
                Please fill your details to login to your account
            </p>
            <div id="recaptcha"></div>
            <TextField
                disabled={disablePhone}
                label="Phone Number"
                placeholder="9999999999"
                suffix="+91"
                width={isMobile ? 240 : 360}
                height={50}
                value={phone}
                onChange={(e) => !loading && setPhone(e.target.value)}
            />
            <div
                className={cx(styles.label, {
                    [styles.enable]: isValidPhone(phone) && !disablePhone,
                })}
                onClick={getOtp}
            >
                {loading && !disablePhone ? <DotElastic /> : 'Get OTP'}
            </div>
            <TextField
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
                style={{ marginBottom: '60px' }}
            />
            <Button
                loading={disablePhone && loading}
                width={isMobile ? 240 : 360}
                label="Sign In"
                aria-label="Sign In"
                disabled={!(otp.length === 6)}
                onClick={handleSubmit}
            />
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
