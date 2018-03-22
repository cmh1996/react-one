import { get } from '../get';

export function getWeatherData(city) {
    const result = get('/api/weather/?city='+city);
    return new Promise((resolve,reject)=>{
    	result
    	.then((res)=>{
    		if(res.status===200){
    			return res.json();
    		}else{
    			reject(res.status);
    		}
    	})
    	.then((json)=>{
    		return json.HeWeather6[0];
    	})
    	.then((res)=>{
    		let weatherIcon;
            switch (res.daily_forecast[0].cond_txt_d){
                case '多云': weatherIcon = 'icon-tianqi'
                break;
                case '阴': weatherIcon = 'icon-tianqi'
                break;
                case '阵雨': weatherIcon = 'icon-xue'
                break;
                case '小雨': weatherIcon = 'icon-xue'
                break;
                case '中雨': weatherIcon = 'icon-xue'
                break;
                case '雷阵雨': weatherIcon = 'icon-tianqi2'
                break;
                case '晴': weatherIcon = 'icon-tianqi1'
                break;
                case '晴间多云': weatherIcon = 'icon-tianqi'
                break;
                default: weatherIcon = 'icon-weather'
            }
            resolve({
                temperature:Math.floor((Number(res.daily_forecast[0].tmp_max)+Number(res.daily_forecast[0].tmp_min))/2),
                weatherIcon:weatherIcon,
             	pm25:res.daily_forecast[0].uv_index || '0',
                type:res.daily_forecast[0].cond_txt_d,
                lowTem:res.daily_forecast[0].tmp_min+'℃',
                highTem:res.daily_forecast[0].tmp_max+'℃',
                wind:res.daily_forecast[0].wind_dir,
                forecast:res.daily_forecast.concat(res.daily_forecast)
            })
    	})
    	.catch((e)=>{
    		reject(e.toString());
    	})
    })
}
