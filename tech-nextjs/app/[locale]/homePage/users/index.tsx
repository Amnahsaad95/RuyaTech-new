import React from 'react';
import Head from 'next/head';
import Directory from '../components/Directory';

const HomePage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Professional Network Directory</title>
        <meta 
          name="description" 
          content="Find and connect with professionals, students, and companies. Advanced filtering and search capabilities." 
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        
        {/* Font Awesome for icons */}
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" 
        />
        
        {/* Open Graph meta tags */}
        <meta property="og:title" content="Professional Network Directory" />
        <meta 
          property="og:description" 
          content="Find and connect with professionals, students, and companies. Advanced filtering and search capabilities." 
        />
        <meta property="og:type" content="website" />
        
        {/* Twitter Card meta tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Professional Network Directory" />
        <meta 
          name="twitter:description" 
          content="Find and connect with professionals, students, and companies. Advanced filtering and search capabilities." 
        />
      </Head>
      
      <Directory />
    </>
  );
};

export default HomePage;

