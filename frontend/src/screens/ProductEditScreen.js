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

    if(code === 0) {
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
        const url = process.env.NODE_ENV === 'development' 
            ? 'http://localhost:5000' 
            : process.env.REACT_APP_URI_API_PRODUCTION

        const { data } = await axios.post(`${url}/api/upload`, formData, config);

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
                        <div className="flex flex-col items-center justify-center w-full">
                            <label
                                htmlFor="dropzone-file"
                                className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                            >
                                <div className="flex flex-col items-center justify-center">
                                <svg
                                    className="w-6 h-6 mb-2 text-gray-500 dark:text-gray-400"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 20 16"
                                >
                                    <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                    />
                                </svg>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    <span className="font-semibold">Click para Cargar Archivo</span> o Arrastrar y Soltar
                                </p>
                                </div>
                                <input
                                id="dropzone-file"
                                type="file"
                                className="hidden"
                                onChange={uploadFileHandler}
                                />
                            </label>

                            {/* Campo de texto adicional para la URL de la imagen */}
                            <div className="w-full mt-2">
                                {/* Texto de la ruta debajo del input */}
                                {image && (
                                <p className="text-xs text-gray-500 mt-1 truncate">
                                    <span className="bg-blue-100 text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">Ruta actual: {image}</span>
                                </p>
                                )}
                            </div>
                            </div>
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