import React, { useState, useEffect, useRef } from 'react'
import cx from 'classnames'
import Image from 'next/image'

import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { Snackbar, Alert, AlertTitle } from '@mui/material'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'

import store from 'redux/configureStore'
import {
    TextField,
    isValidPhone,
    isValidEmail,
    isValidName,
    Button,
    DotElastic,
} from 'utils/components'

import styles from './sign-up.module.scss'

function SignIn({ handleUserDetails, handleSignIn, closeLogin }) {
    const otpRef = useRef(null)
    const [loading, setLoading] = useState(false)
    const [phone, setPhone] = useState('')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [otp, setOtp] = useState('')
    const [disablePhone, setDisablePhone] = useState(false)
    const [otpVisibility, setOtpVisibility] = useState(false)
    const [otpCallback, setOtpCallback] = useState(null)
    const [error, setError] = useState(null)
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))

    useEffect(() => {
        otpRef && otpRef.current && otpRef.current.focus()
    }, [disablePhone])

    function getOtp() {
        try {
            setLoading(true)
            setError(null)
            signInWithPhoneNumber(auth, '+91' + phone, window.recaptchaVerifier)
                .then((res) => {
                    setOtpCallback(res)
                    setDisablePhone(true)
                    setLoading(false)
                })
                .catch((err) => {
                    setLoading(false)
                    setError(err.message)
                })
        } catch (err) {
            setError(err.message)
        }
    }

    function handleSubmit() {
        setLoading(true)
        otpCallback
            .confirm(otp)
            .then((res) => {
                localStorage.setItem('token', res.user.accessToken)
                localStorage.setItem('phone', res.user.phoneNumber)
                authServices
                    .register({ phone: '+91' + phone, email, name })
                    .then((res) => {
                        setLoading(false)
                        handleUserDetails(res.data)
                        // localStorage.setItem('uid', res.data.uuid)
                        window.dispatchEvent(new Event('storage'))
                        closeLogin()
                    })
                    .catch((err) => {
                        localStorage.clear()
                        setLoading(false)
                        setError(err.response.data.message)
                    })
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
            <Image alt="Insta Farms Logo" 

                src="/assets/logos/ig-logo.svg"
                width={235}
                height={40}
            />
            <p className={styles.header}>
                Please fill your details to register your account
            </p>
            <Snackbar
                open={error?.length ? true : false}
                autoHideDuration={6000}
                onClose={resetError}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={resetError} severity="error" sx={{ width: '100%' }}>
                    <AlertTitle>Error</AlertTitle>
                    {error}
                </Alert>
            </Snackbar>
            <div className={styles.fields}>
                <TextField
                    disabled={disablePhone}
                    label="Display Name"
                    placeholder="Rohith Kumar"
                    width={isMobile ? 240 : 360}
                    height={50}
                    value={name}
                    onChange={(e) => !loading && setName(e.target.value)}
                />
                <TextField
                    disabled={disablePhone}
                    label="Mail Id"
                    placeholder="rohithkumar@gmail.com"
                    width={isMobile ? 240 : 360}
                    height={50}
                    value={email}
                    onChange={(e) => !loading && setEmail(e.target.value)}
                />
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
            </div>

            <div
                className={cx(styles.label, {
                    [styles.enable]:
                        isValidPhone(phone) &&
                        isValidEmail(email) &&
                        isValidName(name) &&
                        !disablePhone,
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
                label="Sign Up"
                aria-label="Sign Up"
                disabled={!(otp.length === 6)}
                onClick={handleSubmit}
            />
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
