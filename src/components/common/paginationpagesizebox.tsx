import Div from "../Div";
import { useState } from 'react'
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import {defaultPageSize} from 'src/hooks/queries/admin/userlist'

export default function PaginationPageSizebox({handlePaginationPageSizeChange, page_size}) {
	const [PageSize, setPageSize] = useState(String(page_size));

	const handleChange = (event: SelectChangeEvent) => {
	  handlePaginationPageSizeChange(Number(event.target.value as string))
	  setPageSize(event.target.value as string);
	};
return (
	<Div minW={50} maxW={50} mb5>
      <FormControl variant="standard">
        <Select
          value={PageSize}
          onChange={handleChange}
        >
          <MenuItem value={(defaultPageSize/2).toFixed()}>{String((defaultPageSize/2).toFixed())}</MenuItem>
          <MenuItem value={defaultPageSize}>{String(defaultPageSize)}</MenuItem>
          <MenuItem value={defaultPageSize*2}>{String(defaultPageSize*2)}</MenuItem>
        </Select>
      </FormControl>
	</Div>
)
}