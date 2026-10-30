// this hook is used to provide the auth context to any component 


import { useContext,useEffect } from "react";
import { authcontext } from "../auth.context"; 
import { loginUser, registerUser, logout,getProfile } from "../sevices/auth.api";

export const useAuth = ()=>{
    const context = useContext(authcontext); // this will provide the userdata to any component 

    const {user,setUser,loading,setLoading}=context;

    const handlelogin=async({email,password})=>{
        setLoading(true);
        try{ const data=await loginUser({email,password});
        setUser(data.user);
        return data.user;
    }

    catch(err){
        console.error("Login failed:", err);
        return null;
    }

    finally{      
        setLoading(false);
    }
    }

    const handleregister=async({username,email,password})=>{
        setLoading(true);
        try{
            const data =await registerUser({username,email,password});
        setUser(data.user);
        }
        catch(err){

        }
        finally{
            setLoading(false);
        }
    }

    const handlelogout=async()=>{
        setLoading(true);
        try{
            const data=await logout();
        setUser(null);
        }
        catch(err){

        }
        finally{
        setLoading(false);}
    }

    useEffect(()=>{
            const getandshowprofile=async()=>{
                try{
                    const data=await getProfile();
                    if(data?.user){
                        setUser(data.user);
                    }
                }
                catch(err){
                    console.log(err);
                }
                finally{
                    setLoading(false);
                }
            }
            getandshowprofile();
        },[])

    return {handlelogin,handleregister,handlelogout,user,loading};

     
} 