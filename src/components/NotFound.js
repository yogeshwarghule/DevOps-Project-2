import React from 'react'

function NotFound({query}) {
    return (
        <div className="not_found">
            <div className="not_found_content">
                <h2>Oops!</h2>
                <h2>😅</h2>
                <h3>No result found for "{query}".</h3>
            </div>
        </div>
    )
}

export default NotFound
