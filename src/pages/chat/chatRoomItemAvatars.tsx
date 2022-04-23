import React from 'react';
import Image from "next/image";
import Row from "src/components/Row";
import Col from "src/components/Col";
import Div from "src/components/Div";
import { IMAGES } from "src/modules/images"

const ChatRoomItemAvatars = ({
    firstNftAvatar = null,
    secondNftAvatar = null,
    thirdNftAvatar = null,
    fourthNftAvatar = null,
}) => {
  
    const avatarArr = [
      firstNftAvatar,
      secondNftAvatar,
      thirdNftAvatar,
      fourthNftAvatar,
    ].filter(item => {
      return item;
    });
  
    const avatarArrLength = avatarArr.length;
    if (avatarArrLength == 0) {
      return (
        <Image
            src={IMAGES.characters.default}
            height={50}
            width={50}
            alt="avatarDefault"
        />
      );
    }
    if (avatarArrLength == 1) {
      return <Image src={avatarArr[0]} height={50} width={50} alt="avatarOne"/>;
    }
    if (avatarArrLength == 2) {
      return (
        <Div w50 h50 itemsCenter justifyCenter>
            <Row>
                <Col auto>
                    <Image 
                        src={avatarArr[0]} 
                        height={25}
                        width={25}
                        alt="avatarTwo"
                    />
                </Col>
                <Col auto>
                    <Image 
                        src={avatarArr[1]} 
                        height={25}
                        width={25}
                        alt="avatarTwo"
                    />
                </Col>
            </Row>
        </Div>
      );
    }
    if (avatarArrLength == 3) {
        return (
            <Div w50 h50 itemsCenter justifyCenter>
                <Row>
                    <Col auto>
                        <Image 
                            src={avatarArr[0]} 
                            height={25}
                            width={25}
                            alt="avatarThree"
                        />
                    </Col>
                    <Col auto>
                        <Image 
                            src={avatarArr[1]} 
                            height={25}
                            width={25}
                            alt="avatarThree"
                        />
                    </Col>
                </Row>
                <Row justifyCenter>
                    <Image 
                        src={avatarArr[2]} 
                        height={25}
                        width={25}
                        alt="avatarThree"
                    />
                </Row>
            </Div>
        );
    }
    
    return (
        <Div w50 h50 itemsCenter justifyCenter>
            <Row>
                <Col auto>
                    <Image 
                        src={avatarArr[0]} 
                        height={25}
                        width={25}
                        alt="avatarFour"
                    />
                </Col>
                <Col auto>
                    <Image 
                        src={avatarArr[1]} 
                        height={25}
                        width={25}
                        alt="avatarFour"
                    />
                </Col>
            </Row>
            <Row>
                <Col auto>
                    <Image 
                        src={avatarArr[2]} 
                        height={25}
                        width={25}
                        alt="avatarFour"
                    />
                </Col>
                <Col auto>
                    <Image 
                        src={avatarArr[3]} 
                        height={25}
                        width={25}
                        alt="avatarFour"
                    />
                </Col>
            </Row>
        </Div>
    );
  };
  
  export default React.memo(ChatRoomItemAvatars);