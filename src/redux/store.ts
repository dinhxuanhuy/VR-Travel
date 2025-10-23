import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import authReducer from './slices/authSlice';
import modelReducer from './slices/modelSlice';
import reconstructionReducer from './slices/reconstructionSlice';
import { rootSaga } from './sagas';

/**
 * Create Saga Middleware
 */
const sagaMiddleware = createSagaMiddleware();

/**
 * Configure Redux Store với Saga Middleware
 */
export const store = configureStore({
  reducer: {
    auth: authReducer,
    model: modelReducer,
    reconstruction: reconstructionReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['reconstruction/addFiles'],
        ignoredPaths: ['reconstruction.files'],
      },
    }).concat(sagaMiddleware), // Thêm saga middleware
});

/**
 * Run Root Saga
 */
sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
