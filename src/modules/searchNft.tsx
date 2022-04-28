import React, { useState, useCallback, useEffect, useMemo } from 'react';
import Div from "src/components/Div";
import Row from "src/components/Row";
import Col from "src/components/Col";
import { useQuery, QueryClient, QueryClientProvider, useQueryClient } from 'react-query';
import apis from "src/modules/apis";
import { apiHelperWithToken } from "src/modules/apiHelper";


const getResultByKeyword = async keyword => {
    const res = await apiHelperWithToken(apis.search.nft(encodeURIComponent(keyword)), "GET");
    const data = res.results
    return data;
};
  
const useResults = keyword => {
    return useQuery(['keyword', keyword], () => getResultByKeyword(keyword), {
      enabled: !!keyword,
      select: (data) => data.slice(0, 10),
    });
};

const ResultList = ({ inputValue, setInputValue }) => {
    const { status, data, error } = useResults(inputValue);
    const onHandleList = name => {
        setInputValue(name);
    };
    switch (status) {
      case 'loading':
        return <div>Loading</div>;
      case 'error':
        return <span>Error: {error}</span>;
      default:
        return (
          <ul>
            {data?.map((item, index) => {
                const name = item.name || item.nft_metadatum.name
                return (
                    <Row key={index} cursorPointer onClick={()=>onHandleList(name)}>
                        <Col>
                            <Div imgTag src={item.nft_metadatum.image_uri} bgGray200 h50 w50 roundedFull></Div>
                        </Col>
                        <Col>
                            {name}
                        </Col>
                    </Row>
                )
            })}
          </ul>
        );
    }
};

const debounce = (callback, duration) => {
    let timer; 
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => callback(...args), duration)
    };
};

const SearchNft = () => {
    const [inputValue, setInputValue] = useState('');
    const [searchValue, setSearchValue] = useState('');
    const [name, setName] = useState('seungan')
    
	const queryClient = new QueryClient();


    const debounceSet = useMemo(() => debounce(setSearchValue, 500), []);

	const onChangeInput = e => {
        setInputValue(e.target.value)
		debounceSet(e.target.value)
    };

    return (
			<QueryClientProvider client={queryClient}>
				<input
					placeholder="NFT 찾기"
					className={" rounded w-full bg-gray-200 text-sm focus:outline-none focus:border-gray-400"}
					style={{ height: 32, paddingLeft: 10, paddingRight: 10 }}
					onChange={onChangeInput}
					value={inputValue}
				/>
				<ResultList inputValue={searchValue} setInputValue={setInputValue} />
			</QueryClientProvider>
		);
}
export default SearchNft;


