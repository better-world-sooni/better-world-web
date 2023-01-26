import Div from "../Div";
import Modal from "../modals/Modal";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "src/store/reducers/rootReducer";
import { eventApplicationModalAction } from "src/store/reducers/modalReducer";
import React, { useState } from "react";
import { eventApplicationAction } from "src/store/reducers/adminReducer";
import TimerText from "../common/timertext";
import PaginationPageSizebox from "../common/paginationpagesizebox";
import { ArrowRightIcon, CheckIcon, ClipboardIcon, PencilAltIcon, RefreshIcon } from "@heroicons/react/outline";
import { Oval } from "react-loader-spinner";
import Tooltip from "@mui/material/Tooltip";
import Pagination from "@mui/material/Pagination";
import { defaultPageSize } from "src/hooks/queries/admin/userlist";
import { useQueryClient } from "react-query";
import { cancelEventApplicationQuery, getEventApplications, setEventApplicationStatus } from "src/hooks/queries/admin/events";
import useHandleEventApplications, { EventApplicationStatus } from "src/hooks/useHandleEventApplications";
import { ProfileImage } from "../common/ImageHelper";
import { EventApplicationInputType } from "src/hooks/useUploadDrawEvent";
import { FaBars, FaDiscord, FaTwitter } from "react-icons/fa";
import { getDate } from "src/modules/timeHelper";
import DefaultTransition from "../common/defaulttransition";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { Snackbar } from "@mui/material";

export function useOpenEventApplicationModal(eventId) {
  const dispatch = useDispatch();
  const openEventApplicationModal = () => {
    dispatch(eventApplicationAction({ page_size: defaultPageSize, offset: 0, eventId }));
    dispatch(eventApplicationModalAction({ enabled: true }));
  };
  return openEventApplicationModal;
}

export default function EventApplicationModal({}) {
  const { enabled } = useSelector((state: RootState) => ({
    enabled: state.modal.eventApplicationModal.enabled,
  }));
  const dispatch = useDispatch();
  const closeModal = () => {
    dispatch(eventApplicationModalAction({ enabled: false }));
  };
  return (
    <Modal open={enabled} onClose={closeModal} bdClx={"bg-black/50"} clx={"bg-white w-full"}>
      <EventApplicationModalEntry closeModal={closeModal} />
    </Modal>
  );
}

function EventApplicationModalEntry({ closeModal }) {
  const dispatch = useDispatch();
  const { page_size, offset, eventId } = useSelector((state: RootState) => ({
    page_size: state.admin.eventApplicationPage.page_size,
    offset: state.admin.eventApplicationPage.offset,
    eventId: state.admin.eventApplicationPage.eventId,
  }));
  const {
    isLoading: loading,
    isFetching: fetching,
    isError: error,
    data: eventApplication,
    refetch,
  } = getEventApplications(eventId, page_size, offset, () => {
    setLoadingButton(true);
  });
  const [LoadingButtonOn, setLoadingButton] = useState(false);
  const loading_status = fetching && !loading;
  const queryClient = useQueryClient();
  const refetchUserPost = (page_size, offset) => {
    removeSelected();
    cancelEventApplicationQuery(queryClient, eventId);
    dispatch(eventApplicationAction({ page_size: page_size, offset: offset, eventId }));
  };
  const handlePaginationOffsetChange = (event: React.ChangeEvent<unknown>, value: number) => {
    if (offset != value - 1 && !isLoading) refetchUserPost(page_size, value - 1);
  };
  const handlePaginationPageSizeChange = (page_size_input) => {
    if (page_size != page_size_input && !isLoading) refetchUserPost(page_size_input, 0);
  };
  const { eventApplications, handleToggleEventApplication, isSelected, removeSelected, canMutation, handleToggleAll, allText, isLoading, handleSetStatus } =
    useHandleEventApplications({
      eventId: eventId,
      eventApplications: eventApplication?.event_applications,
      queryClient: queryClient,
    });

  return (
    <Div zIndex={-1000} wFull hFull flex itemsCenter justifyCenter>
      <Div wFull mb10 flex flexCol px30 py30>
        <Div wFull flex flexRow py10 borderB1>
          <Div wFull selfCenter fontBold fontSize30 selfStart textBW>
            응모 기록
          </Div>
          <Div selfCenter>
            <Tooltip title="창 닫기" arrow>
              <Div fontBold selfEnd px10 cursorPointer py5 bgBWLight textBW rounded10 clx="hover:bg-bw hover:text-white" onClick={closeModal}>
                닫기
              </Div>
            </Tooltip>
          </Div>
        </Div>
        <Div mt10 px10 wFull selfCenter>
          <Div wFull flex flexCol>
            <Div mt15 selfCenter flex flexRow wFull mb10>
              <Div justifyItemsStart flex flexRow wFull>
                <Div selfCenter flex flexRow>
                  <PaginationPageSizebox handlePaginationPageSizeChange={handlePaginationPageSizeChange} page_size={page_size} />
                  <Div selfCenter>개씩 보기</Div>
                </Div>
                {eventApplication?.success && eventApplications.length != 0 && (
                  <Div selfCenter flex ml10 flexRow border1 fontSize13 rounded mt3>
                    <Div
                      flex
                      flexRow
                      justifyCenter
                      cursorPointer
                      whitespaceNowrap
                      px10
                      py5
                      bgBW
                      textWhite
                      rounded={!canMutation}
                      roundedL={canMutation}
                      onClick={handleToggleAll}
                    >
                      {allText}
                    </Div>
                    <DefaultTransition
                      show={canMutation}
                      content={
                        <Div flex flexRow>
                          <Div
                            cursorPointer
                            whitespaceNowrap
                            px10
                            py5
                            clx={"hover:bg-black hover:text-white"}
                            onClick={() => handleSetStatus(EventApplicationStatus.APPLIED)}
                          >
                            응모 완료
                          </Div>
                          <Div
                            cursorPointer
                            whitespaceNowrap
                            px10
                            py5
                            clx={"hover:bg-success hover:text-white"}
                            onClick={() => handleSetStatus(EventApplicationStatus.SELECTED)}
                          >
                            당첨
                          </Div>
                          <Div
                            cursorPointer
                            whitespaceNowrap
                            px10
                            py5
                            roundedR
                            clx={"hover:bg-info hover:text-white"}
                            onClick={() => handleSetStatus(EventApplicationStatus.RECEIVED)}
                          >
                            수령 완료
                          </Div>
                        </Div>
                      }
                    />
                  </Div>
                )}
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
                {eventApplication &&
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
              <Div wFull flex flexCol>
                <Div selfCenter>
                  {" "}
                  <Oval height="300" width="300" color="gray" secondaryColor="#FFFFFF" strokeWidth="100" />
                </Div>
              </Div>
            )}
            {eventApplication?.success && (
              <Div selfCenter wFull flex flexCol>
                <Div wFull selfCenter minH={"50vh"} maxH={"60vh"} overflowHidden overflowYScroll>
                  <EventApplicationsDetail
                    eventApplications={eventApplications}
                    eventId={eventId}
                    handleToggleEventApplication={handleToggleEventApplication}
                    isSelected={isSelected}
                  />
                </Div>
                <Div selfCenter mt50>
                  <Pagination
                    count={Math.ceil(eventApplication?.event_application_count / page_size)}
                    page={offset + 1}
                    showFirstButton
                    showLastButton
                    onChange={handlePaginationOffsetChange}
                  />
                </Div>
              </Div>
            )}
            {error ||
              (eventApplication && !eventApplication.success && (
                <Div selfCenter wFull flex flexCol>
                  <Div wFull selfCenter>
                    <Div mb100 wFull bgWhite textCenter textGray400>
                      오류가 발생하였습니다. 다시 시도하여 주세요.{" "}
                    </Div>
                  </Div>
                </Div>
              ))}
          </Div>
        </Div>
      </Div>
    </Div>
  );
}

function EventApplicationsDetail({ eventApplications, eventId, handleToggleEventApplication, isSelected }) {
  if (eventApplications == null || eventApplications.length == 0) {
    return (
      <Div wFull textCenter mb50 fontSize16>
        응모 기록이 없습니다.
      </Div>
    );
  }
  return (
    <Div wFull flex flexCol justifyCenter hFull>
      {eventApplications.map((eventApplication, index) => (
        <ApplicationDetail
          eventApplication={eventApplication}
          key={eventApplication?.id}
          isLast={index == eventApplications.length - 1}
          eventId={eventId}
          handleToggle={() => handleToggleEventApplication(eventApplication?.id)}
          isSelected={isSelected(eventApplication?.id)}
        />
      ))}
    </Div>
  );
}
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function ApplicationDetail({ eventApplication, isLast, eventId, handleToggle, isSelected }) {
  const nft = eventApplication?.nft;
  const [open, setOpen] = useState(false);
  const clickCopy =
    nft?.user_address &&
    (() => {
      navigator.clipboard.writeText(nft?.user_address);
      setOpen(true);
    });

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  return (
    <>
      <Div wFull flex flexRow justifyStart borderB1={!isLast} py5 px5 gapX={15} clx="hover:bg-gray-100">
        <Div selfCenter cursorPointer onClick={handleToggle}>
          <Div w20 h20 border1>
            <DefaultTransition show={isSelected} duration={0.3} content={<CheckIcon height={18} width={18} className="max-h-18 max-w-18" />} />
          </Div>
        </Div>
        <Div selfCenter cursorPointer onClick={handleToggle}>
          <ProfileImage width={50} height={50} nft={nft} rounded={true} resize={true} />
        </Div>
        {nft?.name != null && nft?.name != "" ? (
          <Div selfCenter minW={150} maxW={150} flex flexCol textLeft justifyStart cursorPointer onClick={handleToggle}>
            <Div fontSize16 fontBold overflowEllipsis overflowHidden whitespaceNowrap>
              {nft?.name}
            </Div>
            <Div fontSize12 overflowEllipsis overflowHidden whitespaceNowrap>
              {nft?.nft_metadatum?.name}
            </Div>
          </Div>
        ) : (
          <Div selfCenter minW={150} maxW={150} flex flexCol textLeft justifyStart>
            <Div fontSize16 fontBold overflowEllipsis overflowHidden whitespaceNowrap>
              {nft?.nft_metadatum?.name}
            </Div>
          </Div>
        )}
        <Div selfCenter flex flexRow wFull jsutifyStart gapX={10} flexWrap gapY={10} fontSize13>
          {eventApplication?.event_application_options.map((option, index) => (
            <OptionDetail key={index} option={option} />
          ))}
        </Div>
        <Div selfCenter hFull flex flexRow>
          <Tooltip title="User Address 복사" arrow>
            <Div selfCenter px10 py5 bgBW rounded textWhite clx="hover:bg-bw-light hover:text-black" cursorPointer onClick={clickCopy}>
              <ClipboardIcon height={18} width={18} className="max-h-18 max-w-18" />
            </Div>
          </Tooltip>
        </Div>
        <Div selfCenter flex flexCol justifyEnd gapY={5}>
          <SelectStatus eventApplication={eventApplication} eventId={eventId} />
          <Div whitespaceNowrap textRight textGray600>
            {getDate(eventApplication?.created_at)}
          </Div>
        </Div>
      </Div>
      <Snackbar open={open} autoHideDuration={1500} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          {(nft?.name || nft?.nft_metadatum?.name) + "의 지갑 주소가 복사되었습니다."}
        </Alert>
      </Snackbar>
    </>
  );
}

function SelectStatus({ eventApplication, eventId }) {
  const queryClient = useQueryClient();
  const { mutate, isLoading } = setEventApplicationStatus(eventId, queryClient);
  return (
    <Div flex flexRow justifyCenter border1 rounded fontSize13 cursorPointer>
      <Div
        whitespaceNowrap
        px10
        py5
        roundedL
        bgBlack={eventApplication?.status == EventApplicationStatus.APPLIED}
        textWhite={eventApplication?.status == EventApplicationStatus.APPLIED}
        clx={eventApplication?.status != EventApplicationStatus.APPLIED && "hover:bg-black hover:bg-opacity-40"}
        onClick={
          eventApplication?.status != EventApplicationStatus.APPLIED && !isLoading && (() => mutate(eventApplication?.id, EventApplicationStatus.APPLIED))
        }
      >
        응모 완료
      </Div>
      <Div
        whitespaceNowrap
        px10
        py5
        bgSuccess={eventApplication?.status == EventApplicationStatus.SELECTED}
        textWhite={eventApplication?.status == EventApplicationStatus.SELECTED}
        clx={eventApplication?.status != EventApplicationStatus.SELECTED && "hover:bg-success hover:bg-opacity-40"}
        onClick={
          eventApplication?.status != EventApplicationStatus.SELECTED && !isLoading && (() => mutate(eventApplication?.id, EventApplicationStatus.SELECTED))
        }
      >
        당첨
      </Div>
      <Div
        whitespaceNowrap
        px10
        py5
        roundedR
        bgInfo={eventApplication?.status == EventApplicationStatus.RECEIVED}
        textWhite={eventApplication?.status == EventApplicationStatus.RECEIVED}
        clx={eventApplication?.status != EventApplicationStatus.RECEIVED && "hover:bg-info hover:bg-opacity-40"}
        onClick={
          eventApplication?.status != EventApplicationStatus.RECEIVED && !isLoading && (() => mutate(eventApplication?.id, EventApplicationStatus.RECEIVED))
        }
      >
        수령 완료
      </Div>
    </Div>
  );
}

function OptionDetail({ option }) {
  const inputType = option?.draw_event_option?.input_type;
  const onClick = () => {
    if (inputType == EventApplicationInputType.SELECT || inputType == EventApplicationInputType.CUSTOM_INPUT) return;
    window.open(
      inputType == EventApplicationInputType.DISCORD_ID ? `https://www.discordapp.com/users/${option?.value}` : `https://www.twitter.com/${option?.value}`,
      "_blank"
    );
  };
  return (
    <Div selfCenter bgGray200 px10 py5 rounded flex flexRow justifyCenter gapX={5}>
      {inputType == EventApplicationInputType.SELECT ? (
        <>
          <Div selfCenter mb2>
            <FaBars size={18} />
          </Div>
          <Div selfCenter fontSemibold>
            {option?.draw_event_option?.category}
          </Div>
          <Div selfCenter px8 py2 bgWhite rounded ml5>
            {option?.draw_event_option?.name}
          </Div>
        </>
      ) : (
        <>
          <Div
            selfCenter
            mb2
            onClick={onClick}
            cursorPointer={inputType == EventApplicationInputType.DISCORD_ID || inputType == EventApplicationInputType.TWITTER_ID}
          >
            {inputType == EventApplicationInputType.DISCORD_ID ? (
              <FaDiscord size={18} />
            ) : inputType == EventApplicationInputType.TWITTER_ID ? (
              <FaTwitter size={18} />
            ) : inputType == EventApplicationInputType.CUSTOM_INPUT ? (
              <PencilAltIcon height={18} width={18} className="max-h-18 max-w-18" />
            ) : inputType == EventApplicationInputType.LINK ? (
              <ArrowRightIcon height={18} width={18} className="max-h-18 max-w-18" />
            ) : (
              <></>
            )}
          </Div>
          <Div
            selfCenter
            fontSemibold
            onClick={onClick}
            cursorPointer={inputType == EventApplicationInputType.DISCORD_ID || inputType == EventApplicationInputType.TWITTER_ID}
          >
            {option?.draw_event_option?.category}
          </Div>
          <Div ml5 selfCenter px8 py2 bgWhite rounded>
            {inputType == EventApplicationInputType.LINK ? <CheckIcon height={18} width={18} className="max-h-18 max-w-18 text-success" /> : option?.value}
          </Div>
        </>
      )}
    </Div>
  );
}
