import {Route, Routes, Navigate} from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import NavBar from "./components/NavBar";
import LoadingSpinner from "./components/LoadingSpinner";
import { Toaster } from "react-hot-toast";
import { useUserStore } from "./stores/useUserStore";
import { useEffect } from "react";
import AdminPage from "./pages/AdminPage";
import CategoryPage from "./pages/CategoryPage";
import CartPage from "./pages/CartPage";
import { useCartStore } from "./stores/useCartStore";
import PurchaseSuccessPage from "./pages/PurchaseSuccessPage";
import PurchaseCancelPage from "./pages/PurchaseCancelPage";


function App() {
    const {user, checkAuth, checkingAuth}= useUserStore();
    const {getCartItems}= useCartStore();

    useEffect(()=>{
      checkAuth();
    },[checkAuth]);

    useEffect(()=>{
      if(user) getCartItems();
    },[getCartItems,user]);

    if(checkingAuth) return <LoadingSpinner/>;

    return (
      //minimum height:entirescreen;background:gray(900)->to get dark mode feeling; text:white;relative;overflow-hidden
    <div className='min-h-screen bg-gray-800 text-white relative overflow-hidden'>
      {/* Background gradient */}
			<div className='absolute inset-0 overflow-hidden'>
				<div className='absolute inset-0'>
					<div className='absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3)_0%,rgba(10,140,40,0.2)_45%,rgba(0,60,0,0.1)_100%)]' />
				</div>
			</div>

      <div className='relative z-50 pt-20'>
        <NavBar/> 
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/signup" element={!user ?  <SignUpPage/> : <Navigate to="/"/>} />
          <Route path="/login" element={!user ?  <LoginPage/> : <Navigate to="/"/> } />
          <Route path="/secret-dashboard" element={user?.role==="admin" ?  <AdminPage/> : <Navigate to="/login"/> } />
          <Route path="/category/:category" element={<CategoryPage/>  } />
          <Route path="/cart" element={user ? <CartPage/> : <Navigate to="/login"/> } />
          <Route path='/purchase-success' element={user ? <PurchaseSuccessPage /> : <Navigate to='/login' />} />
					<Route path='/purchase-cancel' element={user ? <PurchaseCancelPage /> : <Navigate to='/login' />} />
        </Routes>
        <Toaster/>
      </div>

    </div>) 
} 

export default App;


// absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3)_0%,rgba(10,140,40,0.2)_45%,rgba(0,60,0,0.1)_100%)]