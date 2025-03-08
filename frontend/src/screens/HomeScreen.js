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
import { FloatingWhatsApp } from 'react-floating-whatsapp';

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

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const cards = [
    <div key="1" className="p-3">
      <img
        src={'/images/primera.jpeg'}
        alt="noticia alfajores principal"
        style={{ width: '100%', maxHeight: '150px', objectFit: 'cover'}}
      />
      <h1 className='font-source font-extrabold mt-1'>NOTICIA #1</h1>
      <p className="text-gray-600">Tenemos los mejores y mas ricos Alfajores para vos.</p>
    </div>,
    <div key="2" className="p-3">
      <img
        src={'/images/primera.jpeg'}
        alt="noticia alfajores principal"
        style={{ width: '100%', maxHeight: '150px', objectFit: 'cover'}}
      />
      <h1 className='font-source font-extrabold mt-1'>NOTICIA #2</h1>
      <p className="text-gray-600">Tenemos los mejores y mas ricos Alfajores para vos.</p>
    </div>,
    <div key="3" className="p-3">
      <img
        src={'/images/primera.jpeg'}
        alt="noticia alfajores principal"
        style={{ width: '100%', maxHeight: '150px', objectFit: 'cover'}}
      />
      <h1 className='font-source font-extrabold mt-1'>NOTICIA #3</h1>
      <p className="text-gray-600">Tenemos los mejores y mas ricos Alfajores para vos.</p>
    </div>,
    <div key="4" className="p-3">
      <img
        src={'/images/primera.jpeg'}
        alt="noticia alfajores principal"
        style={{ width: '100%', maxHeight: '150px', objectFit: 'cover'}}
      />
      <h1 className='font-source font-extrabold mt-1'>NOTICIA #4</h1>
      <p className="text-gray-600">Tenemos los mejores y mas ricos Alfajores para vos.</p>
    </div>,
    <div key="5" className="p-3">
      <img
        src={'/images/primera.jpeg'}
        alt="noticia alfajores principal"
        style={{ width: '100%', maxHeight: '150px', objectFit: 'cover'}}
      />
      <h1 className='font-source font-extrabold mt-1'>NOTICIA #5</h1>
      <p className="text-gray-600">Tenemos los mejores y mas ricos Alfajores para vos.</p>
  </div>,
  ];

  useEffect(() => {
    console.log('PROCESS', process.env.REACT_APP_URI_API_PRODUCTION);
  }, [dispatch, keyword, pageNumber]);

  return (
    <div className='font-source'>
      <Meta />
      <Carousel slides={cards} className="shadow-2xl" />
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

              {!userInfo && (
                <div className="relative">
                  {/* WhatsApp Floating Button */}
                  <div
                    className="fixed bottom-4 right-4 z-[1000]"
                      //onClick={() => setShowTooltip(false)}
                    // onMouseLeave={() => setShowTooltip(false)}
                  >
                    <FloatingWhatsApp
                      phoneNumber="+543794921315"
                      accountName="EL PROMESERO"
                      avatar="/images/logo2.png"
                      statusMessage="Normalmente respondo en unos minutos"
                      chatMessage="¡Hola! ¿Querés un Usuario para Comprar?"
                      notification={false}
                    />
                  </div>
              </div>
              )}
              
            </>
          ) }
      
    </div>
  )
}


export default HomeScreen