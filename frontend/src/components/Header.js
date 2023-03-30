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
  }
  return (
    <header>
      <Navbar bg="dark" variant='dark' expand="lg" collapseOnSelect>
        <Container>
          <LinkContainer to={'/'}>
            <Navbar.Brand>TU NEGOCIO</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <SearchBox />
              <Nav className="ml-auto">
                <LinkContainer to={'/cart'}>
                  <Nav.Link>
                    <i className='fas fa-shopping-cart'>
                    </i>
                    Carrito
                  </Nav.Link>
                </LinkContainer>
                {userInfo && userInfo.name ? (
                  <NavDropdown
                    title={userInfo.name}
                    id='username'
                  >
                    <LinkContainer to='/profile'>
                        <NavDropdown.Item>
                          Perfil
                        </NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Item onClick={logoutHandler}>
                      Cerrar Sessión
                    </NavDropdown.Item>
                  </NavDropdown>
                ): (
                  <LinkContainer to={'/login'}>
                    <Nav.Link>
                      <i className='fas fa-user'>
                      </i>Login
                    </Nav.Link>
                </LinkContainer>
                )}

                {userInfo && userInfo.isAdmin && (
                  <NavDropdown
                    title='Admin'
                    id='adminmenu'
                  >
                    <LinkContainer to='/admin/userlist'>
                        <NavDropdown.Item>
                          Usuarios
                        </NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to='/admin/productlist'>
                        <NavDropdown.Item>
                          Productos
                        </NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to='/admin/orderlist'>
                        <NavDropdown.Item>
                          Ordenes
                        </NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to='/admin/reports'>
                        <NavDropdown.Item>
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
  )
}

export default Header