// this is a protected route component 
// if the user is not logged in then it will redirect to the login page
// and if the user is logged in then it will return the children component 
// protected component is used to protect the routes from the unauthenticated users  

import {useAuth} from "../hook/useAuth"
import {Navigate} from "react-router"

const Protected = ({children}) => {
    const {user,loading}=useAuth();

    if(loading){
        return(
            <main>
                <h1>
                    Loading...
                </h1>
            </main>
        )
    }
    if(!user){
        return(
            <Navigate to="/login"/>
        )
    }
    return children;
}

export default Protected