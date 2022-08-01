import Div from "src/components/Div";
import ReactMarkdown from "react-markdown";
import React from "react";

type TruncatedMarkdownProps = {
	text: string;
	maxLength: number;
	onClickTruncated?: any;
};
type TruncatedMarkdownType = (props: TruncatedMarkdownProps) => JSX.Element;

const ModifiledTruncatedMarkdown: TruncatedMarkdownType = function ({ text, maxLength, onClickTruncated = null }) {
	const lines = text.split("\n");
	let lineLength = 0;
	const resultLines = [];
	for (const lineIndex in lines) {
		if (lineLength + lines[lineIndex].length > maxLength) {
			const words = lines[lineIndex].split(" ");
			let truncatedLine = "";
			for (const wordIndex in words) {
				if (lineLength + truncatedLine.length + words[wordIndex].length > maxLength) {
					break;
				}
				truncatedLine = truncatedLine.concat(" ", words[wordIndex]);
			}
			if (truncatedLine) {
				resultLines.push(truncatedLine);
			}
			break;
		}
		lineLength += lines[lineIndex].length;
		resultLines.push(lines[lineIndex]);
	}
	const result = resultLines.join("\n");
	if (result.length != text.length) {
		if (onClickTruncated) {
			return (
				<Div>
					<ReactMarkdown children={result} />
                    <Div onClick={onClickTruncated} cursorPointer fontBold>
                        ...더보기
                    </Div>
				</Div>
			);
		}
		return <ReactMarkdown children={result.concat("...")} />;
	}
	return <ReactMarkdown children={result} />;
};

export default ModifiledTruncatedMarkdown;
