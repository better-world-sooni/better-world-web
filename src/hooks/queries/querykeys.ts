//모든 Query Key를 적어주면 될듯

const querykeys = {
    admin: {
        userlist: {
            _: (page_size:Number, offset:Number) => ['userlist', page_size, offset],
            count: ['userlist', 'count'],
            post: (contract_address, token_id, page_size, offset) => ['userlist', 'post', contract_address, token_id, page_size, offset],
        },
    }
}

export default querykeys