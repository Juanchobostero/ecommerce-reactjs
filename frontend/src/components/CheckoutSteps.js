import React from 'react'
import { Nav } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

const CheckoutSteps = ({ step1, step2 }) => {
  return (
    <Nav className='justify-content-center my-6'>
      <Nav.Item>
        {step1 ? (
          <LinkContainer to='/shipping'>
            <Nav.Link className='bg-amber-700 no-underline hover:opacity-50 transition-all'>
            <span className='text-amber-100'>Envío</span></Nav.Link>
          </LinkContainer>
        ) : (
            <Nav.Link className='disabled no-underline text-amber-300'>Envío</Nav.Link>
        )}
      </Nav.Item>
      <Nav.Item>
        {step2 ? (
          <LinkContainer to='/placeorder'>
            <Nav.Link className='bg-amber-700 no-underline hover:opacity-50 transition-all'>
            <span className='text-amber-100'>Realizar Pedido</span></Nav.Link>
          </LinkContainer>
        ) : (
            <Nav.Link className='bg-gray-500 disabled no-underline'>
                <span className='text-white'>
                    Realizar Pedido
                </span>
            </Nav.Link>
        )}
      </Nav.Item>
    </Nav>
  );
};

export default CheckoutSteps