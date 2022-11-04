import Div from "src/components/Div";
import { useCallback, useState } from "react";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "src/store/reducers/rootReducer";
import { Oval } from "react-loader-spinner";
import { RefreshIcon } from "@heroicons/react/outline";
import Pagination from "@mui/material/Pagination";
import { useDispatch } from "react-redux";
import { EventListAction } from "src/store/reducers/adminReducer";
import { useQueryClient } from "react-query";
import Tooltip from "@mui/material/Tooltip";
import TimerText from "../common/timertext";
import DefaultTransition from "../common/defaulttransition";
import { cancelEventListQuery, getEventListQuery } from "src/hooks/queries/admin/events";
import NewEventModal from "./NewEventModal";
import { newEventModalAction } from "src/store/reducers/modalReducer";
import { getDashboardQuery } from "src/hooks/queries/admin/dashboard";

function Dashboard() {
  const { isLoading: loading, isFetching: fetching, isError: error, data: data, refetch } = getDashboardQuery(() => setLoadingButton(true));
  const [LoadingButtonOn, setLoadingButton] = useState(false);
  const loading_status = fetching && !loading;
  return (
    <>
      <Div wFull flex flexCol>
        <Div mt15 mb10 selfCenter flex flexRow wFull justifyEnd>
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
            {data &&
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
        {data?.success && <DataCharts data={data?.data} />}
        {error ||
          (data && !data.success && (
            <Div fontSize20 mb100 textStart maxW={1100} mxAuto>
              오류가 발생하였습니다. 다시 시도하여 주세요.
            </Div>
          ))}
      </Div>
    </>
  );
}

function DataCharts({ data }) {
  return (
    <Div mb100 wFull bgWhite flex flexRow justifyCenter>
      <Div style={{ width: "33.3%" }} flex flexCol justifyCenter>
        <Total data={data} />
      </Div>
      <Div style={{ width: "33.3%" }} flex flexCol justifyCenter></Div>
      <Div style={{ width: "33.3%" }} flex flexCol justifyCenter></Div>
    </Div>
  );
}

function Total({ data }) {
  const nftCount = data?.nft_count;
  const walletCount = data?.wallet_count;
  const Value = ({ text, value }) => {
    return (
      <Div flex flexRow wFull justifyCenter fontSize15>
        <Div whitespaceNowrap>{text}</Div>
        <Div wFull />
        <Div whitespaceNowrap fontBold>
          {value}
        </Div>
      </Div>
    );
  };
  return (
    <Div wFull bgGray100 px30 py10 textCenter roundedLg flex flexCol justifyCenter>
      <Value text={"총 NFT 개수 :"} value={nftCount} />
      <Value text={"총 Wallet 개수 :"} value={walletCount} />
    </Div>
  );
}

export default Dashboard;
