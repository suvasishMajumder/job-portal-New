import React from 'react'
import { Button } from "@/components/ui/button"
import { createBrowserRouter , RouterProvider } from 'react-router-dom'
import AppLayout from './layout/AppLayout'
import LandingPage from './pages/LandingPage'
import Onboarding from './pages/Onboarding'
import JobListing from './pages/JobListing'
import PostJob from './pages/PostJob'
import SavedJob from './pages/SavedJob'
import MyJobs from './pages/MyJobs'
import { ThemeProvider } from './components/theme-provider'
import JobPage from './pages/JobPage'
import './App.css'
import ProtectedRoute from './components/ui/protectedRoute'
import toast, { Toaster } from 'react-hot-toast'



const App = () => {

  const router = createBrowserRouter([
    {

      element:<AppLayout />,
      children:[
        {
          path:'/',
          element:<LandingPage />,
        },
        {
          path:'/onboarding',
          element:(
          <ProtectedRoute>
          <Onboarding />
          </ProtectedRoute>),
        },
        {
          path:'/jobs',
          element:(
            <ProtectedRoute>
          <JobListing />
          </ProtectedRoute>),
        },
        {
          path:'/job/:id',
          element:(
            <ProtectedRoute>
          <JobPage />
          </ProtectedRoute>),
        },
        {
          path:'/post-job',
          element:(
            <ProtectedRoute>
          <PostJob />
          </ProtectedRoute>),
        },
        {
          path:'/saved-jobs',
          element:(
            <ProtectedRoute>
          <SavedJob />
          </ProtectedRoute>),
        },
        {
          path:'/my-jobs',
          element:(
            <ProtectedRoute>
          <MyJobs />
          </ProtectedRoute>),
        },
      ],

    },
  ]);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>

  )
}

export default App;
