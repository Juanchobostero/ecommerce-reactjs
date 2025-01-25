import React, { useState, useEffect, Fragment } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import { getUserDetails, updateUser } from '../actions/userActions';
import { USER_UPDATE_RESET } from '../constants/userConstants';

const UserEditScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState(''); 
  const [isAdmin, setIsAdmin] = useState(false);

  const { id: userId } = useParams();
  const dispatch = useDispatch();

  const userDetails = useSelector(state => state.userDetails);
  const { loading, error, user } = userDetails;

  const userUpdate = useSelector(state => state.userUpdate);
  const { 
    loading: loadingUpdate, 
    error: errorUpdate, 
    success: successUpdate 
  } = userUpdate;

  const navigate = useNavigate();
  
  useEffect(() => {
    if(successUpdate) {
        dispatch({ type: USER_UPDATE_RESET });
        navigate('/admin/userlist');
    } else {
        if(!user.name || user._id !== userId) {
            dispatch(getUserDetails(userId));
        } else {
            setName(user.name);
            setEmail(user.email);
            setIsAdmin(user.isAdmin);
        }
    }
    
  }, [dispatch, navigate, userId, user, successUpdate]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(updateUser({ _id: userId, name, email, isAdmin }));
  }
  
  return (
    <Fragment>
        <Button className='my-3 bg-amber-700 text-white' onClick={() => navigate(-1)}>
            Volver
        </Button>
        <FormContainer>
        <h1>Editar Usuario</h1>
        {loadingUpdate && <Loader />}
        {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
        {loading 
            ? <Loader /> 
            : error 
                ? <Message variant='danger'>{error}</Message> 
                :(<Form onSubmit={submitHandler}>
                    <Form.Group controlId='name' className='mb-3'>
                        <Form.Control 
                            type='name' 
                            placeholder='Ingresar Nombre' 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            >
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId='email' className='mb-3'>
                        <Form.Control 
                            type='email' 
                            placeholder='Ingresar Correo' 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            >
                            </Form.Control>
                    </Form.Group>

                    <Form.Group controlId='isadmin'  className='mb-3 text-white font-bold'>
                        <Form.Check 
                            type='checkbox' 
                            label='Es Administrador' 
                            checked={isAdmin}
                            onChange={(e) => setIsAdmin(e.target.checked)}
                            >
                        </Form.Check>
                    </Form.Group>

                    <Button 
                        type='submit' 
                        className='btn btn-block bg-amber-600 mt-4'
                    >
                        Actualizar
                    </Button>
                </Form>
        )}

    </FormContainer>
    </Fragment>
  )
}

export default UserEditScreen;