import { Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Shell } from './components/Shell';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { AppliancesPage } from './pages/AppliancesPage';
import { ConsumptionPage } from './pages/ConsumptionPage';
import { RecommendationsPage } from './pages/RecommendationsPage';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<Shell />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/appliances" element={<AppliancesPage />} />
          <Route path="/consumption" element={<ConsumptionPage />} />
          <Route path="/recommendations" element={<RecommendationsPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}