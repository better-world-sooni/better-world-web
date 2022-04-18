import Div from "src/components/Div";
import Row from "src/components/Row";
import Col from "src/components/Col";
import Image from "next/image";
import { IMAGES } from "src/modules/images";
import { useEffect, useState, useCallback } from "react";

export default function Messages({
    currentRoomId,
    closeOnClick,
    sendOnClick,
    userUuid,
    userAvatar
}) {

    const [text, setText] = useState("")

    const onChange = (e) => {
        setText(e.target.value)
    }
    
    const onSubmit = () => {
        setText("")
        sendOnClick(text);
    }

    return(
        <Div flex flexCol itemsStretch >
            <Row flex itemsCenter>
                <Col auto justifyCenter>
                    <Div onClick={()=>closeOnClick()}>
                        <Image
                            alt="back"
                            src={IMAGES.backButton}
                            height={25}
                            width={25}
                        />
                    </Div>
                </Col>
                <Col auto justifyCenter>
                    <Div>
                        {currentRoomId}
                    </Div>
                </Col>
            </Row>
            <Row flex>
                <Div>
                    {"hi"}    
                </Div>
            </Row>
            <Div flex flexCol roundedMd border1 borderBlack >
                <textarea
                    placeholder="메세지를 입력해주세요"
                    className="m-5 resize-none border-none focus:outline-none w-full"
                    onChange={e => onChange(e)}
                    rows={5}
                    value={text}
                    onKeyPress={event => {
                        if (event.key === 'Enter') {
                            onSubmit();
                        }
                    }}
                ></textarea>
                <Row flex>
                    <Col>
                    </Col>
                    <Col>
                    </Col>
                    <Col></Col>
                    <Col auto px20 pt5 cursorPointer border1 pb8 onClick={onSubmit}>
						전송
					</Col>
                </Row>
            </Div>
        </Div>
       
    );
}
