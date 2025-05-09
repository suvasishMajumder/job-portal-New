import { useUser } from "@clerk/clerk-react";
import React, { useEffect, useState } from "react";
import { CardHeader, CardTitle , Card , CardContent, CardFooter  } from "./components/ui/card";
import { Heart, MapPin, MapPinIcon , Trash2Icon } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./components/ui/button";
import useFetch from "./hooks/use-fetch";
import { deleteJob, saveJob } from "./pages/api/apiJobs";
import toast from "react-hot-toast";
import { GridLoader } from "react-spinners";




const JobCard = ({job,isMyJob = false, savedInit = false, onJobSaved = () => {}, }) => {

  const { user , isLoaded } = useUser();

const [saved , setSaved] = useState(savedInit)
  
const handleSavedJob = async() =>{


  await fnSavedJob({
  
  user_id:user.id,
  job_id:job.id,
  
  });
  
onJobSaved();

  };


  // console.log(isLoaded ? job : 0)


const {fn:fnSavedJob, data:SavedJob, loading: loadingSavedJob } = useFetch(saveJob,{

  alreadySaved: saved,

});


const {loading:loadingDeleteJob , fn:fnDeleteJob } = useFetch(deleteJob,{

job_id:job.id,

})



const handleDeleteJob = async() =>{

await fnDeleteJob();
onJobSaved();
}

useEffect(()=>{

  if(SavedJob!==undefined){
    
  setSaved(SavedJob?.length > 0);

  }
  
  },[SavedJob]);



  return (
    <Card className={'flex flex-col'}>
      {loadingDeleteJob && (<GridLoader className='mt-4' width='100%' color='#36d7b7' />)}
      <CardHeader>
        <CardTitle>
          {job.title}

          {isMyJob && (
            <Trash2Icon
              fill="red"
              size={18}
              className="text-red-300 cursor-pointer"
              onClick={handleDeleteJob}
            />
          )}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="">
          {job.company && (
            <img src={job.company.logo_url} className="h-6" alt={job.company_id} />
          )}

          <div className="flex gap-2 justify-end items-center">
            <MapPinIcon size={15} /> <span>{job.location}</span>
          </div>
        </div>
        <hr />
        {job.description}
      </CardContent>

<CardFooter className='flex gap-2'>
  <Link to={`/job/${job.id}`}>
  
  <Button variant='secondary' className='w-[100%]'>More Details</Button>
  
  </Link>



{!isMyJob && <Button variant='outline' 
onClick={handleSavedJob} 
disabled={loadingSavedJob}
className='w-15'>

{saved ? (<Heart size={20} stroke='red' fill='red' />)
 : 
 (<Heart size={20}  />) }

  
  </Button>}





</CardFooter>

    </Card>
  );
};

export default JobCard;



//DOUBT 1:

/*
The call to

useFetch(saveJob, { alreadySaved: saved })

returns an object with four properties:

a) fn – the function that, when called, will invoke your saveJob callback

b) data – the most recent response from saveJob (initially undefined)

c) loading – a boolean (or null initially) indicating whether the call is in flight

d) error – any error thrown during the call (initially null);



By writing:

const {
  fn: fnSavedJob,
  data: SavedJob,
  loading: loadingSavedJob
} = useFetch(saveJob, { alreadySaved: saved });


you’re simply:

--Renaming fn → fnSavedJob

--Renaming data → SavedJob

--Renaming loading → loadingSavedJob



So after that line:

--fnSavedJob is the fetch function you call to actually run saveJob(...)

--SavedJob holds whatever saveJob last returned (or undefined if never called)

--loadingSavedJob is true while the API call is in progress, false when it finishes, and null before any call

(error is also available on the return object if you ever want to destructure it.)


*/