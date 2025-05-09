import React, { useEffect } from "react";
import { z } from "zod";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { Button } from "./ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useFetch from "@/hooks/use-fetch";
import { addNewCompany } from "@/pages/api/apiCompanies";
import { BarLoader } from "react-spinners";
import { Input } from "./ui/input";


const schema = z.object({
  name: z.string().min(1, { message: "Company Name Is Required" }),
logo: z
    .any()
    .refine(
      (file) =>
       file && file[0] &&
        (file[0]?.type === "image/png" ||
          file[0]?.type === "image/jpeg" ||
          file[0]?.type === "image/webp"),
      { message: "Only Images Are Allowed" }
    ),
});

const AddCompanyDrawer = ({ fetchCompanies }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });




  const {
    loading:loadingAddCompany,
    error:errorAddCompany,
    data:dataAddCompany,
    fn:fnAddCompany,
    
    } = useFetch(addNewCompany);

  const onSubmit = async(data) =>{
    
fnAddCompany({
...data,
logo:data.logo[0],


})

  }


useEffect(()=>{

if(dataAddCompany?.length > 0){

fetchCompanies();

}

},[loadingAddCompany])


  return (
    <Drawer>
      <DrawerTrigger>
        <Button type="button" size="sm" variant="secondary">
          Add Company
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>




        <form className='flex gap-2 p-4 pb-0'>
<Input placeholder="Company Name" {...register("name")} />

<Input type="file" accept="image/*" className="file:text-gray-500"
{...register("logo")} />

<Button
type='button'
onClick={handleSubmit(onSubmit)}
variant="destructive"
className="w-40">
Add
</Button>

</form>
{errors.name && <p className="text-red-500">{errors?.name.message}</p>}
{errors.logo && <p className="text-red-500">{errors?.logo.message}</p>}
{errorAddCompany?.message && <p className="text-red-500">{errorAddCompany?.message}</p>}

{loadingAddCompany && <BarLoader width={'100%'} color="#36d7b7"></BarLoader>}

          <DrawerTitle>Add A New Company</DrawerTitle>
          <DrawerDescription>This action cannot be undone.</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="secondary" type='button'>Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default AddCompanyDrawer;
