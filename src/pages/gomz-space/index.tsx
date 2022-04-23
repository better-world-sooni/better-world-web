import Div from "src/components/Div";
import useIsTablet from "src/hooks/useIsTablet";
import Helmet from "react-helmet";
import dynamic from "next/dynamic";
import FullMapTopBar from "src/components/FullMapTopBar";
import { useEffect, useState } from "react";
import { apiHelper } from "src/modules/apiHelper";
import apis from "src/modules/apis";
import FullMapDetailsShelf from "src/components/FullMapDetailsShelf";
import FullMap from "src/components/FullMap";
import { gifs } from "src/modules/gifs";

const LoadingComponent = () => {
	return (
		<Div hFull wFull bgGray100 flex itemsCenter justifyCenter>
			<Div imgTag src={gifs.loading} w70 h70></Div>
		</Div>
	);
};
export default function GomzSpace({ lands }) {
	const isTablet = useIsTablet();
	const [dynamicallyLoadedFullMap, setDynamicallyLoadedFullMap] = useState(<LoadingComponent />);
	useEffect(() => {
		setTimeout(() => {
			const FullMap = dynamic(() => import("src/components/FullMap"), { loading: LoadingComponent, ssr: false });
			setDynamicallyLoadedFullMap(<FullMap lands={lands} />);
		}, 100);
	}, []);
	return (
		<Div overflowHidden hScreen>
			<Helmet bodyAttributes={{ style: "background-color : black; overflow-x: hidden;" }} />
			<FullMapTopBar mode={"dark"} />
			<Div bgGray100 wFull hFull fixed>
				<FullMap lands={lands} />
			</Div>
			<FullMapDetailsShelf />
		</Div>
	);
}

export async function getServerSideProps() {
	const res = await apiHelper(apis.land.getAll());
	return {
		props: {
			lands: res.data,
		},
	};
};
