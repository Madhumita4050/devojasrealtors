import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Plots from './pages/Plots';
import Transactions from './pages/Transactions';
import Commissions from './pages/Commissions';
import Wallets from './pages/Wallets';
import Reports from './pages/Reports';
import Banners from './pages/Banners';
import Complaints from './pages/Complaints';
import Enquiries from './pages/Enquiries';
import Settings from './pages/Settings';
import SlabSettings from './pages/SlabSettings';
import MyTeamNetworkAdmin from './pages/MyTeamNetwork';
import PaymentsAndReceipts from './pages/PaymentsAndReceipts';

// ---------- NEW: Client Panel imports ----------
import ClientLayout from './components/client/ClientLayout';
import ClientDashboard from './pages/client/ClientDashboard';
import MyPlots from './pages/client/MyPlots';
import BrowsePlots from './pages/client/BrowsePlots';
import PlotDetail from './pages/client/PlotDetail';
import MyTransactions from './pages/client/MyTransactions';
import MyPayments from './pages/client/MyPayments';
import Profile from './pages/client/Profile';
import ClientNotifications from './pages/client/ClientNotifications';
import Support from './pages/client/Support';

// ---------- NEW: Associate Panel imports ----------
import AssociateLayout from './components/associate/AssociateLayout';
import AssociateDashboard from './pages/associate/AssociateDashboard';
import MyTeam from './pages/associate/MyTeamNetwork';
import MyPlotAssociate from './pages/associate/MyPlot';
import MyRewardAssociate from './pages/associate/MyReward';
import MyCommissions from './pages/associate/MyCommissions';
import MyWallet from './pages/associate/MyWallet';
import AssociateBrowsePlots from './pages/associate/BrowsePlots';
import AssociateProfile from './pages/associate/Profile';
import AssociateNotifications from './pages/associate/AssociateNotifications';
import AssociateSupport from './pages/associate/Support';

// ---------- NEW: Accounts Panel imports ----------
import AccountsLayout from './components/accounts/AccountsLayout';
import AccountsDashboard from './pages/accounts/AccountsDashboard';
import PaymentVerification from './pages/accounts/PaymentVerification';
import PayoutManagement from './pages/accounts/PayoutManagement';
import Invoices from './pages/accounts/Invoices';
import FinancialReports from './pages/accounts/FinancialReports';
import AllWallets from './pages/accounts/AllWallets';
import ExportData from './pages/accounts/ExportData';
import AccountsSupport from './pages/accounts/Support';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* ---------- ADMIN PANEL (unchanged — same as before) ---------- */}
          <Route
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Dashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/plots" element={<Plots />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/commissions" element={<Commissions />} />
            <Route path="/wallets" element={<Wallets />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/banners" element={<Banners />} />
            <Route path="/complaints" element={<Complaints />} />
            <Route path="/enquiries" element={<Enquiries />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/slabs" element={<SlabSettings />} />
            <Route path="/network" element={<MyTeamNetworkAdmin />} />
            <Route path="/payments" element={<PaymentsAndReceipts />} />
          </Route>

          {/* ---------- CLIENT PANEL (new) ---------- */}
          <Route
            element={
              <ProtectedRoute allowedRoles={['client']}>
                <ClientLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/client" element={<ClientDashboard />} />
            <Route path="/client/my-plots" element={<MyPlots />} />
            <Route path="/client/my-plots/add" element={<MyPlots />} />
            <Route path="/client/browse" element={<BrowsePlots />} />
            <Route path="/client/plots/:id" element={<PlotDetail />} />
            <Route path="/client/transactions" element={<MyTransactions />} />
            <Route path="/client/payments" element={<MyPayments />} />
            <Route path="/client/profile" element={<Profile />} />
            <Route path="/client/notifications" element={<ClientNotifications />} />
            <Route path="/client/support" element={<Support />} />
          </Route>

          {/* ---------- ASSOCIATE PANEL (new) ---------- */}
          <Route
            element={
              <ProtectedRoute allowedRoles={['associate']}>
                <AssociateLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/associate" element={<AssociateDashboard />} />
            <Route path="/associate/team" element={<MyTeam />} />
            <Route path="/associate/my-plot" element={<MyPlotAssociate />} />
            <Route path="/associate/my-reward" element={<MyRewardAssociate />} />
            <Route path="/associate/commissions" element={<MyCommissions />} />
            <Route path="/associate/wallet" element={<MyWallet />} />
            <Route path="/associate/plots" element={<AssociateBrowsePlots />} />
            <Route path="/associate/profile" element={<AssociateProfile />} />
            <Route path="/associate/notifications" element={<AssociateNotifications />} />
            <Route path="/associate/support" element={<AssociateSupport />} />
          </Route>

          {/* ---------- ACCOUNTS PANEL (new) ---------- */}
          <Route
            element={
              <ProtectedRoute allowedRoles={['accounts']}>
                <AccountsLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/accounts" element={<AccountsDashboard />} />
            <Route path="/accounts/payments" element={<PaymentVerification />} />
            <Route path="/accounts/payouts" element={<PayoutManagement />} />
            <Route path="/accounts/invoices" element={<Invoices />} />
            <Route path="/accounts/reports" element={<FinancialReports />} />
            <Route path="/accounts/wallets" element={<AllWallets />} />
            <Route path="/accounts/export" element={<ExportData />} />
            <Route path="/accounts/support" element={<AccountsSupport />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
