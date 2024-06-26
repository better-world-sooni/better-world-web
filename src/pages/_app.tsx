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
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query'
import React from "react";

const queryClient = new QueryClient({
	defaultOptions: {
	queries: {
	  retry: 0,
	  useErrorBoundary: true,
	  refetchOnWindowFocus: false,
	},
	mutations: {
	  useErrorBoundary: true,
	},
  },})

function MyApp({ Component, pageProps }: AppProps) {
	const [_, setPrevPage] = useSessionStorage("prevPage", null);
	setJwt(pageProps.jwt)
	const router = useRouter();
	useEffect(() => {
		return () => {
			setPrevPage(router.pathname);
		};
	}, [router]);
	return (
		<QueryClientProvider client={queryClient}>
		<Hydrate state={pageProps.dehydratedState}>
		  <Component {...pageProps} />
		</Hydrate>
	  </QueryClientProvider>
	);
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
	const oldJwt = ctx?.req?.headers?.webviewcookie || cookies(ctx).jwt;
	const requiresLogin = ctx.pathname != "/" && ctx.pathname != "/[lang]"
	let currentUser = null;
	let currentNft = null;
	let jwt = null;
	if (requiresLogin) {
		if (oldJwt) {
			const authResponse = await apiHelperWithJwtFromContext(ctx, apis.auth.user._(), "GET");
			if (authResponse.success) {
				currentUser = authResponse.user;
				currentNft = authResponse.current_nft;
				jwt = authResponse.jwt;
			} 
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
		const componentAsyncProps = await Component.getInitialProps(ctx, queryClient);
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
