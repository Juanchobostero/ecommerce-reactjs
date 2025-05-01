import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, ListGroup } from 'react-bootstrap';
import Product from '../components/Product';
import { listProducts } from '../actions/productActions';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { useParams } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import Meta from '../components/Meta';

const ProductCatalogScreen = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const keyword = params.keyword || '';
  const [currentPage, setCurrentPage] = useState(0); // Página actual
  const itemsPerPage = 8; // Cantidad de productos por página

  const productList = useSelector((state) => state.productList);
  const { loading, error, products = [] } = productList;

  useEffect(() => {
    dispatch(listProducts(keyword));
  }, [dispatch, keyword]);

  // Calcular la paginación
  const pageCount = Math.ceil(products.length / itemsPerPage); // Total de páginas
  const offset = currentPage * itemsPerPage; // Índice inicial de los productos en la página actual
  const currentProducts = products.slice(offset, offset + itemsPerPage); // Productos en la página actual

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected); // Actualizar la página actual al hacer clic en la paginación
  };

  return (
    <>
      <Meta title={'El Promesero | ALFAJORES'} />
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <ListGroup.Item className="mt-8 mb-8 bg-amber-950 rounded-md py-2 px-10">
            <Row className="flex flex-col">
              <span className="text-3xl font-source text-amber-100 mt-2">Nuestros Productos</span>
              <span className="flex items-center text-sm font-source text-amber-100 mt-2">
                ℹ️ <i>Podes comprar solo hasta <b>24</b> unidades por caja</i>
              </span>
            </Row>
            <Row>
              {currentProducts.map((product) => (
                <Col key={product._id} sm={12} md={3} lg={3}>
                  <Product product={product} />
                </Col>
              ))}
            </Row>
            <ReactPaginate
              previousLabel={'← Anterior'}
              nextLabel={'Siguiente →'}
              breakLabel={'...'}
              pageCount={pageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={handlePageClick}
              containerClassName={'pagination justify-content-center'}
              pageClassName={'page-item'}
              pageLinkClassName={'page-link'}
              previousClassName={'page-item'}
              previousLinkClassName={'page-link'}
              nextClassName={'page-item'}
              nextLinkClassName={'page-link'}
              breakClassName={'page-item'}
              breakLinkClassName={'page-link'}
              activeClassName={'active'}
            />
          </ListGroup.Item>
        </>
      )}
    </>
  );
};

export default ProductCatalogScreen;