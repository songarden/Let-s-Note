import React from "react";
import { Provider } from 'react-redux';
import { store } from './app/store';
import { Route, Routes } from "react-router-dom";
import WorkPlacePage from "./pages/WorkPlacePage";
import LandingPage from "./pages/LandingPage";
import MyPage from "./pages/MyPage";

const App = () => {
  return (
    <>
      <Provider store={store}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/workspace/:spaceId" element={<WorkPlacePage />} />
          <Route path="/workspace" element={<WorkPlacePage />} /> 
        </Routes>
      </Provider>
    </>
  );
};

export default App;
