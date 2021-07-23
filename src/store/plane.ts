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

const initialState: PlaneState = {
    // type: 'Básico',
    type : 'sss'
};

interface PlaneState {
  type : string;
}

export const updatePlane = createAsyncThunk(
  'plane/update',
  async (_, { dispatch, getState }) => {
    const {
      app: { rut },
    } = getState() as RootState;
    if (rut != null) {
      try {
        const [type] = await Promise.all([
          api.getServiceType(rut)
        ]);
        dispatch(
          setPlane({ type } as {
            type : string;
          })
        );
      } catch (error) {
        dispatch(setError(error));
      }
    }
  }
);

const planeSlice = createSlice({
    name: 'plane',
    initialState,
    reducers: {
        setPlane(
            state,
            action: PayloadAction<{type : string}>
        ) {
            state.type = action.payload.type
        }
    },
  });

export const { setPlane } = planeSlice.actions;
export const planeReducer = planeSlice.reducer;