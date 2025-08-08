import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from '../components/layout';
import { Dashboard } from '../pages/Dashboard';
import { PressMonitoring } from '../pages/PressMonitoring';
import { VehicleMonitoring } from '../pages/VehicleMonitoring';
import { PaintingMonitoring } from '../pages/PaintingMonitoring';
import { AssemblyMonitoring } from '../pages/AssemblyMonitoring';
import { Board } from '../pages/Board';
import { MyPage } from '../pages/MyPage';

export const AppRouter = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/press" element={<PressMonitoring />} />
          <Route path="/vehicle" element={<VehicleMonitoring />} />
          <Route path="/painting" element={<PaintingMonitoring />} />
          <Route path="/assembly" element={<AssemblyMonitoring />} />
          <Route path="/board" element={<Board />} />
          <Route path="/mypage" element={<MyPage />} />
          {/* 404 페이지 */}
          <Route path="*" element={
            <div style={{ padding: '40px', textAlign: 'center' }}>
              <h1>404 - 페이지를 찾을 수 없습니다</h1>
              <p>요청하신 페이지가 존재하지 않습니다.</p>
            </div>
          } />
        </Routes>
      </Layout>
    </Router>
  );
};