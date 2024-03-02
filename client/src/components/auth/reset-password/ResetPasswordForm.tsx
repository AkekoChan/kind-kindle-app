import { Field, Form, Formik, FormikHelpers } from "formik";
import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "react-line-awesome";
import * as Yup from "yup";
import { Button } from "../../ui";

interface FormValues {
  password: string;
  confirmPassword: string;
}

const ResetPasswordForm = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const handleSubmit = (
    values: FormValues,
    actions: FormikHelpers<FormValues>
  ) => {
    console.log(values);
    actions.setSubmitting(false);
  };

  return (
    <Formik
      initialValues={{ password: "", confirmPassword: "" }}
      validationSchema={Yup.object().shape({
        password: Yup.string()
          .required("Le mot de passe est obligatoire.")
          .min(8, "Le mot de passe doit contenir 8 caractères minimum.")
          .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            "Le mot de passe doit contenir au moins une lettre majuscule, une lettre minuscule, un chiffre et un caractère special."
          )
          .trim(),
        confirmPassword: Yup.string()
          .oneOf([Yup.ref("password")], "Le mot de passe ne correspond pas.")
          .required("La confirmation du mot de passe est obligatoire.")
          .trim(),
      })}
      onSubmit={handleSubmit}
    >
      {({ errors, touched, isValid, dirty }) => (
        <Form className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <div className="relative">
                <Field
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Mot de passe"
                  autoComplete="off"
                  aria-required="true"
                  aria-invalid={
                    errors.password && touched.password ? "true" : "false"
                  }
                  aria-describedby="password-help"
                  className={`w-100 bg-alabaster-600 border-3 rounded-xl p-4 placeholder:text-alabaster-50 focus:border-tree-poppy-500 outline-none ${
                    errors.password && touched.password
                      ? "border-mandy-500"
                      : "border-alabaster-400"
                  }`}
                />
                {!showPassword ? (
                  <EyeSlashIcon
                    onClick={() => setShowPassword(true)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && setShowPassword(true)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 inline-block text-2xl text-alabaster-400 cursor-pointer"
                    component="span"
                    aria-hidden="false"
                    aria-label="Voir le mot de passe"
                    tabIndex={0}
                  />
                ) : (
                  <EyeIcon
                    onClick={() => setShowPassword(false)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && setShowPassword(false)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 inline-block text-2xl text-alabaster-400 cursor-pointer"
                    component="span"
                    aria-hidden="false"
                    aria-label="Cacher le mot de passe"
                    tabIndex={0}
                  />
                )}
              </div>
              {errors.password && touched.password && (
                <p
                  className="text-mandy-500 font-bold text-sm"
                  id="password-help"
                  aria-live="assertive"
                >
                  {errors.password}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <div className="relative">
                <Field
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirmation mot de passe"
                  autoComplete="off"
                  aria-required="true"
                  aria-invalid={
                    errors.confirmPassword && touched.confirmPassword
                  }
                  aria-describedby="confirm-password-help"
                  className={`w-100 bg-alabaster-600 border-3 rounded-xl p-4 placeholder:text-alabaster-50 focus:border-tree-poppy-500 outline-none ${
                    errors.confirmPassword && touched.confirmPassword
                      ? "border-mandy-500"
                      : "border-alabaster-400"
                  }`}
                />
                {!showConfirmPassword ? (
                  <EyeSlashIcon
                    onClick={() => setShowConfirmPassword(true)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && setShowConfirmPassword(true)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 inline-block text-2xl text-alabaster-400 cursor-pointer"
                    component="span"
                    aria-hidden="false"
                    aria-label="Voir le mot de passe"
                    tabIndex={0}
                  />
                ) : (
                  <EyeIcon
                    onClick={() => setShowConfirmPassword(false)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && setShowConfirmPassword(false)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 inline-block text-2xl text-alabaster-400 cursor-pointer"
                    component="span"
                    aria-hidden="false"
                    aria-label="Cacher le mot de passe"
                    tabIndex={0}
                  />
                )}
              </div>
              {errors.confirmPassword && touched.confirmPassword && (
                <p
                  className="text-mandy-500 font-bold text-sm"
                  id="confirm-password-help"
                  aria-live="assertive"
                >
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>
          <Button
            variant={"primary"}
            type="submit"
            disabled={!(isValid && dirty)}
          >
            Envoyer
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default ResetPasswordForm;
