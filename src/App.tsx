import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { store } from './store/store';

function App() {
  return (

    <Provider store={store}>
      <BrowserRouter>
        {/* <Header /> */}
        <Routes>
          {/* <Route path="/" element={<Home />} />
          <Route path='/login'
            element={
              <AuthWrapper>
                <Login />
              </AuthWrapper>
            } />
          <Route path='/register'
            element={
              <AuthWrapper>
                <Register />
              </AuthWrapper>
            } />
          <Route path='*' element={<Custom404 />} /> */}
        </Routes>
        {/* <Toast /> */}
      </BrowserRouter>
    </Provider>
  );
}

export default App;
