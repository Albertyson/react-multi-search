class API{
  get(endpoint,params){
    let query = this.objectParamsToString(params);
    const url = `${endpoint}?${query}`;
    return fetch(url);
  }
  objectParamsToString(params){
    let paramsArray = Object.keys(params).map((key)=>{
      return `${key}=${params[key]}`;
    });
    return paramsArray.join("&");
  }
};
export default API;