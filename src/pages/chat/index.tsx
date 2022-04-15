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

export default function Chat({ nftCollection, proposals, about, user }) {

	const [isOpen, setIsOpen] = useState(false);

	return (
		<Div>
			<Helmet bodyAttributes={{ style: "background-color : white;" }} />
			<MainTopBar user={user} />
			<Confetti />
			
			<EmptyBlock h={20} />
			<Div px30>
				<Div mxAuto maxW={1100} px10>
					<Row flex itemsCenter roundedXl border1 py20 px20></Row>
				</Div>
			</Div>
		</Div>
	);
}
