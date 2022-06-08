// import { useCallback, useEffect, useState } from 'react';

import { Form, Formik } from "formik";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setActiveRoute } from "store/activeRoute";
import { Alert, Card, CardBody, Col, Container, Row } from "reactstrap";
import { InputField } from "app/components";
import * as Yup from "yup";

const Schema = Yup.object().shape({
  username: Yup.string().required("required"),
  password: Yup.string().required("required"),
});

export const LoginPage = () => {
  const dispatch = useDispatch();
  const navigation = useNavigate();

  useEffect(() => {
    dispatch(setActiveRoute("login"));
  }, [dispatch]);

  const onSubmit = async (values: any, action: any) => {
    // dispatch(loginStart());
    try {
      // await login(values);
      // const user = await getUser();
      // dispatch(setUser(user));
      // dispatch(loginSuccess());
      navigation("/detail");
    } catch (err) {
      // console.error(err);
      // dispatch(loginFail('Incorrect username or password'));
    }
  };

  return (
    <div className="p-4 d-flex flex-column justify-content-center align-items-center">
      <p
        className="remark"
        style={{
          fontSize: "0.8rem",
        }}
      >
        {"( Not implemented yet )"}
      </p>
      <Row className="">
        <Col>
          <Card className="shadow overflow-hidden">
          <div className="bg-primary w-100" style={{height:'2rem'}}></div>
            <CardBody className="mx-4 mb-4">
              
              <Formik
                initialValues={{
                  loginName: "",
                  password: "",
                }}
                validationSchema={Schema}
                onSubmit={onSubmit}
              >
                {() => (
                  <Form className="form-horizontal">
                    {/* {loginError && typeof loginError === 'string' ? (
                            <Alert color="danger">{loginError}</Alert>
                          ) : null} */}
                    <div className="mb-3">
                      <InputField
                        name="username"
                        label="username"
                        placeholder="username"
                        type="text"
                      />
                    </div>
                    <div className="mb-3">
                      <InputField
                        name="password"
                        label="password"
                        placeholder="password"
                        type="password"
                      />
                    </div>
                    <div className="mt-3 d-grid">
                      <button
                        className="btn btn-primary btn-block"
                        type="submit"
                        // disabled={loginLoading}
                      >
                        Login
                        {/* {loginLoading ? (
                                <i className="bx bx-loader-circle bx-spin" />
                              ) : (
                                '登入'
                              )} */}
                      </button>
                    </div>
                    <div className="mt-4 text-center"></div>
                  </Form>
                )}
              </Formik>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Link to="/">go back to home</Link>
    </div>
  );
};
