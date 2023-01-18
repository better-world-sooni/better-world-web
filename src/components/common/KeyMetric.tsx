import { useState } from "react";
import { Oval } from "react-loader-spinner";
import { DashboardOrderStatus, DashboardShowType, getDashboardEventQuery } from "src/hooks/queries/admin/dashboard";
import Div from "../Div";
import { ProfileImage } from "./ImageHelper";

export default function KeyMetric({}) {
  const [type, setType] = useState(DashboardShowType.EVENT);
  const [order, setOrder] = useState(DashboardOrderStatus.DEFAULT);
  const { isFetching: fetching, data: data } = getDashboardEventQuery(type, order);
  return (
    <Div rounded hFull wFull mx5 style={{ backgroundColor: "#F3F6FD" }} px10 py10 flex flexCol>
      <Div flex flexRow wFull justifyStart>
        <Div fontBold fontSize20 selfCenter whitespaceNowrap>
          Key Metrics
        </Div>
        <Div wFull />
        <Div flex flexRow selfCenter rounded border1 fontSize14>
          <Div
            px10
            py5
            whitespaceNowrap
            bgWhite={type == DashboardShowType.EVENT}
            cursorPointer
            roundedL
            onClick={() => {
              setType(DashboardShowType.EVENT);
              setOrder(DashboardOrderStatus.DEFAULT);
            }}
            fontBold={type == DashboardShowType.EVENT}
            clx={type == DashboardShowType.EVENT && "text-bw"}
          >
            Event
          </Div>
          <Div
            px10
            py5
            whitespaceNowrap
            bgWhite={type == DashboardShowType.ANNOUNCEMENT}
            cursorPointer
            roundedR
            onClick={() => {
              setType(DashboardShowType.ANNOUNCEMENT);
              setOrder(DashboardOrderStatus.DEFAULT);
            }}
            fontBold={type == DashboardShowType.ANNOUNCEMENT}
            clx={type == DashboardShowType.ANNOUNCEMENT && "text-bw"}
          >
            Announcement
          </Div>
        </Div>
      </Div>
      {fetching && (
        <Div wFull hFull flex flexRow justifyCenter>
          <Div selfCenter>
            <Oval height="30" width="30" color="#4738FF" secondaryColor="#FFFFFF" strokeWidth="10" />
          </Div>
        </Div>
      )}
      {!fetching && data && data.draw_events && data.draw_events.length != 0 && (
        <Div flex flexCol style={{ maxWidth: "100%" }} justifyCenter py10>
          <EventHead order={order} setOrder={setOrder} />
          {data.draw_events.map((drawEvent, key) => {
            return <EventWrapper drawEvent={drawEvent} key={key} />;
          })}
        </Div>
      )}
    </Div>
  );
}

const EventWrapper = ({ drawEvent }) => {
  return (
    <Div wFull flex flexRow px5 py5 borderB1>
      <Div style={{ width: "52%" }} flex flexRow fontSize14 selfCenter overflowHidden>
        <Div w={40} h={40} selfCenter mr10>
          {drawEvent?.image_uri ? (
            <Div
              w={40}
              h={40}
              rounded={true}
              style={{
                backgroundImage: `url(${drawEvent?.image_uri})`,
                backgroundSize: "cover",
                backgroundPositionX: "center",
                backgroundPositionY: "center",
              }}
            ></Div>
          ) : (
            <Div w={40} h={40} rounded={true} bgGray300 />
          )}
        </Div>
        <Div overflowEllipsis overflowHidden whitespaceNowrap selfCenter>
          {drawEvent?.name}
        </Div>
      </Div>
      <Div style={{ width: "12%" }} textCenter fontSize14 selfCenter>
        {drawEvent?.application_count}
      </Div>
      <Div style={{ width: "12%" }} textCenter fontSize14 selfCenter>
        {drawEvent?.view_count}
      </Div>
      <Div style={{ width: "12%" }} textCenter fontSize14 selfCenter>
        {drawEvent?.likes_count}
      </Div>
      <Div style={{ width: "12%" }} textCenter fontSize14 selfCenter>
        {drawEvent?.comments_count}
      </Div>
    </Div>
  );
};

const EventHead = ({ setOrder, order }) => {
  const toggleApplicationOrder = () => {
    if (order == DashboardOrderStatus.APPLICATION_ASC) setOrder(DashboardOrderStatus.APPLICATION_DESC);
    else if (order == DashboardOrderStatus.APPLICATION_DESC) setOrder(DashboardOrderStatus.DEFAULT);
    else setOrder(DashboardOrderStatus.APPLICATION_ASC);
  };
  const toggleViewOrder = () => {
    if (order == DashboardOrderStatus.VIEW_ASC) setOrder(DashboardOrderStatus.VIEW_DESC);
    else if (order == DashboardOrderStatus.VIEW_DESC) setOrder(DashboardOrderStatus.DEFAULT);
    else setOrder(DashboardOrderStatus.VIEW_ASC);
  };
  const toggleLikeOrder = () => {
    if (order == DashboardOrderStatus.LIKE_ASC) setOrder(DashboardOrderStatus.LIKE_DESC);
    else if (order == DashboardOrderStatus.LIKE_DESC) setOrder(DashboardOrderStatus.DEFAULT);
    else setOrder(DashboardOrderStatus.LIKE_ASC);
  };
  const toggleCommentOrder = () => {
    if (order == DashboardOrderStatus.COMMENT_ASC) setOrder(DashboardOrderStatus.COMMENT_DESC);
    else if (order == DashboardOrderStatus.COMMENT_DESC) setOrder(DashboardOrderStatus.DEFAULT);
    else setOrder(DashboardOrderStatus.COMMENT_ASC);
  };
  return (
    <Div wFull flex flexRow px5 py3 borderB2 fontBold fontSize12 whitespaceNowrap textLeft>
      <Div style={{ width: "52%" }} selfCenter px10>
        {"이벤트"}
      </Div>
      <Div style={{ width: "12%" }} selfCenter px10 cursorPointer whitespaceNowrap onClick={toggleApplicationOrder}>
        {"참여 수 " + (order == DashboardOrderStatus.APPLICATION_ASC ? "▲" : "") + (order == DashboardOrderStatus.APPLICATION_DESC ? "▼" : "")}
      </Div>
      <Div style={{ width: "12%" }} selfCenter px10 cursorPointer whitespaceNowrap onClick={toggleViewOrder}>
        {"조회 수 " + (order == DashboardOrderStatus.VIEW_ASC ? "▲" : "") + (order == DashboardOrderStatus.VIEW_DESC ? "▼" : "")}
      </Div>
      <Div style={{ width: "12%" }} selfCenter px10 cursorPointer whitespaceNowrap onClick={toggleLikeOrder}>
        {"좋아요 수 " + (order == DashboardOrderStatus.LIKE_ASC ? "▲" : "") + (order == DashboardOrderStatus.LIKE_DESC ? "▼" : "")}
      </Div>
      <Div style={{ width: "12%" }} selfCenter px10 cursorPointer whitespaceNowrap onClick={toggleCommentOrder}>
        {"댓글 수 " + (order == DashboardOrderStatus.COMMENT_ASC ? "▲" : "") + (order == DashboardOrderStatus.COMMENT_DESC ? "▼" : "")}
      </Div>
    </Div>
  );
};
