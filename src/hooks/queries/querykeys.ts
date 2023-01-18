//모든 Query Key를 적어주면 될듯

const querykeys = {
  admin: {
    userlist: {
      _: (page_size: Number = null, offset: Number = null, search_key: String = null) =>
        page_size || offset || search_key ? ["userlist", "list", search_key, page_size, offset] : ["userlist", "list"],
      post: (contract_address, token_id, page_size: Number = null, offset: Number = null, search_key: String = null) =>
        page_size || offset || search_key
          ? ["userlist", "post", contract_address, token_id, search_key, page_size, offset]
          : ["userlist", "post", contract_address, token_id],
    },
    events: {
      _: (page_size: Number = null, offset: Number = null, search_key: String = null) =>
        page_size || offset || search_key ? ["events", "list", search_key, page_size, offset] : ["events", "list"],
      eventApplication: (eventId, page_size: Number = null, offset: Number = null) =>
        page_size || offset ? ["events", "eventApplication", eventId, page_size, offset] : ["events", "eventApplication", eventId],
      banner: () => ["events", "banners"],
    },
    collections: {
      _: (page_size: Number = null, offset: Number = null, search_key: String = null) =>
        page_size || offset || search_key ? ["collections", "list", search_key, page_size, offset] : ["collections", "list"],
      list: () => ["all", "collections", "list"],
      newCollection: (contract_address) => ["all", "collections", "newCollection", contract_address],
      info: () => ["all", "collections", "info"],
    },
    dashboard: { _: () => ["dashboard"], events: (order, type) => ["dashboard", "events", order, type] },
  },
};

export default querykeys;
