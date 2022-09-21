import React, { useState, useEffect } from 'react';
import './ProductBox.css';
import Header from './Header';
import axios from 'axios';
import Loading from './Loading';
import Modal from 'react-modal';
import { Pie } from 'react-chartjs-2';

import { Chart, ArcElement } from 'chart.js'
import NotFound from './NotFound';
Chart.register(ArcElement);

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        padding: '60px 100px',
        transform: 'translate(-50%, -50%)',
    },
};

Modal.setAppElement('#root');

function ProductBox() {

    const [allProducts, setAllProducts] = useState([]);
    const [searchProducts, setSearchProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [category, setCategory] = useState("all");
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [modalIsOpen, setIsOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [categoryList,setCategoryList] = useState([]);
    const [categoriesCount, setCategoriesCount] = useState([]);
    
    const backgroundList = [
        '#B21F00',
        '#C9DE00',
        '#2FDE00',
        '#00A6B4',
        '#6800B4'
    ]

    const state = {
        labels: categoryList,
        datasets: [
            {
                label: 'Rainfall',
                backgroundColor: backgroundList,
                hoverBackgroundColor: [
                    '#501800',
                    '#4B5000',
                    '#175000',
                    '#003350',
                    '#35014F'
                ],
                data: categoriesCount
            }
        ]
    }

    const handleAnalyse = () => {
        console.log("click");
        openModal();
    }

    function openModal() {
        setIsOpen(true);
    }
    let subtitle;
    function afterOpenModal() {
        // references are now sync'd and can be accessed.
        subtitle.style.color = '#f00';
    }

    function closeModal() {
        setIsOpen(false);
    }

    useEffect(() => {
        axios('https://fakestoreapi.com/products')
            .then((response) => {
                // console.log(response.data)
                setLoading(false);
                setAllProducts(response.data);
                setFilteredProducts(response.data);
                const categoriesList = response.data.reduce((acc, cur) => {
                    acc[cur.category] = (acc[cur.category] || 0) + 1
                    return acc;
                 }, {})

                 let array=[], catList=[];
                 for(const cat in categoriesList) {
                     catList.push(cat);
                    array.push(categoriesList[cat]);
                 }

                 setCategoryList(catList);
                 setCategoriesCount(array);
            })
            .catch(error => {
                console.log('Error getting fake data: ' + error);
            })
    }, []);

    return (
        <div>
            <Header query={query}
                setQuery={setQuery}
                allProducts={allProducts}
                setSearchProducts={setSearchProducts}
                setCategory={setCategory}
                filteredProducts={filteredProducts}
                setFilteredProducts={setFilteredProducts}
                categories={categories}
                setCategories={setCategories} />
            <div className="product_box">
                {
                    (query.length !== 0 && searchProducts.length === 0 ? 
                        <NotFound query={query} /> : (category !== "all" && query.length === 0 ?
                        filteredProducts : query.length !== 0 ?
                            searchProducts : allProducts).map((item, index) => {
                                return (
                                    <div className="card" key={item.id}>
                                        <div className="product_image">
                                            <img
                                                src={item.image}
                                                alt={item.title.length > 24 ? item.title.substring(0, 24) + '...' : item.title} />
                                            <div className="category">{item.category}</div>
                                        </div>

                                        <div className="product_info">
                                            <h2>{item.title.length > 60 ? item.title.substring(0, 60) + '...' : item.title}</h2>
                                            <p>
                                                {item.description.substring(0, 50)}
                                            </p>
                                            <div>price: <span>${item.price}</span></div>
                                        </div>

                                    </div>
                                )
                            }))
                }
                {loading && <Loading />}
                <div className="btn_analyse">
                    <button onClick={handleAnalyse}>Analyse</button>
                </div>
            </div>
            <Modal
                isOpen={modalIsOpen}
                afterOpenModal={afterOpenModal}
                onRequestClose={closeModal}
                style={customStyles}
            >

                <button className="close_modal" onClick={closeModal}>x</button>
                <div className="chart_indicator_box">
                {
                    categoryList.map((item,ind) => {
                        return (
                            <div className="indicator_content" key={ind}>
                                <span className="indicator_symbol" style={{
                                    backgroundColor: backgroundList[ind]
                                }}></span>
                                {item}
                            </div> 
                        )
                    })
                }
                </div>
                <Pie
                    style={{
                        width: '50px',
                        height: '50px'
                    }}
                    data={state}
                    options={{
                        title: {
                            display: true,
                            text: 'Average Rainfall per month',
                            fontSize: 20
                        },
                        legend: {
                            display: true,
                            position: 'right'
                        }
                    }}
                />
            </Modal>
        </div>
    )
}

export default ProductBox;
