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

  /*
z.any() accepts any kind of input for the resume field, such as a file object, 
and hands it off for further validation. You then chain on .refine(), supplying a 
predicate that first ensures the uploaded file array isn’t empty and then checks 
the MIME type of the first file entry to confirm it’s either a PDF 
(application/pdf) or a Word document (application/msword or 
application/vnd.openxmlformats-officedocument.wordprocessingml.document).
 If these conditions aren’t met, the custom error “Only PDF or Word documents
  are allowed” is raised.
*/

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

/*


# experience: Minimum value is 0 || Must be an integer || Error message: "Experience must be at least 0".


# skills: Must be a string || Cannot be empty || Error message: Skills are required


# education: Must be one of the predefined values: Intermediate , Graduate or Post Graduate


# resume: Can be any file || Must be a .pdf or .doc/.docx file || Error message: Only PDF or Word documents are allowed



This `schema` is a validation object created using **Zod**, a library for schema validation. It defines rules for validating form inputs.

### Explanation:
1. **`experience`**:
   - Must be a number.
   - Minimum value is `0`.
   - Must be an integer.
   - Error message: `"Experience must be at least 0"`.

2. **`skills`**:
   - Must be a string.
   - Cannot be empty.
   - Error message: `"Skills are required"`.

3. **`education`**:
   - Must be one of the predefined values: `"Intermediate"`, `"Graduate"`, or `"Post graduate"`.
   - Error message: `"Education is required"`.

4. **`resume`**:
   - Can be any file.
   - Must be a `.pdf` or `.doc/.docx` file.
   - Error message: `"Only PDF or Word documents are allowed"`.

### How Zod Works:
- **Validation**: Zod checks the input data against the rules defined in the schema.
- **Error Handling**: If the data doesn't match the rules, Zod returns the specified error messages.
- **Integration**: This schema is used with `react-hook-form` to validate form inputs before submission.

*/

const ApplyJobDrawer = ({ user, job, applied = false, fetchJob }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  // applied = true; //With applied to true , the button will get destructive color
  // and will be disabled

  //Doubt 1:-

  //How this open = {applied ? false : undefined}

  /*
✅ Applied Check Logic for Drawer
🔁 Logic Overview:
If applied === true
→ The open prop is set to false.
→ This ensures the drawer remains closed at all times.

If applied === false
→ The open prop is set to undefined.
→ This allows the drawer to be controlled by its internal state or the DrawerTrigger.

⚙️ Behavior of open: undefined
When open is undefined, the drawer behaves as a controlled/uncontrolled component:

It uses internal logic or waits for user interaction (e.g., clicking the DrawerTrigger) to open/close.

🧠 How It Works
✅ User has applied (applied === true)
→ Drawer cannot be opened (hard-locked by open = false).

❌ User has not applied (applied === false)
→ Drawer can be opened by the user via trigger interaction.

🎯 Result
This ensures that:

Only users who have not applied can interact with the drawer.

Users who have already applied are restricted from opening it again.
*/

  const {
    loading: loadingApply,
    error: errorApply,
    fn: fnApply,
  } = useFetch(applyToJob);

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
    <Drawer className="select-none" open={applied ? false : undefined}>
      <DrawerTrigger asChild>
        {/* The asChild prop is typically used in UI libraries (Like radix or custom component)
       to allow the component to pass its behavior to a child component */}

        <Button
          size={"lg"}
          variant={job?.isOpen && !applied ? "blue" : "destructive"}
          disabled={!job?.isOpen || applied}

          /*
The above short circuiting:

✅ disabled={!job?.isOpen || applied} — Logic Breakdown
This expression determines whether a button should be disabled
 based on two conditions:

🧠 Explanation
1. Logical OR (||)
The || operator returns true if either condition is true.

If the first condition is true, JavaScript skips checking the second 
(due to short-circuiting).

2. Conditions Explained
!job?.isOpen:

Checks if the job is not open.

If job?.isOpen is false or undefined, this becomes true.

applied:

Checks if the user has already applied for the job.

🧾 Resulting Behavior
The button becomes disabled (true) if:

The job is not open, OR

The user has already applied.

The button remains enabled (false) only if:

The job is open, AND

The user has not applied.


*/
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
          /*
          The <form onSubmit={handleSubmit(onSubmit)}> works as follows:

handleSubmit:
Provided by react-hook-form, it validates the form data using the schema before submission.
If validation passes, it calls the onSubmit function with the form data.

onSubmit:
This is your custom function that processes the validated form data 
(e.g., sending it to the server).

Flow
User submits the form.
handleSubmit validates the data using the Zod schema.
If valid, onSubmit is called with the form data.
If invalid, errors are displayed (e.g., errors.resume.message).
          */
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
  );
};

export default ApplyJobDrawer;

// In your ApplyJobDrawer form, the <Controller> is the bridge between React Hook Form (RHF) and that custom RadioGroup UI component.
//  Here’s how it works, step by step, in simpler terms:

// 1. RHF Needs to “Control” Custom Inputs:

// React Hook Form’s register API works great on standard HTML inputs (like <input>, <select>, etc.). But when you use a custom component—here,
// RadioGroup from your UI library—you can’t just spread register(...) into it. RHF can’t automatically hook into its value or change events.
//  That’s where <Controller> comes in.

// 2. Telling RHF What Field You’re Managing:

// <Controller
//   name="education"
//   control={control}
//   render={({ field }) => ( … )}
// />

// name="education": This is the key in your form data. After submit, data.education will hold the selected radio value.

// control={control}: This is the RHF object you got from useForm(). It keeps track of all controlled fields.

// 3. render → Getting field Props:

// The render prop is a function that RHF calls to render your custom component. It passes an object containing a field property,
//  which is essentially:

// {
//   value: /* current form value for “education” */,
//   onChange: /* function to call when the value changes */,
//   onBlur: /* (optional) for tracking “touched” state */,
//   name: "education"
// }

// You spread those into your component (or wire them up manually) so RHF can keep in sync with what the user picks.

// 4. Wiring field into RadioGroup:

// <RadioGroup onValueChange={field.onChange} {...field}>
//   …
// </RadioGroup>

// value={field.value} (in the spread): tells the radio group which option is currently selected.

// onValueChange={field.onChange}: whenever the user clicks a radio item, RadioGroup calls this, and RHF updates its internal state for education.

// 5. Putting It All Together:

// User clicks the “Graduate” radio.

// RadioGroup fires its onValueChange("Graduate"), which is your field.onChange.

// RHF stores { education: "Graduate" } in its form state.

// If you inspect formState.values or eventually call handleSubmit, you’ll see education: "Graduate" in the data.

// 6. Why This Matters:

// Without <Controller>, RHF wouldn’t know when the radio value changes, and your form would never capture which education level was selected.

// <Controller> gives you a standardized way to integrate any custom or third‑party component into RHF’s world of validation,
// state tracking, and submission.

// In short:

// <Controller> wraps your non‑standard input (RadioGroup), hands you back a small field object (value, onChange, etc.), and
// wires it up so that React Hook Form can see and validate whatever the user selects.
