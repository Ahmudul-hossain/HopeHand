import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import ScrollToTop from './Scrolling';
import Home from './Home';
import ResturantNGOSelector from './ResturantNGOSelector';
import Login from './Login';
import Registration from './Registration';
import ProfileRes from './ProfileRes';
import ProfileNgo from './ProfileNgo';
import AboutUs from './AboutUs';
import NGOPage from './NGOPage';
import HowItWorks from './HowItWorks';
import Restaurant from './Restaurant';
import NgoHistory from './NgoHistory';
import FoodRequests from './FoodRequests';
import RestaurantHistory from './RestaurantHistory';
import NgoRequests from './NgoRequests';
import ProtectedRoute from './ProtectedRoute';
import RedirectIfLoggedIn from './RedirectIfLoggedIn';
import CarbonFootPrintDisplay from './CarbonFootPrintDisplay';
function Website() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/view-page" element={<RedirectIfLoggedIn><Home /></RedirectIfLoggedIn>} />
          <Route path="/res-ngo-selector" element={<ResturantNGOSelector />} />
          <Route path="/log-in" element={<Login />} />
          <Route path="/reg-page" element={<Registration />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/about-us" element={<AboutUs />} />

          <Route path="/pro-res" element={<ProtectedRoute allowedRole="restaurant"><ProfileRes /></ProtectedRoute>} />
          <Route path="/pro-ngo" element={<ProtectedRoute allowedRole="ngo"><ProfileNgo /></ProtectedRoute>} />
          <Route path="/ngo-page" element={<ProtectedRoute allowedRole="ngo"><NGOPage /></ProtectedRoute>} />
          <Route path="/home-page" element={<ProtectedRoute allowedRole="restaurant"><Restaurant /></ProtectedRoute>} />
          <Route path="/history-page" element={<ProtectedRoute allowedRole="ngo"><NgoHistory /></ProtectedRoute>} />
          <Route path="/food-requests" element={<ProtectedRoute allowedRole="ngo"><FoodRequests /></ProtectedRoute>} />
          <Route path="/res-history" element={<ProtectedRoute allowedRole="restaurant"><RestaurantHistory /></ProtectedRoute>} />
          <Route path="/ngo-requests" element={<ProtectedRoute allowedRole="restaurant"><NgoRequests /></ProtectedRoute>} />

          <Route path="*" element={<RedirectIfLoggedIn><Home /></RedirectIfLoggedIn>} />
        </Routes>
      </BrowserRouter>
      <CarbonFootPrintDisplay />
    </AuthProvider>
  );
}

export default Website;