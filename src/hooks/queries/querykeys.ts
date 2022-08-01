//모든 Query Key를 적어주면 될듯

const querykeys = {
    admin: {
        userlist: {
            _: (page_size:Number=null, offset:Number=null, search_key:String=null) => 
                page_size||offset||search_key ? ['userlist', 'list', search_key, page_size, offset] : ['userlist', 'list'],
            post: (contract_address, token_id, page_size:Number=null, offset:Number=null, search_key:String=null) => 
            page_size||offset||search_key ? ['userlist', 'post', contract_address, token_id, search_key, page_size, offset] : ['userlist', 'post', contract_address, token_id],
        },
    }
}

export default querykeys