import Div from "src/components/Div";
import { useState } from "react";
import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartTooltip, ResponsiveContainer, Legend } from "recharts";
import { ProfileImage } from "../common/ImageHelper";
import { showType } from "../admin/dashboard";
import { sortType } from "../admin/dashboard";

const uniqueNftCount = (condition, a, b) => (condition ? (a?.nft_count_uniq ? a?.nft_count_uniq : 0) - (b?.nft_count_uniq ? b?.nft_count_uniq : 0) : 0);
const sleepNftCount = (condition, a, b) => (condition ? (a?.nft_count_sleep ? a?.nft_count_sleep : 0) - (b?.nft_count_sleep ? b?.nft_count_sleep : 0) : 0);
const followCount = (condition, a, b) => (condition ? (a?.follow_count ? a?.follow_count : 0) - (b?.follow_count ? b?.follow_count : 0) : 0);

const eventCount = (condition, a, b) => (condition ? (a?.event_count ? a?.event_count : 0) - (b?.event_count ? b?.event_count : 0) : 0);
const noficationCount = (condition, a, b) =>
  condition ? (a?.notification_count ? a?.notification_count : 0) - (b?.notification_count ? b?.notification_count : 0) : 0;
const inProgessEventCount = (condition, a, b) =>
  condition ? (a?.in_progress_event_count ? a?.in_progress_event_count : 0) - (b?.in_progress_event_count ? b?.in_progress_event_count : 0) : 0;
const announcedEventCount = (condition, a, b) =>
  condition ? (a?.announced_event_count ? a?.announced_event_count : 0) - (b?.announced_event_count ? b?.announced_event_count : 0) : 0;
const finishedEventCount = (condition, a, b) =>
  condition ? (a?.finished_event_count ? a?.finished_event_count : 0) - (b?.finished_event_count ? b?.finished_event_count : 0) : 0;
const appliedEventApplicationCount = (condition, a, b) =>
  condition
    ? (a?.applied_event_application_count ? a?.applied_event_application_count : 0) -
      (b?.applied_event_application_count ? b?.applied_event_application_count : 0)
    : 0;
const selectedEventApplicationCount = (condition, a, b) =>
  condition
    ? (a?.selected_event_application_count ? a?.selected_event_application_count : 0) -
      (b?.selected_event_application_count ? b?.selected_event_application_count : 0)
    : 0;
const receivedEventApplicationCount = (condition, a, b) =>
  condition
    ? (a?.received_event_application_count ? a?.received_event_application_count : 0) -
      (b?.received_event_application_count ? b?.received_event_application_count : 0)
    : 0;
const eventReadCount = (condition, a, b) => (condition ? (a?.event_read_count ? a?.event_read_count : 0) - (b?.event_read_count ? b?.event_read_count : 0) : 0);
const notificationCount = (condition, a, b) =>
  condition ? (a?.notification_read_count ? a?.notification_read_count : 0) - (b?.notification_read_count ? b?.notification_read_count : 0) : 0;

const postCount = (condition, a, b) => (condition ? (a?.post_count ? a?.post_count : 0) - (b?.post_count ? b?.post_count : 0) : 0);
const postLikeCount = (condition, a, b) => (condition ? (a?.post_like_count ? a?.post_like_count : 0) - (b?.post_like_count ? b?.post_like_count : 0) : 0);
const repostCount = (condition, a, b) => (condition ? (a?.repost_count ? a?.repost_count : 0) - (b?.repost_count ? b?.repost_count : 0) : 0);
const commentCount = (condition, a, b) => (condition ? (a?.comment_count ? a?.comment_count : 0) - (b?.comment_count ? b?.comment_count : 0) : 0);
const commentLikeCount = (condition, a, b) =>
  condition ? (a?.comment_like_count ? a?.comment_like_count : 0) - (b?.comment_like_count ? b?.comment_like_count : 0) : 0;
const donationSum = (condition, a, b) => (condition ? (a?.donation_sum ? a?.donation_sum : 0) - (b?.donation_sum ? b?.donation_sum : 0) : 0);
const hugCount = (condition, a, b) => (condition ? (a?.hug_count ? a?.hug_count : 0) - (b?.hug_count ? b?.hug_count : 0) : 0);

export default function CollectionsChart({ data, summerize = true, showNow = true }) {
  const dataArray = data ? data : [];
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Div bgWhite px5 py2 bgOpacity50 flex flexCol rounded>
          <Div flex flexRow gapX={10}>
            <Div selfCenter>
              <ProfileImage nft={{ image_uri: payload[0].payload.image_uri }} resize={true} rounded={true} width={40} height={40} />
            </Div>
            <Div selfCenter fontBold>
              {payload[0].payload.name}
            </Div>
          </Div>
          {show == showType.nft && (
            <>
              {option == 0 && select[0] && select[1] && (
                <Div selfCenter wFull textRight>{`전체 NFT: ${
                  (payload[0].payload.nft_count_uniq ? payload[0].payload.nft_count_uniq : 0) +
                  (payload[0].payload.nft_count_sleep ? payload[0].payload.nft_count_sleep : 0)
                }개`}</Div>
              )}
              {option == 0 && select[0] && (
                <Div selfCenter wFull textRight>{`활동 NFT: ${payload[0].payload.nft_count_uniq ? payload[0].payload.nft_count_uniq : 0}개`}</Div>
              )}
              {option == 0 && select[1] && (
                <Div selfCenter wFull textRight>{`휴면 NFT: ${payload[0].payload.nft_count_sleep ? payload[0].payload.nft_count_sleep : 0}개`}</Div>
              )}
              {option == 1 && <Div selfCenter wFull textRight>{`팔로워: ${payload[0].payload.follow_count ? payload[0].payload.follow_count : 0}`}</Div>}
            </>
          )}
          {show == showType.event && (
            <>
              {option == 0 && select[1] && (
                <Div selfCenter wFull textRight>{`공지: ${payload[0].payload.notification_count ? payload[0].payload.notification_count : 0}개`}</Div>
              )}
              {option == 0 && select[0] && (
                <Div selfCenter wFull textRight>{`이벤트: ${payload[0].payload.event_count ? payload[0].payload.event_count : 0}개`}</Div>
              )}
              {option == 1 && select[0] && select[1] && (
                <Div selfCenter wFull textRight>{`총 조회수: ${
                  (payload[0].payload.event_read_count ? payload[0].payload.event_read_count : 0) +
                  (payload[0].payload.notification_read_count ? payload[0].payload.notification_read_count : 0)
                }개`}</Div>
              )}
              {option == 1 && select[0] && (
                <Div selfCenter wFull textRight>{`이벤트 조회수: ${payload[0].payload.event_read_count ? payload[0].payload.event_read_count : 0}개`}</Div>
              )}
              {option == 1 && select[1] && (
                <Div selfCenter wFull textRight>{`공지 조회수: ${
                  payload[0].payload.notification_read_count ? payload[0].payload.notification_read_count : 0
                }개`}</Div>
              )}
              {option == 2 && select[0] && select[1] && select[2] && (
                <Div selfCenter wFull textRight>{`총 이벤트: ${payload[0].payload.event_count ? payload[0].payload.event_count : 0}개`}</Div>
              )}
              {option == 2 && select[0] && (
                <Div selfCenter wFull textRight>{`진행 중인 이벤트: ${
                  payload[0].payload.in_progress_event_count ? payload[0].payload.in_progress_event_count : 0
                }개`}</Div>
              )}
              {option == 2 && select[1] && (
                <Div selfCenter wFull textRight>{`당첨 발표된 이벤트: ${
                  payload[0].payload.announced_event_count ? payload[0].payload.announced_event_count : 0
                }개`}</Div>
              )}
              {option == 2 && select[2] && (
                <Div selfCenter wFull textRight>{`마감된 이벤트: ${
                  payload[0].payload.finished_event_count ? payload[0].payload.finished_event_count : 0
                }개`}</Div>
              )}
              {option == 3 && select[0] && select[1] && select[2] && (
                <Div selfCenter wFull textRight>{`총 응모기록: ${
                  payload[0].payload.event_application_count ? payload[0].payload.event_application_count : 0
                }개`}</Div>
              )}
              {option == 3 && select[0] && (
                <Div selfCenter wFull textRight>{`응모기록: ${
                  payload[0].payload.applied_event_application_count ? payload[0].payload.applied_event_application_count : 0
                }개`}</Div>
              )}
              {option == 3 && select[1] && (
                <Div selfCenter wFull textRight>{`당첨된 응모기록: ${
                  payload[0].payload.selected_event_application_count ? payload[0].payload.selected_event_application_count : 0
                }개`}</Div>
              )}
              {option == 3 && select[2] && (
                <Div selfCenter wFull textRight>{`수령완료된 응모기록: ${
                  payload[0].payload.received_event_application_count ? payload[0].payload.received_event_application_count : 0
                }개`}</Div>
              )}
            </>
          )}
          {show == showType.social && (
            <>
              {option == 0 && select[0] && !select[2] && (
                <Div selfCenter wFull textRight>{`총 게시글 작성: ${payload[0].payload.post_count ? payload[0].payload.post_count : 0}개`}</Div>
              )}
              {option == 0 && select[0] && select[2] && (
                <Div selfCenter wFull textRight>{`총 게시글 작성: ${
                  (payload[0].payload.post_count ? payload[0].payload.post_count : 0) + (payload[0].payload.repost_count ? payload[0].payload.repost_count : 0)
                }개`}</Div>
              )}
              {option == 0 && select[1] && (
                <Div selfCenter wFull textRight>{`총 댓글 작성: ${payload[0].payload.comment_count ? payload[0].payload.comment_count : 0}개`}</Div>
              )}
              {option == 0 && select[0] && select[2] && (
                <Div selfCenter wFull textRight>{`총 리포스트 게시글 작성: ${payload[0].payload.repost_count ? payload[0].payload.repost_count : 0}개`}</Div>
              )}
              {option == 1 && select[0] && select[1] && (
                <Div selfCenter wFull textRight>{`총 좋아요 표현: ${
                  (payload[0].payload.post_like_count ? payload[0].payload.post_like_count : 0) +
                  (payload[0].payload.comment_like_count ? payload[0].payload.comment_like_count : 0)
                }개`}</Div>
              )}
              {option == 1 && select[0] && (
                <Div selfCenter wFull textRight>{`총 게시글 좋아요 표현: ${
                  payload[0].payload.post_like_count ? payload[0].payload.post_like_count : 0
                }개`}</Div>
              )}
              {option == 1 && select[1] && (
                <Div selfCenter wFull textRight>{`총 댓글 좋아요 표현: ${
                  payload[0].payload.comment_like_count ? payload[0].payload.comment_like_count : 0
                }개`}</Div>
              )}
              {option == 2 && (
                <Div selfCenter wFull textRight>{`총 후원 합: ${payload[0].payload.donation_sum ? payload[0].payload.donation_sum : 0}Klay`}</Div>
              )}
              {option == 3 && <Div selfCenter wFull textRight>{`총 허그 횟수: ${payload[0].payload.hug_count ? payload[0].payload.hug_count : 0}회`}</Div>}
            </>
          )}
        </Div>
      );
    }

    return null;
  };
  const sortFunction = (a, b) => {
    if (sort == sortType.valueASC) {
      if (show == showType.nft)
        return uniqueNftCount(option == 0 && select[0], a, b) + sleepNftCount(option == 0 && select[1], a, b) + followCount(option == 1, a, b);
      if (show == showType.event)
        return (
          eventCount(option == 0 && select[0], a, b) +
          noficationCount(option == 0 && select[1], a, b) +
          eventReadCount(option == 1 && select[0], a, b) +
          notificationCount(option == 1 && select[1], a, b) +
          inProgessEventCount(option == 2 && select[0], a, b) +
          announcedEventCount(option == 2 && select[1], a, b) +
          finishedEventCount(option == 2 && select[2], a, b) +
          appliedEventApplicationCount(option == 3 && select[0], a, b) +
          selectedEventApplicationCount(option == 3 && select[1], a, b) +
          receivedEventApplicationCount(option == 3 && select[2], a, b)
        );
      if (show == showType.social)
        return (
          postCount(option == 0 && select[0], a, b) +
          commentCount(option == 0 && select[1], a, b) +
          repostCount(option == 0 && select[0] && select[2], a, b) +
          postLikeCount(option == 1 && select[0], a, b) +
          commentLikeCount(option == 1 && select[1], a, b) +
          donationSum(option == 2, a, b) +
          hugCount(option == 3, a, b)
        );
    }
    if (sort == sortType.valueDESC) {
      if (show == showType.nft)
        return uniqueNftCount(option == 0 && select[0], b, a) + sleepNftCount(option == 0 && select[1], b, a) + followCount(option == 1, b, a);
      if (show == showType.event)
        return (
          eventCount(option == 0 && select[0], b, a) +
          noficationCount(option == 0 && select[1], b, a) +
          eventReadCount(option == 1 && select[0], b, a) +
          notificationCount(option == 1 && select[1], b, a) +
          inProgessEventCount(option == 2 && select[0], b, a) +
          announcedEventCount(option == 2 && select[1], b, a) +
          finishedEventCount(option == 2 && select[2], b, a) +
          appliedEventApplicationCount(option == 3 && select[0], b, a) +
          selectedEventApplicationCount(option == 3 && select[1], b, a) +
          receivedEventApplicationCount(option == 3 && select[2], b, a)
        );
      if (show == showType.social)
        return (
          postCount(option == 0 && select[0], b, a) +
          commentCount(option == 0 && select[1], b, a) +
          repostCount(option == 0 && select[0] && select[2], b, a) +
          postLikeCount(option == 1 && select[0], b, a) +
          commentLikeCount(option == 1 && select[1], b, a) +
          donationSum(option == 2, b, a) +
          hugCount(option == 3, b, a)
        );
    }
    if (sort == sortType.alphabeticalASC) return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1;
    if (sort == sortType.alphabeticalDESC) return a.name.toLowerCase() < b.name.toLowerCase() ? 1 : -1;
    return 0;
  };
  const filterFunction = (entry) => {
    if (show == showType.nft)
      return (
        (option == 0 && select[0] && entry?.nft_count_uniq != null) ||
        (option == 0 && select[1] && entry?.nft_count_sleep != null) ||
        (option == 1 && entry?.follow_count != null)
      );
    if (show == showType.event)
      return (
        (option == 0 && select[0] && entry?.event_count != null) ||
        (option == 0 && select[1] && entry?.notification_count != null) ||
        (option == 1 && select[0] && entry?.event_read_count != null && entry?.event_read_count != 0) ||
        (option == 1 && select[1] && entry?.notification_read_count != null && entry?.notification_read_count != 0) ||
        (option == 2 && select[0] && entry?.in_progress_event_count != null) ||
        (option == 2 && select[1] && entry?.announced_event_count != null) ||
        (option == 2 && select[2] && entry?.finished_event_count != null) ||
        (option == 3 && select[0] && entry?.applied_event_application_count != null) ||
        (option == 3 && select[1] && entry?.selected_event_application_count != null) ||
        (option == 3 && select[2] && entry?.received_event_application_count != null)
      );
    if (show == showType.social)
      return (
        (option == 0 && select[0] && entry?.post_count != null) ||
        (option == 0 && select[1] && entry?.comment_count != null) ||
        (option == 0 && select[0] && select[2] && entry?.repost_count != null) ||
        (option == 1 && select[0] && entry?.post_like_count != null) ||
        (option == 1 && select[1] && entry?.comment_like_count != null) ||
        (option == 2 && entry?.donation_sum != null) ||
        (option == 3 && entry?.hug_count != null)
      );
  };
  const mpaFunction = (entry) => {
    if (option == 0 && select[2])
      return { ...entry, post_count: (entry?.post_count ? entry?.post_count : 0) - (entry?.repost_count ? entry?.repost_count : 0) };
    else return entry;
  };
  const [sort, setSort] = useState<sortType>(sortType.valueDESC);
  const [show, setShow] = useState<showType>(showType.nft);
  const [option, setOption] = useState(0);
  const [select, setSelect] = useState([true, true, true]);
  const filteredDataArray = dataArray
    .filter(filterFunction)
    .map(mpaFunction)
    .sort(sortFunction)
    .slice(0, summerize ? 5 : data.length);
  const resetOption = (doNext = null) => {
    setOption(0);
    setSelect([true, true, true]);
    doNext && doNext();
  };
  const resetSelect = (doNext = null) => {
    setSelect([true, true, true]);
    doNext && doNext();
  };

  if (!showNow) {
    return (
      <Div h={summerize ? 200 : "50vh"} flex flexCol justifyCenter textCenter>
        구성 중입니다.
      </Div>
    );
  }
  const clickSelect = (index) => {
    const three = (show == showType.event && option == 2) || (show == showType.event && option == 3);
    if ((index == 0 ? select[0] : !select[0]) && (index == 1 ? select[1] : !select[1]) && (!three ? !three : index == 2 ? select[2] : !select[2])) {
      setSelect([index == 0 ? false : true, index == 1 ? false : true, index == 2 ? false : true]);
      return;
    } else {
      setSelect([
        index == 0 ? !select[0] : select[0],
        index == 1 ? !select[1] : select[1],
        index == 2 ? !select[2] : show == showType.social && option == 0 && index == 0 ? true : select[2],
      ]);
      return;
    }
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
            onClick={() => resetOption(() => setShow(showType.nft))}
          >
            NFT
          </Div>
          <Div
            wFull
            px10={!summerize}
            cursorPointer
            py5
            clx="hover:bg-gray-400"
            bgGray400={show == showType.event}
            onClick={() => resetOption(() => setShow(showType.event))}
          >
            Event
          </Div>
          <Div
            wFull
            px10={!summerize}
            cursorPointer
            py5
            roundedR
            clx="hover:bg-gray-400"
            bgGray400={show == showType.social}
            onClick={() => resetOption(() => setShow(showType.social))}
          >
            Social
          </Div>
        </Div>
        {!summerize && (
          <Div flex flexRow justifyCenter rounded bgBWLight>
            <Div px10 cursorPointer py5 roundedL whitespaceNowrap textWhite={option == 0} bgBW={option == 0} onClick={() => resetSelect(() => setOption(0))}>
              {show == showType.nft && "NFT"}
              {show == showType.event && "Total"}
              {show == showType.social && "Total"}
            </Div>
            <Div
              px10
              cursorPointer
              py5
              roundedR={show == showType.nft}
              whitespaceNowrap
              textWhite={option == 1}
              bgBW={option == 1}
              onClick={() => resetSelect(() => setOption(1))}
            >
              {show == showType.nft && "팔로워"}
              {show == showType.event && "조회수"}
              {show == showType.social && "좋아요 수"}
            </Div>
            {(show == showType.event || show == showType.social) && (
              <Div px10 cursorPointer py5 whitespaceNowrap textWhite={option == 2} bgBW={option == 2} onClick={() => resetSelect(() => setOption(2))}>
                {show == showType.event && "이벤트"}
                {show == showType.social && "후원"}
              </Div>
            )}
            {(show == showType.event || show == showType.social) && (
              <Div px10 cursorPointer py5 roundedR whitespaceNowrap textWhite={option == 3} bgBW={option == 3} onClick={() => resetSelect(() => setOption(3))}>
                {show == showType.event && "응모"}
                {show == showType.social && "허그"}
              </Div>
            )}
          </Div>
        )}
        {!summerize &&
          ((show == showType.nft && option == 0) ||
            (show == showType.event && option == 0) ||
            (show == showType.event && option == 1) ||
            (show == showType.event && option == 2) ||
            (show == showType.event && option == 3) ||
            (show == showType.social && option == 0) ||
            (show == showType.social && option == 1)) && (
            <>
              <Div flex flexRow justifyCenter rounded bgBWLight>
                <Div px10 cursorPointer py5 roundedL whitespaceNowrap textWhite={select[0]} bgBW={select[0]} onClick={() => clickSelect(0)}>
                  {option == 0 && show == showType.nft && "활동 NFT"}
                  {option == 0 && show == showType.event && "이벤트"}
                  {option == 1 && show == showType.event && "이벤트 조회수"}
                  {option == 2 && show == showType.event && "진행 중인 이벤트"}
                  {option == 3 && show == showType.event && "응모 완료된 응모기록"}
                  {option == 0 && show == showType.social && "게시글"}
                  {option == 1 && show == showType.social && "게시글"}
                </Div>
                <Div
                  px10
                  cursorPointer
                  py5
                  roundedR={!((show == showType.event && option == 2) || (show == showType.event && option == 3))}
                  whitespaceNowrap
                  textWhite={select[1]}
                  bgBW={select[1]}
                  onClick={() => clickSelect(1)}
                >
                  {option == 0 && show == showType.nft && "휴면 NFT"}
                  {option == 0 && show == showType.event && "공지"}
                  {option == 1 && show == showType.event && "공지 조회수"}
                  {option == 2 && show == showType.event && "당첨 발표된 이벤트"}
                  {option == 3 && show == showType.event && "당첨된 응모기록"}
                  {option == 0 && show == showType.social && "댓글"}
                  {option == 1 && show == showType.social && "댓글"}
                </Div>
                {((show == showType.event && option == 2) || (show == showType.event && option == 3)) && (
                  <Div px10 cursorPointer py5 roundedR whitespaceNowrap textWhite={select[2]} bgBW={select[2]} onClick={() => clickSelect(2)}>
                    {option == 2 && show == showType.event && "마감된 이벤트"}
                    {option == 3 && show == showType.event && "수령 완료된 응모기록"}
                  </Div>
                )}
              </Div>
              {show == showType.social && option == 0 && select[0] && (
                <Div flex flexRow justifyCenter rounded bgBWLight>
                  <Div
                    px10
                    cursorPointer
                    py5
                    rounded
                    whitespaceNowrap
                    textWhite={select[2]}
                    bgBW={select[2]}
                    onClick={() => setSelect([select[0], select[1], !select[2]])}
                  >
                    {option == 0 && show == showType.social && "리포스트 포함"}
                  </Div>
                </Div>
              )}
            </>
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

      {filteredDataArray.length != 0 && (
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
            {show == showType.nft && (
              <>
                {option == 0 && select[0] && <Bar dataKey="nft_count_uniq" stackId="nft_count" fill="#8884d8" />}
                {option == 0 && select[1] && <Bar dataKey="nft_count_sleep" stackId="nft_count" fill="#82ca9d" />}
                {option == 1 && <Bar dataKey="follow_count" stackId="follow_count" fill="#8884d8" />}
              </>
            )}
            {show == showType.event && (
              <>
                {option == 0 && select[0] && <Bar dataKey="event_count" stackId="total_event_count" fill="#8884d8" />}
                {option == 0 && select[1] && <Bar dataKey="notification_count" stackId="total_event_count" fill="#82ca9d" />}
                {option == 1 && select[0] && <Bar dataKey="event_read_count" stackId="read_count" fill="#8884d8" />}
                {option == 1 && select[1] && <Bar dataKey="notification_read_count" stackId="read_count" fill="#82ca9d" />}
                {option == 2 && select[0] && <Bar dataKey="in_progress_event_count" stackId="event_count" fill="#8884d8" />}
                {option == 2 && select[1] && <Bar dataKey="announced_event_count" stackId="event_count" fill="#82ca9d" />}
                {option == 2 && select[2] && <Bar dataKey="finished_event_count" stackId="event_count" fill="#ffc658" />}
                {option == 3 && select[0] && <Bar dataKey="applied_event_application_count" stackId="event_application_count" fill="#8884d8" />}
                {option == 3 && select[1] && <Bar dataKey="selected_event_application_count" stackId="event_application_count" fill="#82ca9d" />}
                {option == 3 && select[2] && <Bar dataKey="received_event_application_count" stackId="event_application_count" fill="#ffc658" />}
              </>
            )}
            {show == showType.social && (
              <>
                {option == 0 && select[0] && <Bar dataKey="post_count" stackId="total_social_count" fill="#8884d8" />}
                {option == 0 && select[1] && <Bar dataKey="comment_count" stackId="total_social_count" fill="#82ca9d" />}
                {option == 0 && select[2] && select[0] && <Bar dataKey="repost_count" stackId="total_social_count" fill="#ffc658" />}
                {option == 1 && select[0] && <Bar dataKey="post_like_count" stackId="like_count" fill="#8884d8" />}
                {option == 1 && select[1] && <Bar dataKey="comment_like_count" stackId="like_count" fill="#82ca9d" />}
                {option == 2 && <Bar dataKey="donation_sum" stackId="donation_sum" fill="#8884d8" />}
                {option == 3 && <Bar dataKey="hug_count" stackId="hug_count" fill="#8884d8" />}
              </>
            )}
            {/* <Legend /> */}
          </BarChart>
        </ResponsiveContainer>
      )}
      {filteredDataArray.length == 0 && (
        <Div wFull textCenter flex flexCol hFull justifyCenter fontSize18 fontSemibold>
          Data가 충분하지 않습니다.{" "}
        </Div>
      )}
    </Div>
  );
}
