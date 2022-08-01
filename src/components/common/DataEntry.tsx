import Div from "../Div";
import { Tooltip } from "@mui/material";

export default function DataEntry({name="", w, label, data, dataEnabled=true}) {
	return (
		name=="" ?
 		<Div selfCenter justifyItemsStart w={w} flex flexRow ml25 mr25>
		{label}{dataEnabled ? (data ? data : 0) : ""}
		</Div>
	:
	<Tooltip title={name} arrow>
	<Div selfCenter justifyItemsStart w={w} flex flexRow ml25 mr25>
	{label}{dataEnabled ? (data ? data : 0) : ""}
	</Div>
	</Tooltip>
	);
}

export function DataEntryWithoutMargin({name="", w, label, data, dataEnabled=true}) {
	return (
		name=="" ?
 		<Div w={w} flex flexRow>
		{label}{dataEnabled ? (data ? data : 0) : ""}
		</Div>
	:
	<Tooltip title={name} arrow>
	<Div w={w} flex flexRow>
	<Div selfCenter>{label}</Div><Div selfCenter>{dataEnabled ? (data ? data : 0) : ""}</Div>
	</Div>
	</Tooltip>
	);
}