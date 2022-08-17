import { CheckCircleIcon, PencilIcon } from "@heroicons/react/outline";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { apiHelperWithToken } from "src/modules/apiHelper";
import apis from "src/modules/apis";
import { COLORS } from "src/modules/constants";
import Div from "../Div";
import Spinner from "./Spinner";
import TruncatedMarkdown from "./TruncatedMarkdown";
import TruncatedText from "./TruncatedText";

enum StoryState {
	Stale,
	Editting,
	Loading,
}
export default function Story({ initialStory, mine, contractAddress = null }) {
	const [full, setFull] = useState(false);
	const [story, setStory] = useState({
		value: initialStory || "",
		edittingValue: initialStory || "",
		state: StoryState.Stale,
		error: "",
	});
	const isValidStory = story.error == "" && story.edittingValue != "";
	const handleClickEditStory = () => {
		setStory({ ...story, state: StoryState.Editting });
	};
	const handleEditStory = ({ target: { value } }) => {
		const error = getStoryError(value);
		setStory({ ...story, edittingValue: value, error });
	};
	const getStoryError = (value) => {
		if (value == "") {
			return "스토리는 한 글자 이상이어야 합니다.";
		}
		if (new Blob([value]).size > 60000) {
			return "스토리는 60KB 이하여야합니다.";
		}
		return "";
	};
	const handleClickSaveStory = async () => {
		if (story.edittingValue == story.value) {
			setStory({ ...story, error: "", state: StoryState.Stale });
		}
		if (isValidStory) {
			setStory({ ...story, state: StoryState.Loading });
			try {
				const endpoint = contractAddress ? apis.nft_collection.contractAddress._(contractAddress) : apis.nft._();
				const res = await apiHelperWithToken(endpoint, "PUT", {
					property: "story",
					value: story.edittingValue,
				});
				if (res.success) {
					setStory({
						value: story.edittingValue,
						edittingValue: story.edittingValue,
						state: StoryState.Stale,
						error: "",
					});
					return;
				}
				throw new Error();
			} catch {
				setStory({ ...story, error: "스토리를 저장하지 못하였습니다." });
			}
		}
	};
	useEffect(() => {
		setStory({
			value: initialStory,
			edittingValue: initialStory,
			state: StoryState.Stale,
			error: "",
		});
	}, [initialStory]);

	return (
		<Div mxAuto py20>
			<Div itemsCenter flex flexRow>
				<Div flex1 textLg fontWeight={500}>
					스토리
				</Div>
				{mine && (
					<Div pl5>
						{
							{
								[StoryState.Stale]: (
									<Div cursorPointer onClick={handleClickEditStory}>
										<PencilIcon height={20} width={20} scale={1} strokeWidth={0.5} />
									</Div>
								),
								[StoryState.Editting]: (
									<Div cursorPointer textGray200={!isValidStory} onClick={handleClickSaveStory}>
										<CheckCircleIcon height={20} width={20} scale={1} strokeWidth={0.5} />
									</Div>
								),
								[StoryState.Loading]: <Spinner clx={"h-20 w-20"} fill={COLORS.BW} circleFill={COLORS.GRAY200} />,
							}[story.state]
						}
					</Div>
				)}
			</Div>
			<Div textGray400={!story.edittingValue} mt5>
				{
					{
						[StoryState.Stale]: (
							<Div textGray400={!story.value} textBase>
								{full ? (
									<ReactMarkdown children={story.value || "스토리가 아직 작성되지 않았습니다."}></ReactMarkdown>
								) : (
									<TruncatedMarkdown
										text={story.value || "스토리가 아직 작성되지 않았습니다."}
										maxLength={300}
										onClickTruncated={() => setFull(true)}
									/>
								)}
							</Div>
						),
						[StoryState.Editting]: (
							<Div fontWeight={500}>
								<textarea
									placeholder={story.value || "마크다운을 사용하실 수 있습니다."}
									value={story.edittingValue}
									className={"bg-gray-200 border-gray-200 box-shadow-none w-full rounded-lg focus:border-gray-400"}
									style={{ boxShadow: "none", border: "none" }}
									onChange={handleEditStory}
									rows={10}
								></textarea>
							</Div>
						),
						[StoryState.Loading]: (
							<Div textGray400={!story.value} textBase>
								<ReactMarkdown children={story.value || "스토리가 아직 작성되지 않았습니다."}></ReactMarkdown>
							</Div>
						),
					}[story.state]
				}
			</Div>
		</Div>
	);
}
