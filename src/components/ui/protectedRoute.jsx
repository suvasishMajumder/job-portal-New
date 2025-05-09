import { useUser } from '@clerk/clerk-react'
import React from 'react'
import { useLocation , Navigate, useNavigate } from 'react-router-dom'

const ProtectedRoute = ({children}) => {

  const {isSignedIn, user, isLoaded} = useUser();

  const navigate = useNavigate();

  /*Note: This useUser hook is like a gloabl context for user autehntication
  * isSignedIn : Is the user signed in or not (Boolean)
  * user: All the details of the user
  * isLoaded: Have the user details loaded or not
  *  */

const { pathname } = useLocation();

/*This hook returns the location object used by the react-router. 
This object represents the current URL and is immutable. Whenever the URL changes, 
the useLocation() hook returns a newly updated location object. Some of its use includes extracting
 the query parameters from the URL and doing something depending on the query parameters. 
The “search” property of the location object returns a string containing the query part of the URL.*/


/*
pathname is a property of the object returned by the useLocation() hook from react-router-dom. 
The useLocation() hook provides the current location object, which includes the following properties:

pathname: The path of the current URL (e.g., /dashboard).
search: The query string of the URL (e.g., ?id=123).
hash: The hash fragment of the URL (e.g., #section1).
state: Any state passed to the location (e.g., via navigate or Link).
key: A unique key for the location (useful for navigation history).
So, your usage of const { pathname } = useLocation(); is correct and will extract the pathname from the location object.
*/




if(isLoaded && !isSignedIn && isSignedIn !==undefined){

  return <Navigate to ='/?sign-in=true' />;
  
  }


  /*
  Note:
  * isLoaded: This code checks if the user authentication state is 
  loaded (isLoaded), the user is not signed in (!isSignedIn), 
  and isSignedIn is not undefined. If all these conditions are true, 
  it redirects the user to the /?sign-in=true URL using the <Navigate>
   component from react-router-dom. This ensures only 
   signed-in users can access the protected route.


* !isSignedIn: If isSignedIn is not true , means that the user is not
logged in . Hence we will navigate him to the sign-in page.


* isSignedIn!==undefined:
The condition isSignedIn !== undefined ensures that the isSignedIn 
value is explicitly checked to confirm it is not undefined. 
This is important because isSignedIn might initially be
 undefined while the user's authentication state is still
  loading. By including this check, the code avoids making 
  decisions based on an uninitialized or undefined state.






   
  */



  //Check onboarding status

  

if(user!==undefined && !user?.unsafeMetadata?.role && pathname !=='/onboarding'){

  return <Navigate to ="/onboarding" />
  
  }
  

  return children;
  
}

export default ProtectedRoute;
