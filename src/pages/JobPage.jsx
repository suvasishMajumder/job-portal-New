import useFetch from '@/hooks/use-fetch';
import { useUser } from '@clerk/clerk-react'
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { getSingleJob, updateHiringStatus } from './api/apiJobs';
import { BarLoader } from 'react-spinners';
import { Briefcase, DoorClosed, DoorOpen, MapPinIcon } from 'lucide-react';
import MDEditor from '@uiw/react-md-editor';
import { Select , SelectTrigger , SelectValue , SelectContent , SelectGroup , SelectItem } from '@/components/ui/select';
import ApplyJobDrawer from '@/components/ApplyJobDrawer';
import ApplicationCard from '@/components/ApplicationCard';

const JobPage = () => {

const {user , isLoaded} = useUser();



const {id} = useParams();


const {fn:fnJob, data:job, loading: loadingJob } = useFetch(getSingleJob ,{


  job_id:id,

});


const {loading:loadingHiringStatus , fn:fnHiringStatus} = useFetch(
  updateHiringStatus,
  {

    job_id: id,

  }
);



const handleStatusChange = (value) => {

  const isOpen = value === "open";
  fnHiringStatus(isOpen).then(()=> fnJob());
  
  };


useEffect(()=>{ 
  if(isLoaded){

fnJob();

}

},[isLoaded])


if(!isLoaded || loadingJob){

  return <BarLoader className='mb-4' width={"100%"} color= '#36d7b7' />;
  
  }

// console.log(job)
// console.log(job?.recruiter_id === user?.id);

// console.log(`job?.recruiter_id: ${job?.recruiter_id}`);
// console.log(`job?.user?.id:${user?.id}`);


console.log(user)


  return (
    <>
   <div className='flex flex-col gap-8 mt-5'>
    <div className='flex flex-col-reverse gap-6 md:flex-row justify-between items-center'>
<h1 className="gradient-title font-extrabold pb-3 text-4xl sm:text-6xl">{job?.title}</h1>
<img src={job?.company?.logo_url} className='h-12' alt={job?.title} />
    </div>



<div className="flex justify-between">

<div className="flex gap-2">

<MapPinIcon />
{job?.location}

</div>



<div className="applicants flex gap-2">
  <Briefcase />{job?.applications?.length} Applicants
</div>




<div className="applicants flex gap-2">
{

job?.isOpen ? (

  <>
  <DoorOpen />
  </>

) : (

<>
<DoorClosed />
</>

)

}
</div>

</div>


{/* Hiring Status */}

{job?.recruiter_id === user?.id && 

(
<Select onValueChange={handleStatusChange}>
      <SelectTrigger className={`w-full ${job?.isOpen ? 'bg-green-950' : 'bg-red-950'}`}>
        <SelectValue placeholder={"Hiring Status " + (job?.isOpen ? '( Open )' : '( Closed )')} />
      </SelectTrigger> 
      <SelectContent>
        <SelectGroup>
  
   <SelectItem value='open'>Open</SelectItem>
   <SelectItem value='closed'>Closed</SelectItem>

        </SelectGroup>
      </SelectContent>
    </Select>
)

}

<h2 className="text-2xl sm:text-3xl font-bold">About The Job</h2>
<p className="">{job?.description}</p>
<h2 className="text-2xl sm:text-3xl font-bold">What we are looking for</h2>

<MDEditor.Markdown source={job?.requirements}  className='bg-amber-50  sm:text-lg' />





{/* Render Applications */}

{job?.recruiter_id !== user?.id && <ApplyJobDrawer 
job={job}
user={user}
fetchJob={fnJob}
applied={job?.applications?.find((ap)=>ap.candidate_id === user.id)}
 /> }



{
job?.applications?.length > 0 && job.recruiter_id === user?.id && (

  <div className="">

<h2 className="text-2xl sm:text-3xl font-bold mb-8">Applications</h2>
{job?.applications.map((application) => {

return (

  <ApplicationCard key={application.id} application={application} />
)

})}

  </div>
  
)

}



   </div>
   </>
  )
}

export default JobPage;
