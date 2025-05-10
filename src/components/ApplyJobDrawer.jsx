import React from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import useFetch from "@/hooks/use-fetch";
import { applyToJob } from "@/pages/api/apiApplication";
import { GridLoader } from "react-spinners";
import { useUser } from "@clerk/clerk-react";

const schema = z.object({
  experience: z
    .number()
    .min(0, { message: "Experience must be at least 0" })
    .int(),

  skills: z.string().min(1, { message: "Skills are required" }),

  education: z.enum(["Intermediate", "Graduate", "Post Graduate"], {
    message: "Education is required",
  }),



  resume: z
    .any()
    .refine(
      (file) =>
        file[0] &&
        (file[0].type === "application/pdf" ||
          file[0].type === "application/msword"),
      { message: "Only PDF or Word documents are allowed" }
    ),
});



  const ApplyJobDrawer = ({ job, applied, fetchJob }) => {
    const {
      loading: loadingApply,
      error: errorApply,
      fn: fnApply,
    } = useFetch(applyToJob);
  
    const { register, handleSubmit, control, reset, formState: { errors } } = useForm({
      resolver: zodResolver(schema),
    });
  
    const { user } = useUser();
  
    const onSubmit = (data) => {
      console.log(data?.resume);
  
      fnApply({
        ...data,
        job_id: job.id,
        candidate_id: user.id,
        name: user.fullName,
        status: "applied",
        resume: data.resume[0],
      }).then(() => {
        fetchJob();
        reset();
      });
    };
  
    return (
    <>
    <Drawer className="select-none" open={applied ? false : undefined}>
      <DrawerTrigger asChild>
    
        <Button
          size={"lg"}
          variant={job?.isOpen && !applied ? "blue" : "destructive"}
          disabled={!job?.isOpen || applied}
        >
          {/* doubt */}
          {job?.isOpen ? (applied ? "Applied" : "Apply") : "Hiring Closed"}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{`Apply For ${job?.title} Job at ${job?.company?.name}`}</DrawerTitle>
          <DrawerDescription>Please Fill The Form Below</DrawerDescription>
        </DrawerHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          action=""
          className="flex flex-col gap-4 p-4 pb-0"
        >
          <Input
            {...register("experience", {
              valueAsNumber: true,
            })}
            type="number"
            placeholder="Years Of Experience"
            className="flex-1"
          />
          {errors.experience && (
            <p className="text-red-500">{errors.experience.message}</p>
          )}

          <Input
            type="text"
            placeholder="Skills (Comma Separated)"
            className="flex-1"
            {...register("skills")}
          />
          {errors.skills && (
            <p className="text-red-500">{errors.skills.message}</p>
          )}

          <Controller
            name="education"
            control={control}
            render={({ field }) => (
              <RadioGroup onValueChange={field.onChange} {...field}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Intermediate" id="Intermediate" />
                  <Label htmlFor="Intermediate">Intermediate</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Graduate" id="Graduate" />
                  <Label htmlFor="Graduate">Graduate</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Post Graduate" id="Post Graduate" />
                  <Label htmlFor="post-graduate">Post Graduate</Label>
                </div>
              </RadioGroup>
            )}
          />

          {errors.education && (
            <p className="text-red-500">{errors.education.message}</p>
          )}

          <Input
            type="file"
            accept=".pdf,.doc,.docx"
            className="flex-1 file:text-gray-600"
            {...register("resume")}
          />
          {errors.resume && (
            <p className="text-red-500">{errors.resume.message}</p>
          )}

          {errorApply?.message && <p className="">{errorApply.message}</p>}
          {loadingApply && <GridLoader width={`100%`} color={`#36d7b7`} />}

          <Button type="submit" variant="blue" size="lg">
            Apply
          </Button>
        </form>

        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
    </>
  );
};

export default ApplyJobDrawer;
