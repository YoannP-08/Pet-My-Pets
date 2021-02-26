import React from 'react';
import styleSearch from "../../styles/Search.module.css"

const Search = (props) => {

    return (
        <div className={styleSearch.cont}>
            <div className={styleSearch.container}>
                <input className={styleSearch.input} placeholder="Search..." type="text" value={props.inputSearch} onChange={props.searchOnChange} />
            </div>
        </div>
    )
}

export default Search