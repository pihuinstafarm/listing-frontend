import Header from 'containers/header';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import HeadContent from './HeadContent';

const Footer = dynamic(() => import('./footer'));


export const revalidate = 10

function Layout({ children }) {

    return (<>
        <Head>
            <HeadContent />
            <title>Find Your Next Stay at InstaFarms</title>
            <meta name="description" content="Your one stop destination for anything and everything related to Farmhouses!" />
        </Head>

        <Header />
        {children}
        <Footer />
    </>)
}

export default Layout
