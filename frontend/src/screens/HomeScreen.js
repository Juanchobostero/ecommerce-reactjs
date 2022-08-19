import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import Product from '../components/Product';
import { listProducts } from '../actions/productActions';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { Link, useParams } from 'react-router-dom';
import Paginate from '../components/Paginate';
import ProductCarousel from '../components/ProductCarousel';
import Meta from '../components/Meta';

const HomeScreen = () => {

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
    dispatch(listProducts(keyword, pageNumber));
  }, [dispatch, keyword, pageNumber]);

  return (
    <>
      <Meta />
      {!keyword ? <ProductCarousel /> : <Link to='/' className='btn btn-light'>Go Back</Link>}
      <br></br>
      <h1>Latest Products</h1>
      { loading 
        ? (<Loader />) 
        : error 
          ? (<Message variant='danger'>{error}</Message>) 
          : (
            <>
              <Row>
                { products.map(product => (
                    <Col 
                      key={product._id} 
                      sm={12} 
                      md={6} 
                      lg={4}
                    >
                        <Product product={product}/>
                    </Col>
                )) } 
              </Row>
              <Paginate 
                pages={pages}
                page={page}
                keyword={keyword ? keyword : ''}
              />
            </>
          ) }
      
    </>
  )
}

export default HomeScreen