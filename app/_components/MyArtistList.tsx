import FadingDot from "@/(route)/(bottom-nav)/signin/_components/FadingDot";
import { keepPreviousData, useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import BottomButton from "@/components/button/BottomButton";
import ToTopButton from "@/components/button/ToTopButton";
import DeferredSuspense from "@/components/skeleton/DeferredSuspense";
import { instance } from "@/api/api";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import { getSession } from "@/store/session/cookies";
import { Res_Get_Type } from "@/types/getResType";
import { ArtistType } from "../_types";
import ArtistCard from "./ArtistCard";
import ChipButton from "./chip/ChipButton";
import SearchInput from "./input/SearchInput";

const SIZE = 24;

const MyArtistList = () => {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");

  const session = getSession();
  const userId = session?.user.userId;
  const { data: myArtistData } = useQuery<ArtistType[]>({
    queryKey: ["myArtist"],
    queryFn: async () => await instance.get(`/users/${userId}/artists`),
    placeholderData: keepPreviousData,
  });

  const [selected, setSelected] = useState<ArtistType[]>([]);
  useEffect(() => {
    if (myArtistData) {
      setSelected(myArtistData);
    }
  }, [myArtistData]);

  const [deleteData, setDeleteData] = useState<Set<string>>(new Set());
  const [addData, setAddData] = useState<Set<string>>(new Set());

  const handleArtistClick = (cur: ArtistType) => {
    if (selected.some((item) => item?.id === cur.id)) {
      setSelected((prevSelected) => prevSelected.filter((item) => item?.id !== cur.id));

      if (myArtistData?.some((item) => item?.id === cur.id)) {
        setDeleteData((prev) => prev.add(cur.id));
      }
      if (!myArtistData?.some((item) => item?.id === cur.id)) {
        setAddData((prev) => (prev.delete(cur.id), prev));
      }
    } else {
      setSelected((prevSelected) => [...prevSelected, cur]);

      if (myArtistData?.some((item) => item?.id === cur.id)) {
        setDeleteData((prev) => (prev.delete(cur.id), prev));
      }
      if (!myArtistData?.some((item) => item?.id === cur.id)) {
        setAddData((prev) => prev.add(cur.id));
      }
    }
  };

  const [isError, setIsError] = useState(false);

  const handleSubmit = async () => {
    const session = getSession();

    try {
      if (addData.size) {
        const addRes = await instance.post(`/users/${session?.user.userId}/artists`, {
          artistIds: [...addData],
        });
        if (addRes) {
          router.push("/mypage");
          toast.success("아티스트와 가까워진 기분이에요!", {
            className: "text-16 font-600",
          });
        }
      }
      if (deleteData.size) {
        const deleteRes = await instance.delete(`/users/${session?.user.userId}/artists`, {
          artistIds: [...deleteData],
        });
        if (deleteRes) {
          router.push("/mypage");
          toast.success("아티스트와 조금 멀어졌어요...", {
            className: "text-16 font-600",
          });
        }
      }
    } catch (e) {
      setIsError(true);
      setSelected(myArtistData!.map((item) => ({ id: item.id, name: item.name, image: item.image, type: "" })));
      toast.error("앗! 다시 시도해 볼까요?", {
        className: "text-16 font-600",
      });
    } finally {
      setDeleteData(new Set());
      setAddData(new Set());
    }
  };

  const queryClient = useQueryClient();
  const artistMutation = useMutation({
    mutationFn: handleSubmit,
    onSuccess: () => queryClient.refetchQueries({ queryKey: ["myArtist"] }),
    onError: () => queryClient.refetchQueries({ queryKey: ["myArtist"] }),
  });

  const {
    data: artistData,
    fetchNextPage,
    refetch,
    isFetching,
  } = useInfiniteQuery({
    initialPageParam: 1,
    queryKey: ["artist"],
    queryFn: async ({ pageParam = 1 }): Promise<Res_Get_Type["artistGroup"]> => await instance.get("/artist/group", { size: SIZE, page: pageParam, keyword }),
    getNextPageParam: (lastPage) => (lastPage.page * SIZE < lastPage.totalCount ? lastPage.page + 1 : null),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    refetch();
  }, [keyword]);

  const containerRef = useInfiniteScroll({
    handleScroll: fetchNextPage,
    deps: [artistData],
  });

  const lastItemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    lastItemRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
  }, [lastItemRef.current]);

  return (
    <div className="flex h-full flex-col gap-12">
      <SearchInput setKeyword={setKeyword} placeholder="최애의 행사를 찾아보세요!" />
      <div className="sticky top-72 z-nav flex w-full snap-x snap-mandatory gap-12 overflow-x-scroll bg-white-white pt-12">
        {selected.map((artist, idx) => {
          if (!artist) {
            return null;
          }
          return (
            <div key={artist.id} ref={selected.length - 1 === idx ? lastItemRef : null} className="snap-start">
              <ChipButton label={artist.name} onClick={() => handleArtistClick(artist)} canDelete />
            </div>
          );
        })}
      </div>
      <section className="flex-center m-auto flex-col">
        <ul className="flex-center max-w-[52rem] flex-wrap gap-x-16 gap-y-20 px-8 pc:max-w-[76rem]">
          {artistData?.pages.map((page) =>
            page.artistAndGroupList.map((artist) => (
              <li key={artist.id}>
                <ArtistCard isSmall onClick={() => handleArtistClick(artist)} isChecked={selected.map((item) => item?.id).includes(artist.id)} profileImage={artist.image}>
                  {artist.name}
                </ArtistCard>
              </li>
            )),
          )}
          <li className="h-[1px]" ref={containerRef} />
        </ul>
        <div className="mb-100 mt-12">
          <DeferredSuspense fallback={<FadingDot />} isFetching={isFetching} />
        </div>
      </section>
      <BottomButton onClick={() => artistMutation.mutate()} isDisabled={artistMutation.isPending}>
        {isError ? "다시 시도하기" : "변경 내용 저장"}
      </BottomButton>
    </div>
  );
};

export default MyArtistList;
