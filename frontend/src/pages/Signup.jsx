import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Signup() {
   const [username, setUsername] = useState('');
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const { register } = useAuth();
   const navigate = useNavigate();

   const handleSubmit = async (e) => {
      e.preventDefault();
      const toastId = toast.loading('Creating account...');
      const res = await register(username, email, password);

      if (res.success) {
         toast.success('Account created successfully!', { id: toastId });
         navigate('/');
      } else {
         toast.error(res.error || 'Failed to create account', { id: toastId });
      }
   };

   return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f1117] px-4">
         <div className="max-w-md w-full space-y-8 bg-[#161b22] p-8 rounded-xl border border-gray-800 shadow-2xl">
            <div>
               <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
                  Create your account
               </h2>
            </div>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
               <div className="rounded-md shadow-sm -space-y-px">
                  <div>
                     <input
                        type="text"
                        required
                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-gray-300 bg-[#0d1117] rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                     />
                  </div>
                  <div>
                     <input
                        type="email"
                        required
                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-gray-300 bg-[#0d1117] focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                     />
                  </div>
                  <div>
                     <input
                        type="password"
                        required
                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-gray-300 bg-[#0d1117] rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                     />
                  </div>
               </div>

               <div>
                  <button
                     type="submit"
                     className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                     Sign up
                  </button>
               </div>

               <div className="text-sm text-center">
                  <Link to="/login" className="font-medium text-white">
                     Already have an account? <span className="font-medium text-blue-500 hover:text-blue-400">Sign in</span>
                  </Link>
               </div>
            </form>
         </div>
      </div>
   );
}
