// import { useCallback, useEffect, useState } from 'react';

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { setActiveRoute } from "store/activeRoute";

export const DetailPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setActiveRoute("detail"));
  }, [dispatch]);
  return (
    <div className="d-flex flex-column justify-content-center align-items-center">
      <div>this is the detail page</div>
      <Link to="/">go back to home</Link>
    </div>
  );
};
