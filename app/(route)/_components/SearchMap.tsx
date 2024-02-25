"use client";

import HomeKakaoMap from "@/(route)/_components/HomeKakaoMap";
import { useQuery } from "@tanstack/react-query";
import confetti from "canvas-confetti";
import { ChangeEvent, FocusEvent, Fragment, MouseEvent, useEffect, useRef, useState } from "react";
import HorizontalEventCard from "@/components/card/HorizontalEventCard";
import { instance } from "@/api/api";
import { openToast } from "@/utils/toast";
import { EventCardType } from "@/types/index";
import { TOAST_MESSAGE } from "@/constants/toast";
import Favicon from "@/public/icon/favicon.svg";
import MapIcon from "@/public/icon/map.svg";

const SearchMap = () => {
  const [focus, setFocus] = useState(false);
  const [selected, setSelected] = useState<EventCardType[]>([]);
  const [keyword, setKeyword] = useState("");
  const timer = useRef<NodeJS.Timeout>();

  const handleBlur = (e: FocusEvent) => {
    const container = e.currentTarget;
    if (container.contains(e.relatedTarget)) {
      return;
    }
    setFocus(false);
  };

  const { data: myEventsData, refetch } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      return instance.get(`/event`, { size: 30, keyword });
    },
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    const timerId = timer.current;
    if (timerId) {
      clearTimeout(timerId);
    }

    timer.current = setTimeout(() => setKeyword(value), 300);
  };

  useEffect(() => {
    refetch();
  }, [keyword]);

  const handleRedirectToMap = (locationInfo: EventCardType) => async () => {
    const placeId = await getPlaceId(locationInfo.address, locationInfo.placeName);
    if (!placeId) {
      openToast.error(TOAST_MESSAGE.kakaoMap);
      return;
    }
    window.open(`https://map.kakao.com/link/map/${placeId}`);
  };

  const handleConfetti = (e: MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const { innerWidth, innerHeight } = window;
    const isPc = innerWidth > 1200;

    if (rect) {
      confetti({
        particleCount: isPc ? 60 : 30,
        spread: isPc ? 75 : 50,
        startVelocity: isPc ? 50 : 20,
        angle: 45,
        colors: ["#ff50aa", "#ff50aa50", "#ff50aa12"],
        origin: { x: (rect.left + rect.right) / 2 / innerWidth, y: (rect.top + rect.bottom) / 2 / innerHeight },
      });
    }
  };

  return (
    <div>
      <HomeKakaoMap scheduleData={myEventsData?.eventList} />
      <div className="relative" onFocus={() => setFocus(true)} onBlur={handleBlur}>
        <div className="absolute-center relative z-heart w-4/5 ">
          <button onClick={handleConfetti} className="absolute left-20 top-1/2 -translate-y-1/2">
            <Favicon />
          </button>
          <input
            onChange={handleChange}
            placeholder="아티스트 이름으로 검색"
            className="w-full rounded-full border-[2px] border-main-pink-300 py-12 pl-52 text-16 font-600 outline-none placeholder:font-400"
          />
        </div>
        {focus && (
          <div
            className={`animate-slideDownSearch absolute left-1/2 top-4 z-base mt-28 w-4/5 -translate-x-1/2 overflow-hidden rounded-lg border border-main-pink-300 bg-white-white`}
          >
            {myEventsData.eventList.length ? (
              <div className={`flex max-h-[55.6rem] snap-y snap-mandatory flex-col overflow-scroll rounded-lg px-20 pc:px-40`}>
                {myEventsData.eventList.map((event: EventCardType) => (
                  <div key={event.id} className="snap-start">
                    <button
                      onClick={handleRedirectToMap(event)}
                      className="flex-center w-fit gap-4 pt-20 text-14 font-500 text-gray-900 hover:underline"
                      aria-label="카카오 맵으로 이동"
                    >
                      <MapIcon width={20} height={20} viewBox="0 0 24 24" stroke="#A0A5B1" />
                      {event.address}
                    </button>
                    <HorizontalEventCard data={event} isGrow />
                  </div>
                ))}
              </div>
            ) : (
              <p className="flex-center py-12 text-16 text-gray-500">검색 결과가 없습니다.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default SearchMap;

const getPlaceId = async (address: string, placeName: string) => {
  const data = await fetch(`https://dapi.kakao.com/v2/local/search/keyword.json?query=${address}${placeName}`, {
    headers: { Authorization: `KakaoAK ${process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY}` },
  });
  const ret = await data.json();
  if (!ret.documents?.[0]) return;
  return ret.documents?.[0].id;
};
