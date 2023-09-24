"use client";
import { Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { api } from "~/utils/api";
import * as Yup from "yup";
import { TextInput } from "~/components/input/TextInput";
import PrimaryButton from "~/components/button/PrimaryButton";
import { JobType, WorkPlace } from "@prisma/client";
import RichTextEditor from "~/components/input/RichTextEditor";
import Loader from "~/components/Loader";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";
import CheckBoxV1 from "~/components/input/CheckBoxV1";
import SelectV1 from "~/components/input/SelectV1";
type Params = {
  params: {
    id: string;
  };
};

const DisplayingErrorMessagesSchema = Yup.object().shape({
  title: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  type: Yup.string().required("Required"),
  education: Yup.string().required("Required"),
});
const EditJobPage = ({ params: { id } }: Params) => {
  const { data: session } = useSession();
  const { data: job, isLoading } = api.job.get.useQuery({ id });
  const updateAdminJob = api.job.updateAdminJob.useMutation({
    onSuccess: () => {
      toast.success("Job updated Successfully");
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  const { data: companies, isLoading: isCompaniesLoading } =
    api.company.getAll.useQuery(undefined, {});
  const { data: categories, isLoading: isCategoriesLoading } =
    api.category.getAll.useQuery(undefined, {});
  const { data: subCategories, isLoading: isSubCategoriesLoading } =
    api.subCategory.getAll.useQuery(undefined, {});

  const [desc, setDesc] = useState<string>();
  const [applyInstruction, setApplyInstruction] = useState<string>();

  useEffect(() => {
    if (job && !isLoading) {
      setDesc(job.desc);
      setApplyInstruction(job.applyInstruction);
    }
  }, [job, isLoading]);

  if (
    isCompaniesLoading ||
    isCategoriesLoading ||
    isSubCategoriesLoading ||
    isLoading
  ) {
    return <Loader />;
  }

  return (
    <main className=" mx-auto w-full max-w-7xl px-4">
      <h2 className=" py-4 text-[clamp(1rem,6vw,2rem)] font-medium capitalize">
        Edit Job Page
      </h2>
      <Formik
        initialValues={{
          title: job.title,
          type: job.type,
          education: job.education,
          role: job.role,
          experienceMin: job.experienceMin,
          experienceMax: job.experienceMax,
          salary: job.salary,
          workPlace: job.workPlace,
          location: job.location,
          categoryId: job.categoryId,
          subCategoryId: job.subCategoryId,
          companyId: job.companyId,
          featured: job.featured,
          approved: job.approved,
        }}
        validationSchema={DisplayingErrorMessagesSchema}
        onSubmit={(values: JobListType) => {
          void updateAdminJob.mutate({
            id: job.id,
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
            approved: values.approved,
            featured: values.featured,
            userId: job.userId ? job.userId : session.user.id,
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
              <PrimaryButton
                loading={updateAdminJob.isLoading}
                disable={updateAdminJob.isLoading}
                className=" my-4 w-full"
                type="submit"
              >
                Update
              </PrimaryButton>
            </div>
          </Form>
        )}
      </Formik>
    </main>
  );
};

export default api.withTRPC(EditJobPage);
