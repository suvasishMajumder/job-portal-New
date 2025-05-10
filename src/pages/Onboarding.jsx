import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/clerk-react';
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { RiseLoader	} from 'react-spinners'


const Onboarding = () => {

const {user , isLoaded } = useUser();
console.log(user);

const navigate = useNavigate();

const handleRoleSelection = async(role) =>{

await user
.update({unsafeMetadata:{role},
})
.then((role)=>{

 role === 'Candidate' ? navigate('/jobs') : navigate('/post-job');

}).catch((error)=>{

  console.log('Error:',error);
  
})

}


if(!isLoaded){
  return <RiseLoader className='mb-4 text-center' width={'100%'} color='#36d7b7'/>
}

  return (
    <>
    <div>
    <h2 className='gradient-title text-center font-extrabold text-7xl
    sm:text-8xl tracking-tighter'>I am a...</h2>
<div className="mt-16 grid grid-cols-2 gap-4 w-full md:px-40">

  <Button onClick={() =>handleRoleSelection('Candidate')} variant='blue' className='h-36 cursor-pointer text-2xl'>Candidate</Button>
  <Button onClick={() => handleRoleSelection('Recruiter')} variant='default' className='h-36 cursor-pointer bg-[#067700]
  hover:bg-lime-600 text-white text-2xl'>Recruiter</Button>

</div>

    </div>
    </>
  )
}

export default Onboarding;
