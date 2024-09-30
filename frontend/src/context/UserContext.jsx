"use client";
import baseUrl from '../service/BaseUrl';
import React, { createContext, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
const UserContext = createContext();

export const UserProvider = ({ children }) => {

  const [user, setUser] = useState(null);

  const [token, setToken] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setToken(sessionStorage.getItem('token') || '');
    }
    if (token) {
      fetchUser();
    }
  }, [token]);


  const fetchUser = async () => {
    try {
      await fetch(`${baseUrl}/sanctum/csrf-cookie`, { credentials: 'include' });
      const response = await fetch(`${baseUrl}/api/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });
      const data = await response.json();
      if (response.ok) {
        setUser(data.user);
      } else if (response.status === 401) {
        Swal.fire({
          icon: 'warning',
          text: data.message,
          color: 'white',
          confirmButtonText: 'ตกลง',
          confirmButtonColor: '#005e95',
          background: 'rgba(0,0,0,0) linear-gradient(rgba(0, 54, 104, 0.5), rgba(0, 94, 149, 0.5)) repeat scroll 0 0',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: "มีบางอย่างผิดปกติ",
        color: "white",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#005e95",
        background: "rgba(0,0,0,0) linear-gradient(rgba(0, 54, 104, 0.5), rgba(0, 94, 149, 0.5)) repeat scroll 0 0",
    });
    } 
  };

  return (
    <UserContext.Provider value={{ user, setUser, token, setToken }}>
    {children}
    </UserContext.Provider >
  );
};

export { UserContext };
