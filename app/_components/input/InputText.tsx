import classNames from "classnames";
import Image from "next/image";
import { ReactNode, useState } from "react";
import { FieldPath, FieldValues, UseControllerProps, useController } from "react-hook-form";

interface Prop {
  type?: "text" | "password";
  children: ReactNode;
  placeholder?: string;
  autoComplete?: string;
  hint?: string;
  maxLength?: number;
}

type Function = <TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>(
  prop: UseControllerProps<TFieldValues, TName> & Prop,
) => ReactNode;

const InputText: Function = ({ type: initialType, children, placeholder, autoComplete, hint, maxLength, ...control }) => {
  const { field, fieldState } = useController(control);
  const [type, setType] = useState(initialType ?? "text");

  const handlePasswordShow = () => {
    setType((prev) => (prev === "password" ? "text" : "password"));
  };

  const handleDelete = () => {
    field.onChange("");
  };

  return (
    <div className="relative">
      <label htmlFor={field.name} className="text-14">
        {children}
      </label>
      <input
        id={field.name}
        type={type}
        placeholder={placeholder ?? "입력해주세요."}
        autoComplete={autoComplete ?? "off"}
        {...field}
        className={`border-solid-gray body1-normal placeholder:text-gray-4 focus:border-purple mt-10 h-48 w-full rounded-md bg-blue-50 p-16 text-14 text-black outline-none `}
      />
      {initialType === "password" && (
        <button onClick={handlePasswordShow} type="button" className="absolute right-0 top-44 h-24 w-24 -translate-x-1/2 -translate-y-1/2">
          {<Image src={type === "password" ? "/icon/closed-eyes_black.svg" : "/icon/opened-eyes_black.svg"} alt="비밀번호 아이콘" width={16} height={16} />}
        </button>
      )}
      {initialType !== "password" && (
        <button onClick={handleDelete} type="button" className="absolute right-0 top-44 h-24 w-24 -translate-x-1/2 -translate-y-1/2">
          <Image src="/icon/x_gray.svg" alt="초기화 버튼" width={16} height={16} />
        </button>
      )}
      <div className="flex gap-8">
        {maxLength ? <span className={classNames("mt-4 h-8", { "text-red-500": field.value.length > maxLength })}>{`(${field.value.length}/${maxLength})`}</span> : null}
        <p className={classNames(`font-normal mt-4 h-8 text-12`, { "text-red-500": fieldState.error, "text-gray-400": !fieldState.error })}>{fieldState?.error?.message || hint}</p>
      </div>
    </div>
  );
};

export default InputText;