import Div from "src/components/Div";
import { useCallback, useState } from "react";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "src/store/reducers/rootReducer";
import { Disclosure } from "@headlessui/react";
import { Oval } from "react-loader-spinner";
import {
  ChevronUpIcon,
  PencilAltIcon,
  RefreshIcon,
  CheckIcon,
  EyeIcon,
  DocumentTextIcon,
  TrashIcon,
  PencilIcon,
  ArrowRightIcon,
  GlobeAltIcon,
} from "@heroicons/react/outline";
import Pagination from "@mui/material/Pagination";
import { useDispatch } from "react-redux";
import { EventListAction } from "src/store/reducers/adminReducer";
import { useQueryClient } from "react-query";
import Tooltip from "@mui/material/Tooltip";
import TimerText from "../common/timertext";
import DefaultTransition from "../common/defaulttransition";
import PaginationPageSizebox from "../common/paginationpagesizebox";
import DataEntry from "../common/DataEntry";
import { ImageSlide, ProfileImage } from "../common/ImageHelper";
import SearchBar from "src/hooks/SearchBar";
import { cancelEventListQuery, getEventListQuery, setStatus } from "src/hooks/queries/admin/events";
import getDrawEventStatus, { DrawEventStatus } from "../common/getDrawEventStatus";
import { motion } from "framer-motion";
import TruncatedText from "../common/ModifiedTruncatedMarkdown";
import { createdAtText, getDate, getDateType } from "src/modules/timeHelper";
import useLink from "src/hooks/useLink";
import { FaBars, FaDiscord, FaTwitter } from "react-icons/fa";
import { chain, debounce } from "lodash";
import NewEventModal, { useOpenNewEventModal } from "./NewEventModal";
import { newEventModalAction } from "src/store/reducers/modalReducer";
import { EventApplicationInputType } from "src/hooks/useUploadDrawEvent";
import EventApplicationModal, { useOpenEventApplicationModal } from "./EventApplicationsModal";
import { ChangeCreatedAtModal, DeleteEventModal } from "../modals/CheckModal";
import DatePicker from "react-datepicker";
import { ko } from "date-fns/locale";

function EventScreen() {
  const { page_size, offset, search_key } = useSelector((state: RootState) => ({
    page_size: state.admin.EventListPage.page_size,
    offset: state.admin.EventListPage.offset,
    search_key: state.admin.EventListPage.search_key,
  }));
  const [searchKey, setSearchKey] = useState(search_key);
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
  const debounceRefetchhEvenList = useCallback(
    debounce((searchKey) => {
      refetchEventList(page_size, 0, searchKey);
    }, 500),
    [page_size]
  );
  const handleSearchBarChange = (search_key_input) => {
    setSearchKey(search_key_input);
    debounceRefetchhEvenList(search_key_input);
  };
  const openModal = useOpenNewEventModal();

  return (
    <>
      <Div flex flexCol>
        <Div mt15 mb10 selfCenter flex flexRow wFull>
          <Div justifyItemsStart flex flexRow wFull>
            <Div selfCenter>
              <PaginationPageSizebox handlePaginationPageSizeChange={handlePaginationPageSizeChange} page_size={page_size} />
            </Div>
            <Div selfCenter>개씩 보기</Div>
            <Div selfCenter ml10>
              <SearchBar w={250} placeholder={"Event를 검색해보세요."} initialText={searchKey} handleSearch={handleSearchBarChange} />
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
            <Div mr10>
              <NewEventIcon loading={false} onClick={openModal} />
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
      <NewEventModal />
      <EventApplicationModal />
    </>
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
  const HandleOpen = (open) => open;
  return (
    <Disclosure as="div" className="w-full">
      {({ open }) => (
        <>
          <Disclosure.Button className="w-full hover:bg-gray-100">
            <Div px30 py10 cursorPointer flex flexRow justifyCenter border1 borderGray100 clx={`${HandleOpen(open) ? "bg-gray-100" : ""}`} overflowHidden>
              <Div wFull flex flexCol justifyCenter selfCenter>
                <Div wFull flex flexRow justifyStart gapX={10} mb10>
                  <EventStatus event={event} />
                  <Div flex flexRow wFull justifyEnd>
                    {event?.has_application == true && !event?.application_link && (
                      <DataEntry
                        name={"응모자 수"}
                        w={55}
                        label={<DocumentTextIcon height={20} width={20} className="max-h-20 max-w-20 mr-10" />}
                        data={event?.event_application_count}
                      />
                    )}
                    <DataEntry
                      name={"조회 수"}
                      w={55}
                      label={<EyeIcon height={20} width={20} className="max-h-20 max-w-20 mr-10" />}
                      data={event?.read_count}
                    />
                  </Div>
                </Div>
                <Div wFull flex flexRow justifyStart gapX={20}>
                  <Tooltip title={event?.nft_collection?.name} arrow>
                    <Div selfCenter>
                      <ProfileImage width={40} height={40} nft={event?.nft_collection} rounded={true} resize={true} />
                    </Div>
                  </Tooltip>
                  <Div flex flexCol justifyStart selfCenter wFull>
                    <Div fontSize18 fontBold wFull overflowEllipsis overflowHidden whitespaceNowrap textLeft>
                      {event?.name}
                    </Div>
                  </Div>
                  <Div selfCenter mr40>
                    <Date updated_at={event?.created_at} />
                  </Div>
                </Div>
              </Div>
              <Div selfCenter>
                <motion.div animate={{ rotate: HandleOpen(open) ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronUpIcon height={20} width={20} className="text-gray-400" />
                </motion.div>
              </Div>
            </Div>
          </Disclosure.Button>
          <DefaultTransition
            show={HandleOpen(open)}
            content={
              <Disclosure.Panel static className="bg-gray-100 border-b-2">
                <EventDetails event={event} />
              </Disclosure.Panel>
            }
          />
        </>
      )}
    </Disclosure>
  );
}

function EventDetails({ event }) {
  const queryClient = useQueryClient();
  const { Modal, openModal, isLoading } = DeleteEventModal(event?.id, queryClient);
  const openEventApplicationModal = useOpenEventApplicationModal(event?.id);
  const originalCreatedAt = getDateType(event?.created_at);
  const [createdAt, setCreatedAt] = useState(originalCreatedAt);
  const { Modal: Modal2, openModal: openModal2, isLoading: isLoading2 } = ChangeCreatedAtModal(event?.id, createdAt, event?.status, queryClient);
  const openModifyEventModal = useOpenNewEventModal(event);
  return (
    <>
      <Modal />
      <Modal2 />
      <Div px30 py10 flex flexCol justifyCenter gapY={20} textCenter>
        <Div wFull flex flexRow justifyStart gapX={10}>
          <Div selfCenter flex flexRow wFull jsutifyStart gapX={10} flexWrap gapY={10}>
            {event?.has_application && <ApplicationLink event={event} />}
            {event?.has_application && <EventOptions event={event} />}
          </Div>
          <Div selfStart mr10 whitespaceNowrap>
            <Div selfStart w160>
              {originalCreatedAt && (
                <DatePicker
                  className={"self-center h-full w-full focus:outline-none focus:border-gray-400 bg-transparent rounded-md border-none py-5 text-right px-2"}
                  selected={createdAt}
                  onChange={(date) => setCreatedAt(date)}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  locale={ko}
                  timeCaption="time"
                  dateFormat="yyyy/MM/dd HH:mm "
                />
              )}
            </Div>
          </Div>
          {+originalCreatedAt !== +createdAt && <CheckButton loading={isLoading2} onClick={openModal2} />}
          <ModifyButton onClick={openModifyEventModal} />
          <DeleteButton loading={isLoading} openModal={openModal} />
        </Div>
        {event?.has_application && (
          <Div wFull flex flexRow justifyCenter>
            <Div>
              <ChangeStatus event={event} />
            </Div>
            <Div ml10 fontSize14 rounded fontSemibold minW={80} py5 bgGray200 clx="hover:bg-gray-300" cursorPointer onClick={openEventApplicationModal}>
              응모 관리
            </Div>
            <Div wFull />
            {event?.expires_at && (
              <Div selfCenter whitespaceNowrap mt3 textDanger fontSemibold>
                {`${getDate(event?.expires_at, "YYYY.MM.DD HH:mm")}에 마감`}
              </Div>
            )}
          </Div>
        )}
        <Div wFull flex flexRow justifyCenter borderT1 py10 borderGray300 gapX={15}>
          <Div selfcenter wFull textLeft flex flexCol gapY={10}>
            {event?.discord_link && (
              <Div flex flexRow justifyStart>
                <DiscordLink event={event} />
              </Div>
            )}
            <TruncatedText text={event?.description} maxLength={1000} />
          </Div>
          {event?.image_uris && event?.image_uris.length != 0 && (
            <Div>
              <ImageSlide uris={event?.image_uris} maxHeight={300} maxWidth={300} click={false} />
            </Div>
          )}
        </Div>
      </Div>
    </>
  );
}

function EventOptions({ event }) {
  const drawEventOptions = event?.draw_event_options;
  const Options =
    drawEventOptions && drawEventOptions.length != 0
      ? chain(drawEventOptions)
          .groupBy("category")
          .map((value, key) => {
            const options = value.map((item) => ({ ...item }));
            if (options.length == 1 && options[0].input_type == EventApplicationInputType.CUSTOM_INPUT)
              return { name: key, inputType: EventApplicationInputType.CUSTOM_INPUT, options };
            if (options.length == 1 && options[0].input_type == EventApplicationInputType.DISCORD_ID)
              return { name: key, inputType: EventApplicationInputType.DISCORD_ID, options };
            if (options.length == 1 && options[0].input_type == EventApplicationInputType.TWITTER_ID)
              return { name: key, inputType: EventApplicationInputType.TWITTER_ID, options };
            return { name: key, inputType: EventApplicationInputType.SELECT, options };
          })
          .value()
      : null;
  return <>{Options ? Options.map((value, index) => <EventOption option={value} key={index} />) : null}</>;
}

function EventOption({ option }) {
  const [click, setClick] = useState(false);
  const onHoverOptions = () => {
    if (!canClick) return;
    setClick(true);
  };
  const onLeaveOptions = () => {
    if (!canClick) return;
    setClick(false);
  };
  const canClick = option?.inputType == EventApplicationInputType.SELECT && option?.options && option?.options.length != 0;
  return (
    <Div relative>
      <Div
        selfStart
        px10
        py5
        bgWhite={!click}
        bgGray200={click}
        rounded={!click}
        roundedT={click}
        textBlack
        flex
        flexRow
        justifyCenter
        relative
        onMouseEnter={onHoverOptions}
        onMouseLeave={onLeaveOptions}
        cursorPointer={canClick}
        clx={canClick && "hover:bg-gray-200"}
      >
        <Div relative selfCenter>
          {option?.inputType == EventApplicationInputType.DISCORD_ID ? (
            <FaDiscord size={18} />
          ) : option?.inputType == EventApplicationInputType.TWITTER_ID ? (
            <FaTwitter size={18} />
          ) : option?.inputType == EventApplicationInputType.CUSTOM_INPUT ? (
            <PencilAltIcon height={18} width={18} className="max-h-18 max-w-18" />
          ) : (
            <FaBars size={18} />
          )}
        </Div>
        <Div relative selfCenter fontSize12 ml5 fontSemibold>
          {option?.name}
        </Div>
        {canClick && (
          <Div relative selfCenter fontSize12 ml5 fontSemibold>
            <motion.div animate={{ rotate: click ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronUpIcon height={12} width={12} className="max-h-12 max-w-12" />
            </motion.div>
          </Div>
        )}
      </Div>
      <DefaultTransition
        show={click && canClick}
        duration={0.2}
        content={
          <Div
            onMouseEnter={onHoverOptions}
            onMouseLeave={onLeaveOptions}
            cursorPointer
            z100
            absolute
            bgGray200
            overflowYScroll
            noScrollBar
            style={{ maxHeight: "500%" }}
            minWFull
            top={"100%"}
            roundedB
            px10
            flex
            flexCol
            py5
            gapY={3}
          >
            {option?.options.map((value, index) => (
              <Div key={index} breakAll relative textRight fontSize14 borderGray400 borderB1={index != option?.options.length - 1}>
                {value?.name}
              </Div>
            ))}
          </Div>
        }
      />
    </Div>
  );
}

function ApplicationLink({ event }) {
  const { link, linkError, handleClickLink } = useLink(event?.application_link);
  return (
    event?.has_application &&
    event?.application_link &&
    (event?.draw_event_options == null || (event?.draw_event_options != null && event?.draw_event_options.length == 0)) && (
      <Div selfCenter flex flexRow gapX={20}>
        <Div selfCenter fontSemibold>
          응모 링크
        </Div>
        <Div selfCenter flex flexCol justifyStart overflowEllipsis overflowHidden whitespaceNowrap gapY={5} style={{ maxWidth: "30vw" }}>
          {link}
        </Div>
        <DefaultTransition
          show={!linkError}
          content={
            <Div selfCenter px10 py5 bgInfo bgOpacity50 rounded10 textWhite cursorPointer clx="hover:bg-info" onClick={handleClickLink}>
              {" "}
              <ArrowRightIcon height={15} width={20} className="max-h-20 max-w-20" />
            </Div>
          }
        />
      </Div>
    )
  );
}

function DiscordLink({ event }) {
  const { link, linkError, handleClickLink } = useLink(event?.discord_link);
  return (
    link && (
      <Div selfCenter flex flexRow gapX={20}>
        <Div selfCenter fontSemibold whitespaceNowrap>
          본문 링크
        </Div>
        <Div selfCenter flex flexCol justifyStart overflowEllipsis overflowHidden whitespaceNowrap gapY={5} style={{ maxWidth: "30vw" }}>
          {link}
        </Div>
        <DefaultTransition
          show={!linkError}
          content={
            <Div selfCenter px10 py5 bgInfo bgOpacity50 rounded10 textWhite cursorPointer clx="hover:bg-info" onClick={handleClickLink}>
              {" "}
              <ArrowRightIcon height={15} width={20} className="max-h-20 max-w-20" />
            </Div>
          }
        />
      </Div>
    )
  );
}

function Date({ updated_at }) {
  return (
    <Tooltip title={getDate(updated_at)} arrow>
      <Div textRight whitespaceNowrap>
        {" "}
        {createdAtText(updated_at)}{" "}
      </Div>
    </Tooltip>
  );
}

function NewEventIcon({ loading, onClick }) {
  return loading ? (
    <Div selfCenter px10 py5 bgBW bgOpacity50 rounded10 textWhite>
      {" "}
      <Oval height="14" width="14" color="white" secondaryColor="#FFFFFF" strokeWidth="5" />
    </Div>
  ) : (
    <Tooltip title="새 글 작성" arrow>
      <Div selfCenter px10 py5 bgOpacity50 rounded10 cursorPointer clx="text-black hover:bg-bw hover:text-white" onClick={onClick}>
        {" "}
        <PencilAltIcon height={20} width={20} className="max-h-20 max-w-20" />
      </Div>
    </Tooltip>
  );
}

function ModifyButton({ onClick }) {
  return (
    <Tooltip title="수정" arrow>
      <Div selfStart px10 py5 bgBW bgOpacity50 rounded10 textWhite cursorPointer clx="hover:bg-bw" onClick={onClick}>
        {" "}
        <PencilIcon height={20} width={20} className="max-h-20 max-w-20" />
      </Div>
    </Tooltip>
  );
}

function DeleteButton({ loading, openModal }) {
  return loading ? (
    <Div selfStart px10 py5 bgDanger bgOpacity50 rounded10 textWhite>
      {" "}
      <Oval height="14" width="14" color="red" secondaryColor="#FFFFFF" strokeWidth="5" />
    </Div>
  ) : (
    <Tooltip title="삭제" arrow>
      <Div selfStart px10 py5 bgDanger bgOpacity50 rounded10 textWhite cursorPointer clx="hover:bg-danger" onClick={openModal}>
        {" "}
        <TrashIcon height={20} width={20} className="max-h-20 max-w-20" />
      </Div>
    </Tooltip>
  );
}

function CheckButton({ loading, onClick }) {
  return loading ? (
    <Div selfStart px10 py5 bgBW bgOpacity50 rounded10 textWhite>
      {" "}
      <Oval height="14" width="14" color="red" secondaryColor="#FFFFFF" strokeWidth="5" />
    </Div>
  ) : (
    <Tooltip title="게시일 변경" arrow>
      <Div selfStart px10 py5 rounded10 textBlack cursorPointer clx="bg-bw-light hover:bg-bw hover:text-white" onClick={onClick}>
        {" "}
        <CheckIcon height={20} width={20} className="max-h-20 max-w-20" />
      </Div>
    </Tooltip>
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
      {eventStatus?.category && <Theme status={eventStatus?.category} />}
      {eventStatus?.status && <Theme status={eventStatus?.status} />}
      {eventStatus?.expires && <Theme status={eventStatus?.expires} />}
    </>
  );
}

function ChangeStatus({ event }) {
  const eventId = event?.id;
  const queryClient = useQueryClient();
  const { mutate, isLoading } = setStatus(eventId, event?.created_at, queryClient);
  return (
    <SelectEntry
      firstText={"진행 중"}
      secondText={"당첨 발표"}
      thirdText={"마감"}
      clickFirst={() => mutate(DrawEventStatus.IN_PROGRESS)}
      clickSecond={() => mutate(DrawEventStatus.ANNOUNCED)}
      clickThird={() => mutate(DrawEventStatus.FINISHED)}
      isFirst={event?.status == DrawEventStatus.IN_PROGRESS}
      isSecond={event?.status == DrawEventStatus.ANNOUNCED}
      isThird={event?.status == DrawEventStatus.FINISHED}
      enable={!isLoading}
    />
  );
}

function SelectEntry({ firstText, secondText, thirdText, clickFirst, clickSecond, clickThird, isFirst, isSecond, isThird, enable }) {
  return (
    <Div clx="bg-bw-light" cursorPointer={enable} rounded flex flexRow fontSize14 fontSemibold overflowHidden selfCenter>
      <Div px10 py5 selfCenter bgBW={isFirst} textWhite={isFirst} onClick={enable && clickFirst} whitespaceNowrap>
        {firstText}
      </Div>
      <Div px10 py5 selfCenter bgBW={isSecond} textWhite={isSecond} onClick={enable && clickSecond} whitespaceNowrap>
        {secondText}
      </Div>
      <Div px10 py5 selfCenter bgBW={isThird} textWhite={isThird} onClick={enable && clickThird} whitespaceNowrap>
        {thirdText}
      </Div>
    </Div>
  );
}

export default EventScreen;
