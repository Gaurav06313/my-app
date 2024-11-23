import React, { createContext, useReducer } from 'react';
import dashboardReducer from './pages/dashboardReducer';

export const AppContext = createContext();

function AppController(state = {}, action) {
    return {
      dashboard: dashboardReducer(state.dashboard, action)
    };
  }

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppController, {});

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};