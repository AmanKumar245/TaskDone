import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { SocketProvider } from './context/SocketProvider'
import Header from './components/Header'
import Footer from './components/Footer'
import LandingPage from './pages/LandingPage'
import PostTask from './pages/PostTask'
import EarnMoney from './pages/EarnMoney'
import Signup from './pages/Signup'
import Login from './pages/Login'
import BrowseTasks from './pages/BrowseTasks'
import Discover from './pages/Discover'
import MyTasks from './pages/MyTasks'
import ManageTask from './pages/ManageTask'
import Messages from './pages/Messages'
import UserProfile from './pages/UserProfile'
import TaskerDashboard from './pages/TaskerDashboard'
import PaymentHistory from './pages/PaymentHistory'
import SettingsPage from './pages/SettingsPage'
import NotificationsPage from './pages/NotificationsPage'

// Redirect logged-in users away from guest-only pages
const GuestRoute = ({ children }) => {
  const { userInfo } = useSelector((state) => state.auth);
  return userInfo ? <Navigate to="/discover" replace /> : children;
};

function App() {
  return (
    <BrowserRouter>
      <SocketProvider>
        <div className="min-h-screen bg-white flex flex-col">
          <Routes>
            
            <Route path="/post-task" element={<PostTask />} />
            <Route path="/signup" element={<GuestRoute><Signup /></GuestRoute>} />
            <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />

           
            <Route path="*" element={
              <>
                <Header />
                <main className="flex-grow">
                  <Routes>
                    <Route path="/" element={<HomeRedirect />} />
                    <Route path="/earn-money" element={<EarnMoney />} />
                    <Route path="/tasks" element={<BrowseTasks />} />
                    <Route path="/tasks/:taskId" element={<BrowseTasks />} />
                    <Route path="/my-tasks" element={<MyTasks />} />
                    <Route path="/my-tasks/:taskId" element={<ManageTask />} />
                    <Route path="/discover" element={<Discover />} />
                    <Route path="/messages" element={<Messages />} />
                    <Route path="/messages/:conversationId" element={<Messages />} />
                    <Route path="/profile/:userId" element={<UserProfile />} />
                    <Route path="/dashboard" element={<TaskerDashboard />} />
                    <Route path="/dashboard/payment-history" element={<PaymentHistory />} />
                    <Route path="/dashboard/payment-methods" element={<PaymentHistory />} />
                    <Route path="/dashboard/settings" element={<SettingsPage />} />
                    <Route path="/dashboard/settings/:section" element={<SettingsPage />} />
                    <Route path="/dashboard/notifications" element={<NotificationsPage />} />
                    <Route path="/dashboard/profile" element={<TaskerDashboard />} />
                    <Route path="/dashboard/skills" element={<TaskerDashboard />} />
                    <Route path="/dashboard/badges" element={<TaskerDashboard />} />
                    <Route path="/dashboard/portfolio" element={<TaskerDashboard />} />
                  </Routes>
                </main>
                <Footer />
              </>
            } />
          </Routes>
        </div>
      </SocketProvider>
    </BrowserRouter>
  )
}

// Show LandingPage for guests, redirect to /discover for logged-in users
const HomeRedirect = () => {
  const { userInfo } = useSelector((state) => state.auth);
  return userInfo ? <Navigate to="/discover" replace /> : <LandingPage />;
};

export default App

