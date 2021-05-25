import { RootState } from 'store';
import {
  createSlice,
  PayloadAction,
  ThunkDispatch,
  AnyAction,
  createAsyncThunk,
} from '@reduxjs/toolkit';

import * as api from 'api';
import { Client } from 'api';
import { setError } from './app';

const initialState: ClientsState = {
  clients: [],
  providers: [],
  state: 'LOADING',
  topeClientes: 0,
};

export type SliceState = 'READY' | 'LOADING' | 'ERROR';

interface ClientsState {
  clients: api.Client[];
  providers: api.Client[];
  topeClientes: number;
  state: SliceState;
}

export const getClientList = createAsyncThunk(
  'clients/getList',
  async (_, { dispatch, getState }) => {
    const {
      app: { rut },
    } = getState() as RootState;
    if (rut != null) {
      try {
        const [clients, tope] = await Promise.all([
          api.getClients(rut),
          api.getTopeClientes(rut),
        ]);
        dispatch(setClients({ clients, tope }));
      } catch (error) {
        dispatch(setError(error));
      }
    }
  }
);

export const postClientThunk = createAsyncThunk(
  'clients/post',
  async (client: api.Client, { dispatch, getState }) => {
    const {
      app: { rut },
    } = getState() as RootState;
    if (rut != null) {
      try {
        await api.postClient(rut, client);
        dispatch(getClientList());
      } catch (error) {
        dispatch(setError(error));
      }
    }
  }
);

export const updateClientThunk = createAsyncThunk(
  'clients/post',
  async (client: api.Client, { dispatch, getState }) => {
    dispatch(setState('LOADING'));
    const {
      app: { rut },
    } = getState() as RootState;
    if (rut != null) {
      try {
        await api.updateClient(rut, client);
        dispatch(getClientList());
      } catch (error) {
        dispatch(setError(error));
      }
    }
  }
);

export const deleteClient = (id: number) => async (
  dispatch: ThunkDispatch<{}, {}, AnyAction>,
  getState: () => RootState
) => {
  dispatch(setState('LOADING'));
  const { rut } = getState().app;
  if (rut != null) {
    try {
      await api.deleteClient(rut, id);
      dispatch(getClientList());
    } catch (error) {
      dispatch(setError(error));
    }
  }
};

export const getProviderList = createAsyncThunk(
  'clients/getListProviders',
  async (_, { dispatch, getState }) => {
    const {
      app: { rut },
    } = getState() as RootState;
    if (rut != null) {
      try {
        const [providers, tope] = await Promise.all([
          api.getProviders(rut),
          api.getTopeClientes(rut),
        ]);
        dispatch(setProviders({ providers, tope }));
      } catch (error) {
        dispatch(setError(error));
      }
    }
  }
);

export const postProviderThunk = createAsyncThunk(
  'clients/postProvider',
  async (client: api.Client, { dispatch, getState }) => {
    const {
      app: { rut },
    } = getState() as RootState;
    if (rut != null) {
      try {
        await api.postProvider(rut, client);
        dispatch(getProviderList());
      } catch (error) {
        dispatch(setError(error));
      }
    }
  }
);

export const updateProviderThunk = createAsyncThunk(
  'clients/postProvider',
  async (client: api.Client, { dispatch, getState }) => {
    dispatch(setState('LOADING'));
    const {
      app: { rut },
    } = getState() as RootState;
    if (rut != null) {
      try {
        await api.updateProvider(rut, client);
        dispatch(getProviderList());
      } catch (error) {
        dispatch(setError(error));
      }
    }
  }
);

export const deleteProvider = (id: number) => async (
  dispatch: ThunkDispatch<{}, {}, AnyAction>,
  getState: () => RootState
) => {
  dispatch(setState('LOADING'));
  const { rut } = getState().app;
  if (rut != null) {
    try {
      await api.deleteProvider(rut, id);
      dispatch(getProviderList());
    } catch (error) {
      dispatch(setError(error));
    }
  }
};

const clientsSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    setClients(
      state,
      action: PayloadAction<{ clients: Client[]; tope: number }>
    ) {
      state.clients = action.payload.clients;
      state.topeClientes = action.payload.tope;
      state.state = 'READY';
    },
    setTope(state, action: PayloadAction<number>) {
      state.topeClientes = action.payload;
    },
    setState(state, action: PayloadAction<SliceState>) {
      state.state = action.payload;
    },
    setProviders(
      state,
      action: PayloadAction<{ providers: Client[]; tope: number }>
    ) {
      state.providers = action.payload.providers;
      state.topeClientes = action.payload.tope;
      state.state = 'READY';
    },
  },
});

export const { setClients, setState, setProviders } = clientsSlice.actions;
export const clientsReducer = clientsSlice.reducer;
