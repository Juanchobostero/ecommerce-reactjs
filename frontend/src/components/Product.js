import React, { useState } from 'react'
import { Card, Modal, Button, Form } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Swal from 'sweetalert2'
import { addToCart } from '../actions/cartActions'

const Product = ({ userLogged, product }) => {
  const [showModal, setShowModal] = useState(false)
  const [qty, setQty] = useState(1)

  const cart = useSelector((state) => state.cart)
  const { cartItems } = cart

  const dispatch = useDispatch();

  const handleShow = () => setShowModal(true)
  const handleClose = () => setShowModal(false)

  const handleAddToCart = () => {
    const existingCartItem = cartItems.find((item) => item.product === product._id);
    const currentQtyInCart = existingCartItem ? existingCartItem.qty : 0;
    const totalQty = currentQtyInCart + qty;

    if (totalQty > product.countInStock) {
      Swal.fire({
        title: 'Error!',
        text: `🚨 Stock insuficiente.`,
        icon: 'error',
        confirmButtonText: 'Ok',
        background: '#fff',
        customClass: {
          title: 'font-source',
          popup: 'font-source',
        }
      });
      return;
    }

    dispatch(addToCart(product._id, qty, false)); // 👈 Importante: enviar `replace` como `false` para sumar la cantidad

    Swal.fire({
      title: "✅",
      text: "Se ha actualizado tu Carrito",
      confirmButtonText: "OK",
      confirmButtonColor: '#b45309',
      background: '#fff',
      customClass: {
        title: 'font-source',
        popup: 'font-source',
      }
    });
  };

  return (
    <>
      <Card className="custom-card my-8 py-2 bg-white">
        <div className={`${userLogged && 'relative '}cursor-pointer`}>
          <Card.Img
            className="custom-card-img cursor-pointer"
            src={product.image}
            variant="top"
          />
          { userLogged
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

          {
            (product.discount > 0) && (
              <button
                type="button" 
                className=" cursor-pointer absolute bottom-1 left-1 text-white bg-amber-950 hover:bg-amber-800 focus:ring-4 focus:outline-none focus:ring-amber-300 font-medium rounded-sm text-sm p-1 text-center inline-flex items-center dark:bg-amber-950 dark:hover:bg-amber-700 dark:focus:ring-amber-800"
              >
                {product.discount} % OFF
              </button>
            )
          }
          
        </div>
        <Card.Body className="custom-card-body">
          <Link to={`/product/${product._id}`}>
            <Card.Title as="div" className="custom-card-title">
              <strong className="font-source text-amber-950">{product.name}</strong>
            </Card.Title>
          </Link>

          {/* Mostrar el precio con descuento si existe */}
          <Card.Text as="h3" className="font-source custom-card-price">
            {product.discount > 0 ? (
              <>
                <span className="text-gray-500 line-through text-lg mr-2">
                  ${product.price}
                </span>
                <span className="text-amber-600 text-xl font-bold">
                  ${product.price - (product.price * product.discount) / 100}
                </span>
              </>
            ) : (
              <span>${product.price}</span>
            )}
          </Card.Text>

          <Card.Title as="div" className="mt-[-1rem] p-1">
            {!userLogged ? (
              <button
                onClick={handleShow}
                type="button"
                className="text-white bg-amber-700 hover:bg-amber-800 focus:ring-4 focus:outline-none focus:ring-amber-300 font-medium rounded-sm text-sm p-1 text-center inline-flex items-center dark:bg-amber-600 dark:hover:bg-amber-700 dark:focus:ring-amber-800"
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
                <div className="font-source flex flex-row gap-2">
                  <Form.Control
                    as="select"
                    value={qty}
                    onChange={(e) => setQty(Number(e.target.value))}
                    className="w-full md:w-28 h-10"
                  >
                    {[...Array(Number(product.countInStock)).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </Form.Control>
                  <button
                    onClick={handleAddToCart}
                    type="button"
                    className="text-white bg-green-400 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-sm text-sm p-1 text-center inline-flex items-center me-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                  >
                    <svg
                      className="w-8 h-6 text-gray-800 dark:text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 4h1.5L8 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm.75-3H7.5M11 7H6.312M17 4v6m-3-3h6"
                      />
                    </svg>
                  </button>
                </div>
              </>
            )}
          </Card.Title>
        </Card.Body>

      </Card>

      {/* Modal */}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title><h1 className='text-amber-700'>{product.name}</h1></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img
            src={product.image}
            alt={product.name}
            style={{ width: '100%', maxHeight: '270px', objectFit: 'cover'}}
          />
          <h1 className='mt-3 text-amber-700'>
            Precio: ${product.price}
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
    </>
  );
};

export default Product;