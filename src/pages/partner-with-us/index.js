import Head from 'next/head'
import { useState } from 'react'
import { isValidPhone } from 'utils/components'
import { contactServices } from 'utils/services'
import styles from './index.module.scss'

export default function PartnerWithUs() {
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState('')
    const [error, setError] = useState('')
    const [formError, setFormError] = useState({
        full_name: '',
        contact_number: '',
        property_details: ''
    })
    const [formData, setFormData] = useState({
        viewed: 0,
        request_type: 'propertyRequest',
        full_name: '',
        contact_number: '',
        property_details: ''
    })

    const pageSchema = {
        "@context": "https://schema.org",
        "@graph": [
            {
            "@type": "WebPage",
            "@id": "https://instafarms.in/partner-with-us/#webpage",
            "url": "https://instafarms.in/partner-with-us/",
            "name": "Partner With Us - InstaFarms",
            "description": "List your farmhouse and become a partner with InstaFarms. Join India's leading agri-tech platform to transform farmhouse experiences using smart technology.",
            "datePublished": "2023-01-01",
            "dateModified": "2025-07-30"
            },
            {
            "@type": "Organization",
            "@id": "https://instafarms.in#organization",
            "name": "InstaFarms",
            "url": "https://instafarms.in",
            "logo": {
                "@type": "ImageObject",
                "url": "https://instafarms.in/logo.png",
                "width": 200,
                "height": 60
            },
            "sameAs": [
                "https://instagram.com/instafarms",
                "https://facebook.com/instafarms"
            ],
            "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "Partner Inquiries",
                "telephone": "+91-9876543210",
                "email": "support@instafarms.in",
                "areaServed": "IN",
                "availableLanguage": ["English", "Hindi", "Telugu"]
            }
            },
            {
            "@type": "Service",
            "name": "Farmhouse Partnership Program",
            "serviceType": "Farmhouse Listing & Partnership",
            "provider": {
                "@id": "https://instafarms.in#organization"
            },
            "areaServed": {
                "@type": "Country",
                "name": "India"
            },
            "audience": {
                "@type": "Audience",
                "audienceType": "Farmhouse Owners, Agri-entrepreneurs"
            },
            "offers": {
                "@type": "Offer",
                "description": "List your farmhouse and become a partner to offer premium, tech-enabled farmhouse experiences with InstaFarms.",
                "price": "0.00",
                "priceCurrency": "INR",
                "eligibleRegion": {
                "@type": "Country",
                "name": "India"
                }
            }
            }
        ]
    }

    // console.log("faqList : ", faqList);
    // console.log("schema : ", pageSchema);

    const applicationSchema = JSON.stringify(pageSchema);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        if (formError[field]) {
            setFormError(prev => ({ ...prev, [field]: '' }))
        }
    }

    const isValidName = (name) => {
        return name && name.trim().length > 0

    }

    const submitForm = async () => {
        setFormError({
            full_name: '',
            contact_number: '',
            property_details: ''
        })
        setSuccess('')
        setError('')

        let errorCount = 0
        let payLoad = formData

        if (!isValidName(payLoad.full_name)) {
            errorCount++
            setFormError(prev => ({
                ...prev,
                full_name: 'Please enter valid full name'
            }))
        }

        if (!isValidPhone(payLoad.contact_number)) {
            errorCount++
            setFormError(prev => ({
                ...prev,
                contact_number: 'Please enter valid contact number'
            }))
        }

        // Property details is optional, but if provided, it should have minimum 10 characters
        if (payLoad.property_details && payLoad.property_details.trim().length > 0 && payLoad.property_details.trim().length < 10) {
            errorCount++
            setFormError(prev => ({
                ...prev,
                property_details: 'Please provide property details (minimum 10 characters)'
            }))
        }

        if (errorCount === 0) {
            setLoading(true)
            try {
                let response = await contactServices.submitForm(payLoad)
                if (response.id) {
                    setSuccess('Request submitted successfully! We will get back to you within 24 hours.')
                    setFormData({
                        viewed: 0,
                        request_type: 'propertyRequest',
                        full_name: '',
                        contact_number: '',
                        property_details: ''
                    })
                } else {
                    setError(response.message || 'Something went wrong. Please try again.')
                }
            } catch (err) {
                setError('Something went wrong. Please try again.')
            }
            setLoading(false)
        }
    }

    const metaTitle = 'List Your Farmhouse - InstaFarms'
    const metaDescription = 'Turn your farmhouse into a thriving weekend getaway. Join thousands of hosts earning from their properties with zero hassle.'
    const metaUrl = 'https://instafarms.in/partner-with-us';
    const metaKeywords = '';
    const metaImage = ''
    const siteName = 'InstaFarms'

    return (
        <>
            <Head>
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: applicationSchema }} />
                <title>{metaTitle}</title>
                <meta name="title" content={metaTitle} />
                <meta name="description" content={metaDescription} />
                <meta name="robots" content="index, follow" />
                <meta name="keywords" content={metaKeywords} />
                <link rel="canonical" href={metaUrl} />

                {/* OG Tags */}
                <meta property="og:title" content={metaTitle} />
                <meta property="og:description" content={metaDescription} />
                <meta property="og:url" content={metaUrl} />
                <meta property="og:image" content={metaImage} />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta property="og:logo" content="http://instafarms.in/logo.webp"/>
                <meta property="og:type" content="My Enquiries Page" />
                <meta property="og:site_name" content={siteName} />
                <meta property="og:locale" content="en_US" />

                {/* Twitter Tags */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={metaTitle} />
                <meta name="twitter:description" content={metaDescription} />
                <meta name="twitter:image" content={metaImage} />
                <meta name="twitter:url" content={metaUrl} />
                <meta name="twitter:site" content="@instafarms" />

                <meta itemProp="name" content={metaTitle} />
                <meta itemProp="description" content={metaDescription} />
                <meta itemProp="image" content={metaImage} />
            </Head>

            <div className={styles.registerFarmhousePage}>
                {/* Hero Section */}
                <section className={styles.heroSection}>
                    <div className={styles.container}>
                        <div className={styles.heroContent}>
                            <h1>List Your Farmhouse</h1>
                            <p className={styles.heroSubtitle}>
                                Turn your farmhouse into a <strong>thriving weekend getaway</strong>.
                                Join thousands of hosts earning from their properties with <em>zero hassle</em>.
                            </p>
                            <div className={styles.trustBadge}>
                                <button
                                    onClick={() => document.getElementById('farmhouseForm').scrollIntoView({ behavior: 'smooth' })}
                                    className={styles.ctaLink}
                                >
                                    🚀 Start Listing Today
                                </button>
                                <p>Trusted by 1000+ hosts</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Why Partner Section */}
                <section className={styles.whyPartnerSection}>
                    <div className={styles.container}>
                        <h2>Why Partner with InstaFarms?</h2>
                        <p className={styles.sectionSubtitle}>
                            We handle everything so you can focus on what matters most - earning from your property.
                        </p>

                        <div className={styles.benefitsGrid}>
                            <div className={styles.benefitCard}>
                                <div className={styles.benefitIcon}>📋</div>
                                <h3>Hassle-Free Management</h3>
                                <p>We handle <strong>guest inquiries, bookings, check-ins and support</strong>.
                                    You won't need to worry about managing schedules.</p>
                            </div>

                            <div className={styles.benefitCard}>
                                <div className={styles.benefitIcon}>👥</div>
                                <h3>Access to Ready Audience</h3>
                                <p>Get featured on our website and social channels, where <strong>thousands of families and travelers</strong>
                                    search for farmhouse stays.</p>
                            </div>

                            <div className={styles.benefitCard}>
                                <div className={styles.benefitIcon}>📱</div>
                                <h3>Marketing That Works</h3>
                                <p>From <strong>Instagram reels to Google listings</strong>, we promote your farm across
                                    digital platforms to drive bookings.</p>
                            </div>

                            <div className={styles.benefitCard}>
                                <div className={styles.benefitIcon}>🛡️</div>
                                <h3>Full-Service Support</h3>
                                <p><strong>Guest screening, dashboard access</strong>, and 24/7 support.
                                    You're never alone in your hosting journey.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Steps Section */}
                <section className={styles.stepsSection}>
                    <div className={styles.container}>
                        <h2>Simple Steps to Start Earning</h2>
                        <p className={styles.sectionSubtitle}>
                            Get your farmhouse listed in just 3 easy steps
                        </p>

                        <div className={styles.stepsGrid}>
                            <div className={styles.stepCard}>
                                <div className={styles.stepNumber}>1</div>
                                <h3>Fill Partner Form</h3>
                                <p>Share basic details and images of your farm</p>
                            </div>

                            <div className={styles.stepCard}>
                                <div className={styles.stepNumber}>2</div>
                                <h3>Property Visit & Verification</h3>
                                <p>Our team schedules a quick visit to assess and onboard your property</p>
                            </div>

                            <div className={styles.stepCard}>
                                <div className={styles.stepNumber}>3</div>
                                <h3>Go Live & Start Earning</h3>
                                <p>Your listing goes live and guests can start booking right away</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Who Can List Section */}
                <section className={styles.whoCanListSection}>
                    <div className={styles.container}>
                        <h2>Who Can List?</h2>
                        <p className={styles.sectionSubtitle}>
                            We're open to all farm owners who want to earn from their space. Ideal properties include:
                        </p>

                        <div className={styles.criteriaGrid}>
                            <div className={styles.criteriaCard}>
                                <h3>Prime Locations</h3>
                                <p><strong>Farmhouses near Hyderabad</strong> like Shamshabad, Kollur, Tukkuguda or other locations</p>
                            </div>

                            <div className={styles.criteriaCard}>
                                <h3>Weekend-Ready Spaces</h3>
                                <p>Properties with <strong>basic amenities</strong> for comfortable family or group stays</p>
                            </div>

                            <div className={styles.criteriaCard}>
                                <h3>Private & Secure</h3>
                                <p><strong>Private, gated properties</strong> suitable for family or group stays</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Registration Form Section */}
                <section className={styles.formSection} id="farmhouseForm">
                    <div className={styles.container}>
                        <div className={styles.formWrapper}>
                            <div className={styles.formHeader}>
                                <h2>Ready to Earn from Your Farmhouse?</h2>
                                <p>Fill out this quick form and our team will get in touch with you within <strong>24 hours</strong>
                                    to discuss your property and next steps.</p>
                            </div>

                            <div className={styles.formFeatures}>
                                <div className={styles.feature}>
                                    <span>✓</span>
                                    <p>Quick property verification</p>
                                </div>
                                <div className={styles.feature}>
                                    <span>✓</span>
                                    <p>No upfront costs</p>
                                </div>
                                <div className={styles.feature}>
                                    <span>✓</span>
                                    <p>Dashboard access for bookings & earnings</p>
                                </div>
                            </div>

                            <form className={styles.registrationForm} onSubmit={(e) => { e.preventDefault(); submitForm(); }}>
                                <div className={styles.formRow}>
                                    <div className={styles.formField}>
                                        <label>Full Name *</label>
                                        <input
                                            type="text"
                                            value={formData.full_name}
                                            onChange={(e) => handleInputChange('full_name', e.target.value)}
                                            placeholder="Enter your full name"
                                            className={formError.full_name ? styles.errorInput : ''}
                                        />
                                        {formError.full_name && <span className={styles.errorMessage}>{formError.full_name}</span>}
                                    </div>

                                    <div className={styles.formField}>
                                        <label>Contact Number *</label>
                                        <input
                                            type="tel"
                                            value={formData.contact_number}
                                            onChange={(e) => handleInputChange('contact_number', e.target.value)}
                                            placeholder="+91 Enter your contact number"
                                            className={formError.contact_number ? styles.errorInput : ''}
                                        />
                                        {formError.contact_number && <span className={styles.errorMessage}>{formError.contact_number}</span>}
                                    </div>
                                </div>

                                <div className={styles.formField}>
                                    <label>Property Details</label>
                                    <textarea
                                        value={formData.property_details}
                                        onChange={(e) => handleInputChange('property_details', e.target.value)}
                                        placeholder="Tell us about your property, amenities, bedroom count, location highlights, etc."
                                        rows="4"
                                        className={formError.property_details ? styles.errorInput : ''}
                                    />
                                    {formError.property_details && <span className={styles.errorMessage}>{formError.property_details}</span>}
                                </div>

                                {success && <div className={styles.successMessage}>{success}</div>}
                                {error && <div className={styles.errorMessage}>{error}</div>}

                                <button
                                    type="submit"
                                    className={styles.submitButton}
                                    disabled={loading}
                                >
                                    {loading ? 'Submitting...' : '🚀 Submit Application'}
                                </button>
                            </form>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className={styles.ctaSection}>
                    <div className={styles.container}>
                        <h2>Ready to Earn from Your Farmhouse?</h2>
                        <p>Partner with InstaFarms and turn your space into a <strong>thriving weekend getaway</strong>.</p>
                        <button
                            onClick={() => document.getElementById('farmhouseForm').scrollIntoView({ behavior: 'smooth' })}
                            className={styles.ctaButton}
                        >
                            🌟 Get Started Now
                        </button>
                    </div>
                </section>
            </div>
        </>
    )
} 