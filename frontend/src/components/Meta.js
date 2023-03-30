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
    title: 'Bienvenido | Home',
    description: 'Vendemos los mejores productos para vos',
    keywords: 'electronica, comprar articulos de electronica, articulos electronicos baratos'
}

export default Meta;