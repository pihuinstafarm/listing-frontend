import React, { useState, useEffect, useRef } from 'react'
import { CircularLoader, isLoggedIn } from 'utils/components'
import { getProfile } from 'hooks/my-profile.hooks'
import { Col, Container, Row } from 'react-bootstrap'
import { TextField, Button } from 'utils/components'
import styles from './my-profile.module.scss'
import { authServices } from 'utils/services'
import { useRouter } from 'next/router'
import { Link } from '@mui/material'
import Head from 'next/head'
function MyProfile() {
    const router = useRouter()
    const { loading, data } = getProfile()
    const [isSubmitted, setisSubmitted] = useState(false)
    const [formValues, setFormValues] = useState({})
    const metaTitle = 'My Profile - Insta Farms'
    const metaDescription = ''
    const metaUrl = 'https://instafarms.in/my-profile';
    const metaKeywords = '';
    const metaImage = ''
    const siteName = 'InstaFarms'

    let BreadcrumItems = [{
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": 'https://instafarms.in'
    }]

    let OrganizationSchema = {
        "@context": "http://schema.org",
        "@type": "Organization",
        "name": "InstaFarms",
        "url": 'https://instafarms.in'

    }

    let WebPageSchema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": metaTitle,
        "url": metaUrl
    }

    let BreadcrumSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": BreadcrumItems
    }


    const schemaOrgArray = [OrganizationSchema, WebPageSchema, BreadcrumSchema];
    let schemaString = JSON.stringify(schemaOrgArray);
    const applicationSchema = schemaString



    useEffect(() => {
        const isAuthUser = isLoggedIn()
        if (!isAuthUser) {
            router.push('/');
        }
    }, [])

    useEffect(() => {
        setFormValues(data)
    }, [data])

    useEffect(() => {

    }, [formValues])


    if (loading) {
        return (
            <div className="full_screen_loading flex justify-center items-center h-[75%] w-full">
                <CircularLoader />
            </div>
        )
    }

    if (!formValues) {
        return <div>Error Page</div>
    }
    const capitalizeFirstLetter = (string) => {
        if (string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        } else {
            return string;
        }
    }
    function handleSubmit() {
        setisSubmitted(true)
        let payload = {
            first_name: capitalizeFirstLetter(formValues.first_name),
            last_name: capitalizeFirstLetter(formValues.last_name),
            email: formValues.email,
            phone: formValues.phone,
            address_details: {
                address: formValues.address,
                state_name: formValues.state_name,
                city_name: formValues.city_name,
                area_name: formValues.area_name
            }
        };
        authServices.updateProfile(payload).then(({ data }) => {
            setisSubmitted(false)
        })



    }

    return (<>
        <Head>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: applicationSchema }}
            />
            <title>{metaTitle}</title>
            <meta name="title" content={metaTitle} />
            <meta name="description" content={metaDescription} />
            <meta name="keywords" content={metaKeywords} />
            <meta name="robots" content="index, follow" />
            <link rel="canonical" href={metaUrl} />
            
            {/* OG Tags */}
            <meta property="og:title" content={metaTitle} />
            <meta property="og:description" content={metaDescription} />
            <meta property="og:url" content={metaUrl} />
            <meta property="og:image" content={metaImage} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:logo" content="http://instafarms.in/logo.webp"/>
            <meta property="og:type" content="My Profile Page" />
            <meta property="og:site_name" content={siteName} />
            <meta property="og:locale" content="en_US" />

            {/* Twitter Tags */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={metaTitle} />
            <meta name="twitter:description" content={metaDescription} />
            <meta name="twitter:image" content={metaImage} />
            <meta name="twitter:url" content={metaUrl} />
            <meta name="twitter:site" content="@instafarms"/>

            <meta itemProp="name" content={metaTitle} />
            <meta itemProp="description" content={metaDescription} />
            <meta itemProp="image" content={metaImage} />

        </Head>
        <Container className="page_content contact_us">
            <div className={'inner_section'}>
                <div className='breadcrum'>
                    <Link scroll={true} aria-label='Home' href={`/`}>Home</Link>/
                    <span>My Profile</span>
                </div>
            </div>
            <section className='inner_section'>

                <h1>Profile Details</h1>
                <div className={styles.form_section}>
                    <div className={styles.form_left}>
                        <h2 className={styles.section_heading}>Personal Details</h2>
                        <TextField
                            label="First Name"
                            placeholder=""
                            height={50}
                            value={formValues ? formValues.first_name : ''}
                            className={styles.textfield}
                            onChange={(e) => {
                                const { value: first_name } = e.target
                                setFormValues((prev) => ({
                                    ...prev,
                                    first_name,
                                }))
                            }}
                        />
                        <TextField
                            label="Last Name"
                            placeholder=""
                            height={50}
                            value={formValues ? formValues.last_name : ''}
                            className={styles.textfield}
                            onChange={(e) => {
                                const { value: last_name } = e.target
                                setFormValues((prev) => ({
                                    ...prev,
                                    last_name,
                                }))
                            }}
                        />

                        <TextField
                            label="Email ID"
                            placeholder=""
                            height={50}
                            value={formValues.email}
                            className={styles.textfield}
                            InputProps={{ readOnly: true }}
                        />
                        <TextField
                            label="Mobile Number"
                            placeholder=""
                            height={50}
                            value={formValues.phone}
                            className={styles.textfield}
                            InputProps={{ readOnly: true }}

                        />

                    </div>
                    <div className={styles.form_right}>

                        <h2 className={styles.section_heading}>Address Details</h2>
                        <TextField
                            label="Address"
                            placeholder=""
                            height={50}
                            value={formValues.address_details?.address}
                            className={styles.textfield}
                            onChange={(e) => {
                                const { value: address } = e.target
                                setFormValues((prev) => ({
                                    ...prev,
                                    address,
                                }))
                            }}

                        />

                        <div className={styles.form_section}>
                            <div className={styles.form_left}>
                                <TextField
                                    label="State"
                                    placeholder=""
                                    height={50}
                                    value={formValues.address_details?.state_name}
                                    className={styles.textfield}
                                    onChange={(e) => {
                                        const { value: state_name } = e.target
                                        setFormValues((prev) => ({
                                            ...prev,
                                            state_name,
                                        }))
                                    }}
                                />
                            </div>
                            <div className={styles.form_right}>
                                <TextField
                                    label="City"
                                    placeholder=""
                                    height={50}
                                    value={formValues.address_details?.city_name}
                                    className={styles.textfield}
                                    onChange={(e) => {
                                        const { value: city_name } = e.target
                                        setFormValues((prev) => ({
                                            ...prev,
                                            city_name,
                                        }))
                                    }}
                                />
                            </div>
                        </div>

                        <div className={styles.form_section}>
                            <div className={styles.form_left}>
                                <TextField
                                    label="Area Name"
                                    placeholder=""
                                    height={50}
                                    value={formValues.address_details?.area_name}
                                    className={styles.textfield}
                                    onChange={(e) => {
                                        const { value: area_name } = e.target
                                        setFormValues((prev) => ({
                                            ...prev,
                                            area_name,
                                        }))
                                    }}
                                />
                            </div>
                            <div className={styles.form_right}>
                            </div>
                        </div>

                    </div>
                </div>


                <Row className={styles.submit_row}>
                    <Button
                        loading={isSubmitted}
                        label="Update"
                        aria-label="Update"
                        onClick={handleSubmit}
                    />
                </Row>
            </section>
        </Container>
    </>
    )
}

export default MyProfile
