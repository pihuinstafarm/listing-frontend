import React from 'react'
import Head from 'next/head'
import Link from 'next/link'

export default function FallbackPage() {
  return (
    <>
      <Head>
        <title>Page Not Found - InstaFarms</title>
        <meta name="description" content="The page you are looking for could not be found." />
      </Head>
      
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: '20px',
        fontFamily: 'Arial, sans-serif'
      }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: '#333' }}>
          404
        </h1>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#666' }}>
          Page Not Found
        </h2>
        <p style={{ fontSize: '1rem', marginBottom: '2rem', color: '#888', maxWidth: '500px' }}>
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link href="/" style={{
          padding: '12px 24px',
          backgroundColor: '#007bff',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '5px',
          fontSize: '1rem',
          transition: 'background-color 0.3s'
        }}>
          Go to Homepage
        </Link>
      </div>
    </>
  )
} 