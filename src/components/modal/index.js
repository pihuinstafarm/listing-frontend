import React, { useRef, useEffect, useState } from 'react'
import cx from 'classnames'

import styles from './index.module.scss'

function Modal({ wrapperClassname, classname, children, onClose }) {
    const modalRef = useRef()
    const [leave, setLeave] = useState(false)

    useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick)
        document.body.classList.add("modal-open");
        return () => {
            document.body.classList.remove("modal-open");
            document.removeEventListener('mousedown', handleOutsideClick)
        }
    }, [modalRef])

    function handleOutsideClick(e) {
        if (!modalRef.current.contains(e.target)) {
            setLeave(true)
            setTimeout(onClose, 1000)
        }
    }

    return (
        <div className={cx(styles.container, styles.one, { [styles.out]: leave })}>
            <div className={styles.modalBg}>
                <div className={cx(styles.modal, classname)} ref={modalRef}>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Modal
