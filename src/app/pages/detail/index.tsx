// import { useCallback, useEffect, useState } from 'react';

import { Link } from "react-router-dom";

export const DetailPage = () => {
  return (
    <div className="d-flex flex-column h-100 justify-content-center align-items-center">
      <div>this is the detail page</div>
      <Link to="/home">go back to home</Link>
    </div>
  );
};
