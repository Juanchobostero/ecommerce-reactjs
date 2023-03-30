import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Footer from "./components/Footer";
import Header from "./components/Header";
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import CartScreen from './screens/CartScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ProfileScreen from './screens/ProfileScreen';
import ShippingScreen from './screens/ShippingScreen';
import PaymentScreen from './screens/PaymentScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderDetailsScreen from './screens/OrderDetailsScreen';
import UserListScreen from './screens/UserListScreen';
import UserEditScreen from './screens/UserEditScreen';
import ProductListScreen from './screens/ProductListScreen';
import ProductEditScreen from './screens/ProductEditScreen';
import OrderListScreen from './screens/OrderListScreen';
import ReportScreen from './screens/ReportScreen';
import 'antd/dist/antd.min.css';

function App() {
  return (
    <Router>
      <Header />
      <main className='py-3'>
        <Container>
          <Routes>
            <Route path='/order/:id' element={<OrderDetailsScreen />} />
            <Route path='/shipping' element={<ShippingScreen />} />
            <Route path='/payment' element={<PaymentScreen />} />
            <Route path='/placeorder' element={<PlaceOrderScreen />} />
            <Route path='/login' element={<LoginScreen />} />
            <Route path='/register' element={<RegisterScreen />} />
            <Route path='/profile' element={<ProfileScreen />} />
            <Route path='/product/:id' element={<ProductScreen />} />
            <Route path='/cart' element={<CartScreen />}/>
            <Route path='/cart/:id' element={<CartScreen />}/>
            <Route path='/admin/userlist' element={<UserListScreen />}/>
            <Route path='/admin/user/:id/edit' element={<UserEditScreen />}/>
            <Route path='/admin/productlist' element={<ProductListScreen />} exact />
            <Route path='/admin/productlist/:pageNumber' element={<ProductListScreen />} exact />
            <Route path='/admin/product/:id/edit' element={<ProductEditScreen />}/>
            <Route path='/admin/orderlist' element={<OrderListScreen />}/>
            <Route path='/admin/reports' element={<ReportScreen />}/>
            <Route path='/search/:keyword' element={<HomeScreen />} exact/>
            <Route path='/page/:pageNumber' element={<HomeScreen />} />
            <Route path='/search/:keyword/page/:pageNumber' element={<HomeScreen />} />
            <Route path='/' element={<HomeScreen />} />
          </Routes>
        </Container>
      </main>
      <Footer />
    </Router>
  );
}

export default App;

// Crear Proyecto

// npx create-react-app nombre

// npm install (p/cargar directorio 'node_modules' -> Dependencias en package.json)

// npm start(inicialmente) & npm run dev (config ideal para separar backend y frontend) (server & cliente) 

// Eliminar archivos innecesarios que vienen por defecto y limpiar App.js (Acá se van a configurar 
// las rutas para el frontend)

// Dividir directorios (components, screens)

// Definir rutas e instalar 'react-router-dom', 'react-router-bootstrap', 'react-bootstrap' (a elección)

// Aplicar componente de ruta en App.js (Router, Routes, Route)

// Redux (?) ó Context API (?) (Manejo del estado de la app)