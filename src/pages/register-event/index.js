import Head from 'next/head'
import { useState } from 'react'
import { isValidPhone } from 'utils/components'
import { contactServices } from 'utils/services'
import styles from './index.module.scss'

export default function RegisterEvent() {
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState('')
    const [error, setError] = useState('')
    const [formError, setFormError] = useState({
        full_name: '',
        contact_number: '',
        event_details: ''
    })
    const [formData, setFormData] = useState({
        viewed: 0,
        request_type: 'eventRequest',
        full_name: '',
        contact_number: '',
        event_details: ''
    })

    const pageSchema = {
        "@context": "https://schema.org",
        "@graph": [
            {
            "@type": "WebPage",
            "@id": "https://instafarms.in/register-event",
            "url": "https://instafarms.in/register-event",
            "name": "Register Your Event - InstaFarms",
            "description": "Host and list your event at InstaFarms properties. Promote weddings, parties, and gatherings across our network of farmhouses.",
            "inLanguage": "en"
            },
            {
            "@type": "Service",
            "name": "Event Listing and Hosting",
            "serviceType": "Event Registration",
            "url": "https://instafarms.in/register-event",
            "provider": {
                "@type": "Organization",
                "name": "InstaFarms",
                "url": "https://instafarms.in",
                "logo": {
                "@type": "ImageObject",
                "url": "https://instafarms.in/logo.png",
                "width": 200,
                "height": 60
                },
                "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "Customer Support",
                "telephone": "+91-9403892058",
                "availableLanguage": ["English", "Hindi", "Telugu"]
                }
            },
            "areaServed": {
                "@type": "Country",
                "name": "India"
            },
            "audience": {
                "@type": "Audience",
                "audienceType": "Event Organizers"
            },
            "offers": {
                "@type": "Offer",
                "priceCurrency": "INR",
                "price": "0.00",
                "description": "Free registration for event hosting and listing on InstaFarms."
            }
            }
        ]
    }

    // console.log("faqList : ", faqList);
    // console.log("schema : ", pageSchema);

    const applicationSchema = JSON.stringify(pageSchema);

    const isValidName = (name) => {
        return name && name.trim().length > 0

    }

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        if (formError[field]) {
            setFormError(prev => ({ ...prev, [field]: '' }))
        }
    }

    const submitForm = async () => {
        setFormError({
            full_name: '',
            contact_number: '',
            event_details: ''
        })
        setSuccess('')
        setError('')

        let errorCount = 0
        let payLoad = formData

        if (!isValidName(payLoad.full_name)) {
            errorCount++
            setFormError(prev => ({
                ...prev,
                full_name: 'Please enter valid first name and last name'
            }))
        }

        if (!isValidPhone(payLoad.contact_number)) {
            errorCount++
            setFormError(prev => ({
                ...prev,
                contact_number: 'Please enter valid contact number'
            }))
        }

        // Event details is optional, but if provided, it should have minimum 10 characters
        if (payLoad.event_details && payLoad.event_details.trim().length > 0 && payLoad.event_details.trim().length < 10) {
            errorCount++
            setFormError(prev => ({
                ...prev,
                event_details: 'Please provide event details (minimum 10 characters)'
            }))
        }

        if (errorCount === 0) {
            setLoading(true)
            try {
                let response = await contactServices.submitForm(payLoad)
                if (response.id) {
                    setSuccess('Event enquiry submitted successfully! We will get back to you within 24 hours with customized quotes.')
                    setFormData({
                        viewed: 0,
                        request_type: 'eventRequest',
                        full_name: '',
                        contact_number: '',
                        event_details: ''
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

    const metaTitle = 'Book Your Event at a Farmhouse - InstaFarms'
    const metaDescription = 'Planning a special event? Whether you\'re envisioning a vibrant sangeet, a dreamy wedding or a cozy birthday gathering, InstaFarms has the perfect venue for you.'
    const metaUrl = 'https://instafarms.in/register-event'
    const metaImage = '';
    const metaKeywords = '';
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
                <meta name="twitter:site" content="@instafarms"/>

                <meta itemProp="name"  content={metaTitle}  />
                <meta itemProp="description" content={metaDescription}/>
                <meta itemProp="image" content={metaImage} />
            </Head>

            <div className={styles.registerEventPage}>
                {/* Hero Section */}
                <section className={styles.heroSection}>
                    <div className={styles.container}>
                        <div className={styles.heroContent}>
                            <h1>🎉 Event Planning</h1>
                            <h2>Perfect Venues for Every Celebration</h2>
                            <p className={styles.heroSubtitle}>
                                Planning a special event? Whether you're envisioning a <strong>vibrant sangeet</strong>,
                                a <strong>dreamy wedding</strong> or a <strong>cozy birthday gathering</strong>,
                                InstaFarms has the perfect venue for you.
                            </p>
                            <div className={styles.trustBadge}>
                                <button
                                    onClick={() => document.getElementById('eventForm').scrollIntoView({ behavior: 'smooth' })}
                                    className={styles.ctaLink}
                                >
                                    🎊 Book Your Event
                                </button>
                                <p>Seamless, memorable & one-of-a-kind</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Event Types Section */}
                <section className={styles.eventTypesSection}>
                    <div className={styles.container}>
                        <h2>Types of Events We Host</h2>
                        <p className={styles.sectionSubtitle}>
                            From family milestones to professional offsites, we provide the space and support
                            to make your event seamless and memorable.
                        </p>

                        <div className={styles.eventTypesGrid}>
                            <div className={styles.eventTypeCard}>
                                <div className={styles.eventIcon}>💃</div>
                                <h3>Sangeet Nights & Weddings</h3>
                                <p>Celebrate with <strong>dance, music and lights</strong> under open skies.
                                    Perfect for traditional ceremonies, Haldi, Mehendi or modern outdoor weddings.</p>
                            </div>

                            <div className={styles.eventTypeCard}>
                                <div className={styles.eventIcon}>🎂</div>
                                <h3>Birthdays & Celebrations</h3>
                                <p>Whether it's a <strong>1st birthday or a 60th</strong>, our venues are perfect
                                    for memorable celebrations with space to play, party and relax.</p>
                            </div>

                            <div className={styles.eventTypeCard}>
                                <div className={styles.eventIcon}>🏢</div>
                                <h3>Corporate Gatherings</h3>
                                <p>Host <strong>offsites, team building retreats</strong> or small conferences
                                    in serene surroundings away from the city hustle.</p>
                            </div>

                            <div className={styles.eventTypeCard}>
                                <div className={styles.eventIcon}>🎉</div>
                                <h3>Other Events</h3>
                                <p>From <strong>anniversaries to family reunions</strong>, InstaFarms can accommodate
                                    a variety of private gatherings. Just tell us what you need.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* What You Get Section */}
                <section className={styles.whatYouGetSection}>
                    <div className={styles.container}>
                        <h2>What You Get</h2>
                        <p className={styles.sectionSubtitle}>
                            Our carefully curated farmhouses offer spacious layouts, natural beauty and
                            customizable options to suit every celebration.
                        </p>

                        <div className={styles.benefitsGrid}>
                            <div className={styles.benefitCard}>
                                <div className={styles.benefitIcon}>🏠</div>
                                <h3>Spacious Outdoor & Indoor Areas</h3>
                                <p>With parking, power backup & washrooms - everything you need for a successful event</p>
                            </div>

                            <div className={styles.benefitCard}>
                                <div className={styles.benefitIcon}>👥</div>
                                <h3>Support Team for Planning</h3>
                                <p>Full coordination support to make your event seamless and memorable</p>
                            </div>

                            <div className={styles.benefitCard}>
                                <div className={styles.benefitIcon}>⏰</div>
                                <h3>Flexible Time Slots</h3>
                                <p>Customizable timing options to fit your event schedule perfectly</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Why Choose Us Section */}
                <section className={styles.whyChooseSection}>
                    <div className={styles.container}>
                        <h2>Why Choose InstaFarms for Events?</h2>
                        <div className={styles.reasonsGrid}>
                            <div className={styles.reasonCard}>
                                <h3>Verified Farm Venues</h3>
                                <p>With clear pricing and transparent booking process</p>
                            </div>

                            <div className={styles.reasonCard}>
                                <h3>Easy Booking Process</h3>
                                <p>Simple, hassle-free booking experience</p>
                            </div>

                            <div className={styles.reasonCard}>
                                <h3>Professional Event Coordination</h3>
                                <p>Full support for planning and coordination</p>
                            </div>

                            <div className={styles.reasonCard}>
                                <h3>Multiple Location Options</h3>
                                <p>Near major cities with easy accessibility</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Registration Form Section */}
                <section className={styles.formSection} id="eventForm">
                    <div className={styles.container}>
                        <div className={styles.formWrapper}>
                            <div className={styles.formHeader}>
                                <h2>Make Your Event Memorable</h2>
                                <p>Tell us about your event and we'll help you find the perfect farmhouse venue.
                                    Get a <strong>customized quote within 24 hours</strong>.</p>
                            </div>

                            <div className={styles.formFeatures}>
                                <div className={styles.feature}>
                                    <span>✓</span>
                                    <p>Free venue consultation</p>
                                </div>
                                <div className={styles.feature}>
                                    <span>✓</span>
                                    <p>Professional coordination support</p>
                                </div>
                                <div className={styles.feature}>
                                    <span>✓</span>
                                    <p>Transparent pricing</p>
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
                                    <label>Event Details</label>
                                    <textarea
                                        value={formData.event_details}
                                        onChange={(e) => handleInputChange('event_details', e.target.value)}
                                        placeholder="Tell us about your event, guest count, event-dates, special requirements, theme, etc."
                                        rows="4"
                                        className={formError.event_details ? styles.errorInput : ''}
                                    />
                                    {formError.event_details && <span className={styles.errorMessage}>{formError.event_details}</span>}
                                </div>

                                {success && <div className={styles.successMessage}>{success}</div>}
                                {error && <div className={styles.errorMessage}>{error}</div>}

                                <button
                                    type="submit"
                                    className={styles.submitButton}
                                    disabled={loading}
                                >
                                    {loading ? 'Submitting...' : '🎉 Make an Enquiry'}
                                </button>
                            </form>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className={styles.ctaSection}>
                    <div className={styles.container}>
                        <h2>Ready to Plan Your Perfect Event?</h2>
                        <p>Let us help you create <strong>memories that last a lifetime</strong> in the perfect farmhouse setting.</p>
                        <div className={styles.ctaButtons}>
                            <button
                                onClick={() => document.getElementById('eventForm').scrollIntoView({ behavior: 'smooth' })}
                                className={styles.ctaButton}
                            >
                                🌟 Book Now
                            </button>
                            <button
                                onClick={() => document.getElementById('eventForm').scrollIntoView({ behavior: 'smooth' })}
                                className={styles.ctaButtonSecondary}
                            >
                                📞 Get Quote
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </>
    )
} 