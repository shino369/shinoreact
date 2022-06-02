// import { useCallback, useEffect, useState } from 'react';

import { Link } from "react-router-dom"

export const HomePage = () => {
    return (
        <div className="d-flex flex-column h-100 justify-content-center align-items-center">
            <div>hello world!</div>
            <Link to="/home/detail">go to detail</Link>

        </div>
    )
}