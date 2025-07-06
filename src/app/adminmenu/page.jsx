"use client"
import React, {useEffect, useState} from 'react';
import Sidebar from "@/components/Sidebar/Sidebar";
import "./adminmenu.scss"
import ArticleForm from "@/components/ArticleForm/ArticleForm";
import ArticlesList from "@/components/ArticlesList/ArticlesList";
import Header from "@/components/Header/Header";
import {useRouter} from "next/navigation";
const AdminMenu = () => {
    const [articles, setArticles] = useState([]);
    const [categories, setCategories] = useState([]);
    const router = useRouter();
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isFormShown, setIsFormShown] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    const ChangeForm = () => {
        setIsFormShown(!isFormShown);
    };

    useEffect(() => {

        const checkAdminAuth = () => {
            const adminData = localStorage.getItem('admindata');
            if (!adminData) {
                router.push('/register');
            } else {
                setIsAdmin(true);
            }
        };


        checkAdminAuth();
    }, [router]);


    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/getcategories');
                if (!response.ok) {
                    throw new Error('Ошибка при получении категорий');
                }
                const data = await response.json();
                setCategories(data);
            } catch (error) {
                console.error('Ошибка при получении категорий:', error);

            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                let url = 'http://localhost:5000/api/adminmenu';
                if (selectedCategory) {
                    url = `http://localhost:5000/api/articles/category/${selectedCategory}`;
                }
                const response = await fetch(url);
                const data = await response.json();
                setArticles(data);
            } catch (error) {
                console.error('Ошибка при получении новостей:', error);
            }
        };

        fetchArticles();
    }, [selectedCategory]);

    const handleCategorySelect = (categorySlug) => {
        setSelectedCategory(categorySlug);
    };


    if (!isAdmin) {
        return <p>Проверка авторизации...</p>;
    }

    return (
        <div className="adminmenu-container">
            <Header />

            {isFormShown ? (
                <ArticleForm  articles = {articles}/>
            ) : (
                <ArticlesList articles={articles} setArticles={setArticles} />
            )}
            <Sidebar categories={categories} onCategorySelect={handleCategorySelect} swapForm={ChangeForm} />
        </div>
    );
};

export default AdminMenu;

