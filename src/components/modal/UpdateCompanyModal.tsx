"use client";
import { Field, Form, Formik } from "formik";
import React, { useState } from "react";
import { api } from "~/utils/api";
import type { RouterOutputs } from "~/utils/api";
import PrimaryButton from "../button/PrimaryButton";
import ImageUpload from "../input/ImageUpload";
import { TextInput } from "../input/TextInput";
import Modal from "./Modal";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import RichTextEditor from "../input/RichTextEditor";
import { useSession } from "next-auth/react";
import { BiEdit } from "react-icons/bi";

interface Values {
  name: string;
  website: string;
  linkedin: string;
}

const DisplayingErrorMessagesSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  website: Yup.string().required("Required"),
  linkedin: Yup.string().required("Required"),
});

type Company = RouterOutputs["company"]["get"];

const UpdateCompanyModal = ({ company }: { company: Company }) => {
  const { data: session } = useSession();

  const updateCompany = api.company.updateAdminCompany.useMutation({
    onSuccess: () => {
      toast.success("Company Update SuccessFully");
    },
    onError: () => {
      toast.error("Something went Wrong");
    },
  });
  const [desc, setDesc] = useState(company?.desc);
  const [logo, setLogo] = useState<string>(company?.logo);
  if (!session?.user?.isAdmin) {
    return null;
  }
  return (
    <Modal
      button={
        <p className="flex h-full w-full items-center justify-center  text-4xl font-medium text-white">
          <BiEdit size={24} />
        </p>
      }
    >
      <Formik
        initialValues={{
          name: company.name,
          website: company.website,
          linkedin: company.linkedin,
        }}
        validationSchema={DisplayingErrorMessagesSchema}
        onSubmit={(values: Values) => {
          if (!logo) toast.error("Please select A Company logo");
          if (logo) {
            void updateCompany.mutate({
              id: company.id,
              name: values.name,
              desc: desc,
              logo: logo,
              website: values.website,
              linkedin: values.linkedin,
            });
          }
        }}
      >
        <Form className=" grid gap-2">
          <ImageUpload
            value={company.logo}
            onChange={(base64) => setLogo(base64)}
          />

          <Field
            component={TextInput}
            name="name"
            id="name"
            title="name"
            placeholder="Apple"
          />
          <RichTextEditor value={desc} onChange={setDesc} />

          <Field
            component={TextInput}
            name="website"
            id="website"
            title="Company website"
            placeholder="Company website"
          />
          <Field
            component={TextInput}
            name="linkedin"
            id="linkedin"
            title="Company linkedin"
            placeholder="Company linkedin"
          />

          <PrimaryButton
            disable={updateCompany.isLoading}
            loading={updateCompany.isLoading}
            className="mt-4"
          >
            Submit
          </PrimaryButton>
        </Form>
      </Formik>
    </Modal>
  );
};

export default UpdateCompanyModal;
