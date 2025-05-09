
import { useSession } from "@clerk/clerk-react";
import { useEffect, useState } from "react";


const useFetch = (cb,options={}) =>{

const [data,setData] = useState(undefined);
const [loading, setLoading] = useState(null);
const [error,setError] = useState(null);


const {session} = useSession();

// console.log(session)

const fn = async(...args) => {

    // console.log(args)

    setLoading(true);
    setError(null);


    try {
        
        const supabaseAccessToken = await session.getToken({

            template:"supabase",
      
          });

    //   console.log('====================================');
    //   console.log(supabaseAccessToken ? console.log(supabaseAccessToken) : 'Not available');
    //   console.log('====================================');

         const response = await cb(supabaseAccessToken,options,...args);
         setData(response);
        //  console.log(data);
         setError(null);

    } catch (error) {
        setError(error);
    }finally{

        setLoading(false)
    }

}

// console.log(data)

return {fn, data, loading, error}  // The fn here, remembers its lexical scope

/*
in the cb , is the function fn remembering its lexical scope , because when we call getJobs , the cb executes as getJobs 
and when we call saveJob , then cb calls saveJob 
*/

}


export default useFetch;