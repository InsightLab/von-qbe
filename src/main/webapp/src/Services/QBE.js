import api  from '.';

export const ServiceApiQBE = {

  listDatabases: () => {
    return api.get("databases");
  },

  getSuggestions: (text, database) => {
    //const param = { text: encodeURIComponent(text), database: database };
    //return api.get(`helper?text=${encodeURIComponent(text)}&database=${database}`);
    return api.get("helper", { params: {
      text: encodeURIComponent(text),
      database
    }});
  },

  getSocketURL: () => {
    return api.defaults.baseURL.replace("http://","ws://");
  }

};
