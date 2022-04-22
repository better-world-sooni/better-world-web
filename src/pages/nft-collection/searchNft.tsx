import React, { useState } from 'react';
import { QueryClientProvider, QueryClient } from 'react-query';
import ResultList from 'src/pages/nft-collection/result'


const SearchNft = () => {
    const [inputValue, setInputValue] = useState('');
	const queryClient = new QueryClient();
	const debounce = (callback, duration) => {
		let timer; 
		return (...args) => {
			clearTimeout(timer);
			timer = setTimeout(() => callback(...args), duration)
		};
	};

	const onChangeInput = e => {
		debounce(setInputValue(e.target.value), 500);
	};

    return (
        <QueryClientProvider client={queryClient}>
			<textarea
                placeholder="search Nft"
                className="m-5 resize-none border-none focus:outline-none w-full"
                onChange={onChangeInput}
                rows={1}
                value={inputValue}
            />				
            <ResultList inputValue={inputValue} setInputValue={setInputValue} />
        </QueryClientProvider>
    )
}

export default SearchNft;


