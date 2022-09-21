import React, { useEffect } from 'react';
import './Header.css';
import axios from 'axios';

function Header({
    query, setQuery,
    allProducts, setSearchProducts,
    filteredProducts, setFilteredProducts,
    setCategory,
    categories, setCategories }) {

    const handleSearch = (event) => {
        let value = event.target.value;

        setQuery(value);
        let result = [];
 
        result = filteredProducts.filter((data) => {
            return data.title.toLowerCase().search(value.toLowerCase()) !== -1;
        });
        setSearchProducts(result);

    }

    const handleFilter = (e) => {
        let category = e.target.value;
        setQuery("");
        setCategory(category);
        let result = [];
        result = category === "all" ? allProducts : allProducts.filter((data) => {
            return data.category.toLowerCase().search(category.toLowerCase()) !== -1;
        });
        setFilteredProducts(result);
    }

    useEffect(() => {
        axios('https://fakestoreapi.com/products/categories')
            .then((response) => {
                // console.log(response.data)
                response.data.unshift("all");
                setCategories(response.data);
            })
            .catch(error => {
                console.log('Error getting fake data: ' + error);
            })

    }, []);


    return (
        <div className="header">
            <div className="right_align">
                <select name="cars" id="cars" className="filter_product" onChange={(e) => handleFilter(e)}>
                    {
                        categories.map((item, ind) => {
                            return (
                                <option value={item} key={ind}>{item}</option>
                            )
                        })
                    }
                </select>
                <input type="search"
                    name="search_product"
                    className="search_input"
                    placeholder="Search for ..."
                    value={query}
                    onChange={(e) => handleSearch(e)} />
            </div>
        </div>
    )
}

export default Header
