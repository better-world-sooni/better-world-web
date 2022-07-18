//모든 Query Key를 적어주면 될듯

const querykeys = {
    admin: {
        userlist: (page_size:Number, offset:Number) => ['user_list', page_size, offset]
    }
}

export default querykeys