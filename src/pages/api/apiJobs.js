import supabaseClient from "@/utils/Superbase";
import toast from "react-hot-toast";

/*Because in JavaScript extra arguments are just ignored unless you explicitly grab them, there’s no error here:
So, we r taking onky 2 function paramters here even if 3 arguments are passed to the getJobs function from isnde the useFetch.jsx

*/
export async function getJobs(token, { location, company_id, searchQuery }) {
  //Instantiate a Supabase client with the user’s token
  const supabase = await supabaseClient(token);

  /*At this point, query is a Supabase “query builder” object pointing at jobs. No network call has been made yet. */
  let query = supabase
    .from("jobs")
    .select(`*, company:companies(name,logo_url,id), saved:saved_jobs(id)`);
  // let query = supabase
  //   .from("jobs")
  //   .select(`
  //     *,
  //    companies(*)
  //   `);
  // console.log(query);

  //Explanantions about these filters:

  /*
Whenever we write
let query = supabase.from("jobs").select("*");

we don’t yet hit the network—you just get back a query builder object. Under the hood, that builder keeps an internal list of:

which table you’re querying (jobs),

which columns you want (*),

and any filters or modifiers you’ve chained on.


Each time you call a filter method:- query = query.eq("location", location);
or query = query.ilike("title", `%${searchQuery}%`);

you’re doing two things:

Appending a new “filter statement” to that builder’s internal list

Returning the same kind of builder (so you can chain again)


So after all your if (…){ query = query.eq(…) } lines, query.filters might look like:

[
  { op: "eq",    col: "location",    val: "Paris"       },
  { op: "ilike", col: "title",       val: "%Engineer%"  },
  { op: "eq",    col: "company_id",  val: "123"         },
]



Now , Only when we do const { data, error } = await query

1. Serialize those filters into the REST‑endpoint URL or RPC payload

2. Send a single HTTP request

3. Return the combined, filtered results in data

*/

  if (location) {
    query = query.eq("location", location);
  }

  if (searchQuery) {
    query = query.ilike("title", `%${searchQuery}`);
  }

  if (company_id) {
    query = query.eq("company_id", company_id);
  }

  /*Only when you await the builder does Supabase fire off the HTTP request.
   It returns an object with data (your array of jobs) and error. */
  const { data, error } = await query;

  if (error) {
    console.error("Error Fetching Jobs:", error);
    return null;
  }

  console.log(data);

  return data;
}

export async function saveJob(token, { alreadySaved }, saveData) {
  /*
NOTE: export async function saveJob(
  token,                // JWT for auth
  { alreadySaved },     // boolean flag: has the user already saved this job?
  saveData              // object with the row to insert/delete, e.g. { job_id, user_id, … }
) { … }
*/

  //Instantiate an Authenticated Supabase Client. This ensures all subsequent operations run under the user’s identity

  const supabase = await supabaseClient(token);

  if (alreadySaved) {
    // If the job is already saved, remove it

    /*
.delete().eq("job_id", saveData.job_id) issues a DELETE FROM saved_jobs WHERE job_id = ….

On error, it logs to the console and shows a toast notification.

Returns data, which is an array of deleted rows (often empty if none matched).
*/

    const { data, error: deleteError } = await supabase
      .from("saved_jobs")
      .delete()
      .eq("job_id", saveData.job_id); //Here,  if you don’t chain on .select(), the data you get back from a .delete() call is always null

    console.log("value:", data); //Output: value: null

    /*
      Check for Errors: If deleteError exists, it means the deletion operation failed.
Log the Error: The error is logged to the console for debugging.
Show a Notification: A toast notification is displayed to inform the user about the failure.
      */

    if (deleteError) {
      console.error("Error removing saved job:", deleteError);
      toast.error("Error removing saved job");
      return data; //line 1
      /*On error, Supabase always sets data to null (and populates the error field). So in this above:
       if (deleteError) branch, you’ll be returning null.
       */
    }

    return data; //line 2
  } else {
    // If the job is not saved, add it to saved jobs . If the Job Is Not Yet Saved → Insert a New Row
    /*
.insert([ saveData ]) adds a new record to saved_jobs.

.select() appended to an insert causes Supabase to return the newly inserted rows.

On error, it logs it; otherwise returns the inserted row(s).

Return Value
In both branches the function returns the data array from Supabase. 
Your calling code can use that to update UI state (e.g. refreshing the list of saved jobs).

*/

    /* Because you appended .select() to the .insert() call, Supabase will return an array of the newly 
inserted row(s) in data when the operation succeeds. */
    const { data, error: insertError } = await supabase
      .from("saved_jobs")
      .insert([saveData])
      .select();

    /* if insertError is truthy, Supabase will set data to null (and populate insertError), 
      so in that error branch you’ll be returning null.
       */
    if (insertError) {
      console.error("Error saving job:", insertError);
      toast.error(`Error saving job`);
      return data; //will return null
    }

    return data; //will return the newly inserted rows due to the select() chaining.
  }
}

// NOTE

// eslint-disable-next-line no-irregular-whitespace
// since you didn’t chain .select() on your .delete() call, Supabase will return data = null in both the error branch (line 1)
// and the success branch (line 2). If you want the deleted row(s) back, you need to do:

export async function getSingleJob(token, { job_id }) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("jobs")
    .select(
      "*, company:companies(name,logo_url) , applications: application(*)"
    )
    .eq("id", job_id)
    .single();

  // console.log('value:',data)

  if (error) {
    console.log("Error Fetching Company:", error);
    return null;
  }

  // console.log(data)

  return data;
}

export async function updateHiringStatus(token, { job_id }, isOpen) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("jobs")
    .update({ isOpen })
    .eq("id", job_id)
    .select();

  /*
const { data, error } = await supabase
 # .from("jobs")          // Specifies the table to update (`jobs` table).

# .update({ isOpen })    // Updates the `isOpen` column with the new value.
Updates the isOpen column with the value provided in the isOpen variable.
  
 # .eq('id', job_id)      // Filters the rows where the `id` matches `job_id`.
  .select();             // Returns the updated rows after the operation.
*/

  // console.log('value:',data)

  if (error) {
    console.log("Error Updating Job", error);
    return null;
  }

  console.log(data);

  return data;
}

export async function addNewJob(token, _, jobData) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("jobs")
    .insert([jobData])
    .select();

  if (error) {
    console.log("Error Creating Job", error);
  }

  return data;
}

export async function getSavedJobs(token) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("saved_jobs")
    .select("*,job:jobs(*,company:companies(name,logo_url))");

  if (error) {
    console.log("Error Fetching Saved Jobs", error);
    return null;
  }

  return data;
}

export async function getMyJobs(token, { recruiter_id }) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("jobs")
    .select("*,company:companies(name,logo_url)")
    .eq("recruiter_id", recruiter_id);

  if (error) {
    console.log("Error Fetching Saved Jobs", error);
    return null;
  }

  return data;
}

//Delete Job:

export async function deleteJob(token, { job_id }) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("jobs")
    .delete()
    .eq("id", job_id)
    .select();

  if (error) {
    console.log("Error Deleting Job", error);
    return null;
  }

  return data;

}
