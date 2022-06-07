import { configureStore } from "@reduxjs/toolkit";
import { Action, combineReducers } from "redux";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { ThunkAction } from "redux-thunk";
import activeRoute from "./activeRoute";

const reducers = combineReducers({
  //   layout,
  //   auth,
  //   permission,
  // add more reducer here
  activeRoute
});

export type RootState = ReturnType<typeof reducers>;

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
};

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => {
    const middlewares = getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    });
    return middlewares;
  },
});

const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;

export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;

export { store, persistor };
