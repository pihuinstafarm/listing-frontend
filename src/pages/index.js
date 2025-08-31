import React, { useEffect, useState } from 'react'
import styles from './index.module.scss'

import Head from 'next/head'

import Lazycarousel from 'containers/header/carousel'

import DestinationList from 'containers/DestinationList'
import NearByLocations from 'containers/NearByLocations'
import BookingListBlock from 'containers/BookingListBlock'
import CollectionsSection from 'containers/CollectionsSection'
import LazySearchBox from 'containers/SearchBox'
import BenefitsSection from 'containers/BenefitsSection'

import { settingsServices, propertiesServices, locationsSerivces, carouselServices, collectionsSerivces, metadataServices } from 'utils/services'

export async function getStaticProps() {
  let siteSettings = await settingsServices.getSettings();
  let allCarousels = await carouselServices.getAllCarousels();
  let locationsList = await locationsSerivces.getNearByLocations();
  let NearByPropertiesList = await propertiesServices.getNearByProperties();
  let LatestPropertiesList = await propertiesServices.getLatestProperties();
  let allCollectionsList = await collectionsSerivces.getAll();
  let allLocations = await locationsSerivces.getAllArea();
  let metadata = await metadataServices.getMetadata("QAINtXmk4qs1SFe8RLqi");

  return { props: { siteSettings, allCarousels, locationsList, LatestPropertiesList, NearByPropertiesList, allLocations, allCollectionsList, metadata }, revalidate: 10 }
}

export default function Home({ siteSettings, allCarousels, locationsList, LatestPropertiesList, NearByPropertiesList, allLocations, allCollectionsList, metadata }) {

  // Metadata
  const siteName = siteSettings.site_title || 'InstaFarms';
  const metaTitle = metadata?.metadata?.metaTitle || "Farmhouses in Hyderabad | Private, Luxury Stays with Pool";
  const metaDescription = metadata?.metadata?.metaDescription || "Enjoy luxury farmhouses in Hyderabad with a pool for family stays, events, or nightouts. Perfect for relaxing retreats with comfort and privacy. Book now!";
  const metaKeywords = siteSettings.meta_keywords ? siteSettings.meta_keywords : '';
  const metaUrl = metadata?.metadata?.metaUrl || 'https://instafarms.in';
  const metaImage = metadata?.metadata?.metaImage || "https://instafarms.in/_next/image?url=%2Fassets%2Fimages%2Fsvg%2Flogo.webp&w=384&q=75";

  const pageSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://instafarms.in/#localbusiness",
    "name": "InstaFarms",
    "url": "https://instafarms.in/",
    "logo": "https://instafarms.in/logo.webp",
    "image": "https://instafarms.in/logo.webp",
    "description": "InstaFarms is Hyderabad’s trusted platform for booking premium farmhouses in Shamshabad, Moinabad, and nearby areas. Perfect for parties, weddings, family gatherings, and weekend getaways — all with pools, lawns, and modern amenities.",
    "telephone": "+91-8019127474",
    "address": {
      "@type": "PostalAddress",
      "streetAddress" : "Instafarms Hyderabad, Telangana",
      "addressLocality": "Hyderabad",
      "addressRegion": "Telangana",
      "postalCode": "500001",
      "addressCountry": "IN"
    },
    "openingHours": "Mo-Su 09:00-21:00",
    "priceRange": "₹₹₹",
    "sameAs": [
      "https://www.instagram.com/instafarms.in",
      "https://www.facebook.com/instafarms"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-8019127474",
      "contactType": "Customer Service",
      "areaServed": "IN",
      "availableLanguage": ["English", "Hindi"]
    }
  }

  const applicationSchema = JSON.stringify(pageSchema);

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
      <meta property="og:type" content="Homepage" />
      <meta property="og:logo" content="http://instafarms.in/properties.webp"/>
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_US" />
      <meta property="og:image:secure_url" content="http://instafarms.in/properties.webp" />

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
    <div className={styles.HeaderSection}>
      <section className={styles.CarouselSlider}>
        <Lazycarousel allCarousels={allCarousels} />
      </section>
      <section className={styles.SearchSection}>
        <LazySearchBox allLocations={allLocations} />
      </section>
    </div>
    <DestinationList locationsList={locationsList} />

    {/* Beautiful Farmhouses Banner */}
    <section className="relative overflow-hidden my-12 mx-4">
      <div className="relative">
        <div className="relative z-10 py-16 px-8 text-center">
          {/* Main Title */}
          <h1 className="text-4xl lg:text-6xl md:text-5xl sm:text-3xl font-bold mb-4 leading-tight">
            Farmhouses in Hyderabad
          </h1>

          {/* Subtitle */}
          <h6 className="text-xl lg:text-2xl md:text-xl sm:text-lg font-medium leading-relaxed max-w-5xl mx-auto"
            style={{ color: '#224957' }}>
            Find the most trusted farmhouses based on your needs or your destination!
          </h6>
        </div>
      </div>
    </section >

    <NearByLocations titleTag={'h2'} title={'Popular Locations'} subtitle={'Verified private Farmhouses at all the popular locations in Hyderabad'} propertiesList={NearByPropertiesList} />
    <NearByLocations titleTag={'h2'} title={'Newly Launched Farmhouses'} subtitle={'Explore our latest farmhouses perfect for kids, events & more'} propertiesList={LatestPropertiesList} />
    <CollectionsSection allCollectionsList={allCollectionsList} />
    <BookingListBlock />
    <BenefitsSection />
  </>)
}