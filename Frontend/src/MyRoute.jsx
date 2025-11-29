import React from 'react'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import Login from './components/Login'
import Signup from './components/Signup'
import Campaign from './components/Campaign'
import Createcampaign from './components/Createcampaign'
import HomePage from './components/Homepage'
import AboutPage from './components/AboutPage'
import ViewCampaign from './components/ViewCampaign'

const MyRoute = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/campaign" element={<Campaign />} />
          <Route path="/createcampaign" element={<Createcampaign />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/view/:id" element={<ViewCampaign />} />


        </Routes>
      </Router>
    </div>
  )
}

export default MyRoute
