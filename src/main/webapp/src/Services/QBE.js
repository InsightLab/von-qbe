import api  from '.';

export const ServiceApiQBE = {

  listDatabases: () => {
    return api.get("databases");
  },

};
