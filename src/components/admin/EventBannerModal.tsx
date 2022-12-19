import Div from "../Div";
import Modal from "../modals/Modal";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "src/store/reducers/rootReducer";
import { eventBannerAction } from "src/store/reducers/modalReducer";
import Tooltip from "@mui/material/Tooltip";
import TimerText from "../common/timertext";
import { useState } from "react";
import { ArrowDownIcon, ArrowLeftIcon, ArrowRightIcon, ArrowUpIcon, PencilAltIcon, PlusIcon, RefreshIcon, TrashIcon } from "@heroicons/react/outline";
import { Oval } from "react-loader-spinner";
import { actionEventBanner, EventBannerAction, getEventBanners } from "src/hooks/queries/admin/events";
import useUploadEventBanner from "src/hooks/useUploadBanner";
import { useQueryClient } from "react-query";
import ReactTextareaAutosize from "react-textarea-autosize";
import { DefaultText } from "../common/ModifiedTruncatedMarkdown";
import DefaultTransition from "../common/defaulttransition";
import { DeleteEventBannerModal } from "../modals/CheckModal";
import { SizedImage } from "../common/ImageHelper";

export enum EventBannerModalState {
  NONE = -1,
  BOARD = 0,
  ADD_BY_DRAW_EVENT_ID = 1,
  ADD_BY_LINK = 2,
  MODIFY = 3,
}

export const useOpenEventBannerModal = (state, drawEvent = null, eventBanner = null) => {
  const dispatch = useDispatch();
  const openEventBannerModal = () => dispatch(eventBannerAction({ enabled: true, state, drawEvent, eventBanner }));
  return openEventBannerModal;
};

export const useOpenModifyEventBannerModal = () => {
  const openModifyEventBannerModal = useOpenEventBannerModal(EventBannerModalState.BOARD, null);
  return openModifyEventBannerModal;
};

export const useOpenAddByDrawEventEventBannerModal = (drawEvent = null) => {
  const openModifyEventBannerModal = useOpenEventBannerModal(EventBannerModalState.ADD_BY_DRAW_EVENT_ID, drawEvent);
  return openModifyEventBannerModal;
};

export default function EventBannerModal({}) {
  const { enabled, state, drawEvent, eventBanner } = useSelector((state: RootState) => ({
    enabled: state.modal.EventBannerModal.enabled,
    state: state.modal.EventBannerModal.state,
    drawEvent: state.modal.EventBannerModal.drawEvent,
    eventBanner: state.modal.EventBannerModal.eventBanner,
  }));
  const dispatch = useDispatch();
  const closeModal = () => {
    dispatch(eventBannerAction({ enabled: false, state, drawEvent, eventBanner }));
  };

  return (
    <Modal
      open={enabled}
      onClose={() => {
        return;
      }}
      bdClx={"bg-black/50"}
      clx={"bg-white"}
    >
      <EventBannersDetail closeModal={closeModal} state={state} drawEvent={drawEvent} eventBanner={eventBanner} />
    </Modal>
  );
}

function EventBannersDetail({ closeModal, state, drawEvent, eventBanner }) {
  return (
    <Div zIndex={-1000} w={"80vw"} hFull flex itemsCenter justifyCenter>
      <Div wFull mb10 flex flexCol px30 py30>
        <Div wFull flex flexRow py10 borderB1>
          <Div wFull selfCenter fontBold fontSize30 selfStart textBW>
            {state == EventBannerModalState.BOARD ? "이벤트 배너 관리" : state == EventBannerModalState.MODIFY ? "배너 수정" : "새 배너 추가"}
          </Div>
          <Div selfCenter>
            <Tooltip title="창 닫기" arrow>
              <Div fontBold selfEnd px10 cursorPointer py5 bgBWLight textBW rounded10 clx="hover:bg-bw hover:text-white" onClick={closeModal}>
                닫기
              </Div>
            </Tooltip>
          </Div>
        </Div>
        <Div wFull mt20 pl10>
          {state == EventBannerModalState.BOARD && <ModifyEventBanner />}
          {(state == EventBannerModalState.ADD_BY_DRAW_EVENT_ID || state == EventBannerModalState.ADD_BY_LINK || state == EventBannerModalState.MODIFY) && (
            <AddEventBanner state={state} drawEvent={drawEvent} eventBanner={eventBanner} />
          )}
        </Div>
      </Div>
    </Div>
  );
}

function AddEventBanner({ state, drawEvent, eventBanner }) {
  const openModifyEventBannerModal = useOpenEventBannerModal(EventBannerModalState.BOARD, null);
  const queryClient = useQueryClient();
  const {
    loading,
    link,
    linkError,
    handleChangeLink,
    handleClickLink,
    description,
    markdownDescription,
    handleChangeDescription,
    descriptionError,
    error,
    uploadEventBanner,
  } = useUploadEventBanner({ queryClient, state, uploadSuccessCallback: openModifyEventBannerModal, drawEvent, eventBanner });
  return (
    <Div flex flexCol>
      <Div flex flexRow wFull justifyStart>
        {state == EventBannerModalState.ADD_BY_LINK ? (
          <Div selfCenter wFull textLeft>
            새로운 배너를 추가해주세요. <br /> 이벤트로 연결되는 배너 추가시에는{" "}
            <Div spanTag fontBold>
              이 창을 닫고, 이벤트
            </Div>
            를 클릭 후 배너 추가 버튼을 이용해주세요.
          </Div>
        ) : state == EventBannerModalState.ADD_BY_DRAW_EVENT_ID ? (
          <Div selfCenter wFull textLeft>
            새로운 배너를 추가해주세요. <br /> 링크로 연결되는 배너 추가시에는{" "}
            <Div spanTag fontBold>
              이 창을 닫고, 상단의 배너 관리
            </Div>
            를 클릭 후 배너 추가 버튼을 이용해주세요.
          </Div>
        ) : (
          <Div wFull />
        )}
        {(state == EventBannerModalState.ADD_BY_LINK || state == EventBannerModalState.MODIFY) && (
          <Div selfStart flex flexRow>
            <Tooltip title="이전" arrow style={{ marginRight: 10 }}>
              <Div fontBold selfEnd px10 cursorPointer py5 bgBWLight textBW rounded10 clx="hover:bg-bw hover:text-white" onClick={openModifyEventBannerModal}>
                <ArrowLeftIcon height={20} width={20} className="max-h-20 max-w-20" />
              </Div>
            </Tooltip>
          </Div>
        )}
      </Div>
      <Div wFull flex flexCol bgGray100 rounded px10 py10 mt15>
        <Div fontBold>배너 문구 작성</Div>
        <Div textGray400 fontSize12>
          최대 2줄까지 작성 가능
        </Div>
        <Div wFull flex flexCol gapX={10}>
          {" "}
          <Div wFull borderB1>
            <Div wFull flex flexRow justifyCenter fontSize15 fontSemibold>
              원문
            </Div>
            <ReactTextareaAutosize
              rows={5}
              onChange={handleChangeDescription}
              placeholder={"오직 홀더를 위한 공지와 이벤트\n**BetterWorld Events**"}
              className={"text-base"}
              value={description}
              style={{ boxShadow: "none", border: "none", resize: "none", width: "100%", padding: 0, background: "transparent" }}
            />
          </Div>
          <Div wFull textLeft>
            <Div wFull textCenter flex flexRow justifyCenter fontSize15 fontSemibold>
              View
            </Div>
            <Div wFull textGray500={description == ""}>
              <DefaultText text={markdownDescription == "" ? "오직 홀더를 위한 공지와 이벤트\n\n**BetterWorld Events**" : markdownDescription} />
            </Div>
          </Div>
        </Div>
        <Div textDanger fontSize12 fontBold>
          {descriptionError}
        </Div>
      </Div>
      {(state == EventBannerModalState.ADD_BY_LINK || (state == EventBannerModalState.MODIFY && eventBanner?.banner_uri != null)) && (
        <Div wFull flex flexCol bgGray100 rounded px10 py10 mt15>
          <Div fontBold>링크 작성</Div>
          <Div wFull flex flexRow>
            <Div selfCenter flex flexRow gapX={10}>
              <Div flex flexCol justifyStart gapY={5}>
                <Div px10 py5 bgWhite roundedLg textBlack w={"60vw"}>
                  <input
                    placeholder="https://..."
                    value={link}
                    className={"self-center h-full w-full focus:outline-none focus:border-gray-400 bg-transparent rounded-md"}
                    style={{ boxShadow: "none", border: "none" }}
                    onChange={handleChangeLink}
                  ></input>
                </Div>
                <Div textLeft textDanger fontBold fontSize12 ml10 mb18={!linkError}>
                  <DefaultTransition show={linkError ? true : false} content={linkError} />
                </Div>
              </Div>
              <DefaultTransition
                show={!linkError}
                content={
                  <Div selfStart px10 py5 bgInfo bgOpacity50 rounded10 textWhite cursorPointer clx="hover:bg-info" onClick={handleClickLink}>
                    {" "}
                    <ArrowRightIcon height={20} width={20} className="max-h-20 max-w-20" />
                  </Div>
                }
              />
            </Div>
          </Div>
        </Div>
      )}
      {(state == EventBannerModalState.ADD_BY_DRAW_EVENT_ID || (state == EventBannerModalState.MODIFY && drawEvent != null)) && (
        <Div wFull flex flexCol bgGray100 rounded px10 py10 mt15>
          <Div fontBold>이벤트</Div>
          <Div wFull flex flexRow gapX={10}>
            <Div selfCenter>{drawEvent.image_uris.length >= 1 && <SizedImage width={80} height={80} uri={drawEvent.image_uris[0]} />}</Div>
            <Div wFull flex flexCol>
              <Div style={{ maxWidth: "60vw" }} fontBold gapY={10} overflowEllipsis overflowHidden whitespaceNowrap mb10>
                {drawEvent.name}
              </Div>
              <Div style={{ maxWidth: "60vw", height: 40 }} gapY={10} overflowEllipsis overflowHidden fontSize13 ml10>
                <DefaultText text={drawEvent.description} />
              </Div>
            </Div>
          </Div>
        </Div>
      )}
      <Div wFull flex flexRow justifyEnd mt30 fontSize14>
        <Div selfCenter>
          <DefaultTransition
            show={error != ""}
            content={
              <Div textDanger fontBold mr10>
                {error}
              </Div>
            }
          />
        </Div>
        <Div selfCenter>
          {loading ? (
            <Div fontBold bgBW selfEnd px10 py5 bgBWLight textWhite rounded10>
              <Oval height="14" width="14" color="#4738FF" secondaryColor="#FFFFFF" strokeWidth="5" />
            </Div>
          ) : (
            <Tooltip title={state == EventBannerModalState.MODIFY ? "배너 수정" : "배너 업로드"} arrow>
              <Div fontBold bgOpacity80 bgBW selfEnd px10 cursorPointer py5 bgBWLight textWhite rounded10 clx="hover:bg-bw" onClick={uploadEventBanner}>
                {state == EventBannerModalState.MODIFY ? "수정" : "업로드"}
              </Div>
            </Tooltip>
          )}
        </Div>
      </Div>
    </Div>
  );
}

function ModifyEventBanner({}) {
  const [LoadingButtonOn, setLoadingButton] = useState(false);
  const {
    isLoading: loading,
    isFetching: fetching,
    isError: error,
    data: eventBanners,
    refetch,
  } = getEventBanners(() => {
    setLoadingButton(true);
  });
  const loadingStatus = fetching && !loading;
  const openModifyEventBannerModal = useOpenEventBannerModal(EventBannerModalState.ADD_BY_LINK, null);
  return (
    <Div flex flexCol>
      <Div flex flexRow wFull justifyStart>
        <Div selfCenter wFull textLeft>
          배너 문구를 수정하거나 순서를 변경하고, 삭제할 수 있습니다.
        </Div>
        <Div selfCenter flex flexRow>
          <Div minW={120} fontSize15 fontSemibold mr10 selfCenter>
            <Div spanTag textSuccess>
              <TimerText
                condtion={!loading && LoadingButtonOn && !loadingStatus && !error}
                text={"Update Complete"}
                seconds={2}
                closecontidion={setLoadingButton}
              />
            </Div>
            <Div spanTag textDanger>
              <TimerText condtion={!loading && LoadingButtonOn && error} text={"Update error"} seconds={2} closecontidion={setLoadingButton} />
            </Div>
          </Div>
          <Tooltip title="배너 추가" arrow style={{ marginRight: 10 }}>
            <Div fontBold selfEnd px10 cursorPointer py5 bgBWLight textBW rounded10 clx="hover:bg-bw hover:text-white" onClick={openModifyEventBannerModal}>
              <PlusIcon height={20} width={20} className="max-h-20 max-w-20" />
            </Div>
          </Tooltip>
          {eventBanners &&
            (loadingStatus ? (
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
      {(eventBanners || error) &&
        (error || eventBanners?.success === false || !eventBanners.event_banners ? (
          <Div wFull textCenter fontBold fontSize15 mt20>
            오류가 발생했습니다. 다시 시도해주세요.
          </Div>
        ) : eventBanners.event_banners.length == 0 ? (
          <Div wFull textCenter fontBold fontSize15 mt20>
            설정된 배너가 아직 없습니다. 새로운 배너를 추가해주세요!
          </Div>
        ) : (
          <Div wFull flex flexCol mt20>
            {eventBanners.event_banners.map((value, index) => {
              return <EventBannerDetail eventBanner={value} key={value.id} isFirst={index == 0} isLast={index >= eventBanners.event_banners.length - 1} />;
            })}
          </Div>
        ))}
    </Div>
  );
}

function EventBannerDetail({ eventBanner, isFirst = false, isLast = false }) {
  const queryClient = useQueryClient();
  const { Modal, openModal, isLoading } = DeleteEventBannerModal(eventBanner?.id, queryClient);
  const { isLoading: loadingAction, mutate } = actionEventBanner(eventBanner?.id, queryClient);
  const openEventBannerModal = useOpenEventBannerModal(EventBannerModalState.MODIFY, eventBanner?.draw_event, eventBanner);
  return (
    <>
      <Modal />
      <Div wFull flex flexRow px10 py5 bgGray100 gapX={10} borderB1={!isLast}>
        {" "}
        <Div flex flexCol selfCenter gapY={3} w30 h50 justifyCenter>
          {!isFirst && (
            <Div
              px5
              py3
              rounded
              bgGray200
              cursorPointer
              clx="hover:bg-gray-600 hover:text-white"
              onClick={!loadingAction && (() => mutate(EventBannerAction.UP))}
            >
              <ArrowUpIcon height={15} width={15} className="max-h-20 max-w-20" />
            </Div>
          )}
          {!isLast && (
            <Div
              px5
              py3
              rounded
              bgGray200
              cursorPointer
              clx="hover:bg-gray-600 hover:text-white"
              onClick={!loadingAction && (() => mutate(EventBannerAction.DOWN))}
            >
              <ArrowDownIcon height={15} width={15} className="max-h-20 max-w-20" />
            </Div>
          )}
        </Div>
        <Div wFull selfCenter fontSize13>
          <DefaultText text={eventBanner.description.replace("\n", "\n\n")} />
        </Div>
        {eventBanner.banner_uri && (
          <Div
            selfCenter
            px10
            py5
            bgGray200
            rounded
            flex
            flexRow
            gapX={10}
            cursorPointer
            clx="hover:bg-gray-300"
            onClick={() => {
              window.open(eventBanner.banner_uri, "_blank");
            }}
          >
            <Div selfCenter fontBold>
              링크
            </Div>
            <Div selfCenter overflowEllipsis overflowHidden whitespaceNowrap w200 px10 py5 rounded bgWhite>
              {eventBanner.banner_uri}
            </Div>
          </Div>
        )}
        {eventBanner.draw_event && (
          <Div selfCenter px10 py5 bgGray200 rounded flex flexRow gapX={10}>
            <Div selfCenter fontBold>
              이벤트
            </Div>
            <Div selfCenter overflowEllipsis overflowHidden whitespaceNowrap maxW400 px10 py5 rounded bgWhite>
              {eventBanner.draw_event.name}
            </Div>
          </Div>
        )}
        <Tooltip title="배너 수정" arrow>
          <Div fontBold selfCenter px10 cursorPointer py5 bgBWLight textBW rounded10 clx="hover:bg-bw hover:text-white" onClick={openEventBannerModal}>
            <PencilAltIcon height={20} width={20} className="max-h-20 max-w-20" />
          </Div>
        </Tooltip>
        <DeleteButton loading={isLoading} openModal={openModal} />
      </Div>
    </>
  );
}

function DeleteButton({ loading, openModal }) {
  return loading ? (
    <Div selfCenter px10 py5 bgDanger bgOpacity50 rounded10 textWhite>
      {" "}
      <Oval height="14" width="14" color="red" secondaryColor="#FFFFFF" strokeWidth="5" />
    </Div>
  ) : (
    <Tooltip title="삭제" arrow>
      <Div selfCenter px10 py5 bgDanger bgOpacity50 rounded10 textWhite cursorPointer clx="hover:bg-danger" onClick={openModal}>
        {" "}
        <TrashIcon height={20} width={20} className="max-h-20 max-w-20" />
      </Div>
    </Tooltip>
  );
}
