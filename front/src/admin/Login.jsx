import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function Login() {

  const navigate = useNavigate();

  const [username,setUsername] = useState("");
  const [password,setPassword] = useState("");

  const login = async () => {

    try{

      const res = await API.post("/admin/login",{
        username,
        password
      });

      localStorage.setItem("token",res.data.token);

      navigate("/admin/dashboard");

    }catch(err){

      alert("Invalid Username or Password");

    }

  };

  return(

<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700 p-4">

<div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm">

<h1 className="text-2xl font-bold text-center mb-1">
Valod
</h1>

<p className="text-center text-gray-500 mb-6">
Jammat Management System
</p>

<h2 className="text-lg font-semibold mb-4 text-center">
Admin Login
</h2>

<input
placeholder="Username"
className="w-full border rounded p-3 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
value={username}
onChange={(e)=>setUsername(e.target.value)}
/>

<input
type="password"
placeholder="Password"
className="w-full border rounded p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
value={password}
onChange={(e)=>setPassword(e.target.value)}
/>

<button
onClick={login}
className="w-full bg-blue-600 text-white p-3 rounded font-semibold hover:bg-blue-700 transition"
>
Login
</button>

</div>

</div>

  );

}

export default Login;