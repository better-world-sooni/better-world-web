import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { loginAction } from "src/store/reducers/authReducer";
import { apiHelper, apiHelperWithToken } from "./apiHelper";
import apis from "./apis";
import { PLATFORM } from "./constants";
import { setJwt } from "./cookieHelper";

async function createCurrentNftJwt(contract_address, token_id) {
    const res = await apiHelperWithToken(apis.auth.jwt._(), 'POST', {
        contract_address,
        token_id
    })
    if(!res.success){
        return null
    }
    return res.jwt
}

export async function setCurrentNftJwt({contract_address, token_id}) {
    const jwt = await createCurrentNftJwt(contract_address, token_id)
    setJwt(jwt);
}

export const useLoginWithKaikas = () => {
    
    const { locale } = useRouter();
	const dispatch = useDispatch();
    
    return async () => {
        // @ts-ignore
        if (typeof window !== "undefined" && typeof window.klaytn !== "undefined") {
            const klaytn = window["klaytn"];
            try {
                const res = await klaytn.enable();
                const selectedAddress = res[0];
                const caver = window["caver"];
                if (caver && selectedAddress) {
                    const nonceResponse = await apiHelper(apis.auth.kaikas.nonce(), "POST", {
                        address: selectedAddress,
                        platform: PLATFORM,
                        locale: locale,
                    });
                    if (nonceResponse.success) {
                        const signature = await caver.klay.sign(nonceResponse.nonce, selectedAddress);
                        const verificationResponse = await apiHelper(apis.auth.kaikas.verification(), "POST", {
                            signature,
                            address: selectedAddress,
                            signup_uuid: typeof nonceResponse.signup == "undefined" ? null : nonceResponse.signup.uuid,
                        });
                        const mainNft = verificationResponse.user.main_nft;
                        const loginParams = {
                            jwt: verificationResponse.jwt,
                        };
                        dispatch(loginAction(loginParams));
                    }
                }
            } catch (error) {}
        } else {
        }
    }
};