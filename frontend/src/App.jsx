import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
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

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white flex flex-col">
        <Routes>
          {/* Isolated Routes without Header/Footer */}
          <Route path="/post-task" element={<PostTask />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          {/* Main Layout wrapper for other routes */}
          <Route path="*" element={
            <>
              <Header />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/earn-money" element={<EarnMoney />} />
                  <Route path="/tasks" element={<BrowseTasks />} />
                  <Route path="/tasks/:taskId" element={<BrowseTasks />} />
                  <Route path="/my-tasks" element={<MyTasks />} />
                  <Route path="/my-tasks/:taskId" element={<ManageTask />} />
                  <Route path="/discover" element={<Discover />} />
                </Routes>
              </main>
              <Footer />
            </>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
