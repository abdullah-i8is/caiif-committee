import { combineReducers, configureStore } from "@reduxjs/toolkit";
import commonReducer from "./commonSlice/commonSlice";
import authReducer from "./authSlice/authSlice";
import membersReducer from "./membersSlice/membersSlice";
import committeesReducer from "./committeeSlice/committeeSlice";
import storage from 'redux-persist/lib/storage';

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

const allreducers = combineReducers({
  auth: authReducer,
  common: commonReducer,
  members: membersReducer,
  committees: committeesReducer,
});

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist:['common', 'auth']
};

const persistedReducer = persistReducer(persistConfig , allreducers);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
      serializableCheck: false
    }),
});

export const persistor = persistStore(store);
