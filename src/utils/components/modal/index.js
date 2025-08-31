import React, { useRef, useEffect, useState } from 'react';
import cx from 'classnames';

import styles from './index.module.scss';

function Modal({ wrapperClassname, classname, children, onClose }) {
    const modalRef = useRef(null);
    const [leave, setLeave] = useState(false);

    useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [modalRef, onClose]);

    function handleOutsideClick(e) {
        if (onClose && !modalRef.current.contains(e.target)) {
            setLeave(true);
            setTimeout(onClose, 1000);
        }
    }

    return (
        <div
            className={cx(styles.container, styles.one, {
                [styles.out]: leave
            })}
        >
            <div className={styles.modalBg}>
                <div className={cx(styles.modal, classname)} ref={modalRef}>
                    <div className={styles.content}>{children}</div>
                </div>
            </div>
        </div>
    );
}

export default Modal;
