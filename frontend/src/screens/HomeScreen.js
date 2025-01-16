import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import Product from '../components/Product';
import { listProducts } from '../actions/productActions';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { Link, useParams } from 'react-router-dom';
import Paginate from '../components/Paginate';
import Carousel from '../components/Carousel';
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

  const cards = [
    <div key="1" className="p-6">
      <h3 className="text-xl font-bold mb-2">Card 1</h3>
      <p className="text-gray-600">This is the first card with some content.</p>
    </div>,
    <div key="2" className="p-6">
      <h3 className="text-xl font-bold mb-2">Card 2</h3>
      <p className="text-gray-600">Here's the second card with different content.</p>
    </div>,
    <div key="3" className="p-6">
      <h3 className="text-xl font-bold mb-2">Card 3</h3>
      <p className="text-gray-600">And this is the third card in our carousel.</p>
    </div>,
    <div key="4" className="p-6">
      <h3 className="text-xl font-bold mb-2">Card 4</h3>
      <p className="text-gray-600">The fourth card shows how the carousel loops.</p>
    </div>,
  ];

  useEffect(() => {
    console.log('PROCESS', process.env.REACT_APP_URI_API_PRODUCTION);
    dispatch(listProducts(keyword, pageNumber));
  }, [dispatch, keyword, pageNumber]);

  return (
    <>
      <Meta />
      {!keyword ? <Carousel cards={cards} /> : <Link to='/' className='btn btn-light'>Volver</Link>}
      <br></br>
      <h1>Últimos Productos</h1>
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