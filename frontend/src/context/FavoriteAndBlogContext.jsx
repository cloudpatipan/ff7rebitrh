"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import baseUrl from "@/service/BaseUrl";
import { UserContext } from "@/context/UserContext";

const FavoriteAndBlogContext = createContext();

export const FavoriteAndBlogProvider = ({ children }) => {
    const { token } = useContext(UserContext);
    const [favorites, setFavorites] = useState([]);
    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        if (token) {
            fetchFavorite();
            fetchBlog();
        }
    }, [token]);
    

    const fetchFavorite = async () => {
        try {
            await fetch(`${baseUrl}/sanctum/csrf-cookie`);
            const response = await fetch(`${baseUrl}/api/myfavorite`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();
            if (response.ok) {
                setFavorites(data.favorites);
            } else if (response.status === 401) {
                Swal.fire({
                    icon: "error",
                    text: data.message,
                    color: "white",
                    confirmButtonText: "ตกลง",
                    confirmButtonColor: "#005e95",
                    background:
                        "rgba(0,0,0,0) linear-gradient(rgba(0, 54, 104, 0.5), rgba(0, 94, 149, 0.5)) repeat scroll 0 0",
                });
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                text: error.message,
                color: "white",
                confirmButtonText: "ตกลง",
                confirmButtonColor: "#005e95",
                background:
                    "rgba(0,0,0,0) linear-gradient(rgba(0, 54, 104, 0.5), rgba(0, 94, 149, 0.5)) repeat scroll 0 0",
            });
        }
    };

    const fetchBlog = async () => {
        try {
            await fetch(`${baseUrl}/sanctum/csrf-cookie`);
            const response = await fetch(`${baseUrl}/api/myblog`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();
            if (response.ok) {
                setBlogs(data.blogs);
            } else if (response.status === 401) {
                Swal.fire({
                    icon: "error",
                    text: data.message,
                    color: "white",
                    confirmButtonText: "ตกลง",
                    confirmButtonColor: "#005e95",
                    background:
                        "rgba(0,0,0,0) linear-gradient(rgba(0, 54, 104, 0.5), rgba(0, 94, 149, 0.5)) repeat scroll 0 0",
                });
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                text: error.message,
                color: "white",
                confirmButtonText: "ตกลง",
                confirmButtonColor: "#005e95",
                background:
                    "rgba(0,0,0,0) linear-gradient(rgba(0, 54, 104, 0.5), rgba(0, 94, 149, 0.5)) repeat scroll 0 0",
            });
        }
    };

    return (
        <FavoriteAndBlogContext.Provider value={{ favorites, setFavorites, blogs, setBlogs, fetchFavorite, fetchBlog }}>
            {children}
        </FavoriteAndBlogContext.Provider>
    );
};

export { FavoriteAndBlogContext };
