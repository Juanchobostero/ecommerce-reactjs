import React from 'react';
import { Pagination } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const Paginate = ({ pages, page, isAdmin = false, keyword = '', language = 'es' }) => {
  // Texto personalizado basado en el idioma
  const currentText = language === 'es' ? 'Página actual' : 'Current'; // Traducción

  return pages > 1 && 
    <Pagination>
        {[...Array(pages).keys()].map(x => (
            <LinkContainer 
                key={x + 1}
                to={ 
                    !isAdmin 
                    ?   keyword 
                            ? `search/${keyword}/page/${x+1}` 
                            : `/catalogo/page/${x+1}`
                    : `/admin/productlist/${x+1}`
                }
            >
                <Pagination.Item 
                    active={x+1 === page}
                >
                    {x+1 === page ? `${currentText}: ${x+1}` : x+1} {/* Condicional para página activa */}
                </Pagination.Item>
            </LinkContainer>
        ))}
    </Pagination>
}

export default Paginate;
