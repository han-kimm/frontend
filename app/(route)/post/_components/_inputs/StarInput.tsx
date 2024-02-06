import { useFormContext } from "react-hook-form";
import EventTypeBottomSheet from "@/components/bottom-sheet/EventTypeBottomSheet";
import StarBottomSheet from "@/components/bottom-sheet/StarBottomSheet";
import InputText from "@/components/input/InputText";
import { useBottomSheet } from "@/hooks/useBottomSheet";
import { validateEdit } from "@/utils/editValidate";
import { PostType } from "../../page";

const StarInput = () => {
  const { bottomSheet, openBottomSheet, closeBottomSheet, refs } = useBottomSheet();

  const {
    formState: { defaultValues },
    watch,
  } = useFormContext<PostType>();
  const { eventType, group, member } = watch();

  return (
    <>
      <div className="flex-item flex flex-col gap-20">
        <div className="flex flex-col">
          아티스트
          <div className="grid grid-cols-2 gap-8">
            <InputText name="group" placeholder="그룹 선택" readOnly onClick={() => openBottomSheet("starGroup")} />
            <InputText name="member" placeholder="멤버 선택" readOnly />
          </div>
        </div>
        <InputText
          name="eventType"
          readOnly
          placeholder="행사 유형을 선택하세요."
          onClick={() => openBottomSheet("event")}
          isEdit={validateEdit(defaultValues?.eventType !== eventType)}
        >
          행사 유형
        </InputText>
      </div>
      {bottomSheet === "event" && <EventTypeBottomSheet closeBottomSheet={closeBottomSheet} refs={refs} />}
      {bottomSheet === "starGroup" && <StarBottomSheet closeBottomSheet={closeBottomSheet} refs={refs} />}
    </>
  );
};

export default StarInput;