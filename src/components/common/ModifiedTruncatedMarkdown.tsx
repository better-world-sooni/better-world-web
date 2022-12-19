import Div from "src/components/Div";
import ReactMarkdown from "react-markdown";
import React, { useState } from "react";
import remarkGfm from "remark-gfm";

type TruncatedMarkdownProps = {
  text: string;
  maxLength: number;
  onClickTruncated?: any;
};
type TruncatedMarkdownType = (props: TruncatedMarkdownProps) => JSX.Element;

export const ModifiledTruncatedMarkdown: TruncatedMarkdownType = function ({ text, maxLength, onClickTruncated = null }) {
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
  // const temp = resultLines.join("\n\n");
  if (result.length != text.length) {
    if (onClickTruncated) {
      return <DefaultText text={result} optionalText={"...더보기"} onClick={onClickTruncated} />;
    }
    return <DefaultText text={result.concat("...")} />;
  }
  return <DefaultText text={result} />;
};

function TruncatedText({ text, maxLength }) {
  const [full, setfull] = useState(false);
  return full ? (
    <DefaultText text={text} optionalText={"간략히"} onClick={() => setfull(false)} />
  ) : (
    <ModifiledTruncatedMarkdown text={text} maxLength={maxLength} onClickTruncated={() => setfull(true)} />
  );
}

export function DefaultText({
  text,
  optionalText = "",
  onClick = () => {
    return;
  },
}) {
  return (
    <Div breakAll maxWFull>
      <ReactMarkdown remarkPlugins={[remarkGfm]} children={text} />
      {optionalText != "" && (
        <Div onClick={onClick} cursorPointer fontBold>
          {optionalText}
        </Div>
      )}
    </Div>
  );
}

export default TruncatedText;
