import type { AppProps, AppInitialProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect } from "react";
import useSessionStorage from "src/hooks/useSessionStrage";
import { apiHelperWithJwtFromContext } from "src/modules/apiHelper";
import apis from "src/modules/apis";
import { Locale } from "src/modules/constants";
import { setJwt, getJwt } from "src/modules/cookieHelper";
import { wrapper } from "src/store/store";
import cookies from "next-cookies";
import "styles/tailwind.css";

function MyApp({ Component, pageProps }: AppProps) {
	const [_, setPrevPage] = useSessionStorage("prevPage", null);
	setJwt(pageProps.jwt)
	const router = useRouter();
	useEffect(() => {
		return () => {
			setPrevPage(router.pathname);
		};
	}, [router]);
	return <Component {...pageProps} />;
}

const redirectRoot = (ctx) => {
	const { lang = Locale.KO } = ctx.query;
	if (ctx.res) {
		ctx.res.writeHead(302, {
			Location: `/${lang}/`,
		});
		ctx.res.end();
	}
};

MyApp.getInitialProps = async ({ Component, ctx }): Promise<AppInitialProps> => {
	const { jwt: oldJwt } = cookies(ctx);
	const requiresLogin = ctx.pathname != "/" && ctx.pathname != "/[lang]" && !ctx.pathname.startsWith("/[lang]/portal");
	let currentUser = null;
	let currentNft = null;
	let jwt = null
	if (requiresLogin) {
		if (oldJwt) {
			console.log(oldJwt)
			const authResponse = await apiHelperWithJwtFromContext(ctx, apis.auth.user._(), "GET");
			if (!authResponse.success) {
				console.log(authResponse)
				redirectRoot(ctx);
			} else {
				currentUser = authResponse.user;
				currentNft = authResponse.current_nft;
				jwt = authResponse.jwt;
			}
		} else {
			redirectRoot(ctx);
		}
	} else if (oldJwt) {
		const authResponse = await apiHelperWithJwtFromContext(ctx, apis.auth.user._(), "GET");
		if (authResponse.success) {
			currentUser = authResponse.user;
			currentNft = authResponse.current_nft;
			jwt = authResponse.jwt;
		}
	}
	if (Component.getInitialProps) {
		const componentAsyncProps = await Component.getInitialProps(ctx);
		return { pageProps: { ...componentAsyncProps, currentUser, currentNft, jwt } };
	}
	return {
		pageProps: {
			currentUser,
			currentNft,
			jwt,
		},
	};
};
export default wrapper.withRedux(MyApp);
