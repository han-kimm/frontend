import { BottomSheetBaseType } from "@/types/index";
import KebabContents from "../card/KebabContents";
import BottomSheet from "./BottomSheetMaterial";

interface Props extends BottomSheetBaseType {
  refs: {
    sheet: (node: HTMLElement | null) => void;
    content: (node: HTMLElement | null) => void;
  };
  eventId: string;
  setDep?: (dep: string) => void;
}

const MyPostsBottomSheet = ({ closeBottomSheet, refs, eventId, setDep }: Props) => {
  return (
    <BottomSheet.Frame closeBottomSheet={closeBottomSheet} ref={refs.sheet}>
      <KebabContents eventId={eventId} setDep={setDep} />
    </BottomSheet.Frame>
  );
};

export default MyPostsBottomSheet;
