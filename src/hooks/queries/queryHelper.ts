import { useQuery } from 'react-query'
import { apiHelperWithToken, apiHelperWithJwtFromContext } from "src/modules/apiHelper";
import { useMutation } from 'react-query';

export function queryHelperWithToken({key, url, method = 'GET', body = null, options = null}) {
    return useQuery(key, ()=>apiHelperWithToken(url, method, body), {
      ...options
    })
  }

export function queryHelperPrefetchWithToken({key, queryClient, url, method = 'GET', body = null, options = null}) {
    return queryClient.prefetchQuery(key, ()=>apiHelperWithToken(url, method, body), {
        ...options
    })
}
  
export function queryHelperWithJwtFromContext({key, ctx, url, method = 'GET', body = null, options = null}) {
return useQuery(key, ()=>apiHelperWithJwtFromContext(ctx, url, method, body), {
    ...options
})
}

export function queryHelperInitialPropsWithJwtFromContext({key, queryClient, ctx, url, method = 'GET', body = null, options = null}) {
    return queryClient.prefetchQuery(key, ()=>apiHelperWithJwtFromContext(ctx, url, method, body), {
        ...options
    })
}

export function queryHelperMutationWithToken({url, method, body = null, options = null}) {
    const DoApi = async (body) => {
        const { data } = await apiHelperWithToken(url, method, body)
        return data;
      };
    const mutation = useMutation(DoApi, {
        ...options
    })
    return {...mutation, mutate: ()=>{mutation.mutate(body)}}
}

export function queryHelperMutationWithJwtFromContext({url, ctx, method, body = null, options = null}) {
    const DoApi = async (body) => {
        const { data } = await apiHelperWithJwtFromContext(ctx, url, method, body)
        return data;
      };
    const mutation = useMutation(DoApi, {
        ...options
    })
    return {...mutation, mutate: ()=>{mutation.mutate(body)}}
}