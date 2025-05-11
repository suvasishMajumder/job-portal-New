import React, { lazy, Suspense, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
const AppLayout = lazy(()=> import("./layout/AppLayout"));
// const LandingPage = lazy(()=>import("./pages/LandingPage"));
import LandingPage from "./pages/LandingPage";
const Onboarding = lazy(()=>import("./pages/Onboarding"));
const JobListing = lazy(()=>import("./pages/JobListing"));
const PostJob = lazy(()=>import("./pages/PostJob"));
const SavedJob = lazy(()=>import("./pages/SavedJob"));
const MyJobs = lazy(()=>import("./pages/MyJobs"));
import { ThemeProvider } from "./components/theme-provider";
const JobPage = lazy(()=>import("./pages/JobPage"))
import "./App.css";
import ProtectedRoute from "./components/ui/protectedRoute";
import toast, { Toaster } from "react-hot-toast";
import propTypes from "prop-types";
import { BarLoader } from "react-spinners";



const ErrrorBoundary = ({ children }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
     function ErrorSetFunction() {
       setHasError(true);
     }

     window.addEventListener("error", ErrorSetFunction);

     return () => {
       window.removeEventListener("error", ErrorSetFunction);
     };
   }, []);

return hasError ? <div className="text-red-600 text-lg">Error Loading Component</div> : children;


};

ErrrorBoundary.propTypes = {
  children: propTypes.node.isRequired,
};

const App = () => {
  const router = createBrowserRouter([
    {
      element: <AppLayout />,
      children: [
        {
          path: "/",
          element: (
            <ErrrorBoundary>
              <Suspense
                fallback={
                  <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />
                }
              >
                <LandingPage />
              </Suspense>
            </ErrrorBoundary>
          ),
        },
        {
          path: "/onboarding",
          element: (
            <ErrrorBoundary>
              <Suspense
                fallback={
                  <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />
                }
              >
                <ProtectedRoute>
                  <Onboarding />
                </ProtectedRoute>
              </Suspense>
            </ErrrorBoundary>
          ),
        },
        {
          path: "/jobs",
          element: (
            <ErrrorBoundary>
              <Suspense
                fallback={
                  <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />
                }
              >
                <ProtectedRoute>
                  <JobListing />
                </ProtectedRoute>
              </Suspense>
            </ErrrorBoundary>
          ),
        },
        {
          path: "/job/:id",
          element: (
            <ErrrorBoundary>
              <Suspense
                fallback={
                  <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />
                }
              >
                <ProtectedRoute>
                  <JobPage />
                </ProtectedRoute>
              </Suspense>
            </ErrrorBoundary>
          ),
        },
        {
          path: "/post-job",
          element: (
            <ErrrorBoundary>
              <Suspense
                fallback={
                  <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />
                }
              >
                <ProtectedRoute>
                  <PostJob />
                </ProtectedRoute>
              </Suspense>
            </ErrrorBoundary>
          ),
        },
        {
          path: "/saved-jobs",
          element: (
            <ErrrorBoundary>
              <Suspense
                fallback={
                  <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />
                }
              >
                <ProtectedRoute>
                  <SavedJob />
                </ProtectedRoute>
              </Suspense>
            </ErrrorBoundary>
          ),
        },
        {
          path: "/my-jobs",
          element: (
            <ErrrorBoundary>
              <Suspense
                fallback={
                  <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />
                }
              >
                <ProtectedRoute>
                  <MyJobs />
                </ProtectedRoute>
              </Suspense>
            </ErrrorBoundary>
          ),
        },
      ],
    },
  ]);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
};

export default App;
