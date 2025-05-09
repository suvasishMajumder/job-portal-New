import supabaseClient, { supabaseUrl } from "@/utils/Superbase";
import { useEffect, useMemo, useState } from "react";



export async function getCompanies(token) {
  //Instantiate a Supabase client with the user’s token
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase.from("companies").select("*");

  if (error) {
    console.log("Error Fetching Companies:", error);
    return null;
  }

  return data;
}








// Add Company
// export async function addNewCompany(token, _, companyData) {
//   const supabase = await supabaseClient(token);

//   const random = Math.floor(Math.random() * 90000);
//   const fileName = `logo-${random}-${companyData.name}`;

//   const { error: storageError } = await supabase.storage
//     .from("company-logo")
//     .upload(fileName, companyData.logo);

//   if (storageError) throw new Error("Error uploading Company Logo");

//   const logo_url = `${supabaseUrl}/storage/v1/object/public/company-logo/${fileName}`;

//   const { data, error } = await supabase
//     .from("companies")
//     .insert([
//       {
//         name: companyData.name,
//         logo_url: logo_url,
//       },
//     ])
//     .select();

//   if (error) {
//     console.error(error);
//     throw new Error("Error submitting Companys");
//   }

//   return data;
// }







export async function addNewCompany(token, _, companyData) {
  const supabase = await supabaseClient(token);

  const random = Math.floor(Math.random() * 90000);
  const fileName = `logo-${random}-${companyData.name}`;

  const { error: storageError } = await supabase.storage
    .from("company-logo")
    .upload(fileName, companyData.logo);

  if (storageError){
    
    // throw new Error("Error uploading Company Logo");

    console.log('Error Uploading Company Logo',storageError);
    return null;

  }
  const logo_url = `${supabaseUrl}/storage/v1/object/public/company-logo/${fileName}`;

  const { data, error } = await supabase
    .from("companies")
    .insert([
      {
        name: companyData.name,
        logo_url: logo_url,
      },
    ])
    .select();

  if (error) {
    console.error(error);
    throw new Error("Error submitting Companys");
  }

  return data;
}