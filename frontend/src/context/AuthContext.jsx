import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
   const [user, setUser] = useState(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const checkLoggedIn = async () => {
         const token = localStorage.getItem('token');
         if (token) {
            try {
               const res = await fetch('http://127.0.0.1:5000/api/auth/me', {
                  headers: { Authorization: `Bearer ${token}` },
               });
               const data = await res.json();
               if (res.ok) {
                  setUser(data);
               } else {
                  localStorage.removeItem('token');
                  setUser(null);
               }
            } catch (err) {
               console.error("Auth check failed", err);
               localStorage.removeItem('token');
               setUser(null);
            }
         }
         setLoading(false);
      };
      checkLoggedIn();
   }, []);

   const login = async (email, password) => {
      try {
         const res = await fetch('http://127.0.0.1:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
         });

         const text = await res.text();
         let data;
         try {
            data = JSON.parse(text);
         } catch (e) {
            console.error("Failed to parse login response:", text);
            return { success: false, error: "Server error: Invalid response format" };
         }

         if (res.ok) {
            localStorage.setItem('token', data.token);
            setUser(data);
            return { success: true };
         } else {
            return { success: false, error: data.error || 'Login failed' };
         }
      } catch (err) {
         console.error("Login error:", err);
         return { success: false, error: "Network error. Please try again." };
      }
   };

   const register = async (username, email, password) => {
      console.log("Attempting register:", { username, email });
      try {
         const res = await fetch('http://127.0.0.1:5000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password }),
         });

         const text = await res.text();
         console.log("Register response raw:", text);

         let data;
         try {
            data = JSON.parse(text);
         } catch (e) {
            console.error("Failed to parse register response:", text);
            return { success: false, error: "Server error: Invalid response format. Check console." };
         }

         if (res.ok) {
            console.log("Register success:", data);
            localStorage.setItem('token', data.token);
            setUser(data);
            return { success: true };
         } else {
            console.error("Register failed:", data);
            return { success: false, error: data.error || 'Registration failed' };
         }
      } catch (err) {
         console.error("Register network error:", err);
         return { success: false, error: "Network error: " + err.message };
      }
   };

   const logout = () => {
      localStorage.removeItem('token');
      setUser(null);
   };

   return (
      <AuthContext.Provider value={{ user, login, register, logout, loading }}>
         {children}
      </AuthContext.Provider>
   );
};
