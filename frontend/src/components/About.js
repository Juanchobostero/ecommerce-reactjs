import React, { Fragment } from 'react';
import { Row, Col, ListGroup, Image, Card, Button } from 'react-bootstrap';

const About = () => {
    return (
        <Fragment>
            <Row className='w-full mt-8'>
                <Col md={12}>
                    <ListGroup variant='flush'>
                        <ListGroup.Item className='rounded-md bg-amber-100'>
                            <h1 className="text-lg font-bold">¿Quienes Somos?</h1>
                            <p class="mb-3 text-black-500 dark:text-black-700">Somos una empresa familiar dedicada a la creación de alfajores artesanales en San Luis del Palmar, Corrientes. Inspirados en las tradiciones y sabores de nuestra región, elaboramos cada alfajor con pasión, ingredientes seleccionados y el auténtico toque casero que nos caracteriza.</p>
                        </ListGroup.Item>
                    </ListGroup>
                </Col>

            </Row>
        </Fragment>
    )
}

export default About