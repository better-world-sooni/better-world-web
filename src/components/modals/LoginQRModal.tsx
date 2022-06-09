import { RefreshIcon } from "@heroicons/react/outline";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";
import { Oval } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { apiHelperWithToken } from "src/modules/apiHelper";
import apis from "src/modules/apis";
import { loginQRModalAction } from "src/store/reducers/modalReducer";
import { RootState } from "src/store/reducers/rootReducer";
import Div from "../Div";
import Modal from "./Modal";

export default function LoginQRModal({ address }) {
	const { loginQRModalEnabled } = useSelector((state: RootState) => ({
		loginQRModalEnabled: state.modal.loginQRModal.enabled,
	}));
	const [qrData, setQrData] = useState(null);
	const [ttl, setTtl] = useState({
		minutes: 3,
		seconds: 0,
	});
	const dispatch = useDispatch();
	const closeModal = () => {
		dispatch(loginQRModalAction({ enabled: false }));
	};
	async function fetchData() {
		const qrRes = await apiHelperWithToken(apis.auth.jwt.loginQr(), "POST", {
			address: address,
		});
		setQrData(qrRes);
	}
	useEffect(() => {
		fetchData();
	}, [loginQRModalEnabled]);

	useEffect(() => {
		if (qrData) {
			const dateInt = qrData?.exp * 1000;
			const remainingSeconds = Math.floor((dateInt - new Date().getTime()) / 1000);
			setTtl({
				minutes: Math.floor(remainingSeconds / 60),
				seconds: remainingSeconds % 60,
			});
			const interval = setInterval(() => {
				const remainingSeconds = Math.floor((dateInt - new Date().getTime()) / 1000);
				setTtl({
					minutes: Math.floor(remainingSeconds / 60),
					seconds: remainingSeconds % 60,
				});
			}, 1000);

			return () => {
				clearInterval(interval);
			};
		}
	}, [qrData?.exp, loginQRModalEnabled]);

	return (
		<Modal open={loginQRModalEnabled} onClose={closeModal} bdClx={"bg-black/30"} clx={"bg-white"}>
			<Div mx20 px30 my30 flex itemsCenter>
				<Div>
					<Div fontSize={24} textCenter fontBold>
						임시 큐알
					</Div>
					<Div mxAuto my15>
						{qrData ? (
							<QRCodeSVG size={300} bgColor={"white"} level={"Q"} includeMargin={true} value={qrData.jwt} />
						) : (
							<Oval height="100" width="100" color="blue" secondaryColor="#0049EA" />
						)}
					</Div>
					{qrData && (
						<Div
							fontSize={24}
							textCenter
							textPrimary={ttl.minutes > 0}
							textDanger={ttl.minutes <= 0}
							fontBold
							flex
							itemsCenter
							justifyCenter
							gapX={10}
						>
							<Div>{ttl.minutes < 0 ? "유효기간 만료" : `잔여 ${ttl.minutes}분 ${ttl.seconds}초`}</Div>
							<Div textWhite roundedFull p8 bgBlack cursorPointer onClick={fetchData}>
								<RefreshIcon height={20} width={20} />
							</Div>
						</Div>
					)}
				</Div>
			</Div>
		</Modal>
	);
}
