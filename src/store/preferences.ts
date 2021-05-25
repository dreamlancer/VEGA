import { ImpresionType } from './../api/preferences';
import { RootState } from 'store';
import {
  createSlice,
  PayloadAction,
  ThunkDispatch,
  AnyAction,
  createAsyncThunk,
} from '@reduxjs/toolkit';
import { message } from 'antd';

import * as api from 'api';
import { setError } from './app';

const initialState: PreferencesState = {
  impuestos: '+IVA',
  moneda: 'Dólares',
  state: 'LOADING',
  impresion: 'A4',
};

export type ImpuestosType = '+IVA' | 'IVA INC';
export type MonedaType = 'Dólares' | 'Pesos';

export type SliceState = 'READY' | 'LOADING' | 'ERROR';

interface PreferencesState {
  moneda: MonedaType;
  impuestos: ImpuestosType;
  impresion: ImpresionType;
  state: SliceState;
}

export const postPreferences = (
  moneda: string,
  impuestos: string,
  impresion: ImpresionType
) => async (
  dispatch: ThunkDispatch<{}, {}, AnyAction>,
  getState: () => RootState
) => {
  dispatch(setState('LOADING'));
  const { rut } = getState().app;
  if (rut != null) {
    try {
      await Promise.all([
        api.postMoneda(rut, moneda),
        api.postImpuestos(rut, impuestos),
        api.postImpresion(rut, impresion),
      ]);
      message.success('Se guardaron sus preferencias.');
      dispatch(updatePreferences());
    } catch (error) {
      dispatch(setError(error));
    }
  }
};

export const updatePreferences = createAsyncThunk(
  'preferences/update',
  async (_, { dispatch, getState }) => {
    const {
      app: { rut },
    } = getState() as RootState;
    if (rut != null) {
      try {
        const [moneda, impuestos, impresion] = await Promise.all([
          api.getMoneda(rut),
          api.getImpuestos(rut),
          api.getImpresion(rut),
        ]);
        dispatch(
          setPreferences({ moneda, impuestos, impresion } as {
            moneda: MonedaType;
            impuestos: ImpuestosType;
            impresion: ImpresionType;
          })
        );
      } catch (error) {
        dispatch(setError(error));
      }
    }
  }
);

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    setPreferences(
      state,
      action: PayloadAction<{
        moneda: MonedaType;
        impuestos: ImpuestosType;
        impresion: ImpresionType;
      }>
    ) {
      state.moneda = action.payload.moneda;
      state.impuestos = action.payload.impuestos;
      state.impresion = action.payload.impresion;
      state.state = 'READY';
    },
    setState(state, action: PayloadAction<SliceState>) {
      state.state = action.payload;
    },
  },
});

export const { setPreferences, setState } = preferencesSlice.actions;
export const preferencesReducer = preferencesSlice.reducer;
