import React from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import Layout from '../containers/_App/layout'
import Script from "next/script";

import 'styles/index.scss'
const GA_TRACKING_ID = "G-DY35Y8B82L";

const theme = createTheme({
  typography: {
    fontFamily: 'Montserrat',
  },
  palette: {
    primary: {
      main: '#224957',
    },
    secondary: {
      main: '#F07F6D',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
            @font-face {
                font-family: 'Montserrat';
                font-style: normal;
                font-display: swap;
                font-weight: 400;
                src: local('Montserrat'), local('Montserrat-Regular'), url(https://fonts.googleapis.com/css2?family=Lexend+Deca&family=Montserrat&display=swap) format('woff2');
                unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
              }
          `,
    },
  },
})

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <Layout {...pageProps} >

        {/* Google Tag Manager */}
        <Script
          dangerouslySetInnerHTML={{
            __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','GTM-KDC58QHM');
                `
          }}
        />
        {/* <!-- End Google Tag Manager --> */}

        <Script
          id="facebook-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1562745561085143');
            fbq('track', 'PageView');
          `,
          }}
        />

        {/* NoScript Fallback */}
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=1562745561085143&ev=PageView&noscript=1"
            alt="Facebook Pixel"
          />
        </noscript>
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>

  )
}

export default MyApp