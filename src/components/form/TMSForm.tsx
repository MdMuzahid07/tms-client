"use client";

import {
  DefaultValues,
  FieldValues,
  FormProvider,
  Resolver,
  SubmitHandler,
  useForm,
  UseFormReturn,
} from "react-hook-form";

interface FormConfig<T extends FieldValues> {
  defaultValues?: DefaultValues<T>;
  resolver?: Resolver<T>;
}
interface TMSFormProps<T extends FieldValues> extends FormConfig<T> {
  children: React.ReactNode;
  onSubmit: SubmitHandler<T>;
}

const TMSForm = <T extends FieldValues>({
  children,
  onSubmit,
  defaultValues,
  resolver,
}: TMSFormProps<T>) => {
  const formConfig: FormConfig<T> = {};

  if (defaultValues) {
    // using [] creating an FormConfig property and setting it to defaultValues
    formConfig["defaultValues"] = defaultValues;
  }

  if (resolver) {
    formConfig["resolver"] = resolver;
  }

  const methods: UseFormReturn<T> = useForm<T>(formConfig);

  const submitHandler = methods.handleSubmit;

  return (
    <FormProvider {...methods}>
      <form onSubmit={submitHandler(onSubmit)}>{children}</form>
    </FormProvider>
  );
};

export default TMSForm;
