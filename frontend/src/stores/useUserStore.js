//This hook or file is created to have global state of user related things
import {create} from "zustand"; //To create functions that we can use later on
import axios from "../lib/axios";
import {toast} from "react-hot-toast";


//Now we can use this useUserStore everywhere to extract user, loading, checkingAuth and functions like signup
// as: const {loading, signup} = userUserStore() =>extract necessary things to use them
export const useUserStore= create((set, get)=> ({
    user:null,
    loading:false,
    checkingAuth:true, //by default true, because we need to check for authorization

    signup: async({name,email,password,confirmPassword})=>{
        set({loading:true});

        if(password!==confirmPassword){
            set({loading:false});
            return toast.error("Passwords do not match");
        } 

        try{
            const res= await axios.post("/auth/signup", {name,email,password});
            set({user:res.data.user, loading:false});
        } catch (error) {
			set({ loading: false });
			toast.error(error.response.data.message || "An error occurred");
		}
    },

    login: async(email,password)=>{
        set({loading:true});
        try{
            const res= await axios.post("/auth/login", {email,password});
            set({user:res.data, loading:false});  //res.data.user is undefined
        } catch (error) {
			set({ loading: false });
			toast.error(error.response.data.message || "An error occurred");
		}
    },

    //Now,as soon as a page is refreshed... we open login page for a sec and call a function to check if user is already
    //authenticated and if yes then open homepage otherwise stay on login page
    checkAuth: async () => {
        set({checkingAuth:true});
        try {
            const response= await axios.get("/auth/profile");  //user hua to profile mil jaaegi vrna error pr chla jaaega
            set({user: response.data, checkingAuth:false});
        } catch (error) {
            set({user:null, checkingAuth:false});
        }
    },

    logout: async()=>{
        try {
            await axios.post("/auth/logout");
            set({user:null});
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occured during logout");  
        }
    },

    //Implement axios interceptors to refresh the acces tokens in every 15 minutes

}));