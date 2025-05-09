import supabaseClient, { supabaseUrl } from "@/utils/Superbase";
import { useUser } from "@clerk/clerk-react";


  
// // export async function applyToJob(token , _, jobData) {

// //     const supabase = await supabaseClient(token);
  

// // const random = Math.floor(Math.random() * 90000);

// // const fileName = `resume-${random}-${jobData.candidate_id}`;



// // //uploading data to the DB
// // const {error:storageError} = await supabase.storage.from('resumes').upload(fileName,jobData.resume);


// // if(storageError){

// // console.log('Error Uploading Resume:',storageError);
// // return null;

// // }

// // const resume = `${supabaseUrl}/storage/v1/object/public/resumes/${fileName}`;

// //       const { data , error } = await supabase
// //         .from("applications")
// //         .insert([{

// // ...jobData,resume

// //         }]).select();

  
// //   // console.log('value:',data)
  
  
// //   if(error){
  
// //   console.log('Error Submitting Applications',error);
// //   return null;
  
// //   }
  
// //   console.log(data)
  
// //   return data;
  
// //   }
  
//   // - Apply to job ( candidate )
// export async function applyToJob(token, _, jobData) {
//   const supabase = await supabaseClient(token);

//   const random = Math.floor(Math.random() * 90000);
//   const fileName = `resume-${random}-${jobData.candidate_id}`;

//   const { error: storageError } = await supabase.storage
//     .from("resumes")
//     .upload(fileName, jobData.resume);

//   if (storageError){
//     console.log('Error uploading resume',storageError);
//     throw new Error("Error uploading Resume");
//   }
//   const resume = `${supabaseUrl}/storage/v1/object/public/resumes/${fileName}`;


//   console.log(jobData)
//   const { data, error } = await supabase
//     .from("applications")
//     .insert([
//       {
//         ...jobData,
//         resume,
//       },
//     ])
//     .select();

//     console.log(data)

//   if (error) {
//     console.error(error);
//     throw new Error("Error submitting Application");
//   }

//   return data;
// }



//New code:


export async function applyToJob(token, _, jobData) {
  const supabase = await supabaseClient(token);


  const random = Math.floor(Math.random() * 90000);
  const fileName = `resume-${random}-${jobData.candidate_id}.pdf`; // Ensure valid file name

  // Validate the resume file
  console.log("Resume File Details:", jobData);
  if (!(jobData.resume instanceof File || jobData.resume instanceof Blob)) {
    console.error("Invalid file type. Expected File or Blob.");
    return null;
  }

  // Upload the resume to the Supabase storage bucket
  const { error: storageError } = await supabase.storage
    .from("resumes")
    .upload(fileName, jobData.resume);

  if (storageError) {
    console.error("Error Uploading Resume:", storageError);
    throw new Error("Error uploading Resume");
  }

  // Construct the public URL for the uploaded resume
  const resume = `${supabaseUrl}/storage/v1/object/public/resumes/${fileName}`;

/*
The resume file (jobData.resume) is uploaded to the Supabase storage bucket (resumes) using 
the upload method.
If the upload is successful, a public URL for the uploaded file is constructed.
Inserting Data into the applications Table:

After the resume is successfully uploaded, the jobData
 (along with the resume URL) is inserted into the applications 
table in the database.
*/


  console.log("Job Data:", jobData);
  const { data, error } = await supabase
    .from("application")
    .insert([
      {
        ...jobData,
        resume,
      },
    ])
    .select();

  if (error) {
    console.error("Error Submitting Application:", error);
    throw new Error("Error submitting Application");
  }

  console.log("Application Submitted Successfully:", data);
  return data;
}




export async function updateApplicationStatus(token, { job_id }, status) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("application")
    .update({ status })
    .eq("job_id", job_id)
    .select();

  if (error || data.length === 0) {
    console.error("Error Updating Application Status:", error);
    return null;
  }

  return data;
  
}





export async function getApplications(token,{user_id}) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("application")
    .select('*,job:jobs(title,company:companies(name))')
    .eq("candidate_id", user_id)
 

  if (error || data.length === 0) {
    console.error("Error Fetching Applications:", error);
    return null;
  }

  return data;
  
}



