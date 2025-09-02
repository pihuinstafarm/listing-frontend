import React from 'react'
import Head from 'next/head'
import Link from 'next/link'

export default function Custom500() {
  return (
    <>
      <Head>
        <title>Server Error - InstaFarms</title>
        <meta name="description" content="An internal server error occurred. Please try again later." />
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
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: '#dc3545' }}>
          500
        </h1>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#666' }}>
          Internal Server Error
        </h2>
        <p style={{ fontSize: '1rem', marginBottom: '2rem', color: '#888', maxWidth: '500px' }}>
          Something went wrong on our end. We're working to fix the problem. Please try again later.
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
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
          <button 
            onClick={() => window.location.reload()} 
            style={{
              padding: '12px 24px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'background-color 0.3s'
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    </>
  )
}