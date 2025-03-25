import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Row, Col, Card } from 'react-bootstrap';

const branches = [
    { id: 1, name: 'YPF SANTA ROSA', coords: [-27.477870, -58.820101], description: 'Sucursal en Nueva York' },
    { id: 2, name: 'KIOSKO COCHA - LA ESTACIÓN', coords: [-29.156622, -59.260274], description: 'Sucursal en Los Ángeles' },
    { id: 3, name: 'AR FULL 24 HS.', coords: [-27.514253, -58.566322], description: 'Sucursal en Chicago' },
    { id: 4, name: 'BAR IMPERIO', coords: [-27.509187, -58.558258], description: 'Sucursal en Chicago' },
    { id: 5, name: 'STOP 20-20', coords: [-27.509459, -58.558517], description: 'Sucursal en Chicago' },
];

const Location = () => {
    const [selectedBranch, setSelectedBranch] = useState(branches[0]);

    const handleBranchSelection = (branch) => {
        setSelectedBranch(branch);
    };

    useEffect(() => {
        const { coords, name } = selectedBranch;
        const map = L.map('map').setView(coords, 13)

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
        }).addTo(map)

        // Crear un icono personalizado
        const customIcon = new L.Icon({
            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png', // Imagen predeterminada o personalizada
            iconSize: [25, 41], // Tamaño del icono
            iconAnchor: [12, 41], // Ancla del icono
            popupAnchor: [0, -41], // Ancla del popup
        });

        L.circle(coords, {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.5,
            radius: 25
        }).addTo(map);

        L.marker(coords, { icon: customIcon }).addTo(map).bindPopup(`${name}`)
        .openPopup();

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
                            Selecciona una ubicación
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
