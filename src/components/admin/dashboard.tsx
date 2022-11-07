import Div from "src/components/Div";
import { useState } from "react";
import React from "react";
import { Oval } from "react-loader-spinner";
import { QuestionMarkCircleIcon, RefreshIcon } from "@heroicons/react/outline";
import Tooltip from "@mui/material/Tooltip";
import TimerText from "../common/timertext";
import { getDashboardQuery } from "src/hooks/queries/admin/dashboard";
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip as RechartTooltip, Legend, ResponsiveContainer } from "recharts";
import { ProfileImage } from "../common/ImageHelper";
import ChartModal, { ChartModalType, useOpenChartModal } from "./ChartModal";

enum sortType {
  valueASC = 0,
  valueDESC = 1,
  alphabeticalASC = 2,
  alphabeticalDESC = 3,
}
enum showType {
  nft = 0,
  events = 1,
  posts = 2,
  donations = 3,
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

function DataCharts({ data }) {
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
          <CollectionsChart data={data?.count_by_collections} />
        </Theme>
      </Container>
    </Div>
  );
}

export function CollectionsChart({ data, summerize = true }) {
  const dataArray = data ? data : [];
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Div bgWhite px5 py2 bgOpacity50 flex flexCol rounded>
          <Div flex flexRow gapX={10}>
            <Div selfCenter>
              <ProfileImage nft={{ image_uri: payload[0].payload.image_uri }} resize={true} rounded={true} width={40} height={40} />
            </Div>
            {(show == showType.nft || show == showType.donations) && (
              <>
                <Div selfCenter fontBold>
                  {payload[0].payload.name}:
                </Div>
                <Div selfCenter>
                  {payload[0].value ? payload[0].value : 0}
                  {show == showType.nft ? "개" : "Klay"}
                </Div>
              </>
            )}
            {(show == showType.events || show == showType.posts) && (
              <Div selfCenter fontBold>
                {payload[0].payload.name}
              </Div>
            )}
          </Div>
          {show == showType.events && (
            <>
              {select[0] && <Div selfCenter wFull textRight>{`이벤트: ${payload[0].payload.event_count ? payload[0].payload.event_count : 0}개`}</Div>}
              {select[1] && (
                <Div selfCenter wFull textRight>{`공지: ${payload[0].payload.notification_count ? payload[0].payload.notification_count : 0}개`}</Div>
              )}
            </>
          )}
          {show == showType.posts && (
            <>
              {select[0] && <Div selfCenter wFull textRight>{`게시글: ${payload[0].payload.post_count ? payload[0].payload.post_count : 0}개`}</Div>}
              {select[1] && <Div selfCenter wFull textRight>{`댓글: ${payload[0].payload.comment_count ? payload[0].payload.comment_count : 0}개`}</Div>}
            </>
          )}
        </Div>
      );
    }

    return null;
  };
  const nftCount = (a, b) => (a?.nft_count ? a?.nft_count : 0) - (b?.nft_count ? b?.nft_count : 0);
  const donationCount = (a, b) => (a?.donation_sum ? a?.donation_sum : 0) - (b?.donation_sum ? b?.donation_sum : 0);
  const eventCount = (condition, a, b) => (condition ? (a?.event_count ? a?.event_count : 0) - (b?.event_count ? b?.event_count : 0) : 0);
  const noficationCount = (condition, a, b) =>
    condition ? (a?.notification_count ? a?.notification_count : 0) - (b?.notification_count ? b?.notification_count : 0) : 0;
  const postCount = (condition, a, b) => (condition ? (a?.post_count ? a?.post_count : 0) - (b?.post_count ? b?.post_count : 0) : 0);
  const commentCount = (condition, a, b) => (condition ? (a?.comment_count ? a?.comment_count : 0) - (b?.comment_count ? b?.comment_count : 0) : 0);
  const sortFunction = (a, b) => {
    if (sort == sortType.valueASC) {
      if (show == showType.nft) return nftCount(a, b);
      if (show == showType.events) return eventCount(select[0], a, b) + noficationCount(select[1], a, b);
      if (show == showType.posts) return postCount(select[0], a, b) + commentCount(select[1], a, b);
      if (show == showType.donations) return donationCount(a, b);
    }
    if (sort == sortType.valueDESC) {
      if (show == showType.nft) return nftCount(b, a);
      if (show == showType.events) return eventCount(select[0], b, a) + noficationCount(select[1], b, a);
      if (show == showType.posts) return postCount(select[0], b, a) + commentCount(select[1], b, a);
      if (show == showType.donations) return donationCount(b, a);
    }
    if (sort == sortType.alphabeticalASC) return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1;
    if (sort == sortType.alphabeticalDESC) return a.name.toLowerCase() < b.name.toLowerCase() ? 1 : -1;
    return 0;
  };
  const filterFunction = (entry) => {
    if (show == showType.nft) return entry?.nft_count != null;
    if (show == showType.events) return (select[0] && entry?.event_count != null) || (select[1] && entry?.notification_count != null);
    if (show == showType.posts) return (select[0] && entry?.post_count != null) || (select[1] && entry?.comment_count != null);
    if (show == showType.donations) return entry?.donation_sum != null;
  };

  const [sort, setSort] = useState<sortType>(sortType.valueDESC);
  const [show, setShow] = useState<showType>(showType.nft);
  const [select, setSelect] = useState([true, true]);
  const filteredDataArray = dataArray
    .filter(filterFunction)
    .sort(sortFunction)
    .slice(0, summerize ? 5 : data.length);
  const resetSelect = (doNext = null) => {
    setSelect([true, true]);
    doNext && doNext();
  };
  return (
    <Div h={summerize ? 200 : "50vh"} flex flexCol justifyCenter>
      <Div wFull flex flexRow justifyStart gapX={10} fontSize14 fontSemibold textCenter mb10>
        <Div flex flexRow justifyCenter rounded bgGray200 wFull={summerize}>
          <Div
            wFull
            px10={!summerize}
            cursorPointer
            py5
            roundedL
            clx="hover:bg-gray-400"
            bgGray400={show == showType.nft}
            onClick={() => resetSelect(() => setShow(showType.nft))}
          >
            NFT
          </Div>
          <Div
            wFull
            px10={!summerize}
            cursorPointer
            py5
            clx="hover:bg-gray-400"
            bgGray400={show == showType.events}
            onClick={() => resetSelect(() => setShow(showType.events))}
          >
            Event
          </Div>
          <Div
            wFull
            px10={!summerize}
            cursorPointer
            py5
            clx="hover:bg-gray-400"
            bgGray400={show == showType.posts}
            onClick={() => resetSelect(() => setShow(showType.posts))}
          >
            Social
          </Div>
          <Div
            wFull
            px10={!summerize}
            cursorPointer
            py5
            roundedR
            clx="hover:bg-gray-400"
            bgGray400={show == showType.donations}
            onClick={() => resetSelect(() => setShow(showType.donations))}
          >
            Donation
          </Div>
        </Div>
        {!summerize && (show == showType.events || show == showType.posts) && (
          <Div flex flexRow justifyCenter rounded bgBWLight>
            <Div
              px10
              cursorPointer
              py5
              roundedL
              textWhite={select[0]}
              bgBW={select[0]}
              onClick={
                select[1] && select[0]
                  ? () => setSelect([!select[0], select[1]])
                  : select[1]
                  ? () => setSelect([!select[0], select[1]])
                  : select[0] && (() => setSelect([!select[0], !select[1]]))
              }
            >
              {show == showType.events ? "이벤트" : "게시물"}
            </Div>
            <Div
              px10
              cursorPointer
              py5
              roundedR
              textWhite={select[1]}
              bgBW={select[1]}
              onClick={
                select[1] && select[0]
                  ? () => setSelect([select[0], !select[1]])
                  : select[0]
                  ? () => setSelect([select[0], !select[1]])
                  : select[1] && (() => setSelect([!select[0], !select[1]]))
              }
            >
              {show == showType.events ? "공지" : "댓글"}
            </Div>
          </Div>
        )}
        {!summerize && (
          <>
            <Div wFull />
            <Div
              selfCenter
              px5
              py5
              rounded
              clx="hover:bg-bw hover:text-white"
              cursorPointer
              bgBWLight={sort == sortType.alphabeticalASC || sort == sortType.alphabeticalDESC}
              bgBW={sort == sortType.valueASC || sort == sortType.valueDESC}
              textWhite={sort == sortType.valueASC || sort == sortType.valueDESC}
              onClick={sort == sortType.valueASC ? () => setSort(sortType.valueDESC) : () => setSort(sortType.valueASC)}
            >
              {sort == sortType.valueDESC ? "내림차순" : "오름차순"}
            </Div>
            <Div
              selfCenter
              px5
              py5
              rounded
              clx="hover:bg-bw hover:text-white"
              cursorPointer
              bgBWLight={sort == sortType.valueASC || sort == sortType.valueDESC}
              bgBW={sort == sortType.alphabeticalASC || sort == sortType.alphabeticalDESC}
              textWhite={sort == sortType.alphabeticalASC || sort == sortType.alphabeticalDESC}
              onClick={sort == sortType.alphabeticalASC ? () => setSort(sortType.alphabeticalDESC) : () => setSort(sortType.alphabeticalASC)}
            >
              {sort == sortType.alphabeticalDESC ? "zyx..." : "abc..."}
            </Div>
          </>
        )}
      </Div>

      <ResponsiveContainer width="100%">
        <BarChart
          width={500}
          height={300}
          data={filteredDataArray}
          margin={{
            top: 5,
            right: 30,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="symbol" />
          <YAxis />
          <RechartTooltip content={CustomTooltip} />
          {show == showType.nft && <Bar dataKey="nft_count" fill="#8884d8" />}
          {show == showType.events && (
            <>
              {select[0] && <Bar dataKey="event_count" stackId="a" fill="#8884d8" />}
              {select[1] && <Bar dataKey="notification_count" stackId="a" fill="#82ca9d" />}
            </>
          )}
          {show == showType.posts && (
            <>
              {select[0] && <Bar dataKey="post_count" stackId="a" fill="#8884d8" />}
              {select[1] && <Bar dataKey="comment_count" stackId="a" fill="#82ca9d" />}
            </>
          )}
          {show == showType.donations && <Bar dataKey="donation_sum" fill="#8884d8" />}
        </BarChart>
      </ResponsiveContainer>
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
        <Div wFull cursorPointer py5 clx="hover:bg-gray-400" bgGray400={show == showType.events} onClick={() => setShow(showType.events)}>
          Event
        </Div>
        <Div wFull cursorPointer py5 roundedR clx="hover:bg-gray-400" bgGray400={show == showType.posts} onClick={() => setShow(showType.posts)}>
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
        {show == showType.events && (
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
        {show == showType.posts && (
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
