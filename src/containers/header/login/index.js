import React, { useState, useEffect } from 'react'
import CloseIcon from '@mui/icons-material/Close'

import { SIGN_IN, SIGN_UP } from 'constants/login'
import { Modal } from 'components'
import { Button } from 'utils/components'

import SignIn from './sign-in'
import SignUp from './sign-up'
import RightSection from './right-section'
import { Error } from 'utils/components'

import styles from './index.module.scss'

function Login({ handleUserDetails, closeLogin, isOpen }) {
    const [type, setType] = useState(SIGN_IN)
    const [error, setError] = useState(null)
    return (
        <Modal classname={styles.wrapper} onClose={closeLogin} isOpen={isOpen}>
            <Button
                aria-label='close'
                width={32}
                label={<CloseIcon variant="alert" />}
                className={styles.close}
                onClick={closeLogin}
            />
            <Error error={error} resetError={() => setError(null)} />
            <div className={styles.content}>
                {type === SIGN_IN ? (
                    <SignIn
                        handleUserDetails={handleUserDetails}
                        handleSignUp={() => setType(SIGN_UP)}
                        closeLogin={closeLogin}
                    />
                ) : (
                    <SignUp
                        handleUserDetails={handleUserDetails}
                        handleSignIn={() => setType(SIGN_IN)}
                        closeLogin={closeLogin}
                    />
                )}
            </div>
            <RightSection />
        </Modal>
    )
}

export default Login
