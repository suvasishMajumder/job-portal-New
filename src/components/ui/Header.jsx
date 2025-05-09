import React, { useEffect, useState } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { Button } from './button'
import { SignedIn, SignedOut, SignIn, SignInButton, SignOutButton, UserButton, useUser  } from '@clerk/clerk-react'
import { PenBox , BriefcaseBusiness , BellRing , Heart } from 'lucide-react'



const Header = () => {

  const [showSignIn , setShowSignIn] = useState(false);

  const [search , setSearch] =  useSearchParams();

  const {user, isLoaded, isSignedIn} = useUser();
  const {pathname} = useLocation();

  useEffect(()=>{

    if(search.get('sign-in')){

      setShowSignIn(true)
    }

  }, [search])


  const handleOverlayClick = (e) =>{

    if(e.target === e.currentTarget){

      setShowSignIn(false);
setSearch({})
    }

  }




  return (
<>
    <nav className='py-4 flex max-w-screen overflow-x-hidden justify-around  items-center'>

<Link>
<img src="./src/assets/logo.png" className='h-20'  alt="logo" />
</Link>



<div className="flex gap-8">

<SignedOut>
  <Button variant='outline' onClick={()=>setShowSignIn(true)}>Login</Button>
      </SignedOut>


      <SignedIn>

{

user?.unsafeMetadata?.role === 'Recruiter' && pathname !== '/onboarding' &&
  
 ( <Link to="/post-job">
<Button variant="destructive" className="rounded-full">
<PenBox size={20} className="mr-2" />
Post a Job
</Button>
</Link>)

}


<UserButton appearance={{
  avatarBox:"w-10 h-10"
}}>

  
{/* Each <UserButton.MenuItems></UserButton.MenuItems> wraps an option in the clerk auth modal */}
<UserButton.MenuItems>
<UserButton.Link
label='My Jobs'
labelIcon={<BriefcaseBusiness size = {15} />} 
href='/my-jobs'/>
</UserButton.MenuItems>



<UserButton.MenuItems>
<UserButton.Link
label='Saved Jobs'
labelIcon={<Heart size = {15} />} 
href='/saved-jobs'/>
</UserButton.MenuItems>


</UserButton>
</SignedIn>

</div>


    </nav>


    {showSignIn && <div className='fixed inset-0 flex items-center justify-center z-10 bg-black bg-opacity-50'
    onClick={handleOverlayClick}>
<SignIn signUpForceRedirectUrl='/onboarding'
signUpFallbackRedirectUrl='/onboarding' />
</div>}

    </>
  )
}

export default Header;
