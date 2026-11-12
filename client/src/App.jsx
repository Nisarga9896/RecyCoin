import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import { ToastProvider } from './components/Toast';
import CosmicBackground from './components/CosmicBackground';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Game from './pages/Game';
import Marketplace from './pages/Marketplace';
import ItemDetail from './pages/ItemDetail';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import OrderTracking from './pages/OrderTracking';
import Wishlist from './pages/Wishlist';
import SellerDashboard from './pages/SellerDashboard';
import ManageProducts from './pages/ManageProducts';
import Sales from './pages/Sales';
import About from './pages/About';
import PageWrapper from './components/PageWrapper';

export default function App() {
  const location = useLocation();

  return (
    <ToastProvider>
      <CosmicBackground />
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
              <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
              <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />
              <Route path="/game" element={<PageWrapper><Game /></PageWrapper>} />
              <Route path="/marketplace" element={<PageWrapper><Marketplace /></PageWrapper>} />
              <Route path="/items/:id" element={<PageWrapper><ItemDetail /></PageWrapper>} />
              <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />

              <Route path="/dashboard" element={<PageWrapper><ProtectedRoute><Dashboard /></ProtectedRoute></PageWrapper>} />
              <Route path="/orders" element={<PageWrapper><ProtectedRoute><Orders /></ProtectedRoute></PageWrapper>} />
              <Route path="/orders/:id" element={<PageWrapper><ProtectedRoute><OrderTracking /></ProtectedRoute></PageWrapper>} />
              <Route path="/wishlist" element={<PageWrapper><ProtectedRoute><Wishlist /></ProtectedRoute></PageWrapper>} />
              <Route path="/seller" element={<PageWrapper><ProtectedRoute><SellerDashboard /></ProtectedRoute></PageWrapper>} />
              <Route path="/seller/products" element={<PageWrapper><ProtectedRoute><ManageProducts /></ProtectedRoute></PageWrapper>} />
              <Route path="/seller/sales" element={<PageWrapper><ProtectedRoute><Sales /></ProtectedRoute></PageWrapper>} />

              <Route path="*" element={<PageWrapper><Home /></PageWrapper>} />
            </Routes>
          </AnimatePresence>
        </main>
        {location.pathname === '/' && <Footer />}
      </div>
    </ToastProvider>
  );
}
