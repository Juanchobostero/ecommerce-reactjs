import React, { useState } from 'react';
import { Card, Modal, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import EditQuantity from "./EditQuantity"
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { addToCart } from '../actions/cartActions';

const Product = ({ product }) => {
  const [showModal, setShowModal] = useState(false);
  const [showModalCart, setShowModalCart] = useState(false);
  const [qty, setQty] = useState(1);

  const userLogin = useSelector(state => state.userLogin);
  const { userInfo } = userLogin;

  const dispatch = useDispatch();

  const handleShow = () => setShowModal(true);
  const handleShowModalCart = () => setShowModalCart(true);

  const handleClose = () => setShowModal(false);
  const handleCloseModalCart = () => setShowModalCart(false);

  const handleQty = (newQty) => {
    if (newQty <= 0) {
      setQty(1); // No permite valores negativos
    } else {
      setQty(newQty); // Actualiza el estado del padre
    }
  };

  const handleAddToCart = () => {
    if(qty >= product.countInStock) {
      Swal.fire({
        title: 'Error!',
        text: 'La cantidad es Mayor a la del Stock Disponible',
        icon: 'error',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#d97706'
      })
      return
    }

    dispatch(addToCart(product._id, qty))

    Swal.fire({
      title: "OK!",
      text: `Se ha actualizado tu Carrito`,
      confirmButtonText: "Ok",
      confirmButtonColor: '#d97706'
    });
    return
  };

  
  

  return (
    <>
      <Card className="custom-card my-3 py-1 rounded bg-amber-100">
        <div className={`${userInfo && 'relative '}cursor-pointer`}>
          <Card.Img
            className="custom-card-img"
            src={product.image}
            variant="top"
          />
          {
            userInfo 
              && (<button
                onClick={handleShow} 
                type="button" 
                className="absolute bottom-1 right-1 text-white bg-amber-700 hover:bg-amber-800 focus:ring-4 focus:outline-none focus:ring-amber-300 font-medium rounded-sm text-sm p-1 text-center inline-flex items-center dark:bg-amber-600 dark:hover:bg-amber-700 dark:focus:ring-amber-800"
              >
                <svg
                  className="w-6 h-6 text-gray-800 dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeWidth="2"
                    d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z"
                  />
                  <path
                    stroke="currentColor"
                    strokeWidth="2"
                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
              </button>
              ) 
                
          }
          
        </div>
        <Card.Body className="custom-card-body">
          <Link to={`/product/${product._id}`}>
            <Card.Title as="div" className="custom-card-title">
              <strong className="text-amber-950">{product.name}</strong>
            </Card.Title>
          </Link>
          <Card.Text as="h3" className="custom-card-price">
            ${product.price}
          </Card.Text>
          <Card.Title as="div" className="mt-[-1rem] p-1">
            {
              !userInfo 
                ? (
                  <button
                    onClick={handleShow} 
                    type="button" 
                    className=" text-white bg-amber-700 hover:bg-amber-800 focus:ring-4 focus:outline-none focus:ring-amber-300 font-medium rounded-sm text-sm p-1 text-center inline-flex items-center dark:bg-amber-600 dark:hover:bg-amber-700 dark:focus:ring-amber-800"
                  >
                  <svg
                    className="w-6 h-6 text-gray-800 dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      strokeWidth="2"
                      d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z"
                    />
                    <path
                      stroke="currentColor"
                      strokeWidth="2"
                      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </svg>
              </button>
              ) : (
                <>
                  <EditQuantity qty={qty} onQtyChange={handleQty}/>
                  <button
                      onClick={handleAddToCart} 
                      type="button" 
                      className=" text-white bg-green-400 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-sm text-sm p-1 text-center inline-flex items-center me-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                  >
                      <svg class="w-8 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4h1.5L8 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm.75-3H7.5M11 7H6.312M17 4v6m-3-3h6"/>
                      </svg>
                  </button>
                </>
              ) }
            
            </Card.Title>
        </Card.Body>
      </Card>

      {/* Modal */}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title><h1>{product.name}</h1></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img
            src={product.image}
            alt={product.name}
            style={{ width: '100%', height: '300px', borderRadius: '8px' }}
          />
          <h1>
            ${product.price}
          </h1>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
          <Button variant="primary" className='bg-amber-700' as={Link} to={`/product/${product._id}`}>
            Ver Más
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showModalCart} onHide={handleCloseModalCart} centered>
        <Modal.Header closeButton>
          <Modal.Title><h1>{product.name}</h1></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h3>Seleccionar Cantidad</h3>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModalCart}>
            Cerrar
          </Button>
          <Button variant="primary" className='bg-amber-700' as={Link} to={`/product/${product._id}`}>
            Agregar al Carrito
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Product;
