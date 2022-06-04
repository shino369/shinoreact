// import { useCallback, useEffect, useState } from 'react';

import { Link } from "react-router-dom"

export const AboutPage = () => {
    return (
        <div className="d-flex flex-column justify-content-center align-items-center">
            <div>hello About!</div>
            <Link to="/detail">go to detail</Link>

        </div>
    )
}