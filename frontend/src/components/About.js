import React from 'react';
import { Row, Col, ListGroup } from 'react-bootstrap';

const About = () => {
    return (
        <div className='py-1 px-2 mt-4'>
            <ListGroup variant="flush">
                <ListGroup.Item className="rounded-md bg-amber-950 text-amber-100 font-source text-justify py-2 px-4">
                    <h1 className="text-lg font-bold mb-3">¿Quiénes Somos?</h1>
                    <p className="text-sm text-gray-300 leading-relaxed">
                        Somos una empresa familiar de San Luis del Palmar, Corrientes, especializada en alfajores artesanales. 
                        Nos inspiramos en las tradiciones locales para ofrecer un producto auténtico, elaborado con ingredientes 
                        seleccionados y un toque casero inigualable.
                    </p>
                </ListGroup.Item>
            </ListGroup>
        </div>
    );
};

export default About;
