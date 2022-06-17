// import { useCallback, useEffect, useState } from 'react';

import { Form, Formik } from "formik";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setActiveRoute } from "store/activeRoute";
import { Alert, Card, CardBody, Col, Container, Row } from "reactstrap";
import { InputField } from "app/components";
import * as Yup from "yup";
import { setAuthenticated, setUser } from "store/auth";
import { toast, ToastContainer } from "react-toastify";
import { RootState } from "store";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import "./index.scss";
import { setLoading } from "store/loading";
import {
  collection,
  addDoc,
  getDoc,
  setDoc,
  doc,
  query,
  where,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "app/hooks/firebase";

const Schema = Yup.object().shape({
  username: Yup.string().required("required"),
  password: Yup.string().required("required"),
});

export const LoginPage = () => {
  const dispatch = useDispatch();
  const navigation = useNavigate();
  const { user, isAuthenticated } = useSelector(
    (rootState: RootState) => rootState.auth
  );

  useEffect(() => {
    dispatch(setActiveRoute("login"));
  }, [dispatch]);

  const handleLoginGoogle = async () => {
    dispatch(setLoading(true));
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      dispatch(setAuthenticated(true));
      dispatch(setUser(user));
      // console.log(user);

      // check if user exist in firestore users
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        const userData = {
          uid: user.uid,
          email: user.email || "",
          displayName: user.displayName || "",
          photoURL: user.photoURL || "",
          role: "user" || "",
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        };
        await setDoc(doc(db, "users", user.uid), userData);
      } else {
        // update existing user
        const userData = {
          displayName: user.displayName || "",
          photoURL: user.photoURL || "",
          updatedAt: Timestamp.now(),
        };
        await updateDoc(doc(db, "users", user.uid), userData);
      }

      dispatch(setLoading(false));
      setTimeout(() => {
        console.log("navigate to chat");
        navigation("/chat");
      }, 500);
    } catch (error) {
      console.log(error);
      dispatch(setLoading(false));
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
        Make use of firebase authentication. Please enable broswer popup for
        login.
      </p>
      <div>
        <div className="text-danger text-center">Disclaimer</div>
        <div>
          Server will only store the following data returned by firebase:
        </div>
        <div className="d-flex justify-content-center">
          <ul
            className="remark mb-1"
            style={{
              fontSize: "0.8rem",
            }}
          >
            <li>firebase auto-generated uid</li>
            <li>your gmail</li>
            <li>your google account display name</li>
            <li>avatar</li>
          </ul>
        </div>

        <div className="mb-2 text-center">
          And will not be used for commercial purposes.
        </div>
      </div>
      <button
        onClick={handleLoginGoogle}
        style={{
          backgroundColor: "rgb(55, 85, 168)",
          color: "white",
        }}
        className="btn button-primary google d-flex align-items-center p-2 mb-2"
      >
        <div className="bg-white p-2 me-2">
          <img
            width={30}
            height={30}
            src={require("app/assets/images/google.png")}
            alt="google"
          />
        </div>

        <div className="signIn">Sign in with Google</div>
      </button>
      {/* <Row className="">
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
                    {loginError && typeof loginError === 'string' ? (
                            <Alert color="danger">{loginError}</Alert>
                          ) : null}
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
                        {loginLoading ? (
                                <i className="bx bx-loader-circle bx-spin" />
                              ) : (
                                '登入'
                              )}
                      </button>
                    </div>
                    <div className="mt-4 text-center"></div>
                  </Form>
                )}
              </Formik>
            </CardBody>
          </Card>
        </Col>
      </Row> */}

      <Link to="/">go back to home</Link>
    </div>
  );
};
