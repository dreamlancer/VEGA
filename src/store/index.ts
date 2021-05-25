import { docsReducer } from './docs';
import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { appReducer } from './app';
import { preferencesReducer } from './preferences';
import { clientsReducer } from './clients';

const rootReducer = combineReducers({
  app: appReducer,
  preferences: preferencesReducer,
  clients: clientsReducer,
  docs: docsReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: [thunk],
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof rootReducer>;
