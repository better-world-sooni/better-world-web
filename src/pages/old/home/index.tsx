import { apiHelperWithJwtFromContext, apiHelperWithToken } from "src/modules/apiHelper";
import { NextPageContext } from "next";
import apis from "src/modules/apis";
import Posts from "src/components/common/Posts";
import WebviewWrapper from "src/components/WebviewWrapper";
import useRefreshContent from "src/hooks/useRefeshContent";
import ActiveCapsules from "src/components/common/ActiveCapsules";
import { CapsuleChannel } from "src/modules/capsuleChannel";
import { useEffect } from "react";
import { cable } from "src/modules/cable";


function Index({ currentUser, currentNft, feed, active_capsules, jwt }) {
	const channel = new CapsuleChannel({home: 'home'})

	const refreshQuery = async () => {
		const res = await apiHelperWithToken(apis.feed._(), "GET");
		return res.feed;
	};
	const [cachedContent, refreshContent] = useRefreshContent(feed, refreshQuery);

	const wsConnect = async () =>{
		await cable(jwt).subscribe(channel)
		// channel.on("")
	};
	const wsDisconnect = () => {
        if(channel) {
            channel.disconnect();
            channel.close();
        }
    };

	useEffect(() => {
		wsConnect();
		return wsDisconnect;
	}, []);

	return (
		<WebviewWrapper currentNft={currentNft} currentUser={currentUser} onRefresh={refreshContent} messageable>
			{/* <ActiveCapsules capsule_owners={cachedContent.active_capsules} currentNft={currentNft} /> */}
			<Posts posts={cachedContent} currentNftImage={currentNft.nft_metadatum.image_uri} />
		</WebviewWrapper>
	);
}



Index.getInitialProps = async (context: NextPageContext) => {
	const res = await apiHelperWithJwtFromContext(context, apis.feed._(), "GET");
	return res;
};
export default Index;
