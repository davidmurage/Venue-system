import {Routes, Route} from 'react-router-dom';
import HomePage from "./pages/HomePage";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Policy from "./pages/Policy";
import Pagenotfound from "./pages/Pagenotfound";
import Register from './pages/Auth/Register';
import Login from './pages/Auth/Login';
import Dashboard from './pages/user/Dashboard';
import PrivateRoute from './components/Routes/Private';
import ForgotPassword from './pages/Auth/ForgotPassword';
import AdminRoute from './components/Routes/AdminRoute';
import AdminDashboard from './pages/Admin/AdminDashboard';
import CreateCategory from './pages/Admin/CreateCategory';
import CreateProduct from './pages/Admin/CreateProduct';
import Users from './pages/Admin/Users';
import Profile from './pages/user/Profile';
import Search from './pages/Search';
import Categories from './pages/Categories';
import CategoryProduct from './pages/CategoryProduct';
import CartPage from './pages/CartPage';
import BookingForm from './pages/bookingForm';
import MyBookings from './pages/user/MyBookings';
import PaymentPage from './pages/Payment';
import Venues from './pages/Admin/Products';
import UpdateVenue from './pages/Admin/UpdateProduct';
import VenueDetails from './pages/ProductDetails';
import AdminBookings from './pages/Admin/AdminOrders';

function App() {
  return(
  <>
  <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:slug" element={<VenueDetails />} />
        <Route path='/search' element ={<Search/>}/>
        <Route path='/categories' element={<Categories/>}/>
        <Route path="/category/:slug" element={<CategoryProduct />} />
        <Route path='/cart' element={<CartPage/>}/>
        <Route path="/register" element={<Register />} />
        <Route path='/dashboard' element={<PrivateRoute/>}>
          <Route path="user" element={<Dashboard />} />
          <Route path='user/myBookings' element={<MyBookings/>}/>
          <Route path='user/profile' element={<Profile/>} />
        </Route>

        <Route path='/dashboard' element={<AdminRoute/>}>
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="admin/create-category" element={<CreateCategory />} />
          <Route path="admin/create-product" element={<CreateProduct />} />
          <Route path='admin/product/:slug' element={<UpdateVenue/>}/> 
          <Route path="admin/products" element={<Venues/>}/>
          <Route path="admin/Users" element={<Users/>} />
          <Route path='admin/orders' element={<AdminBookings/>}/>
        </Route>
        
        <Route path="/login" element={<Login />} />
        <Route path='/forgot-password' element={<ForgotPassword/>} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/policy" element={<Policy />} />
        <Route path="*" element={<Pagenotfound />} />
        <Route path='/book/:slug' element={<BookingForm/>}/>
        <Route path='/payment' element={<PaymentPage/>}/>
  </Routes>
  </> 
  );
  

    
}

export default App;