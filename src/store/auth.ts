import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { AdminAuthRequest, AdminAuthResponse, api } from 'app/api';
import { toast } from "react-toastify";
import { AppThunk } from "store";

import { getAuth, signInWithPopup, GoogleAuthProvider, User } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useReducer } from "react";

// create auth and store it in the store

interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
}

const initialState:AuthState = {
  isAuthenticated: false,
  user: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    setUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
    },
    reset() {
      return initialState;
    },
  },
});

export const { setAuthenticated, setUser } = authSlice.actions;
export default authSlice.reducer;