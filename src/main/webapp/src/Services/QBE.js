import api  from '.';

export const ServiceApiQBE = {

  listDatabases: () => {
    return api.get("databases");
  },

  getSuggestions: (text, database) => {
    return api.get(`helper?text=${encodeURIComponent(text)}&database=${database}`);
  },

  getSocketURL: () => {
    return api.defaults.baseURL.replace("http://","ws://");
  }

};
