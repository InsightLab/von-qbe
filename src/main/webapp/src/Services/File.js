import api  from '.';

export const ServiceApiFile = {

  addFile: ( { name, file1, file2, file3 } ) => {
    let data = new FormData();
    data.append("name", name);
    data.append("file1", file1);
    data.append("file2", file2);
    data.append("file3", file3);
    return api.post("uploadFile", data);
  },

};
