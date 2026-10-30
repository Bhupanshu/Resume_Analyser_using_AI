import { createContext , useState} from "react";

export const authcontext = createContext();

export const AuthProvider =({children})=>{        // auth provider is used to provide the auth context to the child components  
    const[user,setUser]=useState(null)          // user is the user that is logged in
    const[loading,setLoading]=useState(true)   // loading is the loading state of the user 

    return(
        <authcontext.Provider value={{user,loading,setUser,setLoading}}> 
            {children}
        </authcontext.Provider> 
    )
} 

