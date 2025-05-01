import React, { useState, useEffect, Fragment } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button, ListGroup, Col, Row } from 'react-bootstrap';
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
  const [previewImage, setPreviewImage] = useState(null);
  const [stockChange, setStockChange] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false); // Nuevo estado para controlar el botón

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
      dispatch({ type: PRODUCT_UPDATE_RESET });
      Swal.fire({
        text: 'Producto actualizado correctamente',
        icon: 'success',
        confirmButtonText: 'Ok',
        customClass: {
          title: 'font-source',
          popup: 'font-source',
      }
      }).then(() => {
        navigate('/admin/productlist') // Redirigir después del Swal
      })
      
      navigate('/admin/productlist');
    } else if (successCreate) {
      dispatch({ type: PRODUCT_CREATE_RESET });
      Swal.fire({
        text: 'Producto actualizado correctamente',
        icon: 'success',
        confirmButtonText: 'Ok',
        customClass: {
          title: 'font-source',
          popup: 'font-source',
      }
      }).then(() => {
        navigate('/admin/productlist') // Redirigir después del Swal
      })
    } else {
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
          setPreviewImage(product.image); // Mostrar la imagen actual como vista previa
        }
      }
    }
  }, [dispatch, navigate, productId, product, successUpdate, successCreate]);

  const validateFields = () => {
    if (!String(name).trim()) return 'El nombre no puede estar vacío';
    if (!String(code).trim()) return 'El campo Código no puede estar vacío';
    if (!String(description).trim()) return 'El campo Descripción no puede estar vacío';
    if (price <= 0) return 'El precio debe ser un número mayor a 0';
    if (countInStock <= 0) return 'El stock ingresado debe ser mayor a 0';
    if (discount < 0 || discount > 100) return 'El descuento debe estar entre 0 y 100';
    return null;
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const errorMsg = validateFields();
    if (errorMsg) {
      Swal.fire({ title: 'Error!', text: errorMsg, icon: 'error', confirmButtonText: 'Ok' });
      return;
    }

    setIsSubmitting(true)

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
          <h1 className="text-center">{productId ? 'Editar Producto' : 'Crear Producto'}</h1>

          {/* Vista previa de la imagen centrada */}
          {/* Vista previa de la imagen centrada */}
          {productId && previewImage && (
            <div className="flex flex-col items-center mt-4">
              <div 
                className="relative group cursor-pointer w-48 h-48 md:w-64 md:h-64"
                onClick={() => document.getElementById('fileInput').click()} // Simular clic en el input file
              >
                <img 
                  src={previewImage} 
                  alt="Vista previa" 
                  className="w-full h-full object-cover rounded-md border border-gray-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md">
                  <span className="text-white text-sm">Actualizar Imagen</span>
                </div>
              </div>
              <input 
                type="file" 
                id="fileInput" 
                className="hidden" 
                onChange={uploadFileHandler} 
                accept="image/*"
              />
            </div>
          )}

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
                <Form.Label>Código</Form.Label>
                <Form.Control 
                  className='h-8 border-solid rounded-md border-2 border-gray-300'  
                  type='text' 
                  value={code} 
                  onChange={(e) => setCode(e.target.value)} 
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Descuento (%)</Form.Label>
                <Form.Control
                  className='h-8 border-solid rounded-md border-2 border-gray-300'
                  type='number'
                  min="0"
                  max="100"
                  value={discount}
                  onChange={(e) => setDiscount(Math.min(Math.max(Number(e.target.value), 0), 100))}
                />
              </Form.Group>

              <Row className="align-items-center">
                {/* Form.Group para Stock */}
                <Col xs={12} md={6}>
                  <Form.Group>
                    <Form.Label>Stock</Form.Label>
                    <Form.Control 
                      type="number"
                      min="0"
                      className="h-8 border-solid rounded-md border-2 border-gray-300"
                      value={countInStock}
                      onChange={(e) => setCountInStock(e.target.value ? Number(e.target.value) : '')}
                    />
                  </Form.Group>
                </Col>

                {/* Form.Group para Modificar Stock */}
                {productId && (
                  <Col xs={12} md={6}>
                    <Form.Group>
                      <Form.Label>Modificar Stock</Form.Label>
                      <div className="d-flex align-items-center gap-2">
                        <Form.Control 
                          type="number"
                          className="h-8 w-20 border-solid rounded-sm border-2 border-gray-300 text-center text-sm p-1"
                          value={stockChange}
                          onChange={(e) => {
                            const value = Math.max(0, Number(e.target.value)); // Evitar valores menores a 0
                            setStockChange(value);
                          }}
                        />
                        <button 
                          type="button"
                          className="px-2 py-1 bg-red-600 text-white rounded-sm"
                          onClick={() => {
                            if (stockChange <= countInStock) { // Validar que no se reste más del stock actual
                              setCountInStock(prev => Math.max(0, prev - stockChange));
                            } else {
                              Swal.fire({
                                title: 'Error!',
                                text: 'No puedes restar más del stock disponible.',
                                icon: 'error',
                                confirmButtonText: 'Ok'
                              });
                            }
                          }}
                        >
                          -
                        </button>
                        <button 
                          type="button"
                          className="px-2 py-1 bg-green-600 text-white rounded-sm"
                          onClick={() => setCountInStock(prev => prev + stockChange)} // Incrementar stock sin restricciones
                        >
                          +
                        </button>
                      </div>
                    </Form.Group>
                  </Col>
                )}
              </Row>

              {
                !productId && (
                  <Form.Group className="mt-4 d-flex align-items-center gap-3">
                    <div>
                      <Form.Label>Subir Imagen</Form.Label>
                      <Form.Control 
                        type="file" 
                        onChange={uploadFileHandler} 
                        accept="image/*"
                        className="border-solid rounded-md border-2 border-gray-300"
                      />
                    </div>
                    {previewImage && (
                      <div className='w-50'>
                        <img 
                          src={previewImage} 
                          alt="Vista previa" 
                          className="w-100 h-100 object-cover rounded-sm border border-gray-300"
                        />
                      </div>
                    )}
                  </Form.Group>
                )
              }

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
                className={`btn btn-block bg-green-700 hover:bg-green-800 mt-2 md:col-span-2 ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                type="submit"
                disabled={isSubmitting} // Deshabilitar el botón mientras se envía
              >
                {isSubmitting ? 'Procesando...' : 'Confirmar'}
              </Button>
            </Form>
          )}
        </FormContainer>
      </ListGroup.Item>
    </Fragment>
  );
};

export default ProductEditScreen;