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

export default function EmailVerificationModal() {
	const dispatch = useDispatch();
	const { locale } = useRouter();
	const { emailVerificationEnabled, user } = useSelector((state: RootState) => ({
		emailVerificationEnabled: state.modal.emailVerification.enabled,
		user: state.auth.user,
	}));
	const closeModal = () => {
		dispatch(emailVerificationAction({ enabled: false }));
	};

	const [email, setEmail] = useState<string>("");
	const [emailError, setEmailError] = useState<boolean>(false);
	const validateEmail = (email) => {
		return String(email)
			.toLowerCase()
			.match(
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
			);
	};
	const handleChangeEmail = ({ target: { value } }) => {
		setEmail(value);
		const isValid = validateEmail(value);
		if (isValid && emailError) {
			setEmailError(false);
		} else if (!(isValid || emailError)) {
			setEmailError(true);
		}
	};

	const [password, setPassword] = useState<string>("");
	const [passwordError, setPasswordError] = useState<boolean>(false);
	//^	The password string will start this way
	// (?=.*[a-z])	The string must contain at least 1 lowercase alphabetical character
	// (?=.*[A-Z])	The string must contain at least 1 uppercase alphabetical character
	// (?=.*[0-9])	The string must contain at least 1 numeric character
	// (?=.[!@#$%^&])	The string must contain at least one special character, but we are escaping reserved RegEx characters to avoid conflict
	// (?=.{8,})	The string must be eight characters or longer
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

	const [passwordConfirmation, setPasswordConfirmation] = useState<string>("");
	const [passwordConfirmationError, setPasswordConfirmationError] = useState<boolean>(false);
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

	const postEmail = () => {
		if (!(passwordConfirmationError || emailError || passwordError || password === "" || passwordConfirmation === "" || email === "")) {
			try {
				const emailResult = apiHelperWithToken(apis.auth.email._(), "POST", {
					address: email,
					password,
					password_confirmation: passwordConfirmation,
				});
				console.log(emailResult);
			} catch (e) {
				console.log(e);
			}
			return;
		}
		alert("Check your inputs");
	};

	return (
		<Modal open={emailVerificationEnabled} onClose={closeModal}>
			<Div maxW={600} mx20 px15>
				<Div textCenter py30>
					<Div spanTag fontBold textXl>
						Verify Your Email
					</Div>
				</Div>
				<Row my15 roundedMd flex itemsCenter>
					<div className="mb-4">
						<label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
						<input
							onChange={handleChangeEmail}
							className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
							id="Email"
							type="email"
							placeholder="Email"
						/>
						<Div textDanger>{emailError && "Invalid Email"}</Div>
					</div>
					<div className="mb-4">
						<label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
						<input
							onChange={handleChangePassword}
							className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
							id="Password"
							type="password"
							placeholder="Password"
						/>
						<Div textDanger>{passwordError && "Invalid Password"}</Div>
					</div>
					<div className="mb-4">
						<label className="block text-gray-700 text-sm font-bold mb-2">Password Confirmation</label>
						<input
							onChange={handleChangePasswordConfirmation}
							className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
							id="Password Confirmation"
							type="password"
							placeholder="Password Confirmation"
						/>
						<Div textDanger>{passwordConfirmationError && "Passwords do not match"}</Div>
					</div>
					<Div onClick={postEmail}>Signup</Div>
				</Row>
			</Div>
		</Modal>
	);
}
