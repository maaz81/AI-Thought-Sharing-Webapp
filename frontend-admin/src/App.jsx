import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LoginPage from './components/pages/Login/LoginPage';
import ProtectedRoute from './components/protectedRoutes/ProtectedRoute';
import Dashboard from './components/dashboard/Dashboard';
import Users from './components/users/Users';
import UserPage from './components/users/UserPage';
import Posts from './components/posts/Posts';
import Reports from './components/reports/Reports';
import Moderation from './components/moderation/Copy';
import AiFlagged from './components/aiManagement/AiFlagged';
import Analytics from './components/analytics/Analytics';
import Audit from './components/auditLogs/Audit';
import Settings from './components/settings/Settings';
import Roles from './components/roles&permissions/Roles';
import BackupRestore from './components/backupRestore/BackupRestore';
import Notifications from './components/notifications/Notifications';
import Security from './components/security/Security';
import MyAccount from './components/myaccount/MyAccount';

function App() {
  return (
    <Router>
      
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard/>}/>
          <Route path="/users" element={<Users/>}/>
          <Route path="/user/:id" element={<UserPage/>}/>
          <Route path='/posts' element={<Posts />} />
          <Route path='/reports' element={<Reports />} />
          {/* <Route path='/moderation' element={<Moderation />} /> */}
          <Route path='/moderation' element={<Moderation />} />
          <Route path='/ai-flagged' element={<AiFlagged />} />
          <Route path='/analytics' element={<Analytics />} />
          <Route path='/logs' element={<Audit />} />
          <Route path='/admin/settings' element={<Settings />} />
          <Route path='/roles' element={<Roles />} />
          <Route path='/notifications' element={<Notifications />} />
          <Route path='/security' element={<Security />} />
          <Route path='/backup' element={<BackupRestore />} />
          <Route path='/profile' element={<MyAccount />} />
  
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
