import React from "react";
import Image from "next/image";
import Row from "src/components/Row";
import Col from "src/components/Col";
import Div from "src/components/Div";
import { IMAGES } from "src/modules/images";

const ChatRoomItemAvatars = ({ h = 50, w = 50, profileImg = null }) => {
	const avatarArr = profileImg.filter((item) => {
		return item;
	});

	const avatarArrLength = avatarArr.length;
	if (avatarArrLength == 0) {
		return <Image src={IMAGES.characters.default} height={h} width={h} alt="avatarDefault" />;
	}
	if (avatarArrLength == 1) {
		return <Image src={avatarArr[0]} height={h} width={w} alt="avatarOne" />;
	}
	if (avatarArrLength == 2) {
		return (
			<Div w={w} h={h} itemsCenter justifyCenter>
				<Row>
					<Col auto>
						<Image src={avatarArr[0]} height={h / 2} width={w / 2} alt="avatarTwo" />
					</Col>
					<Col auto>
						<Image src={avatarArr[1]} height={h / 2} width={w / 2} alt="avatarTwo" />
					</Col>
				</Row>
			</Div>
		);
	}
	if (avatarArrLength == 3) {
		return (
			<Div w={w} h={h} itemsCenter justifyCenter>
				<Row>
					<Col auto>
						<Image src={avatarArr[0]} height={h / 2} width={w / 2} alt="avatarThree" />
					</Col>
					<Col auto>
						<Image src={avatarArr[1]} height={h / 2} width={w / 2} alt="avatarThree" />
					</Col>
				</Row>
				<Row justifyCenter>
					<Image src={avatarArr[2]} height={h / 2} width={w / 2} alt="avatarThree" />
				</Row>
			</Div>
		);
	}

	return (
		<Div w={w} h={h} itemsCenter justifyCenter>
			<Row>
				<Col auto>
					<Image src={avatarArr[0]} height={h / 2} width={w / 2} alt="avatarFour" />
				</Col>
				<Col auto>
					<Image src={avatarArr[1]} height={h / 2} width={w / 2} alt="avatarFour" />
				</Col>
			</Row>
			<Row>
				<Col auto>
					<Image src={avatarArr[2]} height={h / 2} width={w / 2} alt="avatarFour" />
				</Col>
				<Col auto>
					<Image src={avatarArr[3]} height={h / 2} width={w / 2} alt="avatarFour" />
				</Col>
			</Row>
		</Div>
	);
};

export default React.memo(ChatRoomItemAvatars);
