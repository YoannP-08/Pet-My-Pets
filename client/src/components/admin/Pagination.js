import React from "react"
import stylePagination from "../../styles/Pagination.module.css"

const Pagination = ({usersPerPage, totalUsers,paginate}) => {
    const pageNumbers = []

    for(let i = 1; i <= Math.ceil(totalUsers/ usersPerPage) ; i++){
        pageNumbers.push(i)
    }

    return(
            <ul className={stylePagination.pagination}>
                {pageNumbers.map(number => (
                    <li key={number} className={stylePagination.page}>
                        <p style={{ cursor: 'pointer' }} onClick={() => paginate(number)} className={stylePagination.pagelink}>
                            {number}
                        </p>
                    </li>
                ))}
            </ul>
    )
}

export default Pagination