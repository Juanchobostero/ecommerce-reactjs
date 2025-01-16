import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { logout } from '../actions/userActions';
import { useNavigate } from 'react-router-dom';
import SearchBox from './SearchBox';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const logoutHandler = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <header>
      <Navbar expand="lg" collapseOnSelect>
        <Container>
          <LinkContainer to={'/'}>
            <Navbar.Brand className="text-gray-800 font-bold">LOGO</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <SearchBox />
            <Nav className="ml-auto">
              <LinkContainer to={'/cart'}>
                <Nav.Link className="text-gray-700 font-semibold hover:text-gray-900">
                  <i className='fas fa-shopping-cart'></i> Carrito
                </Nav.Link>
              </LinkContainer>
              {userInfo && userInfo.name ? (
                <NavDropdown
                  title={
                    <span className="text-gray-700 font-semibold hover:text-gray-900">
                      {userInfo.name}
                    </span>
                  }
                  id='username'
                >
                  <LinkContainer to='/profile'>
                    <NavDropdown.Item className="text-gray-700 font-semibold hover:text-gray-900">
                      Perfil
                    </NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item
                    onClick={logoutHandler}
                    className="text-gray-700 font-semibold hover:text-gray-900"
                  >
                    Cerrar Sesión
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to={'/login'}>
                  <Nav.Link className="text-gray-700 font-semibold hover:text-gray-900">
                    <i className='fas fa-user'></i> Login
                  </Nav.Link>
                </LinkContainer>
              )}

              {userInfo && userInfo.isAdmin && (
                <NavDropdown
                  title={
                    <span className="text-gray-700 font-semibold hover:text-gray-900">
                      Paneles
                    </span>
                  }
                  id='adminmenu'
                >
                  <LinkContainer to='/admin/userlist'>
                    <NavDropdown.Item className="text-gray-700 font-semibold hover:text-gray-900">
                      Usuarios
                    </NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/admin/productlist'>
                    <NavDropdown.Item className="text-gray-700 font-semibold hover:text-gray-900">
                      Productos
                    </NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/admin/orderlist'>
                    <NavDropdown.Item className="text-gray-700 font-semibold hover:text-gray-900">
                      Ordenes
                    </NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/admin/reports'>
                    <NavDropdown.Item className="text-gray-700 font-semibold hover:text-gray-900">
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
