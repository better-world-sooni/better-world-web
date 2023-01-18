import Div from "src/components/Div";
import { useState } from "react";
import React from "react";
import { Oval } from "react-loader-spinner";
import { QuestionMarkCircleIcon, RefreshIcon } from "@heroicons/react/outline";
import Tooltip from "@mui/material/Tooltip";
import TimerText from "../common/timertext";
import { getDashboardQuery } from "src/hooks/queries/admin/dashboard";
import { ResponsiveContainer, AreaChart, Area, Tooltip as RechartTooltip } from "recharts";
import ChartModal, { ChartModalType, useOpenChartModal } from "./ChartModal";
import CollectionsChart from "../common/CollectionChart";
import useCheckPrivilege from "src/hooks/useCheckPrivilege";
import { IMAGES } from "src/modules/images";
import KeyMetric from "../common/KeyMetric";

export enum sortType {
  valueASC = 0,
  valueDESC = 1,
  alphabeticalASC = 2,
  alphabeticalDESC = 3,
}
export enum showType {
  nft = 0,
  event = 1,
  social = 2,
}

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
      <ChartModal />
    </>
  );
}

function TotalComponent({ data }) {
  return (
    <Div rounded h80 wFull mx5 style={{ backgroundColor: "#F3F6FD" }} px10 py10>
      <Div flex flexRow justifyStart>
        <Div imgTag src={data.image} h15 w15 overflowHidden mr8 fontSemiBold />
        <Div selfCenter textGray500 fontSize13 whitespaceNowrap>
          {data.text}
        </Div>
      </Div>
      <Div wFull flex flexRow justifyStart hFull>
        <Div selfCenter clx="text-bw" fontSize24 fontBold whitespaceNowrap mb5>
          {data.value}
        </Div>
      </Div>
    </Div>
  );
}

function DateComponent({ data, isLast = false }) {
  const cum = data?.values?.cum;
  const value = data?.values?.value;
  const lastDayValue = cum ? (cum[cum.length - 2].value as number) : 0;
  const todayValue = cum ? (cum[cum.length - 1].value as number) : 0;
  const difference = lastDayValue != 0 ? ((todayValue - lastDayValue) / lastDayValue).toFixed(2) : (null as number);
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Div bgWhite px5 py2 bgOpacity90 flex flexCol rounded>
          <Div selfCenter wFull fontSize13 textGray600>
            {payload[0].payload.date}
          </Div>
          <Div selfCenter wFull fontSize14 textGray800>
            {data.text + ": "}
            <Div spanTag fontBold textBlack>
              {payload[0].payload.value}
            </Div>
          </Div>
        </Div>
      );
    }

    return null;
  };
  return (
    <Div rounded h80 wFull px10 py10 flex flexRow borderB2={!isLast}>
      <Div flex flexCol selfCenter style={{ width: "40%" }}>
        <Div flex flexRow justifyStart>
          <Div selfCenter textGray600 fontSize13 whitespaceNowrap>
            {data.text}
          </Div>
        </Div>
        <Div wFull flex flexRow justifyStart hFull gapX={10}>
          <Div selfEnd fontSize24 fontBold whitespaceNowrap>
            {todayValue}
          </Div>
          <Div
            selfEnd
            fontSize16
            whitespaceNowrap
            mb5
            fontBold
            textGray500={!difference || difference == 0}
            textSuccess={difference && difference > 0}
            textDanger={difference && difference < 0}
          >
            {difference && difference != 0 ? (difference > 0 ? "+" : "-") + difference + "%" : "-%"}
          </Div>
        </Div>
      </Div>
      <Div flex flexCol selfCenter hFull style={{ width: "60%" }}>
        <Div hFull wFull py10>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={value}>
              <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6953FF" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#6953FF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="value" stroke="#6953FF" fillOpacity={1} fill="url(#colorUv)" />
              <RechartTooltip content={CustomTooltip} />
            </AreaChart>
          </ResponsiveContainer>
        </Div>
      </Div>
    </Div>
  );
}

function DataCharts({ data }) {
  const { isPrivilege, isSuperPrivilege } = useCheckPrivilege();
  const Theme = (props) => {
    return (
      <Div wFull bgGray100 px5 py5 roundedLg flex flexCol justifyCenter overflowHidden>
        <Div wFull mb10 flex flexRow>
          <Div textLeft fontSize18 fontBold whitespaceNowrap>
            {props.name}
          </Div>
          <Div wFull />
          {props.onClickDetails && (
            <Div textGray600 selfCenter textLeft fontSize12 fontBold whitespaceNowrap onClick={props.onClickDetails} cursorPointer>
              {"자세히 >"}
            </Div>
          )}
        </Div>
        {props.children}
      </Div>
    );
  };
  const Container = (props) => {
    return (
      <Div style={{ width: (props?.number ? props?.number : 32) + "%" }} flex flexCol justifyStart gapY={"1.5vw"}>
        {props.children}
      </Div>
    );
  };
  const openChartModal = useOpenChartModal;
  const openNftByCollection = openChartModal(ChartModalType.NFT_BY_COLLECTIONS, data?.count_by_collections, "Collection별 통계");
  const openDay = openChartModal(ChartModalType.DAY, data?.count_by_collections, "날짜별 통계");
  const total = data?.total;
  const days = data?.date;
  const summary = [
    { image: IMAGES.dashboard.nft, text: "Total NFT", value: total?.nft_count ? total?.nft_count : 0 },
    { image: IMAGES.dashboard.wallet, text: "Total Wallet", value: total?.wallet_count ? total?.wallet_count : 0 },
    // { image: IMAGES.dashboard.collection, text: "Total Collections", value: total?.nft_collection_count ? total?.nft_collection_count : 0 },
    { image: IMAGES.dashboard.event, text: "Total Events", value: total?.event_count ? total?.event_count : 0 },
    { image: IMAGES.dashboard.announcement, text: "Total Announcements", value: total?.notification_count ? total?.notification_count : 0 },
  ];
  const date = [
    { text: "Holders", values: { cum: days?.holders_cum, value: days?.holders } },
    { text: "Event Views", values: { cum: days?.event_views_cum, value: days?.event_views } },
    { text: "Event entry rate", values: { cum: days?.event_entry_rate_cum, value: days?.event_entry_rate } },
  ];
  if (!isSuperPrivilege)
    return (
      <Div mb100 wFull bgWhite flex flexCol justifyCenter gapY={10}>
        <Div wFull flex flexRow>
          {summary.map((value, key) => (
            <TotalComponent key={key} data={value} />
          ))}
        </Div>
        <Div wFull flex flexRow gapX={10}>
          <KeyMetric />
          <Div minW={300} flex flexCol mr10>
            {date.map((value, key) => (
              <DateComponent key={key} data={value} isLast={date.length - 1 == key} />
            ))}
          </Div>
        </Div>
      </Div>
    );
  return (
    <Div mb100 wFull bgWhite flex flexRow justifyCenter gapX={"2%"}>
      <Container>
        <Theme name="Total">
          <Total data={data?.total} />
        </Theme>
        <Theme name="Details">
          <DetailedTotal data={data?.details} />
        </Theme>
      </Container>
      <Container number={66}>
        <Theme name="Collection별 통계" onClickDetails={openNftByCollection}>
          <CollectionsChart data={data?.count_by_collections} showNow={true} />
        </Theme>
        <Theme name="날짜별 통계" onClickDetails={openDay}>
          <TimeChart showNow={false} />
        </Theme>
      </Container>
    </Div>
  );
}

export function TimeChart({ summerize = true, showNow = true }) {
  return (
    <Div h={summerize ? 200 : "50vh"} flex flexCol justifyCenter textCenter>
      구성 중입니다.
    </Div>
  );
}

function Total({ data }) {
  const nftCount = data?.nft_count || 0;
  const nftCountNotNull = data?.nft_count_uniq || 0;
  const walletCount = data?.wallet_count || 0;
  const walletCountNotNull = data?.wallet_count_uniq || 0;
  const eventCount = data?.event_count || 0;
  const nftCollectionCount = data?.nft_collection_count || 0;
  const notificationCount = data?.notification_count || 0;
  const nftByCollectionCount = data?.nft_collection_count_uniq || 0;
  const eventApplicationCount = data?.event_application_count || 0;
  const postCount = data?.post_count || 0;
  const commentCount = data?.comment_count || 0;
  const donationSum = data?.donation_sum || 0;
  const hugCount = data?.hug_count || 0;

  return (
    <Div wFull px25 py5 textCenter flex flexCol justifyCenter>
      <Value text={"총 NFT 개수"} value={nftCount} value2={nftCountNotNull} help={"Betterworld에 등록된 누적 NFT 개수"} />
      <Value text={"총 Wallet 개수"} value={walletCount} value2={walletCountNotNull} help={"Betterworld에 등록된 누적 Wallet 개수"} />
      <Value
        text={"총 Collection 개수"}
        value={nftCollectionCount}
        value2={nftByCollectionCount}
        mb={true}
        help={"Betterworld에 가입 가능한 NFT Collection 개수"}
      />
      <Value text={"총 Event 개수"} value={eventCount} />
      <Value text={"총 공지 개수"} value={notificationCount} />
      <Value text={"작성된 누적 응모 개수"} value={eventApplicationCount} mb={true} help={"Betterworld에서 작성된 누적 응모 개수"} />
      <Value text={"총 게시물 개수"} value={postCount} />
      <Value text={"총 댓글 개수"} value={commentCount} />
      <Value text={"총 Hug 개수"} value={hugCount} />
      <Value text={"총 누적 후원"} value={`${donationSum} Klay`} help={"Betterworld에서 후원된 누적 Klay 총액"} />
    </Div>
  );
}

function DetailedTotal({ data }) {
  const nftCount = data?.nft?.nft_count || 0;
  const nftCountNotNull = data?.nft?.nft_count_uniq || 0;
  const walletCount = data?.nft?.wallet_count || 0;
  const walletCountNotNull = data?.nft?.wallet_count_uniq || 0;
  const nftCollectionCount = data?.nft?.nft_collection_count || 0;
  const nftByCollectionCount = data?.nft?.nft_collection_count_uniq || 0;

  const eventCount = data?.event?.event_count || 0;
  const eventReadSum = data?.event?.event_read_sum || 0;
  const inProgressEventCount = data?.event?.in_progress_event_count || 0;
  const announcedEventCount = data?.event?.announced_event_count || 0;
  const finishedEventCount = data?.event?.finished_event_count || 0;

  const notificationCount = data?.event?.notification_count || 0;
  const notificationSum = data?.event?.notification_read_sum || 0;

  const eventApplicationCount = data?.event?.event_application_count || 0;
  const appliedEventApplicationCount = data?.event?.applied_event_application_count || 0;
  const selectedEventApplicationCount = data?.event?.selected_event_application_count || 0;
  const receivedEventApplicationCount = data?.event?.received_event_application_count || 0;

  const postCount = data?.post?.post_count || 0;
  const postLikedCount = data?.post?.post_like_count || 0;
  const repostCount = data?.post?.repost_post_count || 0;
  const commentCount = data?.post?.comment_count || 0;
  const commentLikedCount = data?.post?.comment_like_count || 0;
  const hugCount = data?.post?.hug_count || 0;
  const donationSum = data?.post?.donation_sum || 0;
  const [show, setShow] = useState<showType>(showType.nft);
  return (
    <Div wFull textCenter flex flexCol justifyCenter>
      <Div flex flexRow justifyCenter rounded bgGray200 wFull mb10>
        <Div wFull cursorPointer py5 roundedL clx="hover:bg-gray-400" bgGray400={show == showType.nft} onClick={() => setShow(showType.nft)}>
          NFT
        </Div>
        <Div wFull cursorPointer py5 clx="hover:bg-gray-400" bgGray400={show == showType.event} onClick={() => setShow(showType.event)}>
          Event
        </Div>
        <Div wFull cursorPointer py5 roundedR clx="hover:bg-gray-400" bgGray400={show == showType.social} onClick={() => setShow(showType.social)}>
          Social
        </Div>
      </Div>
      <Div wFull flex flexCol justifyCenter px25 py5>
        {show == showType.nft && (
          <>
            <Value text={"총 NFT 개수"} value={nftCount} help={"Betterworld에 등록된 누적 NFT 개수"} />
            <Value text={"활동 NFT 개수"} value={nftCountNotNull} help={"Betterworld에 활동 중인 NFT 개수"} />
            <Value text={"휴면 NFT 개수"} value={nftCount - nftCountNotNull} help={"Betterworld에 등록되어있으나 활동하지 않는 NFT 개수"} mb={true} />
            <Value text={"총 Wallet 개수"} value={walletCount} help={"Betterworld에 등록된 누적 Wallet 개수"} />
            <Value text={"활동 Wallet 개수"} value={walletCountNotNull} help={"Betterworld에 활동 중인 Wallet 개수"} />
            <Value
              text={"휴면 Wallet 개수"}
              value={walletCount - walletCountNotNull}
              help={"Betterworld에 등록되어있으나 연결된 NFT가 없는 Wallet 개수"}
              mb={true}
            />
            <Value text={"총 Collection 개수"} value={nftCollectionCount} help={"Betterworld에 가입 가능한 NFT Collection 개수"} />
            <Value text={"활동 Collection 개수"} value={nftByCollectionCount} help={"Betterworld에 등록된 NFT가 있는 NFT Collection 개수"} />
            <Value
              text={"활동하지 않는 Collection 개수"}
              value={nftCollectionCount - nftByCollectionCount}
              help={"Betterworld에 가입 가능하지만, 등록된 NFT가 없는 Collection 개수"}
            />
          </>
        )}
        {show == showType.event && (
          <>
            <Value text={"총 Event 개수"} value={eventCount} />
            <Value text={"총 Event 조회수"} value={eventReadSum} help={"Betterworld의 Event 조회수 총합"} />
            <Value text={"진행 중인 Event 개수"} value={inProgressEventCount} />
            <Value text={"당첨 발표된 Event 개수"} value={announcedEventCount} />
            <Value text={"마감된 Event 개수"} value={finishedEventCount} mb={true} />

            <Value text={"총 공지 개수"} value={notificationCount} />
            <Value text={"총 공지 조회수"} value={notificationSum} help={"Betterworld의 공지 조회수 총합"} mb={true} />

            <Value text={"작성된 누적 응모 개수"} value={eventApplicationCount} help={"Betterworld에서 작성된 누적 응모 개수"} />
            <Value text={"총 응모 개수"} value={appliedEventApplicationCount} help={"Betterworld에서 응모된 누적 응모 개수"} />
            <Value text={"총 당첨 응모 개수"} value={selectedEventApplicationCount} />
            <Value text={"총 수령 응모 개수"} value={receivedEventApplicationCount} />
          </>
        )}
        {show == showType.social && (
          <>
            <Value text={"총 게시물 개수"} value={postCount} />
            <Value text={"게시물 누적 좋아요 개수"} value={postLikedCount} />
            <Value text={"리포스트한 게시물 개수"} value={repostCount} mb={true} />
            <Value text={"총 댓글 개수"} value={commentCount} />
            <Value text={"댓글 누적 좋아요 개수"} value={commentLikedCount} mb={true} />
            <Value text={"총 Hug 개수"} value={hugCount} />
            <Value text={"총 누적 후원"} value={`${donationSum} Klay`} help={"Betterworld에서 후원된 누적 Klay 총액"} />
          </>
        )}
      </Div>
    </Div>
  );
}

const Value = ({ text, value, value2 = null, mb = false, help = null }) => {
  return (
    <Div flex flexRow wFull justifyCenter fontSize15 mb={mb ? 10 : 0}>
      <Div whitespaceNowrap mr5={help}>
        {text}
      </Div>
      {help && (
        <Tooltip title={help} arrow>
          <Div selfCenter>
            <QuestionMarkCircleIcon height={16} width={16} className="max-h-16 max-w-16 mb-2" />
          </Div>
        </Tooltip>
      )}
      <Div whitespaceNowrap>{" :"}</Div>
      <Div wFull />
      <Div whitespaceNowrap fontBold>
        {!value2 && (value ? value : 0)}
        {value2 && `${value ? value : 0} (${value2 ? value2 : 0})`}
      </Div>
    </Div>
  );
};

export default Dashboard;
