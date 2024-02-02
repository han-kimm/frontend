"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useFunnel } from "@/hooks/useFunnel";
import { SignUpFormType, SignupStepNameType } from "@/types/index";
import GenericForm from "./_components/GenericForm";
import ProfileSetup from "./_components/ProfileSetup";

const STEPS: SignupStepNameType[] = ["계정 정보", "프로필 정보", "아티스트 선택"];

const DEFAULT_VALUES = {
  email: "",
  password: "",
  passwordCh: "",
  profileImg: "",
  nickName: "",
  myArtists: [],
};

const SignUp = () => {
  const router = useRouter();
  const { Funnel, Step, setStep, currentStep } = useFunnel(STEPS);

  const handleNextClick = (step: SignupStepNameType) => {
    setStep(step);
  };
  const handlePrevClick = () => {
    const stepIndex = STEPS.indexOf(currentStep);
    if (stepIndex === 0) {
      router.push("/signin");
    }
    setStep(STEPS[stepIndex - 1]);
  };

  return (
    <>
      <Header onClick={handlePrevClick} />
      <GenericForm<SignUpFormType> formOptions={{ mode: "onBlur", defaultValues: DEFAULT_VALUES }}>
        <div className="flex flex-col gap-24 p-12">
          <ProfileSetup steps={STEPS} handleNextClick={handleNextClick} Funnel={Funnel} Step={Step} />
        </div>
      </GenericForm>
    </>
  );
};

export default SignUp;

const Header = ({ onClick }: { onClick: () => void }) => {
  return (
    <div className="flex gap-8 p-12">
      <button onClick={onClick}>
        <Image src="/icon/back-arrow_black.svg" alt="뒤로가기 버튼" width={24} height={24} />
      </button>
      <p className="text-16 font-700">회원가입</p>
    </div>
  );
};