import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { Link, useParams } from 'react-router-dom';
import Carousel from '../components/Carousel';
import Meta from '../components/Meta';
import ComprarButton from '../components/ComprarButton';
import About from '../components/About';
import Location from '../components/Location';

const HomeScreen = () => {

  const dispatch = useDispatch()
  const params = useParams()
  const keyword = params.keyword;
  const pageNumber = params.pageNumber || 1

  const productList = useSelector(state => state.productList)
  const { 
    loading, 
    error, 
  } = productList

  const cards = [
    <div key="1" className="p-6">
      <img
        src={'/images/primera.jpeg'}
        alt="noticia alfajores principal"
        style={{ width: '100%', maxHeight: '150px', objectFit: 'cover'}}
      />
      <h3>No te los podes perder</h3>
      <p className="text-gray-600">Tenemos los mejores y mas ricos Alfajores para vos.</p>
    </div>,
    <div key="2" className="p-6">
      <img
        src={'/images/primera.jpeg'}
        alt="noticia alfajores principal"
        style={{ width: '100%', maxHeight: '150px', objectFit: 'cover'}}
      />
      <h3>No te los podes perder</h3>
      <p className="text-gray-600">Tenemos los mejores y mas ricos Alfajores para vos.</p>
    </div>,
    <div key="3" className="p-6">
      <img
        src={'/images/primera.jpeg'}
        alt="noticia alfajores principal"
        style={{ width: '100%', maxHeight: '150px', objectFit: 'cover'}}
      />
      <h3>No te los podes perder</h3>
      <p className="text-gray-600">Tenemos los mejores y mas ricos Alfajores para vos.</p>
    </div>,
    <div key="4" className="p-6">
      <img
        src={'/images/primera.jpeg'}
        alt="noticia alfajores principal"
        style={{ width: '100%', maxHeight: '150px', objectFit: 'cover'}}
      />
      <h3>No te los podes perder</h3>
      <p className="text-gray-600">Tenemos los mejores y mas ricos Alfajores para vos.</p>
    </div>,
    <div key="5" className="p-6">
      <img
        src={'/images/primera.jpeg'}
        alt="noticia alfajores principal"
        style={{ width: '100%', maxHeight: '150px', objectFit: 'cover'}}
      />
      <h3>No te los podes perder</h3>
      <p className="text-gray-600">Tenemos los mejores y mas ricos Alfajores para vos.</p>
  </div>,
  ];

  useEffect(() => {
    console.log('PROCESS', process.env.REACT_APP_URI_API_PRODUCTION);
  }, [dispatch, keyword, pageNumber]);

  return (
    <>
      <Meta />
      {!keyword ? <Carousel cards={cards} /> : <Link to='/' className='btn btn-light'>Volver</Link>}
      <br></br>
      { loading 
        ? (<Loader />) 
        : error 
          ? (<Message variant='danger'>{error}</Message>) 
          : (
            <>
              <Row className="justify-content-center align-items-center">
                  <ComprarButton />
              </Row>
              <Row className="justify-content-center align-items-center">
                <About />
              </Row>
              <Row className="justify-content-center align-items-center">
                  <Location />
              </Row>
            </>
          ) }
      
    </>
  )
}


export default HomeScreen