import { ArtistAndGroupListType, EventCardType, EventReviewType } from ".";

type Res_Get_Event = EventCardType;
type Res_Get_Event_List = EventCardType[];
type Res_Get_Event_Search = {
  eventList: EventCardType[];
  page: number;
  size: number;
  totalCount: number;
};
type Res_Get_EventReviews = EventReviewType[];
type Res_Get_Artist_Group = ArtistAndGroupListType;

export type Res_Get_Type = {
  event: Res_Get_Event;
  eventList: Res_Get_Event_List;
  eventSearch: Res_Get_Event_Search;
  eventReviews: Res_Get_EventReviews;
  artistGroup: Res_Get_Artist_Group;
};