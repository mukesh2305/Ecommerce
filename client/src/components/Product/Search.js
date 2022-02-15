import React, { Fragment, useState } from 'react'
import { useNavigate } from "react-router";
import MetaData from '../layout/MetaData';
import "./Search.css"

// in react-router6 history is replaced with navigate
const Search = () => {
    const [keyword, setKeyword] = useState("");
    // const { history } = useHistory();
    const navigate = useNavigate();

    const searchSubmitHandler = (e) => {
        e.preventDefault();
        if (keyword.trim()) {
            // history.push(`/products/${keyword}`);
            navigate(`/products/${keyword}`);
        } else {
            // history.push(`/products`);
            navigate(`/products`);
        }
    };
    return (
        <Fragment>
            <MetaData title="Search A Product --- ECOMMERCE" />

            <form className='searchBox' onSubmit={searchSubmitHandler}>
                <input
                    type="text"
                    placeholder='Search a Product ...'
                    onChange={(e) => setKeyword(e.target.value)}
                />
                <input type="submit" value="Search" />
            </form>
        </Fragment>
    )
}

export default Search
