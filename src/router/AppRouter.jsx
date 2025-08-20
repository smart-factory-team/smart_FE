import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from '../components/layout';
import { Dashboard } from '../pages/Dashboard';
import { PressMonitoring } from '../pages/PressMonitoring';
import { VehicleMonitoring } from '../pages/VehicleMonitoring';
import { PaintingMonitoring } from '../pages/PaintingMonitoring';
import { AssemblyMonitoring } from '../pages/AssemblyMonitoring';
import { Board, PostDetail, PostCreate, PostEdit } from '../pages/Board';
import { MyPage } from '../pages/MyPage';
import { Home } from '../pages/Home/Home';

// 향후 추가될 인증 페이지들
// import { Login } from '../pages/auth/Login';
import { Register } from '../pages/Register/Register';

import { UserManagement } from '../pages/Admin';


export const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* 인증 관련 페이지들 - Layout 없음 (전체 화면) */}
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Register />} /> 
        <Route path="/admin/users" element={<UserManagement />} />

        {/* <Route path="/login" element={<Login />} /> */}
        
        {/* 대시보드 및 모니터링 페이지들 - Layout 포함 */}
        <Route path="/*" element={
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/press" element={<PressMonitoring />} />
              <Route path="/vehicle" element={<VehicleMonitoring />} />
              <Route path="/painting" element={<PaintingMonitoring />} />
              <Route path="/assembly" element={<AssemblyMonitoring />} />
              <Route path="/board" element={<Board />} />
              <Route path="/board/create" element={<PostCreate />} />
              <Route path="/board/edit/:id" element={<PostEdit />} />
              <Route path="/board/:id" element={<PostDetail />} />
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
        } />
      </Routes>
    </Router>
  );
};