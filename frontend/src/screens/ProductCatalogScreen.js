import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import Product from '../components/Product';
import { listProducts } from '../actions/productActions';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { Link, useParams } from 'react-router-dom';
import Paginate from '../components/Paginate';
import Meta from '../components/Meta';

const ProductCatalogScreen = () => {

  const dispatch = useDispatch();
  const params = useParams();
  const keyword = params.keyword;
  const pageNumber = params.pageNumber || 1;

  const productList = useSelector(state => state.productList);
  const { 
    loading, 
    error, 
    products, 
    pages,
    page
  } = productList;

  useEffect(() => {
    dispatch(listProducts(keyword, pageNumber))
  }, [dispatch, keyword, pageNumber])

  return (
    <>
      <Meta 
        title={'El promesero | ALFAJORES'}  
      />
      <h1 className='font-extrabold mt-4'>Alfajores</h1>
      <span className="flex items-center text-sm font-medium text-gray-900 me-3"><span className="flex w-2.5 h-2.5 bg-blue-600 rounded-full me-1.5 flex-shrink-0"></span><i>Podes comprar solo hasta <b>40 unidades</b> por caja</i></span>
      { loading 
        ? (<Loader />) 
        : error 
          ? (<Message variant='danger'>{error}</Message>) 
          : (
            <>
              <Row>
                {products.map(product => (
                  <Col 
                    key={product._id} 
                    sm={12} 
                    md={3}  // Cambié de 2 a 3 para que ocupe más espacio y puedas tener más productos por fila
                    lg={3}  // En pantallas grandes también mostrará 4 productos por fila
                  >
                    <Product product={product} />
                  </Col>
                ))}
              </Row>
              <Paginate 
                pages={pages}
                page={page}
                keyword={keyword ? keyword : ''}
                language="es"
              />
            </>
          ) }
      
    </>
  )
}


export default ProductCatalogScreen