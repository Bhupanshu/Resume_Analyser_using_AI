
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import {useAuth} from "../hook/useAuth" 
import Logo  from "../component/Logo"

const Login = () => {
    const { handlelogin, loading } = useAuth();
    const navigate = useNavigate();

    const [isClicked, setIsClicked] = useState(false);

    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");

    const handlesubmit = async (e) => { 
        e.preventDefault();
        const user = await handlelogin({email,password});
        if(user){
            navigate("/");
        }
    }

    if(loading){
        return (
            <main className="min-h-screen flex justify-center items-center ">
                Loading ... 
            </main>
        )
    } 

    const handleButtonClick = () => {
        setIsClicked(true);
        setTimeout(() => setIsClicked(false), 200);  
    };
    return (
        <main className="min-h-screen flex justify-center items-center ">


            {/* Card */}
            <div className="bg-white rounded-2xl shadow-lg p-12 w-full max-w-md mx-4">
                <div className='flex justify-center mb-6'>
                <Logo size='lg' />
            </div>  

                <form onSubmit={handlesubmit} className="flex flex-col gap-6 pl-4">
                    <div className="flex flex-col gap-1">
                        <label htmlFor="email" className="text-sm font-medium text-gray-600">Email</label>
                        <input
                         onChange={(e)=>{setEmail(e.target.value)}}
                            type="email"
                            name="email"
                            id="email"  
                            placeholder="Enter email address"
                            className="border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:border-blue-500 transition"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="password" className="text-sm font-medium text-gray-600">Password</label>
                        <input
                        onChange={(e)=>{setPassword(e.target.value)}}
                            type="password"
                            name="password"
                            id="password"
                            placeholder="Enter password"
                            className="border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:border-blue-500 transition"
                        />
                    </div>

                    <button
                        type="submit"
                        onClick={handleButtonClick}
                        className={`mt-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-2 rounded-lg transition-all duration-150 cursor-pointer select-none
                            ${
                                isClicked
                                    ? "scale-96 shadow-inner brightness-90"
                                    : "scale-100 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                            }`}
                    >
                        Login 
                    </button>
                </form>

                <p className="text-sm text-center text-gray-600 mt-4">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-blue-600 hover:underline"> 
                        Register 
                    </Link> 
                </p> 
            </div>

        </main>
    )
}

export default Login