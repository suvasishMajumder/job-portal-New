import { useUser } from "@clerk/clerk-react";
import React, { lazy } from "react";
import { BarLoader } from "react-spinners";
const CreatedApplication = lazy(()=>import("@/components/CreatedApplication"));
const CreatedJobs = lazy(()=>import( "@/components/CreatedJobs"));

const MyJobs = () => {
  const { user, isLoaded } = useUser();

  // console.log(user)

  if (!isLoaded) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <>
    <div>
      <h1
        className="gradient-title font-extrabold
      text-5xl sm:text-7xl text-center pb-8"
      >
        {user?.unsafeMetadata?.role === "Candidate"
          ? "My Applications"
          : "My Jobs"}
      </h1>

{user?.unsafeMetadata?.role ==="Candidate" ? (
<CreatedApplication />

): (

  <CreatedJobs/>

)}

    </div>
    </>
  );
};

export default MyJobs;
