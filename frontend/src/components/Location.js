import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Row, Col, Card } from 'react-bootstrap';

const branches = [
    { id: 1, name: 'Sucursal 1', coords: [40.7128, -74.0060], description: 'Sucursal en Nueva York' },
    { id: 2, name: 'Sucursal 2', coords: [34.0522, -118.2437], description: 'Sucursal en Los Ángeles' },
    { id: 3, name: 'Sucursal 3', coords: [41.8781, -87.6298], description: 'Sucursal en Chicago' },
];

const Location = () => {
    const [selectedBranch, setSelectedBranch] = useState(branches[0]);

    const handleBranchSelection = (branch) => {
        setSelectedBranch(branch);
    };

    useEffect(() => {
        const { coords } = selectedBranch;
        const map = L.map('map').setView(coords, 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
        }).addTo(map);

        return () => {
            map.remove();
        };
    }, [selectedBranch]);

    return (
        <Row className="w-[97%] rounded-s mt-8 mb-8 bg-amber-100">
            {/* Columna izquierda: Lista de sucursales */}
            <Col md={6}>
                <div className="space-y-4">
                    <div className="bg-amber-100 p-1 rounded-md">
                        <h1 className="text-lg font-bold">¿Cómo encontrarnos?</h1>
                        <p className="text-gray-600">
                            Selecciona una sucursal para ver su ubicación en el mapa.
                        </p>
                    </div>
                    {branches.map((branch) => (
                        <div
                            key={branch.id}
                            onClick={() => handleBranchSelection(branch)}
                            className={`p-2 rounded-s cursor-pointer transition-colors ${
                                branch.id === selectedBranch.id
                                    ? 'bg-amber-950 text-white font-semibold'
                                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                            }`}
                        >
                            {branch.name}
                        </div>
                    ))}
                </div>
            </Col>

            {/* Columna derecha: Mapa */}
            <Col md={6}>
                <Card>
                    <Card.Body>
                        <div id="map" className="h-80 bg-amber-100"></div>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
};

export default Location;
