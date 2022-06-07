// import { useCallback, useEffect, useState } from 'react';

import { useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { setActiveRoute } from "store/activeRoute";

export const LoginPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setActiveRoute("login"));
  }, [dispatch]);
  return (
    <div className="p-4 d-flex flex-column justify-content-center align-items-center">
        <p
          className="remark"
          style={{
            fontSize: "0.8rem",
          }}
        >
          {
            "( Not implemented yet )"
          }
        </p>
      <Form onSubmit={()=>{}} className="border shadow rounded p-4">
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Text className="text-muted">
            <div>You must login to grant access to protected route</div>
          </Form.Text>
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Check type="checkbox" label="Check me out" />
        </Form.Group>
        <Button variant="primary" className="w-100" >
          Submit
        </Button>
      </Form>

      <Link to="/">go back to home</Link>
    </div>
  );
};
