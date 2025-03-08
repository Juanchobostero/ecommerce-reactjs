import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { logout } from '../actions/userActions';
import { useNavigate } from 'react-router-dom';
import SearchBox from './SearchBox';

const Header = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const cart = useSelector((state) => state.cart)
  const { cartItems } = cart

  const logoutHandler = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <header className="relative">
      <div className="absolute inset-0 bg-black bg-opacity-30 z-10"></div>
      <Navbar className="z-20" expand="lg" collapseOnSelect>
        <Container>
        <LinkContainer to={'/'}>
          <Navbar.Brand>
            <img 
              src="/images/logo2.png" 
              alt="Logo" 
              className="h-auto w-auto transition-transform duration-300 ease-in-out hover:scale-110 hover:opacity-80"
              style={{ maxHeight: '70px' }}
            />
          </Navbar.Brand>
        </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto nav-elem relative z-20">
            <LinkContainer to="/catalogo">
              <Nav.Link
                className="ubuntu text-white font-semibold hover:opacity-80 transition-opacity duration-300"
              >
                Productos
              </Nav.Link>
            </LinkContainer>
            {userInfo && userInfo.name && (
              <LinkContainer to="/cart">
              <Nav.Link
                className="ubuntu relative text-white font-semibold hover:opacity-80 transition-opacity duration-300"
              >
                <div className="relative inline-block">
                  {/* Icono del carrito */}
                  <i className="fas fa-shopping-cart"></i>

                  {/* Badge con la cantidad de items */}
                  {(cartItems && cartItems.length > 0) && (
                    <span className="absolute top-0 right-4 transform translate-x-1/2 -translate-y-1/2 px-2 py-1 text-xs font-bold text-white bg-green-600 rounded-full">
                      {cartItems.reduce((acc, item) => acc + (item.qty || 0), 0)}
                    </span>
                  )}
                </div>
                Carrito 
              </Nav.Link>
            </LinkContainer>)}
            {userInfo && userInfo.name ? (
              <NavDropdown
                title={
                  <span className="ubuntu text-white font-semibold hover:opacity-80 transition-opacity duration-300">
                    {userInfo.name}
                  </span>
                }
                id="username"
                menuVariant="dark" // Cambia el tema del menú desplegable a oscuro
              >
                <LinkContainer to="/profile">
                  <NavDropdown.Item
                    className="ubuntu bg-amber-950 text-white font-semibold hover:bg-amber-600 hover:opacity-90 transition-all duration-300"
                  >
                    Perfil
                  </NavDropdown.Item>
                </LinkContainer>
                <NavDropdown.Item
                  onClick={logoutHandler}
                  className="ubuntu bg-amber-950 text-white font-semibold hover:bg-amber-600 hover:opacity-90 transition-all duration-300"
                >
                  Cerrar Sesión
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <LinkContainer to="/login">
                <Nav.Link
                  className="ubuntu text-white font-semibold hover:opacity-80 transition-opacity duration-300"
                >
                  <i className="fas fa-user"></i> Login
                </Nav.Link>
              </LinkContainer>
            )}

            {userInfo && userInfo.isAdmin && (
              <NavDropdown
                title={
                  <span className="ubuntu text-white font-semibold hover:opacity-80 transition-opacity duration-300">
                    Paneles
                  </span>
                }
                id="adminmenu"
                menuVariant="dark" // Cambia el tema del menú desplegable a oscuro
              >
                <LinkContainer to="/admin/userlist">
                  <NavDropdown.Item
                    className="ubuntu bg-amber-950 text-white font-semibold hover:bg-amber-600 hover:opacity-90 transition-all duration-300"
                  >
                    Usuarios
                  </NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/admin/productlist">
                  <NavDropdown.Item
                    className="ubuntu bg-amber-950 text-white font-semibold hover:bg-amber-600 hover:opacity-90 transition-all duration-300"
                  >
                    Productos
                  </NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/admin/orderlist">
                  <NavDropdown.Item
                    className="ubuntu bg-amber-950 text-white font-semibold hover:bg-amber-600 hover:opacity-90 transition-all duration-300"
                  >
                    Pedidos
                  </NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/admin/reports">
                  <NavDropdown.Item
                    className="ubuntu bg-amber-950 text-white font-semibold hover:bg-amber-600 hover:opacity-90 transition-all duration-300"
                  >
                    Reportes
                  </NavDropdown.Item>
                </LinkContainer>
              </NavDropdown>
            )}
          </Nav>


          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
