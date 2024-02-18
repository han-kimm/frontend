"use client";

import FadingDot from "@/(route)/(bottom-nav)/signin/_components/FadingDot";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import HorizontalEventCard from "@/components/card/HorizontalEventCard";
import ChipButton from "@/components/chip/ChipButton";
import { instance } from "@/api/api";
import { getCalendarTime } from "@/utils/getCalendarTime";
import { sortEvents } from "@/utils/sortEventList";
import { EventCardType } from "@/types/index";
import { MYPAGE_CALENDAR_STYLE } from "@/constants/calendarStyle";
import ArrowDownIcon from "@/public/icon/arrow-down_sm.svg";
import NextIcon from "@/public/icon/arrow-left_lg.svg";
import PrevIcon from "@/public/icon/arrow-right_lg.svg";
import ArrowUpIcon from "@/public/icon/arrow-up_sm.svg";

interface Props {
  userId: string;
}

type StatueType = "" | "예정" | "종료" | "진행중" | "종료제외";

const MyCalendarTab = ({ userId }: Props) => {
  const route = useRouter();
  const [data, setData] = useState<EventCardType[] | []>([]);
  const [isFold, setIsFold] = useState(true);
  const [statue, setStatus] = useState<StatueType>("");

  const { data: myEventsData, isSuccess } = useQuery({
    queryKey: ["events", statue],
    queryFn: async () => {
      return instance.get(`/event/${userId}/like`, { status: statue });
    },
  });

  useEffect(() => {
    if (isSuccess) {
      setData(myEventsData);
    }
  }, [myEventsData]);

  const [calendarStyle, setCalendarStyle] = useState("");
  let lastDay: (EventCardType | "blank")[] = [];

  const tileContent = ({ date }: { date: Date }) => {
    const eventsForDate = data.filter((event: EventCardType) => {
      const startDate = getCalendarTime(event.startDate);
      const endDate = getCalendarTime(event.endDate);
      const currentDate = getCalendarTime(date);

      return startDate <= currentDate && endDate >= currentDate;
    });

    switch (isFold) {
      case true:
        if (eventsForDate.length === 0) return;

        let type;
        if (eventsForDate.length === 1) {
          type = COUNT_CHIP_TYPE.light;
        } else if (eventsForDate.length >= 5) {
          type = COUNT_CHIP_TYPE.bold;
        } else {
          type = COUNT_CHIP_TYPE.regular;
        }
        return (
          <span className="pc:flex pc:w-full pc:items-center pc:justify-end pc:self-stretch pc:px-8">
            <div className={`flex-center h-20 w-20 rounded-full text-12 font-600 pc:h-28 pc:w-28 pc:text-16 ${type}`}>{eventsForDate.length}</div>
          </span>
        );

      case false:
        if (eventsForDate.length == 0) {
          lastDay = [];
        }
        if (eventsForDate.length > 0) {
          let today: (EventCardType | "blank")[] = sortEvents(eventsForDate);

          for (let idx in today) {
            const lastDayItem = lastDay[idx];
            const todayItem = today[idx];
            if (lastDayItem === todayItem) {
              continue;
            }
            if (!lastDayItem) {
              lastDay[idx] = todayItem;
              continue;
            }
            let rpt = 0;
            while (lastDay[Number(idx) + rpt] !== today[Number(idx) + rpt]) {
              if (Number(idx) + rpt > lastDay.length) break;
              today.splice(Number(idx) + rpt, 0, "blank");
              rpt++;
            }
          }

          if (date.getDay() === 1) {
            today = today.filter((item) => item !== "blank");
          }
          lastDay = today;

          return (
            <span className="flex flex-col items-center justify-center gap-4 self-stretch pc:pt-4">
              {today.map((event, idx) => {
                if (event === "blank") {
                  return <span key={idx + event} className={`h-4 rounded-sm`} />;
                }
                let type;
                const startDate = getCalendarTime(event.startDate);
                const endDate = getCalendarTime(event.endDate);
                const currentDate = getCalendarTime(date);
                const idNumber = Number((event.id.match(/\d+/g) || ["1"]).join(""));

                if (event.startDate === event.endDate) {
                  type = SHAPE_TYPE.oneDay;
                } else if (startDate === currentDate) {
                  type = SHAPE_TYPE.firstDay;
                } else if (endDate === currentDate) {
                  type = SHAPE_TYPE.lastDay;
                } else {
                  type = SHAPE_TYPE.middleDay;
                }
                return <div key={event.id} className={`h-4 rounded-sm ${type} ${COLOR_TYPE[idNumber % 6]}`} />;
              })}
            </span>
          );
        }
    }

    return null;
  };

  useEffect(() => {
    setCalendarStyle(MYPAGE_CALENDAR_STYLE);
  }, []);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleClickToday = (date: any) => {
    if (selectedDate?.getTime() === date.getTime()) {
      setSelectedDate(null);
      return;
    }
    setSelectedDate(date);
  };

  const handleHeartClick = async (eventId: string) => {
    const res = await instance.post("/event/like", {
      userId: userId,
      eventId: eventId,
    });

    if (res.error) {
      throw new Error(res.error);
    }

    setData(
      data.filter((event) => {
        return event.id !== eventId;
      }),
    );
  };

  const handleChipClick = (label: StatueType) => {
    switch (label) {
      case statue:
        setStatus("");
        break;
      case "예정":
        setStatus(label);
        break;
      case "종료":
        setStatus(label);
        break;
      case "진행중":
        setStatus(label);
        break;
    }
  };

  const handleClick = () => {
    setIsFold((prev) => !prev);
  };

  return (
    <div className="flex flex-col items-center justify-stretch gap-16 px-20 pb-16 pt-72">
      <style>{calendarStyle}</style>
      <div className="flex-center flex-col gap-8 rounded-sm border border-gray-50 pb-8 pt-16">
        {calendarStyle === "" ? (
          <div className="flex-center h-332 w-[90vw]">
            <FadingDot />
          </div>
        ) : (
          <>
            <Calendar
              locale="ko"
              onChange={handleClickToday}
              value={selectedDate}
              tileContent={tileContent}
              nextLabel={<PrevIcon onClick={() => (lastDay = [])} width={32} height={16} viewBox="0 0 24 24" stroke="#A2A5AA" />}
              prevLabel={<NextIcon onClick={() => (lastDay = [])} width={32} height={16} viewBox="0 0 24 24" stroke="#A2A5AA" />}
              next2Label={null}
              prev2Label={null}
              formatDay={(locale, date) => date.getDate().toString()}
              formatShortWeekday={(locale, date) => {
                const shortWeekdays = ["S", "M", "T", "W", "T", "F", "S"];
                return shortWeekdays[date.getDay()];
              }}
            />
            <button className="flex-center w-fit px-12" onClick={handleClick}>
              <p>{isFold ? "펼치기" : "접기"}</p>
              {isFold ? <ArrowDownIcon width="20" height="20" viewBox="0 0 24 24" stroke="#A0A5B1" /> : <ArrowUpIcon width="20" height="20" viewBox="0 0 24 24" stroke="#A0A5B1" />}
            </button>
          </>
        )}
      </div>
      <div className="w-full">
        <div className="flex w-full gap-12">
          <ChipButton label="예정" onClick={() => handleChipClick("예정")} selected={statue === "예정"} />
          <ChipButton label="진행중" onClick={() => handleChipClick("진행중")} selected={statue === "진행중"} />
          <ChipButton label="종료" onClick={() => handleChipClick("종료")} selected={statue === "종료"} />
        </div>
        <section>
          {data
            .filter(
              (event: EventCardType) =>
                !selectedDate || (getCalendarTime(event.startDate) <= getCalendarTime(selectedDate) && getCalendarTime(event.endDate) >= getCalendarTime(selectedDate)),
            )
            .map((event: EventCardType) => (
              <HorizontalEventCard key={event.id} data={event} onHeartClick={() => handleHeartClick(event.id)} isGrow />
            ))}
        </section>
        {!data.length && (
          <div className="flex-center flex-col gap-8 p-40">
            <h1 className="text-16 font-500 ">관심있는 행사에 좋아요를 눌러보세요!</h1>
            <button onClick={() => route.push("/search")} className="text-14 text-sub-pink hover:underline">
              행사 둘러보기
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCalendarTab;

const COLOR_TYPE: Record<number, string> = {
  0: `bg-sub-pink`,
  1: `bg-sub-yellow`,
  2: `bg-sub-skyblue`,
  3: `bg-sub-blue`,
  4: `bg-sub-purple`,
  5: `bg-sub-red`,
};

const SHAPE_TYPE = {
  oneDay: "w-36 pc:w-100",
  firstDay: "ml-8 w-44 pc:w-108",
  lastDay: "mr-8 w-44 pc:w-108",
  middleDay: "w-52 pc:w-120",
};

const COUNT_CHIP_TYPE = {
  light: "text-main-pink-300 bg-main-pink-50",
  regular: "text-main-pink-500 bg-main-pink-50",
  bold: "text-white-white bg-main-pink-500",
};
