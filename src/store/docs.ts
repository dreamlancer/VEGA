import { postHeader, postLineas, validar } from './../api/postDocument';
import { SliceState } from './preferences';
import { RootState } from 'store';
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import moment from 'moment';

import * as api from 'api';
import {
  formatDocument,
  formatLineas,
  formatLineasResguardo,
} from 'api/formatDocument';
import { setError } from './app';
import { DocTypes } from 'components/DocumentForm';

const initialState: DocsState = {
  remaining: [],
  documents: [],
  compras: [],
  state: 'LOADING',
  postState: 'READY',
  available: '',
};

interface DocsState {
  remaining: api.Remaining[];
  documents: api.Document[];
  compras: api.Document[];
  state: SliceState;
  postState: PostState;
  available: string;
  error?: string | Error;
}

type PostState = SliceState | 'SUCCESS';

interface PostStatePayload {
  state: PostState;
  error?: string;
}

export const updateCompras = createAsyncThunk(
  'docs/compras/update',
  async (_, { dispatch, getState }) => {
    const {
      app: { rut, id, isAdmin, isAccountant },
    } = getState() as RootState;
    if (rut != null && id != null) {
      try {
        const compras = await api.getAllCompras(
          rut, 
          id, 
          isAccountant, 
          moment(new Date(2020, 0, 1)).format('DD-MM-yyyy'),
          moment(new Date()).format('DD-MM-yyyy'));
        dispatch(setCompras(compras));
      } catch (error) {
        dispatch(setError(error));
      }
    }
  }
);

export const updateDocuments = createAsyncThunk(
  'docs/documents/update',
  async (_, { dispatch, getState }) => {
    const {
      app: { rut, id, isAdmin, isAccountant },
    } = getState() as RootState;
    if (rut != null && id != null) {
      try {
        const documents = await api.getAllDocuments(
          rut,
          id,
          isAccountant,
          moment(new Date(new Date().getFullYear(), new Date().getMonth(), 1)).format('DD-MM-yyyy'),
          moment(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)).format('DD-MM-yyyy'),
        );
        dispatch(setDocuments(documents));
      } catch (error) {
        dispatch(setError(error));
      }
    }
  }
);

export const updateRemaining = createAsyncThunk(
  'docs/remaining/update',
  async (_, { dispatch, getState }) => {
    const {
      app: { rut },
    } = getState() as RootState;
    if (rut != null) {
      try {
        const remaining = await api.getRestantes(rut);
        dispatch(setRemaining(remaining));
      } catch (error) {
        dispatch(setError(error));
      }
    }
  }
);

export const updateAvailable = createAsyncThunk(
  'docs/available/update',
  async (_, { dispatch, getState }) => {
    const {
      app: { rut },
    } = getState() as RootState;
    if (rut != null) {
      try {
        const remaining = await api.getAvailableDocs(rut);
        dispatch(setAvailable(remaining));
      } catch (error) {
        dispatch(setError(error));
      }
    }
  }
);

interface PostPaylad {
  doc: any;
  lineas?: any;
  type: DocTypes;
  resguardo?: any;
}

export const postDocumentThunk = createAsyncThunk(
  'docs/post',
  async (doc: PostPaylad, { dispatch, getState }) => {
    const {
      app: { rut, interbancario },
    } = getState() as RootState;

    if (rut != null && interbancario != null) {
      try {
        dispatch(setPostState({ state: 'LOADING' }));
        const formatted = formatDocument(doc.doc, rut, interbancario, doc.type);
        const id = await postHeader(formatted);
        if (!id) {
          throw new Error('Recibo_Datos no devolvió un ID');
        }
        if (typeof id === 'string') {
          // If its type string, then is a backend error
          throw new Error(id);
        }
        let lineas;
        if (doc.type === 'Resguardo' && doc.resguardo) {
          lineas = formatLineasResguardo(doc.resguardo, formatted, id);
        } else {
          lineas = formatLineas(doc.lineas, formatted, id, doc.doc);
        }
        const reslineas = await postLineas(lineas);
        const resValidar = await validar(rut, id);
        if (resValidar === 'OK') {
          dispatch(setPostState({ state: 'SUCCESS' }));
        } else {
          dispatch(setPostState({ state: 'ERROR', error: resValidar }));
        }
      } catch (error) {
        dispatch(setPostState({ state: 'ERROR', error }));
      }
    } else {
      if (!interbancario) {
        throw new Error('No existe el valodr del dolar');
      }
      if (!rut) {
        throw new Error('No RUT');
      }
    }
  }
);

const docsSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    setState(state, action: PayloadAction<SliceState>) {
      state.state = action.payload;
    },
    setDocuments(state, action: PayloadAction<api.Document[]>) {
      state.documents = action.payload;
      state.state = 'READY';
    },
    setCompras(state, action: PayloadAction<api.Document[]>) {
      state.compras = action.payload;
      state.state = 'READY';
    },
    setRemaining(state, action: PayloadAction<api.Remaining[]>) {
      state.remaining = action.payload;
      state.state = 'READY';
    },
    setPostState(state, action: PayloadAction<PostStatePayload>) {
      state.postState = action.payload.state;
      state.error = action.payload.error;
    },
    setAvailable(state, action: PayloadAction<string>) {
      state.available = action.payload;
    },
  },
});

export const {
  setDocuments,
  setCompras,
  setRemaining,
  setState,
  setPostState,
  setAvailable,
} = docsSlice.actions;
export const docsReducer = docsSlice.reducer;
