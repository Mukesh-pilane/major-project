import { ErrorMessage, Field } from "formik";

const CheckBoxV1 = ({ name, id, title }) => {
  return (
    <div>
      <label htmlFor={id} className="addon-checkbox mt-5 bg-white">
        <Field type="checkbox" id={id} name={name} />
        <div className="custom-checkbox" />
        <div className="checkbox-content flex">
          <p className="text-sm  font-bold capitalize text-accent-500">
            {title}
          </p>
        </div>
      </label>
      <ErrorMessage name={name} />
    </div>
  );
};

export default CheckBoxV1;
