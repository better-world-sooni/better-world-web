import { apiHelperWithToken } from "./apiHelper";
import apis from "./apis";
import { setJwt } from "./cookieHelper";

async function createCurrentNftJwt(contract_address, token_id) {
    const res = await apiHelperWithToken(apis.auth.jwt(), 'POST', {
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