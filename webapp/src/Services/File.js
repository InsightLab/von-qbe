import api  from '.';

export const ServiceApiFile = {

  addFile: ( { name, file1, file2, file3 } ) => {
    let data = new FormData();
    data.append("name", name);
    data.append("file1", file1);
    data.append("file2", file2);
    return api.post("uploadFile", data);
  },

  addVirtuoso: ( { name, databaseURL , databaseURI, squema} ) => {
      let data = new FormData();
      data.append("name", name);
      data.append("linkURL", databaseURL);
      data.append("baseURI", databaseURI);
      data.append("squema", squema);
      return api.post("uploadLink", data);
  }
};
