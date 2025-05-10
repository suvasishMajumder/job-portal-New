import useFetch from '@/hooks/use-fetch';
import JobCard from '@/JobCard';
import { getMyJobs } from '@/pages/api/apiJobs';
import { useUser } from '@clerk/clerk-react';
import React, { useEffect } from 'react'
import { BarLoader } from 'react-spinners';



const CreatedJobs = () => {

  const {user} = useUser();


const {

loading:loadingCreatedJobs,
data:createdJobs,
fn:fnCreatedJobs,

} = useFetch(getMyJobs,{
recruiter_id:user.id,
});

useEffect(()=>{

  fnCreatedJobs();

},[]);





        if(loadingCreatedJobs){

            return <BarLoader className='mb-4' width={'100%'} color='#36d7b7' />;

        }


  return (
    <>
    <div>

<div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
{createdJobs?.length ? (

createdJobs.map((job) => {

return (

<JobCard
key={job.id}
job={job}
onJobSaved={fnCreatedJobs}
isMyJob 

/*
//When we pass prop as isMyJob  , 
  // then its same as isMyJob = {true}
*/

 />

);


})

) : (

<div>No Jobs Found
</div>

)

}

</div>
    </div>
    </>
  )
}

export default CreatedJobs;
