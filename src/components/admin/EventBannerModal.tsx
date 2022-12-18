import Div from "../Div";
import Modal from "../modals/Modal";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "src/store/reducers/rootReducer";
import { eventBannerAction } from "src/store/reducers/modalReducer";
import Tooltip from "@mui/material/Tooltip";

export enum EventBannerModalState {
  NONE = -1,
  MODIFY = 0,
  ADD_BY_DRAW_EVENT_ID = 1,
  ADD_BY_LINK = 2,
}

export const useOpenEventBannerModal = (state, drawEvent = null) => {
  const dispatch = useDispatch();
  const openEventBannerModal = () => dispatch(eventBannerAction({ enabled: true, state: state, drawEvent: drawEvent }));
  return openEventBannerModal;
};

const useChangeEventBannerModalState = (state) => {
  const dispatch = useDispatch();
  const { drawEvent } = useSelector((state: RootState) => ({
    drawEvent: state.modal.EventBannerModal.drawEvent,
  }));
  const changeEventBannerModalState = () => dispatch(eventBannerAction({ enabled: true, state: state, drawEvent: drawEvent }));
  return changeEventBannerModalState;
};

export default function EventBannerModal({}) {
  const { enabled, state, drawEvent } = useSelector((state: RootState) => ({
    enabled: state.modal.EventBannerModal.enabled,
    state: state.modal.EventBannerModal.state,
    drawEvent: state.modal.EventBannerModal.drawEvent,
  }));
  const dispatch = useDispatch();
  const closeModal = () => {
    dispatch(eventBannerAction({ enabled: false, state: state, drawEvent: drawEvent }));
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
      <EventBannerDetail closeModal={closeModal} state={state} drawEvent={drawEvent} />
    </Modal>
  );
}

function EventBannerDetail({ closeModal, state, drawEvent }) {
  return (
    <Div zIndex={-1000} w={"80vw"} hFull flex itemsCenter justifyCenter>
      <Div wFull mb10 flex flexCol px30 py30>
        <Div wFull flex flexRow py10 borderB1>
          <Div wFull selfCenter fontBold fontSize30 selfStart textBW>
            이벤트 배너 관리
          </Div>
          <Div selfCenter>
            <Tooltip title="창 닫기" arrow>
              <Div fontBold selfEnd px10 cursorPointer py5 bgBWLight textBW rounded10 clx="hover:bg-bw hover:text-white" onClick={closeModal}>
                닫기
              </Div>
            </Tooltip>
          </Div>
        </Div>
        <Div wFull mt20></Div>
      </Div>
    </Div>
  );
}
