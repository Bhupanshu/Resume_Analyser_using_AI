import { RouterProvider } from "react-router";
import {route} from "./app.router";
import { AuthProvider } from "./features/auth/auth.context";
import { InterviewProvider } from "./features/interview/interview.context";

const App = () => {                                      
  return (
    <AuthProvider>
      <InterviewProvider>
        <RouterProvider router={route}/>
      </InterviewProvider>  
    </AuthProvider> 
  )
}

export default App 