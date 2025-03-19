import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, ListGroup } from 'react-bootstrap';
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

  const [userLogged, setUserLogged] = useState(false)

  const productList = useSelector(state => state.productList);
  const { 
    loading, 
    error, 
    products, 
    pages,
    page
  } = productList;

  const userLogin = useSelector(state => state.userLogin)
  const { userInfo } = userLogin

  useEffect(() => {
    dispatch(listProducts(keyword, pageNumber))
  }, [dispatch, keyword, pageNumber])

  useEffect(() => {
    if(userInfo && userInfo.name) {
      setUserLogged(true)
    } else {
      setUserLogged(false)
    }
  }, [])

  return (
    <>
      <Meta 
        title={'El Promesero | ALFAJORES'}  
      />
      { loading 
        ? (<Loader />) 
        : error 
          ? (<Message variant='danger'>{error}</Message>) 
          : (
            <>
              <ListGroup.Item className='mt-8 mb-8 bg-amber-950 rounded-md py-2 px-10'>
                <div class="relative h-full w-full bg-slate-950"></div>
                <div class="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#3e3e3e,transparent)]"></div>
                <Row className='flex flex-col'>
                  <span className='text-3xl font-source text-amber-100 mt-2'>Nuestros Productos</span>
                  <span className="flex items-center text-sm font-source text-amber-100 mt-2">
                  ℹ️ <i>Podes comprar solo hasta <b>20 unidades</b> por caja</i></span>
                </Row>
                <Row>
                  {products.map(product => (
                    <Col 
                      key={product._id} 
                      sm={12} 
                      md={3}  // Cambié de 2 a 3 para que ocupe más espacio y puedas tener más productos por fila
                      lg={3}  // En pantallas grandes también mostrará 4 productos por fila
                    >
                      <Product userLogged={userLogged} product={product} />
                    </Col>
                  ))}
                </Row>
                <Paginate 
                  pages={pages}
                  page={page}
                  keyword={keyword ? keyword : ''}
                  language="es"
                />
              </ListGroup.Item>
              
            </>
          ) }
      
    </>
  )
}


export default ProductCatalogScreen