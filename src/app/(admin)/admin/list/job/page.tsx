"use client";
import { Field, Form, Formik } from "formik";
import React, { useState } from "react";
import { api } from "~/utils/api";
import * as Yup from "yup";
import { TextInput } from "~/components/input/TextInput";
import PrimaryButton from "~/components/button/PrimaryButton";
import { JobType, WorkPlace } from "@prisma/client";
import RichTextEditor from "~/components/input/RichTextEditor";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";
import CheckBoxV1 from "~/components/input/CheckBoxV1";
import SelectV1 from "~/components/input/SelectV1";

const DisplayingErrorMessagesSchema = Yup.object().shape({
  title: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  education: Yup.string()
    .required("Required")
    .min(2, "Too Short!")
    .max(20, "Too Long!"),
  role: Yup.string().required("Required"),
  salary: Yup.number().min(0, "Salary can be negative ???"),
  companyId: Yup.string().required("Required"),
  subCategoryId: Yup.string().required("Required"),
  applyUrl: Yup.string().required("Required"),
  categoryId: Yup.string().required("Required"),
  featured: Yup.boolean().required("Required"),
});

const JobListPage = () => {
  const { data: session } = useSession();

  const listJob = api.job.create.useMutation({
    onSuccess: () => {
      toast.success("Job Listed Successfully");
    },
    onError: (e) => {
      toast.error(`Something went wrong  ${e.message}`);
    },
  });

  const { data: companies } = api.company.getAll.useQuery(undefined, {});
  const { data: categories } = api.category.getAll.useQuery(undefined, {});
  const { data: subCategories } = api.subCategory.getAll.useQuery(
    undefined,
    {}
  );
  const [desc, setDesc] = useState<string>(
    "Job Listing Description Such as Skills role responsibility"
  );
  const [applyInstruction, setApplyInstruction] = useState<string>(
    "Any special apply instruction "
  );

  // if (isCompaniesLoading || isCategoriesLoading || isSubCategoriesLoading) {
  //   return <Loader />;
  // }
  return (
    <main className=" mx-auto w-full max-w-7xl px-4">
      <h2 className=" py-4 text-[clamp(1rem,6vw,2rem)] font-medium capitalize">
        List New Job
      </h2>
      <Formik
        initialValues={{
          title: "",
          type: "FULL_TIME",
          education: "",
          role: "",
          workPlace: "REMOTE",
          location: "",
          categoryId: undefined,
          subCategoryId: undefined,
          companyId: undefined,
          applyUrl: undefined,
          featured: false,
          approved: false,
        }}
        validationSchema={DisplayingErrorMessagesSchema}
        onSubmit={(values: JobListType) => {
          // if(!desc) return toast.error("Please provide job description")
          void listJob.mutate({
            title: values.title,
            desc: desc,
            type: values.type,
            education: values.education,
            role: values.role,
            experienceMin: values.experienceMin,
            experienceMax: values.experienceMax,
            salary: values.salary,
            workPlace: values.workPlace,
            location: values.location,
            companyId: values.companyId,
            categoryId: values.categoryId,
            subCategoryId: values.subCategoryId,
            applyUrl: values.applyUrl,
            applyEmail: values.applyEmail,
            applyInstruction: applyInstruction,
            approved: values.approved,
            featured: values.featured,
            userId: session.user.id,
          });
        }}
      >
        {({ errors, touched, values }) => (
          <Form className="grid gap-6 md:grid-cols-2">
            <div className=" grid h-fit gap-4">
              <Field
                component={TextInput}
                name="title"
                id="title"
                title="title"
                placeholder="Job Title"
              />

              <RichTextEditor
                value={desc}
                onChange={setDesc}
                title="Job Description"
              />

              {companies && (
                <SelectV1
                  options={companies}
                  name="companyId"
                  title="Select Company *"
                />
              )}

              <div className="grid grid-cols-2 gap-4">
                {categories && (
                  <SelectV1
                    options={categories}
                    name="categoryId"
                    title="Job Department *"
                  />
                )}
                {subCategories && (
                  <SelectV1
                    options={subCategories}
                    name="subCategoryId"
                    title="Job Role Position"
                  />
                )}
              </div>

              <Field
                component={TextInput}
                name="education"
                id="education"
                title="education"
                placeholder="Any / Btech / MCA"
              />
              <Field
                component={TextInput}
                name="role"
                id="role"
                title="role"
                placeholder="SDE 1 ~ / Web Developer / Driver 🫥 "
              />
            </div>

            <div className=" grid items-start gap-4">
              <div className="grid grid-cols-2 gap-4">
                <SelectV1
                  options={Object.keys(JobType).map((key) => {
                    return {
                      id: JobType[key],
                      name: key.replaceAll("_", " "),
                    };
                  })}
                  name="type"
                  title="Employment / Job Type *"
                />
                <Field
                  component={TextInput}
                  name="salary"
                  id="salary"
                  title="Salary LPA"
                  type="number"
                  placeholder="Salary"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field
                  component={TextInput}
                  name="experienceMin"
                  id="experienceMin"
                  title="experience Min"
                  type="number"
                  placeholder="0 | > 0"
                />

                <Field
                  component={TextInput}
                  name="experienceMax"
                  id="experienceMax"
                  title="experience Max"
                  type="number"
                  placeholder="Maximum experience"
                />
              </div>
              <div className="grid grid-cols-2 justify-end gap-4">
                <SelectV1
                  options={Object.keys(WorkPlace).map((key) => {
                    return {
                      id: WorkPlace[key],
                      name: key.replaceAll("_", " "),
                    };
                  })}
                  name="workPlace"
                  title="Working Place"
                />
                {values.workPlace === "HYBRID" ||
                values.workPlace === "OFFICE" ? (
                  <Field
                    component={TextInput}
                    name="location"
                    id="location"
                    title="location"
                    placeholder="location"
                  />
                ) : null}
              </div>
              <Field
                component={TextInput}
                name="applyUrl"
                id="applyUrl"
                title="Apply Url"
                placeholder="https://company.com/jobid"
              />
              <Field
                component={TextInput}
                name="applyEmail"
                id="applyEmail"
                title="Apply Email"
                placeholder="Apply Email if any"
              />
              <RichTextEditor
                value={applyInstruction}
                title="Apply Instruction (if any)"
                onChange={setApplyInstruction}
              />
              <div className="  grid grid-cols-2 gap-4">
                <CheckBoxV1 name={"featured"} id="featured" title="featured" />
                <CheckBoxV1 name={"approved"} id="approved" title="approved" />
              </div>
              <PrimaryButton className=" my-4 w-full" type="submit">
                List
              </PrimaryButton>
            </div>
          </Form>
        )}
      </Formik>
    </main>
  );
};

export default api.withTRPC(JobListPage);
