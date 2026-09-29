import { configureStore } from '@reduxjs/toolkit';
import authReducer   from '../authSlice';
import solvedReducer from '../solvedSlice';
import problemsReducer from '../problemsSlice';

export const store = configureStore({
  reducer: {
    auth:   authReducer,
    solved: solvedReducer,
    problems: problemsReducer,
  },
});