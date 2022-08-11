import Div from "src/components/Div";

export default function SearchBar({w, placeholder, handleSearch, initialText}) {
    const handleChangeSearchText = ({ target: { value } }) =>handleSearch(value);
	return(
        <Div w={w} rounded bgGray100>
            <input
            placeholder={placeholder}
            value={initialText}
            className={"px-5 py-5 ml-10 self-center w-full focus:outline-none focus:border-gray-400 bg-gray-100 rounded-lg"}
            style={{ height: 30, boxShadow: "none", border: "none" }}
            onChange={handleChangeSearchText}></input></Div>
	);
}