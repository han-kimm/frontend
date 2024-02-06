export const CALENDAR_STYLE = `
.my-day_range_start.my-selected{
  background-color: #FF50AA;
  color: white;
  border-radius: 100%;
}
.my-day_range_end.my-selected{
  background-color: #FF50AA;
  color: white;
  border-radius: 100%;
}
.my-selected { 
  background-color: #ffeaf4;
  border-radius: 0;
}
.my-selected:hover { 
  color: black;
  font-weight: 700;
}
.rdp-button:hover:not([disabled]):not(.my_selected) {
  background-color: #ffeaf4;
  font-weight:700;
}
`;

export const MYPAGE_CALENDAR_STYLE = `
.react-calendar {
  width: 320px;
  padding: 16px 0 ;
  font-family: Pretendard; 
  border: 1px solid #F1F2F4;
  border-radius: 12px;
}

.react-calendar__navigation {
  height: 24px
}

.react-calendar__navigation button {
  color: black;
  min-width: 16px;
  padding: 0 24px;
  background: none;
  font-weight: 500;
  font-size: 16px
}

.react-calendar__navigation button:enabled:hover,
.react-calendar__navigation button:enabled:focus {
  background-color: white;
}

.react-calendar__month-view__weekdays {
  text-align: center;
  text-transform: uppercase;
  font-size: 0.75em;
  font-weight: 500;
  padding-bottom: 4px;
  abbr { 
    color: #C1C5CC;
    text-decoration: none
  }
}

.react-calendar__tile {
  width: 44px;
  text-align: center;
  min-height: 40px;
  padding: 2px 6.6667px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 2px;
}

.react-calendar__tile > div {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.react-calendar__month-view__days__day {
  font-size: 10px;
  font-family: Pretendard; 
  font-weight: 500;
}

.react-calendar__month-view__days__day--weekend {
  color: #F63D3D
}

.react-calendar__month-view__days__day:not(.react-calendar__month-view__days__day--weekend):not(.react-calendar__month-view__days__day--neighboringMonth)
  + .react-calendar__month-view__days__day--weekend {
  color: black
}

.react-calendar__month-view__days__day--neighboringMonth {
  color: #D2D5DA; 
}

.react-calendar__tile {
  abbr {
    width: 36px;
    height: 12px;
    border-radius: 4px;
  }
}

.react-calendar__tile:enabled:hover,
.react-calendar__tile--now:hover {
  background: #F1F2F3;
  border-radius: 4px;
}

.react-calendar__tile:enabled:focus,
.react-calendar__tile--active {
  abbr {
    background-color: rgba(255, 80, 170, 0.5);
  }
  background: none;
  color: black;
}

.react-calendar__tile--now {
  abbr {
    background-color: #F1F2F3
  }
  background: none;
  color: black;
}
`;
