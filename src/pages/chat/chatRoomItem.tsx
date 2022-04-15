import Div from "src/components/Div";
import Helmet from "react-helmet";
import Confetti from "src/components/modals/Confetti";
import EmptyBlock from "src/components/EmptyBlock";
import Row from "src/components/Row";
import Col from "src/components/Col";
import { IMAGES } from "src/modules/images";
import { truncateKlaytnAddress } from "src/modules/constants";
import MainTopBar from "src/components/MainTopBar";
import { useEffect, useState } from "react";
import { sha3_256 } from "js-sha3";
import apis from "src/modules/apis";
import { apiHelperWithJwtFromContext, apiHelperWithToken } from "src/modules/apiHelper";
import { BadgeCheckIcon } from "@heroicons/react/solid";
import NftCollectionProfile from "src/components/common/NftCollectionProfile";
import { BellIcon, XCircleIcon } from "@heroicons/react/outline";
import { NextPageContext } from "next";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import { useSelector } from "react-redux";
import ImageModal from "src/components/modals/ImageModal";

export default function chatRoomItem() {

    return(
        <Row px20 py10 flex onPress={() => goToChatRoom(chatRoomId)} bgWhite>
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
                        <Div fontSize={15} bold numberOfLines={1} ellipsizeMode={'tail'}>
                            {title}
                        </Div>
                    </Col>
                    <Col auto fontSize={15}>
                        <Div color={GRAY_COLOR}>{category}</Div>
                    </Col>
                    <Col justifyCenter itemsEnd>
                        <Div fontSize={13} light>
                            {createdAtText(createdAt)}
                        </Div>
                    </Col>
                </Row>
                <Row w={'100%'} pt2>
                    <Col pr10>
                        <Div fontSize={15} numberOfLines={1} ellipsizeMode={'tail'}>
                            {lastMessage}
                        </Div>
                    </Col>
                    {unreadMessageCount > 0 && (
                    <Col auto fontSize={15} rounded30 bg={APPLE_RED} px5 justifyCenter>
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