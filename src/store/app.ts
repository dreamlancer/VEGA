import {
  updateRemaining,
  updateDocuments,
  updateCompras,
  updateAvailable,
} from './docs';
import {
  createSlice,
  PayloadAction,
  ThunkDispatch,
  AnyAction,
  createAsyncThunk,
} from '@reduxjs/toolkit';
import * as api from 'api';
import { WSError } from 'api/utils';
import { updatePreferences } from './preferences';

const initialState: AppState = {
  rut: null,
  isAdmin: false,
  isAccountant: false,
  canExport: false,
  licence: 1,
  messages: [],
  id: null,
  name: '',
  certificate: null,
  interbancario: null,
  error: null,
};

interface AppState {
  rut: string | null;
  isAdmin: boolean;
  isAccountant: boolean;
  canExport: boolean;
  licence: number;
  id: number | null;
  messages: api.Message[];
  name: string;
  certificate: string | null;
  interbancario: number | null;
  error: WSError | null;
}

interface SetUserPayload {
  rut: string;
  isAdmin: boolean;
  id: number;
  isAccountant: boolean;
  canExport: boolean;
}

export const loginSuccess = (payload: SetUserPayload) => async (
  dispatch: ThunkDispatch<{}, {}, AnyAction>
) => {
  try {
    dispatch(setUser(payload));

    const [licence, messages, certificado, name] = await Promise.all([
      api.getLicence(payload.rut),
      api.getMessages(payload.rut),
      api.getCertificate(payload.rut),
      api.getName(payload.rut),
    ]);

    dispatch(setLicence(licence));
    dispatch(updateAvailable());
    dispatch(updateRemaining());
    dispatch(updateDocuments());
    dispatch(updateCompras());
    dispatch(updatePreferences());
    dispatch(setName(name));
    dispatch(setCertificate(certificado));
    dispatch(setMessages(messages));
  } catch (error) {
    dispatch(setError(error));
  }
};

export const getInterbancario = createAsyncThunk(
  'app/getInterbancario',
  async (_, { dispatch }) => {
    try {
      const interbancario = await api.getInterbancario();
      dispatch(setInterbancario(interbancario));
    } catch (error) {
      dispatch(setError(error));
    }
  }
);

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<SetUserPayload>) {
      return { ...state, ...action.payload };
    },
    logout() {
      return initialState;
    },
    setLicence(state, action: PayloadAction<number>) {
      state.licence = action.payload;
    },
    setMessages(state, action: PayloadAction<api.Message[]>) {
      state.messages = action.payload;
    },
    setName(state, action: PayloadAction<string>) {
      state.name = action.payload;
    },
    setCertificate(state, action: PayloadAction<string>) {
      state.certificate = action.payload;
    },
    setInterbancario(state, action: PayloadAction<number>) {
      state.interbancario = action.payload;
    },
    setError(state, action: PayloadAction<WSError>) {
      state.error = action.payload;
    },
  },
});

export const {
  setUser,
  logout,
  setLicence,
  setMessages,
  setName,
  setCertificate,
  setInterbancario,
  setError,
} = appSlice.actions;
export const appReducer = appSlice.reducer;
