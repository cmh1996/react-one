import 'whatwg-fetch';
import 'es6-promise';
import {getLocalItem} from '../util/util';

export function get(url) {
  let trueUrl;
  if (__DEV__) {
      trueUrl = url;
  }else{
      trueUrl = 'http://localhost:3000'+url;
  }

  var result = fetch(trueUrl, {
      //credentials: 'include',
      headers: {
        //'Origin':'http://localhost:8080',        'Accept': 'application/json, text/plain, */*',
        'Authorization':getLocalItem('token')?'Bearer '+getLocalItem('token'):'',
        /*
        'cache-control':'no-cache,no-store',
		'pragma':'no-cache',
		'if-modified-since':0,*/
      }
  });

  return result;
}

