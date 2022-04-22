import React from 'react';
import Div from "src/components/Div";
import Row from "src/components/Row";
import Col from "src/components/Col";
import { useQuery, useQueryClient } from 'react-query';
import apis from "src/modules/apis";
import { apiHelperWithToken } from "src/modules/apiHelper";

const getResultByKeyword = async keyword => {
    const res = await apiHelperWithToken(apis.nftProfile.searchNftName(encodeURIComponent(keyword)), "GET");
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
    const queryClient = useQueryClient();

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
                return (
                    <Row key={index} >
                        <Col>
                            <Div imgTag src={item.nft_metadatum.image_uri} bgGray200 h50 w50 roundedFull></Div>
                        </Col>
                        <Col>
                            {item.nft_metadatum.name}
                        </Col>
                    </Row>

                )
            })}
          </ul>
        );
    }

};

export default ResultList;