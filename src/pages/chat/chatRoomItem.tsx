import Div from "src/components/Div";
import Row from "src/components/Row";
import Col from "src/components/Col";
import { useCallback } from "react";
import ChatRoomAvatars from "src/pages/chat/chatRoomAvatars"
import { kmoment } from "src/modules/constants";

export default function ChatRoomItem({
    chatRoomId,
    onclick,
    category,
    title,
    createdAt,
    lastMessage,
    numUsers,
    unreadMessageCount,
    firstUserAvatar = null,
    secondUserAvatar = null,
    thirdUserAvatar = null,
    fourthUserAvatar = null,
}) {

    const goToChatRoom = roomId => {
        // navigation.navigate(NAV_NAMES.ChatRoom, {currentChatRoomId: roomId, title: title, numUsers: numUsers});
        console.log("click")
    };

    const createdAtText = useCallback(createdAt => {
        if (createdAt) {
          const calendar = kmoment(createdAt).calendar();
          const calendarArr = calendar.split(' ');
          if (calendarArr[0] == '오늘') {
            return calendarArr[1] + ' ' + calendarArr[2];
          }
          if (calendarArr[0] == '어제') {
            return calendarArr[0];
          }
          return calendarArr[0] + ' ' + calendarArr[1];
        }
        return null;
      }, []);

    return(
        <Row px20 py10 flex bgWhite onClick={()=>onclick(chatRoomId)}>
            <Col auto mr10 relative>
                <ChatRoomAvatars
                firstUserAvatar={firstUserAvatar}
                secondUserAvatar={secondUserAvatar}
                thirdUserAvatar={thirdUserAvatar}
                fourthUserAvatar={fourthUserAvatar}
                />
            </Col>
            <Col justifyCenter>
                <Row pb2>
                    <Col pr10 auto maxW={'60%'}>
                        <Div fontSize={15} >
                            {title}
                        </Div>
                    </Col>
                    <Col auto fontSize={15}>
                        <Div>{category}</Div>
                    </Col>
                    <Col justifyCenter itemsEnd>
                        <Div fontSize={13}>
                            {createdAtText(createdAt)}
                        </Div>
                    </Col>
                </Row>
                <Row w={'100%'} pt2>
                    <Col pr10>
                        <Div fontSize={15}>
                            {lastMessage}
                        </Div>
                    </Col>
                    {unreadMessageCount > 0 && (
                    <Col auto fontSize={15} rounded30 bg={'rgb(255, 69, 58)'} px5 justifyCenter>
                        <Div color={'white'}>
                            {unreadMessageCount >= 100 ? '99+' : unreadMessageCount}
                        </Div>
                    </Col>
                    )}
                </Row>
            </Col>
        </Row>
    );
}