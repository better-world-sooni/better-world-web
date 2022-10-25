import Div from "src/components/Div";
import { useState } from "react";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "src/store/reducers/rootReducer";
import { Disclosure, Transition, Switch } from "@headlessui/react";
import { Oval } from "react-loader-spinner";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  AdjustmentsIcon,
  CubeIcon,
  IdentificationIcon,
  PencilAltIcon,
  LightBulbIcon,
  HeartIcon,
  SparklesIcon,
  CogIcon,
  RefreshIcon,
  CheckIcon,
  EyeIcon,
  DocumentTextIcon,
} from "@heroicons/react/outline";
import useName from "src/hooks/useName";
import useStory from "src/hooks/useStory";
import useEdittableToggle from "src/hooks/useEdittableToggle";
import EmptyBlock from "../EmptyBlock";
import Pagination from "@mui/material/Pagination";
import { cancelUserListQuery, getUserListQuery, patchUserInfo } from "src/hooks/queries/admin/userlist";
import { useDispatch } from "react-redux";
import { EventListAction, UserListAction, UserListPostAction } from "src/store/reducers/adminReducer";
import { useQueryClient } from "react-query";
import Tooltip from "@mui/material/Tooltip";
import { defaultPageSize } from "src/hooks/queries/admin/userlist";
import { UserPosttModalAction } from "src/store/reducers/modalReducer";
import UserPostModal from "./userposts";
import TimerText from "../common/timertext";
import DefaultTransition from "../common/defaulttransition";
import PaginationPageSizebox from "../common/paginationpagesizebox";
import DataEntry from "../common/DataEntry";
import { ProfileImage } from "../common/ImageHelper";
import SearchBar from "src/hooks/SearchBar";
import { MakeSuperPrivilegeModal } from "../modals/CheckModal";
import { cancelEventListQuery, getEventListQuery } from "src/hooks/queries/admin/events";
import getDrawEventStatus from "../common/getDrawEventStatus";

function EventScreen() {
  const { page_size, offset, search_key } = useSelector((state: RootState) => ({
    page_size: state.admin.EventListPage.page_size,
    offset: state.admin.EventListPage.offset,
    search_key: state.admin.EventListPage.search_key,
  }));
  const {
    isLoading: loading,
    isFetching: fetching,
    isError: error,
    data: events,
    refetch,
  } = getEventListQuery(page_size, offset, search_key, () => setLoadingButton(true));
  const [LoadingButtonOn, setLoadingButton] = useState(false);
  const loading_status = fetching && !loading;
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const refetchEventList = (page_size, offset, search_key) => {
    cancelEventListQuery(queryClient);
    dispatch(EventListAction({ page_size: page_size, offset: offset, search_key: search_key }));
  };
  const handlePaginationOffsetChange = (event: React.ChangeEvent<unknown>, value: number) => {
    if (offset != value - 1) refetchEventList(page_size, value - 1, search_key);
  };
  const handlePaginationPageSizeChange = (page_size_input) => {
    if (page_size != page_size_input) refetchEventList(page_size_input, 0, search_key);
  };
  const handleSearchBarChange = (search_key_input) => {
    refetchEventList(page_size, 0, search_key_input);
  };

  return (
    <Div flex flexCol>
      <Div mt15 mb10 selfCenter flex flexRow wFull>
        <Div justifyItemsStart flex flexRow wFull>
          <Div selfCenter>
            <PaginationPageSizebox handlePaginationPageSizeChange={handlePaginationPageSizeChange} page_size={page_size} />
          </Div>
          <Div selfCenter>개씩 보기</Div>
          <Div selfCenter ml10>
            <SearchBar w={250} placeholder={"Event를 검색해보세요."} initialText={search_key} handleSearch={handleSearchBarChange} />
          </Div>
        </Div>
        <Div selfCenter flex flexRow>
          <Div minW={120} fontSize15 fontSemibold mr10 selfCenter>
            <Div spanTag textSuccess>
              <TimerText
                condtion={!loading && LoadingButtonOn && !loading_status && !error}
                text={"Update Complete"}
                seconds={2}
                closecontidion={setLoadingButton}
              />
            </Div>
            <Div spanTag textDanger>
              <TimerText condtion={!loading && LoadingButtonOn && error} text={"Update error"} seconds={2} closecontidion={setLoadingButton} />
            </Div>
          </Div>
          {events &&
            (loading_status ? (
              <Div fontSize15 fontBold selfEnd px10 py5 textWhite rounded10 bgBW>
                <Oval height="14" width="14" color="#4738FF" secondaryColor="#FFFFFF" strokeWidth="5" />
              </Div>
            ) : (
              <Tooltip title="업데이트" arrow>
                <Div fontBold selfEnd px10 cursorPointer py5 bgBWLight textBW rounded10 clx="hover:bg-bw hover:text-white" onClick={refetch}>
                  <RefreshIcon height={20} width={20} className="max-h-20 max-w-20" />
                </Div>
              </Tooltip>
            ))}
        </Div>
      </Div>
      {loading && (
        <Div fontBold mb100 textStart maxW={1100} mxAuto>
          <Oval height="300" width="300" color="#4738FF" secondaryColor="#FFFFFF" strokeWidth="100" />
        </Div>
      )}
      {events?.success && <EventArray events={events} />}
      {events?.success && (
        <Div selfCenter>
          <Pagination
            count={Math.ceil(events?.events?.event_count / page_size)}
            page={offset + 1}
            showFirstButton
            showLastButton
            onChange={handlePaginationOffsetChange}
          />
        </Div>
      )}
      {error ||
        (events && !events.success && (
          <Div fontSize20 mb100 textStart maxW={1100} mxAuto>
            오류가 발생하였습니다. 다시 시도하여 주세요.
          </Div>
        ))}
    </Div>
  );
}

function EventArray({ events }) {
  var list = events && events?.events && [...events?.events?.events];
  if (list == null) return <></>;
  return list.length != 0 ? (
    <Div mb100 wFull bgWhite border1 bgOpacity90>
      {list.map((event, _) => (
        <EventEntry key={event?.id} event={event} />
      ))}
    </Div>
  ) : (
    <Div mb100 wFull bgWhite bgOpacity90>
      <Div textCenter>Event가 존재하지 않습니다.</Div>
    </Div>
  );
}

function EventEntry({ event }) {
  return (
    <Div px30 py10 cursorPointer flex flexRow justifyCenter border1 borderGray100 clx="hover:bg-gray-100">
      <Div wFull flex flexCol justifyCenter selfCenter>
        <Div wFull flex flexRow justifyStart gapX={10} mb10>
          <EventStatus event={event} />
          <Div flex flexRow wFull justifyEnd>
            {event?.status != 1 && (
              <DataEntry
                name={"응모자 수"}
                w={55}
                label={<DocumentTextIcon height={20} width={20} className="max-h-20 max-w-20 mr-10" />}
                data={event?.event_application_count}
              />
            )}
            <DataEntry name={"조회 수"} w={55} label={<EyeIcon height={20} width={20} className="max-h-20 max-w-20 mr-10" />} data={event?.read_count} />
          </Div>
        </Div>
        <Div wFull flex flexRow justifyStart gapX={20}>
          <Div selfCenter>
            <ProfileImage width={40} height={40} nft={event?.nft_collection} rounded={true} />
          </Div>
          <Div flex flexCol justifyStart selfCenter wFull>
            <Div fontSize18 fontBold wFull overflowEllipsis overflowHidden whitespaceNowrap>
              {event?.name}
            </Div>
            <Div fontSize12 wFull overflowEllipsis overflowHidden whitespaceNowrap>
              {event?.giveaway_merchandise}
            </Div>
          </Div>
        </Div>
      </Div>
      <Div selfCenter>
        <ChevronUpIcon height={20} width={20} className="text-gray-400" />
      </Div>
    </Div>
  );
}

function EventStatus({ event }) {
  const eventStatus = getDrawEventStatus(event);
  const Theme = ({ status }) => {
    return (
      <Div selfCenter rounded25 w={60} px5 py2 fontSize13 textCenter {...status?.color}>
        {status?.string}
      </Div>
    );
  };
  return (
    <>
      {eventStatus?.status && <Theme status={eventStatus?.status} />}
      {eventStatus?.expires && <Theme status={eventStatus?.expires} />}
    </>
  );
}

export default EventScreen;
