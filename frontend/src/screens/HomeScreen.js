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
import TopButton from '../components/TopButton';

const HomeScreen = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const keyword = params.keyword;
  const pageNumber = params.pageNumber || 1;

  const productList = useSelector(state => state.productList);
  const { loading, error } = productList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  // Scroll to top functionality
  const topFunction = () => {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE, and Opera
  };

  // Handle scroll visibility of the button
  useEffect(() => {
    const mybutton = document.querySelector("#myBtn");
    const scrollFunction = () => {
      if (mybutton) {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
          mybutton.style.display = "block";
        } else {
          mybutton.style.display = "none";
        }
      }
    };

    // Add event listener for scroll
    window.addEventListener('scroll', scrollFunction);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('scroll', scrollFunction);
    };
  }, []); // Empty dependency array to run once after the initial render

  const cards = [
    <div key="1" className="p-3">
      <img
        src={'/images/primera.jpeg'}
        alt="noticia alfajores principal"
        style={{ width: '100%', maxHeight: '150px', objectFit: 'cover' }}
      />
      <h1 className='font-source font-extrabold mt-1'>NOTICIA #1</h1>
      <p className="text-gray-600">Tenemos los mejores y mas ricos Alfajores para vos.</p>
    </div>,
    // Other cards
  ];

  return (
    <div className='font-source'>
      <Meta />
      <Carousel slides={cards} className="shadow-2xl" />
      <br></br>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
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
          <div className="relative">
            <div className="fixed bottom-4 right-4 z-[10]">
              <FloatingWhatsApp
                className={`${userInfo && userInfo.name ? 'hidden' : 'block'}`}
                phoneNumber="+543795004254"
                accountName="EL PROMESERO"
                avatar="/images/logo2.png"
                statusMessage="Normalmente respondo en unos minutos"
                chatMessage="¡Hola! ¿Querés un Usuario para Comprar?"
                notification={false}
              />
            </div>

            <button
              className="bg-amber-950 hover:bg-amber-600 fixed right-4 z-[20] p-1"
              id="myBtn"
              title="Go to top"
              onClick={topFunction}
              style={{
                bottom: '100px',
                marginRight: '0.5rem',
                width: '50px',  
                height: '50px', 
                borderRadius: '50%',
              }}
            >
              <i className="fas fa-arrow-up"></i>
            </button>
          </div>


        </>
      )}
    </div>
  );
};

export default HomeScreen;
