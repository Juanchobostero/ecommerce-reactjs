import React, { useState, useEffect, Fragment } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import { listProductDetails, updateProduct } from '../actions/productActions';
import { PRODUCT_UPDATE_RESET } from '../constants/productConstants';
import axios from 'axios';
import { listProductCategories } from '../actions/productCategoryActions';
import Swal from 'sweetalert2';

const ProductEditScreen = () => {

  const { id: productId } = useParams();

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0); 
  const [image, setImage] = useState('');
  const [code, setCode] = useState('');
  const [discount, setDiscount] = useState('');
  const [category, setCategory] = useState(0);
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const productDetails = useSelector(state => state.productDetails);
  const { loading, error, product } = productDetails;

  const productCategory = useSelector(state => state.productCategory);
  const { categories } = productCategory;

  const productUpdate = useSelector(state => state.productUpdate);
  const { 
    loading: loadingUpdate, 
    error: errorUpdate, 
    success: successUpdate 
} = productUpdate;
  
  useEffect(() => {
    if(successUpdate) {
        dispatch({ type: PRODUCT_UPDATE_RESET });
        navigate('/admin/productlist');
    } else {
        if(!product || product._id !== productId) {
            dispatch(listProductCategories());
            dispatch(listProductDetails(productId));
        } else {
            setName(product.name);
            setPrice(product.price);
            setImage(product.image);
            setCode(product.code);
            setDiscount(product.discount);
            setCategory(product.category);
            setCountInStock(product.countInStock);
            setDescription(product.description);
        }
    }
  }, [dispatch, navigate, productId, product, successUpdate]);

  const submitHandler = (e) => {
    e.preventDefault();

    if(name.length === 0 || name === '') {
        Swal.fire({
            title: 'Error!',
            text: 'El nombre no puede estar vacío !',
            icon: 'error',
            confirmButtonText: 'Ok'
        })
        return;
    }

    if(code.length === 0 || code === 0) {
        Swal.fire({
            title: 'Error!',
            text: 'El campo Marca no puede estar vacío !',
            icon: 'error',
            confirmButtonText: 'Ok'
        })
        return;
    }

    if(description.length === 0 || description === '') {
        Swal.fire({
            title: 'Error!',
            text: 'El campo Descripción no puede estar vacío !',
            icon: 'error',
            confirmButtonText: 'Ok'
        })
        return;
    }

    if(isNaN(price)) {
        Swal.fire({
            title: 'Error!',
            text: 'El precio debe ser un número !',
            icon: 'error',
            confirmButtonText: 'Ok'
        })
        return;
    }

    if(price === 0) {
        Swal.fire({
            title: 'Error!',
            text: 'El precio no puede ser cero !',
            icon: 'error',
            confirmButtonText: 'Ok'
        })
        return;
    }

    if(countInStock <= 0) {
        Swal.fire({
            title: 'Error!',
            text: 'El stock ingresado debe ser mayor a 0 !',
            icon: 'error',
            confirmButtonText: 'Ok'
        })
        return;
    }

    dispatch(updateProduct({
        _id: productId,
        name,
        price,
        image,
        code,
        discount,
        category,
        description,
        countInStock
    }));
  }

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        }

        const { data } = await axios.post('/api/upload', formData, config);

        setImage(data);
        setUploading(false);
    } catch (error) {
        console.log(error);
        setUploading(false);
    }
  }
  
  return (
    <Fragment>
        <Link to='/admin/productlist' className='btn btn-light my-3'>
            VOLVER
        </Link>
        <FormContainer>
        <h1>Editar Producto</h1>
        {loadingUpdate && <Loader />}
        {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
        {loading 
            ? <Loader /> 
            : error 
                ? <Message variant='danger'>{error}</Message> 
                :(<Form onSubmit={submitHandler}>
                    <Form.Group controlId='name'>
                        <Form.Label>Nombre</Form.Label>
                            <Form.Control 
                                type='name' 
                                placeholder='Enter Name' 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                >
                            </Form.Control>
                    </Form.Group>

                    <Form.Group controlId='price'>
                        <Form.Label>Precio</Form.Label>
                        <Form.Control 
                            type='number' 
                            placeholder='Enter price' 
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            >
                            </Form.Control>
                    </Form.Group>

                    <Form.Group controlId='image'>
                        <Form.Label>Imagen</Form.Label>
                            <Form.Control 
                                type='text' 
                                placeholder='Enter image url' 
                                value={image}
                                onChange={(e) => setImage(e.target.value)}
                                >
                            </Form.Control>
                            
                            <Form.Control
                                type='file'
                                onChange={uploadFileHandler}
                            />
                            {uploading && <Loader />}
                    </Form.Group>

                    <Form.Group controlId='code'>
                        <Form.Label>Código</Form.Label>
                            <Form.Control 
                                type='text' 
                                placeholder='Enter brand' 
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                >
                            </Form.Control>
                    </Form.Group>

                    <Form.Group controlId='discount'>
                        <Form.Label>Descuento</Form.Label>
                            <Form.Control 
                                type='text' 
                                placeholder='Enter brand' 
                                value={discount}
                                onChange={(e) => setDiscount(e.target.value)}
                                >
                            </Form.Control>
                    </Form.Group>

                    <Form.Group controlId='countInStock'>
                        <Form.Label>Stock</Form.Label>
                        <Form.Control 
                            type='number' 
                            placeholder='Enter count in stock' 
                            value={countInStock}
                            onChange={(e) => setCountInStock(e.target.value)}
                            >
                            </Form.Control>
                    </Form.Group>


                    <Form.Group controlId='description'>
                        <Form.Label>Descripción</Form.Label>
                            <Form.Control 
                                type='text' 
                                placeholder='Enter description' 
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                >
                            </Form.Control>
                    </Form.Group>

                    <Button type='submit' variant='primary'>
                        CONFIRMAR
                    </Button>
                </Form>
        )}

    </FormContainer>
    </Fragment>
  )
}

export default ProductEditScreen;