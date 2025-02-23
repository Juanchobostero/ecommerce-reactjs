import React from 'react';
import { Helmet } from 'react-helmet';

const Meta = ({ title, description, keywords }) => {
  return (
    <Helmet>
        <title>{title}</title>
        <meta name='description' content={description}/>
        <meta name='keywords' content={keywords}/>
    </Helmet>
  )
}

Meta.defaultProps = {
    title: 'El Promesero | INICIO',
    description: 'Vendemos los mejores alfajores para vos',
    keywords: 'Alfajores, comprar alfajores, alfajores ricos'
}

export default Meta;