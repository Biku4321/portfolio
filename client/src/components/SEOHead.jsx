import React from 'react';
import { Helmet } from 'react-helmet';

const SEOHead = ({ title, description, image, url }) => {
  return (
    <Helmet>
      <title>{title || 'Portfolio'}</title>
      <meta name="description" content={description || 'Personal portfolio'} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {image && <meta property="og:image" content={image} />}
      {url && <meta property="og:url" content={url} />}
      <meta name="twitter:card" content="summary_large_image" />
    </Helmet>
  )
}

export default SEOHead;