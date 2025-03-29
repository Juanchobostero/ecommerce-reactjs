import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { Form, Button, Row, Col, Table, ListGroup } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { getUserDetails, updateUserProfile } from '../actions/userActions';
import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants';
import { listMyOrders } from '../actions/orderActions';

const ProfileScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [tel, setTel] = useState(''); // Nuevo estado para el teléfono
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [message, setMessage] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
  const { success } = userUpdateProfile;

  const orderMyList = useSelector((state) => state.orderListMy);
  const { loading: loadingOrders, error: errorOrders, orders } = orderMyList;

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else {
      if (!user || !user.name || success) {
        dispatch({ type: USER_UPDATE_PROFILE_RESET });
        dispatch(getUserDetails('profile'));
        dispatch(listMyOrders());
      } else {
        setName(user.name);
        setEmail(user.email);
        setTel(user.tel); // Cargar el teléfono del usuario
        setAddress(user.address);
        setCity(user.city);
        setPostalCode(user.postalCode);
        setCountry(user.country);
      }
    }
  }, [dispatch, navigate, userInfo, user, success]);

  const submitHandler = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage('Las contraseñas no coinciden !');
    } else {
      dispatch(
        updateUserProfile({
          id: user._id,
          name,
          email,
          tel, // Incluir el teléfono en la actualización
          password,
          address,
          city,
          postalCode,
          country,
        })
      );
    }
  };

  return (
    <div className="mt-4 font-source">
      <Row>
        <Col md={12}>
          <ListGroup.Item className="p-4 bg-white shadow-sm rounded-md">
            <h2 className="font-source font-bold mb-4">Mis Datos</h2>
            {message && <Message variant="danger">{message}</Message>}
            {error && <Message variant="danger">{error}</Message>}
            {success && <Message variant="success">Perfil Actualizado !</Message>}
            {loading && <Loader />}
            <Form onSubmit={submitHandler}>
              <Row>
                <Col md={6}>
                  <Form.Group controlId="name" className="mb-3">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control
                      className="bg-gray-100 border border-gray-600 rounded-md"
                      type="text"
                      placeholder="Ingresar Nombre"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="email" className="mb-3">
                    <Form.Label>Correo</Form.Label>
                    <Form.Control
                      className="bg-gray-100 border border-gray-600 rounded-md"
                      type="email"
                      placeholder="Ingresar Correo"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group controlId="tel" className="mb-3">
                    <Form.Label>Teléfono</Form.Label>
                    <Form.Control
                      className="bg-gray-100 border border-gray-600 rounded-md"
                      type="text"
                      placeholder="Ingresar Teléfono"
                      value={tel}
                      onChange={(e) => setTel(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="address" className="mb-3">
                    <Form.Label>Dirección</Form.Label>
                    <Form.Control
                      className="bg-gray-100 border border-gray-600 rounded-md"
                      type="text"
                      placeholder="Ingresar Dirección"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group controlId="city" className="mb-3">
                    <Form.Label>Ciudad</Form.Label>
                    <Form.Control
                      className="bg-gray-100 border border-gray-600 rounded-md"
                      type="text"
                      placeholder="Ingresar Ciudad"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="postalCode" className="mb-3">
                    <Form.Label>Código Postal</Form.Label>
                    <Form.Control
                      className="bg-gray-100 border border-gray-600 rounded-md"
                      type="text"
                      placeholder="Ingresar Código Postal"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group controlId="country" className="mb-3">
                    <Form.Label>País</Form.Label>
                    <Form.Control
                      className="bg-gray-100 border border-gray-600 rounded-md"
                      type="text"
                      placeholder="Ingresar País"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="password" className="mb-3">
                    <Form.Label>Contraseña</Form.Label>
                    <Form.Control
                      className="bg-gray-100 border border-gray-600 rounded-md"
                      type="password"
                      placeholder="Nueva Contraseña"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group controlId="confirmPassword" className="mb-3">
                    <Form.Label>Confirmar Contraseña</Form.Label>
                    <Form.Control
                      className="bg-gray-100 border border-gray-600 rounded-md"
                      type="password"
                      placeholder="Repetir Contraseña"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Button
                type="submit"
                variant="primary"
                className="bg-amber-700 mt-2 hover:bg-amber-900 px-4 py-2 rounded-md"
              >
                Actualizar
              </Button>
            </Form>
          </ListGroup.Item>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col md={12}>
          <ListGroup.Item className="p-4 bg-white shadow-sm rounded-md">
            <h2 className="font-source font-bold mb-4">Mis Pedidos</h2>
            {loadingOrders ? (
              <Loader />
            ) : errorOrders ? (
              <Message variant="danger">{errorOrders}</Message>
            ) : (
              <Table striped bordered hover responsive className="table-sm">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>FECHA ALTA</th>
                    <th>TOTAL</th>
                    <th>DESPACHADO</th>
                    <th>ENTREGADO</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td>
                        <b>{order.number}</b>
                      </td>
                      <td>{order.createdAt.substring(0, 10)}</td>
                      <td>${order.totalPrice}</td>
                      <td>
                        {order.isDispatched ? (
                          order.dispatchedAt.substring(0, 10)
                        ) : (
                          <i
                            className="fas fa-times"
                            style={{ color: 'red' }}
                          ></i>
                        )}
                      </td>
                      <td>
                        {order.isDelivered ? (
                          order.deliveredAt.substring(0, 10)
                        ) : (
                          <i
                            className="fas fa-times"
                            style={{ color: 'red' }}
                          ></i>
                        )}
                      </td>
                      <td>
                        <LinkContainer to={`/order/${order._id}`}>
                          <Button className="btn-sm bg-amber-700 hover:bg-amber-900">
                            DETALLES
                          </Button>
                        </LinkContainer>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </ListGroup.Item>
        </Col>
      </Row>
    </div>
  );
};

export default ProfileScreen;