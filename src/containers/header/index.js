import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
const Login = dynamic(() => import('./login'));

import { locationsSerivces, settingsServices } from 'utils/services';
import Content from './content';

import styles from './index.module.scss';

export default function Header() {
    const [showLogin, setShowLogin] = useState(false)
    const [allCity, setAllCity] = useState([])
    const [siteSettings, setSiteSettings] = useState('')

    useEffect(() => {
        locationsSerivces.getAllCity().then((res) => {
            setAllCity(res)
        })

        settingsServices.getSettings().then((res) => {
            setSiteSettings(res)
        })

    }, [])


    return (
        <div className={styles.wrapper}>
            {showLogin ? (
                <Login
                    closeLogin={() => setShowLogin(false)}
                    isOpen={showLogin}
                />
            ) : null}
            <Content
                allCity={allCity}
                siteSettings={siteSettings}
                openLogin={() => setShowLogin(true)}
            />
        </div>
    )
}