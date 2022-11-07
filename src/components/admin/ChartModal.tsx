import Div from "../Div";
import Modal from "../modals/Modal";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "src/store/reducers/rootReducer";
import { charModalAction } from "src/store/reducers/modalReducer";
import Tooltip from "@mui/material/Tooltip";
import { CollectionsChart } from "./dashboard";

export function useOpenChartModal(chartType, data, title) {
  const dispatch = useDispatch();
  const openChartModal = () => {
    dispatch(charModalAction({ enabled: true, chartType, data, title }));
  };
  return openChartModal;
}

export enum ChartModalType {
  NFT_BY_COLLECTIONS = 0,
}

export default function ChartModal({}) {
  const { enabled, chartType, data, title } = useSelector((state: RootState) => ({
    enabled: state.modal.ChartModal.enabled,
    chartType: state.modal.ChartModal.chartType,
    data: state.modal.ChartModal.data,
    title: state.modal.ChartModal.title,
  }));
  const dispatch = useDispatch();
  const closeModal = () => {
    dispatch(charModalAction({ enabled: false, chartType: chartType, data: data, title: title }));
  };

  return (
    <Modal open={enabled} onClose={closeModal} bdClx={"bg-black/50"} clx={"bg-white w-full"}>
      <ChartModalEntry closeModal={closeModal} chartType={chartType} data={data} title={title} />
    </Modal>
  );
}

function ChartModalEntry({ closeModal, chartType, data, title }) {
  return (
    <Div zIndex={-1000} wFull hFull flex itemsCenter justifyCenter>
      <Div wFull mb10 flex flexCol px30 py30>
        <Div wFull flex flexRow py10 borderB1>
          <Div wFull selfCenter fontBold fontSize30 selfStart textBW>
            {title}
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
          {chartType == ChartModalType.NFT_BY_COLLECTIONS && <CollectionsChart data={data} summerize={false} />}
        </Div>
      </Div>
    </Div>
  );
}
