import { button } from "framer-motion/client";
import { ShoppingCart, UserPlus, LogIn, LogOut, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";

const NavBar = () => {
  const {user, logout}= useUserStore();
  const isAdmin=user?.role ==="admin";
  const {cart} = useCartStore();

  return (
    <div>
      <header className='fixed top-0 left-0 w-full bg-teal-700 bg-opacity-90 backdrop-blur-md shadow-lg  z-40 transition-all duration-300 border-b border-emerald-800'>

			<div className='container mx-auto px-4 py-3'>           
			  <div className='flex flex-wrap justify-between items-center'>
                  <Link to='/' className='text-2xl font-bold text-emerald-300 items-center space-x-2 flex'>
				    AgroCare
				  </Link>
                

                  <nav className="flex flex-wrap items-center gapr-4 space-x-2.5 ">

                    <Link to={"/"} className='text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out'>Home</Link>
                    { user && (
                        <Link to={"/cart"} className="relative group text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out">
                            <ShoppingCart className='inline-block mr-1 group-hover:text-emerald-400' size={20}/>
                            <span className='hidden sm:inline'>Cart</span> {/*Icon from lucide react */}

				    			{cart.length>0 &&<span
				    				className='absolute -top-2 -left-2 bg-emerald-500 text-white rounded-full px-2 py-0.5  text-xs group-hover:bg-emerald-400 transition duration-300 ease-in-out'>
				    				{cart.length}
				    			</span>}
                    
                        </Link> 
                    )}

                    {isAdmin && (
                        <Link
                        className='bg-emerald-500 hover:bg-emerald-400 text-white px-3 py-1 rounded-md font-medium
                         transition duration-300 ease-in-out flex items-center'
                        to={"/secret-dashboard"}>
                        <Lock className='inline-block mr-1' size={18} /> {/*Icon from lucide react */}
                        <span className='hidden sm:inline'>Dashboard</span>
                    </Link>
                    )}

                    {/* user?():() agr user hai to logout vrna signup/login  */}
                    {user ? (
                        <button className='bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out' onClick={logout} >
                            <LogOut size={18} /> {/*Icon from lucide react */}
                            <span className='hidden sm:inline ml-2'>Log Out</span>
                        </button>
                    ) : (
                        <>
				    		<Link
				    			to={"/signup"}
				    			className='bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out'>
				    			<UserPlus className='mr-2' size={18} /> {/*Icon from lucide react */}
				    			Sign Up
				    		</Link>
				    		<Link
				    			to={"/login"}
				    			className='bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out'>
				    			<LogIn className='mr-2' size={18} /> {/*Icon from lucide react */}
				    			Login
				    		</Link>
				    	</>
                    )}
                </nav>
              </div>
          </div>
      </header>
    </div>
  )
}

export default NavBar
