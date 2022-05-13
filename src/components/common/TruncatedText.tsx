import Div from "src/components/Div";

type TruncatedTextProps = {
	text: string;
	maxLength: number;
	onClickTruncated?: any;
};
type TruncatedTextType = (props: TruncatedTextProps) => string | JSX.Element;

const TruncatedText: TruncatedTextType = function ({ text, maxLength, onClickTruncated = null }) {
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
				<Div spanTag onClick={onClickTruncated} cursorPointer>
					{result.concat("...") + " 더보기"}
				</Div>
			);
		}
		return result.concat("...");
	}
	return result;
};

export default TruncatedText;
