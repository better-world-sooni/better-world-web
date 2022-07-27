import Div from "../Div";
import { Tooltip } from "@mui/material";

export default function DataEntry({name="", w, label, data}) {
	return (
		name=="" ?
 		<Div selfCenter justifyItemsStart w={w} flex flexRow ml25 mr25>
		{label}{data}
		</Div>
	:
	<Tooltip title={name} arrow>
	<Div selfCenter justifyItemsStart w={w} flex flexRow ml25 mr25>
	{label}{data}
	</Div>
	</Tooltip>
	);
}

export function DataEntryWithoutMargin({name="", w, label, data}) {
	return (
		name=="" ?
 		<Div w={w} flex flexRow>
		{label}{data}
		</Div>
	:
	<Tooltip title={name} arrow>
	<Div w={w} flex flexRow>
	<Div selfCenter>{label}</Div><Div selfCenter>{data}</Div>
	</Div>
	</Tooltip>
	);
}