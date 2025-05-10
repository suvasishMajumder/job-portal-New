import supabaseClient from "@/utils/Superbase";
import toast from "react-hot-toast";

export async function getJobs(token, { location, company_id, searchQuery }) {
  //Instantiate a Supabase client with the user’s token
  const supabase = await supabaseClient(token);

  /*At this point, query is a Supabase “query builder” object pointing at jobs. No network call has been made yet. */
  let query = supabase
    .from("jobs")
    .select(`*, company:companies(name,logo_url,id), saved:saved_jobs(id)`);

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
  const supabase = await supabaseClient(token);

  if (alreadySaved) {
    const { data, error: deleteError } = await supabase
      .from("saved_jobs")
      .delete()
      .eq("job_id", saveData.job_id);

    console.log("value:", data);

    if (deleteError) {
      console.error("Error removing saved job:", deleteError);
      toast.error("Error removing saved job");
      return data;
    }

    return data; //line 2
  } else {
    const { data, error: insertError } = await supabase
      .from("saved_jobs")
      .insert([saveData])
      .select();

    if (insertError) {
      console.error("Error saving job:", insertError);
      toast.error(`Error saving job`);
      return data;
    }

    return data;
  }
}

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
