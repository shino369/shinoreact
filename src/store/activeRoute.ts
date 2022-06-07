import { createSlice, PayloadAction } from '@reduxjs/toolkit'
// import { useNavigate } from 'react-router-dom'
import { AppThunk } from './index'

interface ActiveRouteState {
    activeRoute: string
}

const initialState: ActiveRouteState = {
    activeRoute: 'Home'
}

const activeRouteSlide = createSlice({
  name: 'activeRoute',
  initialState,
  reducers: {

    setActiveRoute(state, action: PayloadAction<string>) {
      state.activeRoute = action.payload
    },
    reset() {
      return initialState
    },
  },
})

export const {
    setActiveRoute,
} = activeRouteSlide.actions
const { reset } = activeRouteSlide.actions
export default activeRouteSlide.reducer

export const initActiveRoute =
  (activeRoute: string): AppThunk =>
  async dispatch => {
    dispatch(reset())
    dispatch(setActiveRoute(activeRoute))
  }