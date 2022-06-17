import { Fragment, useRef, useState } from "react";
import Div from "../Div";
import Modal from "./Modal";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "src/store/reducers/rootReducer";
import Row from "../Row";
import { useRouter } from "next/router";
import { apiHelper, apiHelperWithToken } from "src/modules/apiHelper";
import apis from "src/modules/apis";
import { emailVerificationAction } from "src/store/reducers/modalReducer";
import EmptyBlock from "../EmptyBlock";

export default function EmailVerificationModal() {
	const [success, setSuccess] = useState<boolean>(false);
	const [putPasswordError, setPutPasswordError] = useState<boolean>(false);
	const [password, setPassword] = useState<string>("");
	const [passwordError, setPasswordError] = useState<boolean>(false);
	const [passwordConfirmation, setPasswordConfirmation] = useState<string>("");
	const [passwordConfirmationError, setPasswordConfirmationError] = useState<boolean>(false);
	const dispatch = useDispatch();
	const { emailVerificationEnabled } = useSelector((state: RootState) => ({
		emailVerificationEnabled: state.modal.emailVerification.enabled,
	}));
	const closeModal = () => {
		setSuccess(false);
		setPassword("");
		setPasswordError(false);
		setPasswordConfirmation("");
		setPasswordConfirmationError(false);
		dispatch(emailVerificationAction({ enabled: false }));
	};
	const validatePassword = (password) => {
		return String(password).match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/);
	};
	const handleChangePassword = ({ target: { value } }) => {
		setPassword(value);
		const isValid = validatePassword(value);
		if (isValid && passwordError) {
			setPasswordError(false);
		} else if (!(isValid || passwordError)) {
			setPasswordError(true);
		}
	};

	const validatePasswordConfirmation = (confirmation) => {
		return password === confirmation;
	};
	const handleChangePasswordConfirmation = ({ target: { value } }) => {
		setPasswordConfirmation(value);
		const isValid = validatePasswordConfirmation(value);
		if (isValid && passwordConfirmationError) {
			setPasswordConfirmationError(false);
		} else if (!(isValid || passwordConfirmationError)) {
			setPasswordConfirmationError(true);
		}
	};
	const areValidInputs = !(passwordConfirmationError || passwordError || password === "" || passwordConfirmation === "");
	const postEmail = async () => {
		if (areValidInputs) {
			try {
				const emailResult = await apiHelperWithToken(apis.auth.password._(), "PUT", {
					password,
					password_confirmation: passwordConfirmation,
				});
				if (emailResult.success) setSuccess(true);
				closeModal();
				return;
			} catch (e) {}
			setPutPasswordError(true);
		}
	};

	return (
		<Modal open={emailVerificationEnabled} onClose={closeModal} bdClx={"bg-black/30"} clx={"bg-white"}>
			<Div w={400} mx20 px15 my30>
				<Div textCenter>
					<Div spanTag fontBold textXl>
						비밀번호 설정
					</Div>
				</Div>
				<Row my15 roundedMd flex itemsCenter>
					<Div>
						<label className="block text-gray-700 text-sm font-bold mb-2">비밀번호</label>
						<input
							placeholder="비밀번호"
							className={"px-5 w-full focus:outline-none focus:border-gray-400 bg-gray-200 rounded-lg"}
							style={{ height: 40, boxShadow: "none", border: "none" }}
							type="password"
							onChange={handleChangePassword}
						></input>
						<Div textDanger textXs spanTag>
							{passwordError && "비밀 번호는 숫자, 특수문자, 대소문자 영문이 포함돼 있는 8글자 이상의 단어입니다."}
						</Div>
					</Div>
					<EmptyBlock h={4} />
					<Div>
						<label className="block text-gray-700 text-sm font-bold mb-2">비밀번호 확인</label>
						<input
							placeholder="비밀번호 확인"
							style={{ height: 40, boxShadow: "none", border: "none" }}
							type="password"
							className={"px-5 w-full focus:outline-none focus:border-gray-400 bg-gray-200 rounded-lg"}
							onChange={handleChangePasswordConfirmation}
						></input>
						<Div textDanger textXs>
							{passwordConfirmationError && "비밀번호와 확인이 일치하지 않습니다."}
						</Div>
					</Div>
					<EmptyBlock h={20} />
					<ThreeStateButton state={success ? 2 : areValidInputs ? 1 : 0} onClick={postEmail} />
					<Div textDanger textXs spanTag>
						{putPasswordError && "비밀번호를 설정하지 못하였습니다."}
					</Div>
				</Row>
			</Div>
		</Modal>
	);
}

function ThreeStateButton({ state, onClick }) {
	enum State {
		Disabled,
		Clickable,
		Success,
	}
	const propsFromState = (state) => {
		if (state == State.Disabled) {
			return { bgGray100: true, textGray400: true };
		}
		if (state == State.Clickable) {
			return { bgPrimary: true, textWhite: true };
		}
		if (state == State.Success) {
			return { bgSuccess: true, textWhite: true };
		}
		return {};
	};
	const textFromState = (state) => {
		if (state == State.Disabled) {
			return "확인";
		}
		if (state == State.Clickable) {
			return "확인";
		}
		if (state == State.Success) {
			return "완료";
		}
		return "";
	};
	return (
		<Div>
			<Div cursorPointer h40 {...propsFromState(state)} roundedLg flex justifyCenter itemsCenter onClick={state == State.Clickable && onClick}>
				<Div>{textFromState(state)}</Div>
			</Div>
		</Div>
	);
}
