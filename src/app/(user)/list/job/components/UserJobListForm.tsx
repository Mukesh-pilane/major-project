import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { api } from "~/utils/api";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { TextInput } from "~/components/input/TextInput";
import PrimaryButton from "~/components/button/PrimaryButton";
import { JobType, WorkPlace } from "@prisma/client";
import RichTextEditor from "~/components/input/RichTextEditor";
import Loader from "~/components/Loader";
import SelectV1 from "~/components/input/SelectV1";
import { useSession } from "next-auth/react";

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
  applyUrl: Yup.string().required("Required"),
  subCategoryId: Yup.string().required("Required"),
  categoryId: Yup.string().required("Required"),
});
function UserJobListForm() {
  const { data: session } = useSession();
  const listJob = api.job.userCreate.useMutation({
    onError: (e) => {
      toast.error(`Something went wrong ${e.message}`);
    },
    onSuccess: () => {
      toast.success(`SuccessFully applied for job listing`);
    },
  });

  const { data: companies, isLoading: isCompaniesLoading } =
    api.company.getAll.useQuery(undefined, {});

  const { data: categories, isLoading: isCategoriesLoading } =
    api.category.getAll.useQuery(undefined, {});

  const { data: subCategories, isLoading: isSubCategoriesLoading } =
    api.subCategory.getAll.useQuery(undefined, {});

  const [desc, setDesc] = useState<string>(
    "Job Listing Description Such as Skills role responsibility"
  );

  const [applyInstruction, setApplyInstruction] = useState<string>("");

  if (isCompaniesLoading || isCategoriesLoading || isSubCategoriesLoading) {
    return <Loader />;
  }

  return (
    <Formik
      initialValues={{
        title: undefined,
        type: "FULL_TIME",
        education: "Any Graduate",
        role: undefined,
        workPlace: "REMOTE",
        location: undefined,
        categoryId: undefined,
        subCategoryId: undefined,
        applyUrl: undefined,
        companyId: undefined,
      }}
      validationSchema={DisplayingErrorMessagesSchema}
      onSubmit={(values: JobListType) => {
        listJob.mutate({
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
          userId: session.user.id,
        });
      }}
    >
      {({ errors, touched, values }) => (
        <Form className="grid gap-6 md:grid-cols-2">
          <div className="grid h-fit gap-4">
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
              placeholder="https://company.com/jobid/apply"
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
            <PrimaryButton className=" my-4 w-full" type="submit">
              List
            </PrimaryButton>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default UserJobListForm;
