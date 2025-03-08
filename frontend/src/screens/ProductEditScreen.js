import React, { useState, useEffect, Fragment } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button, ListGroup } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import { createProduct, listProductDetails, updateProduct } from '../actions/productActions';
import { PRODUCT_CREATE_RESET, PRODUCT_UPDATE_RESET } from '../constants/productConstants';
import axios from 'axios';
import Swal from 'sweetalert2';

const ProductEditScreen = () => {
  const { id: productId } = useParams();

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [code, setCode] = useState('');
  const [discount, setDiscount] = useState('');
  const [countInStock, setCountInStock] = useState('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null)

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error, product } = useSelector(state => state.productDetails);

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const { 
    loading: loadingUpdate, 
    error: errorUpdate, 
    success: successUpdate 
  } = useSelector(state => state.productUpdate);
  const { 
    loading: loadingCreate, 
    error: errorCreate, 
    success: successCreate 
  } = useSelector(state => state.productCreate);

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: PRODUCT_UPDATE_RESET })
      navigate('/admin/productlist')
    } else if(successCreate) { 
        dispatch({ type: PRODUCT_CREATE_RESET })
        navigate('/admin/productlist')
    } 
    else{
      if (productId) {
        if (!product || product._id !== productId) {
          dispatch(listProductDetails(productId));
        } else {
          setName(product.name);
          setPrice(product.price);
          setImage(product.image);
          setCode(product.code);
          setDiscount(product.discount);
          setCountInStock(product.countInStock);
          setDescription(product.description);
        }
      }
    }
  }, [dispatch, navigate, productId, product, successUpdate, successCreate]);
  

  const validateFields = () => {
    if (!String(name).trim()) return 'El nombre no puede estar vacío';
    if (!String(code).trim()) return 'El campo Código no puede estar vacío';
    if (!String(description).trim()) return 'El campo Descripción no puede estar vacío';
    if (price <= 0) return 'El precio debe ser un número mayor a 0'
    if (countInStock <= 0) return 'El stock ingresado debe ser mayor a 0';
    return null;
  };
  

  const submitHandler = (e) => {
    e.preventDefault();
    const errorMsg = validateFields();
    if (errorMsg) {
      Swal.fire({ title: 'Error!', text: errorMsg, icon: 'error', confirmButtonText: 'Ok' });
      return;
    }
  
    const productData = {
      name,
      user: userInfo._id,
      price: Number(price),
      image,
      code,
      discount: Number(discount),
      description,
      countInStock: Number(countInStock),
    };
  
    if (productId) {
      dispatch(updateProduct({
        _id: productId,
        ...productData
      }));
    } else {
      dispatch(createProduct(productData));
    }
  };
  

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    // Crear una URL temporal para la vista previa
    setPreviewImage(URL.createObjectURL(file));
  
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);
  
    try {
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      const url = process.env.NODE_ENV === 'development'
        ? 'http://localhost:5000'
        : process.env.REACT_APP_URI_API_PRODUCTION;
  
      const { data } = await axios.post(`${url}/api/upload`, formData, config);
      setImage(data);
    } catch (error) {
      console.error('Error al subir la imagen', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Fragment>
      <Button 
        className='my-3 bg-amber-700 hover:bg-amber-600 text-white' 
        onClick={() => navigate(-1)}
      >
        Volver
      </Button>
      <ListGroup.Item className='bg-white mb-8'>
        <FormContainer>
          <h1>{productId ? 'Editar Producto' : 'Crear Producto' }</h1>
          {loadingUpdate && <Loader />}
          {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
          {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : (
            <Form onSubmit={submitHandler} className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <Form.Group>
                <Form.Label>Nombre</Form.Label>
                <Form.Control 
                  className='h-8 border-solid rounded-sm border-2 border-gray-300' 
                  type='text' 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                />
              </Form.Group>

              <Form.Group>
              <Form.Label>Precio</Form.Label>
              <Form.Control
                  type='number'
                  min="0"
                  className='h-8 border-solid rounded-sm border-2 border-gray-300' 
                  value={price}
                  onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : '')}
              />
              </Form.Group>

              <Form.Group>
              <Form.Label>Imagen</Form.Label>
              <input 
                type="file" 
                className="form-control h-auto border-solid rounded-sm border-2 border-gray-300" 
                onChange={uploadFileHandler} 
                accept="image/*"
              />
              {previewImage && (
                <div className="mt-2">
                  <img 
                    src={previewImage} 
                    alt="Vista previa" 
                    className="w-32 h-32 object-cover rounded-sm border border-gray-300"
                  />
                </div>
              )}
              {uploading && <Loader />}
            </Form.Group>

              <Form.Group>
                <Form.Label>Código</Form.Label>
                <Form.Control 
                  className='h-8 border-solid rounded-md border-2 border-gray-300'  
                  type='text' 
                  value={code} 
                  onChange={(e) => setCode(e.target.value)} 
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Descuento</Form.Label>
                <Form.Control 
                  className='h-8 border-solid rounded-md border-2 border-gray-300' 
                  type='number'
                  min="0" 
                  value={discount} 
                  onChange={(e) => setDiscount(e.target.value)} 
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Stock</Form.Label>
                <Form.Control 
                  type='number'
                  min="0" 
                  className='h-8 border-solid rounded-md border-2 border-gray-300' 
                  value={countInStock} 
                  onChange={(e) => setCountInStock(e.target.value ? Number(e.target.value) : '')} />
              </Form.Group>

              <Form.Group className='md:col-span-2'>
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  className='border-solid rounded-md border-2 border-gray-300' 
                  as="textarea" 
                  rows={3} 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                />
              </Form.Group>

              <Button 
                className='btn btn-block bg-green-700 hover:bg-green-800 mt-2 md:col-span-2' 
                type='submit'
              >
                Confirmar
              </Button>
            </Form>
          )}
        </FormContainer>
      </ListGroup.Item>
    </Fragment>
  );
};

export default ProductEditScreen;
