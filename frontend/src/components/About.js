import React, { Fragment } from 'react';
import { Row, Col, ListGroup, Image, Card, Button } from 'react-bootstrap';

const About = () => {
    return (
        <Fragment>
            <Row className='w-full mt-8'>
                <Col md={12}>
                    <ListGroup variant='flush'>
                        <ListGroup.Item className='rounded-md bg-amber-100'>
                            <h1>Quienes Somos?</h1>
                            <p class="mb-3 text-black-500 dark:text-black-400">De la concha de tu madre somos.</p>
                            <p class="text-gray-500 dark:text-gray-400">Otro párrafo.</p>
                        </ListGroup.Item>
                    </ListGroup>
                </Col>

            </Row>
        </Fragment>
    )
}

export default About