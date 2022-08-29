import React, { useEffect } from 'react';
import { notification } from 'antd';
import { Container, Row, Col } from 'react-bootstrap';
import PieComponent from '../components/PieComponent';
import { useDispatch, useSelector } from 'react-redux';
import { listProductCategories, listTopProducts } from '../actions/productActions';
import { Link } from 'react-router-dom';

const ReportScreen = () => {

    const dispatch = useDispatch();

    const productCategories = useSelector(state => state.productCategories);
    const { categories } = productCategories;

    const productTopRated = useSelector(state => state.productTopRated);
    const { products } = productTopRated;

    const productTop = products ? products[0] : null;

    const getRandomInt = (max) => {
      return Math.floor(Math.random() * max);
    }

    const newProductsForReport = Array.isArray(categories) 
      ? (categories).map((category) => (
        {
          key: category._id,
          id: category._id,
          label: category._id,
          value: category.totalQuantity,
          color: `hsl(${getRandomInt(category.totalQuantity)}, 70%, 50%)`
        })) 
      : null;

    console.log(newProductsForReport);

    /* const data = [
      {
        "id": "hack",
        "label": "hack",
        "value": 180,
        "color": "hsl(71, 70%, 50%)"
      },
      {
        "id": "haskell",
        "label": "haskell",
        "value": 7,
        "color": "hsl(274, 70%, 50%)"
      },
      {
        "id": "css",
        "label": "css",
        "value": 357,
        "color": "hsl(91, 70%, 50%)"
      },
      {
        "id": "make",
        "label": "make",
        "value": 83,
        "color": "hsl(299, 70%, 50%)"
      },
      {
        "id": "javascript",
        "label": "javascript",
        "value": 104,
        "color": "hsl(63, 70%, 50%)"
      }
    ]; */

    const openNotificationWithIcon = (type) => {
        notification[type]({
          message: 'Welcome admin !',
          description:
            'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
        });
      };

    useEffect(() => {
      openNotificationWithIcon('info');
      dispatch(listProductCategories());
      dispatch(listTopProducts());
    }, [dispatch]);
    
    return (
      <Container>
        <Row>
          <Col md={12}>
            <h3>Reports Panel</h3>
          </Col>
        </Row>
        <Row>
          <Col 
            md={8} 
            sm={12} 
            className='col-report'
          >
            <h4>Product stock by category</h4>
            <PieComponent data={newProductsForReport} />
          </Col>
          <Col 
            md={4} 
            sm={12} 
            className='col-report'
          >
            <h4>Product top rated</h4>
            {
              productTop && <Link to={`/admin/product/${productTop._id}/edit`}>
              <h3>{productTop && productTop.name}</h3>
            </Link>
            }
            
            <span>
              <i
                style={{ color: '#f8e825' }}
                className='fas fa-star fa-4x'
              >
                  {productTop && productTop.rating}
              </i>
            </span>
            &nbsp;
            <span>
              <i 
                className='fa-solid fa-comment fa-4x'>
                  {productTop && productTop.numReviews}
              </i>
            </span>
          </Col>
        </Row>
        <hr></hr>
        <h1>Orders</h1>
        <Row>
          <Col md={6} sm={12} className='col-report'>
            COL 1
          </Col>
          <Col md={6} sm={12} className='col-report'>
            COL 2
          </Col>
        </Row>
        <hr></hr>
        <h1>Users</h1>
        <Row>
          <Col md={6}>
            COL 1
          </Col>
          <Col md={6}>
            COL 2
          </Col>
        </Row>
      </Container>
    )
}

export default ReportScreen;