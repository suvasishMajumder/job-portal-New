import React, { useEffect, useState } from 'react'
import { getJobs } from './api/apiJobs'
import { useSession, useUser } from '@clerk/clerk-react'
import useFetch from '@/hooks/use-fetch'
import { BarLoader, SyncLoader , RiseLoader } from 'react-spinners'
import JobCard from '@/JobCard'
import { getCompanies } from './api/apiCompanies'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select , SelectTrigger , SelectValue ,
  SelectContent,SelectGroup,SelectLabel,SelectItem } from '@/components/ui/select'
import { City, Country, State } from 'country-state-city'



const JobListing = () => {


const [searchQuery , setSearchQuery] = useState('');
const [location,setLocation] = useState('');
const [company_id , setCompany_id] = useState('');



  const {isLoaded , user} = useUser();

  console.log(user)


  const handleSearch = (e) =>{

    e.preventDefault();

    let formData = new FormData(e.target);
    const query = formData.get('search-query');

    if(query)
      setSearchQuery(query);

  }


//New Code


/*Here , we are passing (getJobs,{ location, company_id, searchQuery }) to the useFetch custom hook and we are destructuring fn,data,loading 
from its return value*/
const {fn:fnJobs, data:dataJobs, loading:loadingJobs, } = useFetch(getJobs,{ location, company_id, searchQuery });

//loadingJobs default value = null; dataJobs default value = 0;
/*When you call fnJobs() in your useEffect, the first thing it does is setLoading(true). That updates the loading value 
inside the hook, which you’ve aliased as loadingJobs. React then re‑renders your component 
with loadingJobs === true, so your <RiseLoader/> spinner shows until the fetch resolves (and setLoading(false) runs).  */

console.log(loadingJobs);

useEffect(()=>{

  console.log('Fetching jobs....')

  if(isLoaded){
  fnJobs();
  }

},[isLoaded,location,company_id,searchQuery]);






const {fn:fnCompanies , data:companies ,  } = useFetch(getCompanies,{ location, company_id, searchQuery });


useEffect(()=>{

  console.log('Fetching companies....')

  if(isLoaded){
  fnCompanies();
  }

},[isLoaded]);

const handleClearFilter = () =>{

  setSearchQuery('');
  setLocation('');
  setCompany_id('')

}



if(!isLoaded){

  return <SyncLoader className='mb-4 text-center' width={'100%'} color='#36d7b7' />

}





  return (
    <div className="select-none">
    <h1 className='gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8'>
Latest Jobs
    </h1>

{/* Add Filters Here */}

<form onSubmit={(event) => handleSearch(event)} className='h-14 flex w-full gap-2 items-center mb-3'>

<Input type='text'
placeholder='Search Job By Title...'
name='search-query' 
className='h-full flex-1 px-4 text-md'
/>

<Button type='submit' className='h-full sm:w-28' variant="blue">
Search
</Button>

</form>


<div className="flex  flex-col sm:flex-row gap-14">





{/* Filter by company */}



<Select value={company_id} onValueChange={(value)=>setCompany_id(value)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Filter By Company" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
      
{

companies?.map(({name,id})=>{

return (

  // <SelectItem key={id} value={name}>{name}</SelectItem>
  <SelectItem key={id} value={id}>{name}</SelectItem>

)

})

}


        </SelectGroup>
      </SelectContent>
    </Select>
  



<Button variant={'destructive'} onClick={handleClearFilter} className={''}>Clear Filters</Button>

  
</div>



{loadingJobs && <SyncLoader className='mb-4 text-center' width={'100%'} color='#36d7b7' />}




{loadingJobs === false && (


<div className="mt-8 grid grid-cols-1 md:gird-cols-2 lg:grid-cols-3 gap-4">{
dataJobs?.length > 0 ? dataJobs.map((job,index)=>{

return (

<JobCard job={job} key={index}
savedInit={job?.saved?.length>0} />
)

})

 : (

  <span className="">No Jobs Found</span>

)}
</div>)}



    </div>
  )

}

export default JobListing;
