import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Footer from './components/Footer';
import Header from './components/Header';
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
import ProductCatalogScreen from './screens/ProductCatalogScreen';
import 'antd/dist/antd.min.css';
import '@fontsource/playball';
import '@fontsource-variable/playfair-display';
import '@fontsource-variable/ubuntu-sans';
import '@fontsource/source-sans-pro';
import { Analytics } from '@vercel/analytics/react';

// Componente de transición para vistas
const TransitionWrapper = ({ children }) => {
  const location = useLocation();
  React.useEffect(() => {
    if ('startViewTransition' in document) {
      document.startViewTransition(() => {
        // Aquí se renderiza la nueva vista automáticamente
      });
    }
  }, [location]);

  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <div
        className="relative bg-no-repeat bg-cover bg-fixed w-full h-full"
        style={{
          backgroundImage: "url('/images/background-alfajores-10.jpeg')",
          backgroundSize: "cover",
        }}
      >
        <div
          className="absolute inset-0 bg-amber-950 opacity-100"
          style={{
            zIndex: -1, // Para asegurarse de que no se superponga con el contenido
          }}
        ></div>
        <Header />
        <main>
          <Container>
            <TransitionWrapper>
              <Routes>
                <Route path="/order/:id" element={<OrderDetailsScreen />} />
                <Route path="/shipping" element={<ShippingScreen />} />
                <Route path="/placeorder" element={<PlaceOrderScreen />} />
                <Route path="/login" element={<LoginScreen />} />
                <Route path="/register" element={<RegisterScreen />} />
                <Route path="/profile" element={<ProfileScreen />} />
                <Route path="/product/:id" element={<ProductScreen />} />
                <Route path="/cart" element={<CartScreen />} />
                <Route path="/cart/:id" element={<CartScreen />} />
                <Route path="/admin/userlist" element={<UserListScreen />} />
                <Route path="/admin/user/:id/edit" element={<UserEditScreen />} />
                <Route path="/admin/productlist" element={<ProductListScreen />} exact />
                <Route path="/admin/productlist/:pageNumber" element={<ProductListScreen />} exact />
                <Route path="/admin/product/:id/edit" element={<ProductEditScreen />} />
                <Route path="/admin/product/new" element={<ProductEditScreen />} />
                <Route path="/admin/orderlist" element={<OrderListScreen />} />
                <Route path="/admin/reports" element={<ReportScreen />} />
                <Route path="/search/:keyword" element={<HomeScreen />} exact />
                <Route path="/catalogo" element={<ProductCatalogScreen />}/>
                <Route path="/catalogo/page/:pageNumber" element={<ProductCatalogScreen />} />
                <Route path="/" element={<HomeScreen />} />
              </Routes>
            </TransitionWrapper>
          </Container>
        </main>
        <Footer />
      </div>
      <Analytics />
    </Router>
  );
}

export default App;
