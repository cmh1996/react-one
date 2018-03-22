//获取屏幕宽高
export function getClientSize(){
	let h = window.innerHeight;
	let w = window.innerWidth;
	return {
		width:w,
		height:h
	}
}

//rem转px，1rem代表的px
export const perRem = 20 * (getClientSize().width / 320);

//按比例对应数值，用于canvas画图:参数是原始最大最小值，对应比例的最大最小值，要转换的值
export function changeByRatio(originMax,originMin,afterMax,afterMin,num){
	if (typeof originMax !== 'number' ||
		typeof originMin !== 'number' ||
		typeof afterMax !== 'number' ||
		typeof afterMin !== 'number' ||
		typeof num !== 'number'
		){
		console.log('请输入数值');
		return;
	}
	if(originMax<=originMin || afterMax<=afterMin){
		console.log('请按指定参数顺序输入值');
		return;
	}
	if(num<originMin || num>originMax){
		console.log('数值应该在原始范围内');
		return;
	}
	const originScale = Math.abs(originMax - originMin);
	const afterScale = Math.abs(afterMax - afterMin);
	const originRatio = (num-originMin)/originScale;
	const afterNum = afterMin + afterScale*originRatio;
	return afterNum;
}

//按反比例对应数值，用于canvas画图:参数是原始最大最小值，对应比例的最大最小值，要转换的值
export function reverseChangeByRatio(originMax,originMin,afterMax,afterMin,num){
	if (typeof originMax !== 'number' ||
		typeof originMin !== 'number' ||
		typeof afterMax !== 'number' ||
		typeof afterMin !== 'number' ||
		typeof num !== 'number'
		){
		console.log('请输入数值');
		return;
	}
	if(originMax<=originMin || afterMax<=afterMin){
		console.log('请按指定参数顺序输入值');
		return;
	}
	if(num<originMin || num>originMax){
		console.log('数值应该在指定范围内');
		return;
	}
	const originScale = originMax - originMin;
	const afterScale = afterMax - afterMin;
	const originRatio = (num-originMin)/originScale;
	const afterNum = afterMin + afterScale*originRatio;

	const midAfterNum = afterMin+(afterScale/2);
	const diff = midAfterNum - afterNum;
	const reverseAfterNum = midAfterNum + diff;
	return reverseAfterNum;
}

//取本地储存数据
export function getLocalItem(key){
    let value;
    try {
        value = localStorage.getItem(key);
    } catch (ex) {
        // 开发环境下提示error
        if (__DEV__) {
            console.error('localStorage.getItem报错, ', ex.message);
        }
    } finally {
        return value;
    }
}

//设置本地储存数据
export function setLocalItem(key, value){
    try {
        // ios safari 无痕模式下，直接使用 localStorage.setItem 会报错
        localStorage.setItem(key, value);
    } catch (ex) {
        // 开发环境下提示 error
        if (__DEV__) {
            console.error('localStorage.setItem报错, ', ex.message);
        }
    }
}

//取会话储存数据
export function getSessionItem(key){
    let value;
    try {
        value = sessionStorage.getItem(key);
    } catch (ex) {
        // 开发环境下提示error
        if (__DEV__) {
            console.error('sessionStorage.getItem报错, ', ex.message);
        }
    } finally {
        return value;
    }
}

//设置会话储存数据
export function setSessionItem(key, value){
    try {
        // ios safari 无痕模式下，直接使用 sessionStorage.setItem 会报错
        sessionStorage.setItem(key, value);
    } catch (ex) {
        // 开发环境下提示 error
        if (__DEV__) {
            console.error('sessionStorage.setItem报错, ', ex.message);
        }
    }
}


//转换为XX万数字
export function convertUnit(num){
    if(num<10000){
        return num;
    }else{
        return Number(num/10000).toFixed(1)+'万';
    }
}

//unicode转中文
export function decode(unicode){
    return unicode.replace(/&#(\d+);/g, function(match, dec) {
        return String.fromCharCode(dec);
    });
}

//准化为00:00这种格式
export function convertTime(seconds){
    return [
        parseInt(seconds / 60 % 60),
        parseInt(seconds % 60)
    ].join(":").replace(/\b(\d)\b/g, "0$1");
}

//数组乱序
export function shuffle(arr){
	for(let i=arr.length-1;i>=0;i--){
		let randomIndex = Math.floor(Math.random()*(i+1));
		let itemAtIndex = arr[randomIndex];
		arr[randomIndex] = arr[i];
		arr[i] = itemAtIndex;
	}
	return arr;
}

//格式化时间
export function formalTime(year=1,month=1,date=1,hour=0,minute=0,second=0){
	const formalYear =(year+'').padStart(4,0);
	const formalMonth = (month+'').padStart(2,0);
	const formalDate = (date+'').padStart(2,0);
	const formalHour = (hour+'').padStart(2,0);
	const formalMinute = (minute+'').padStart(2,0);
	const formalSecond = (second+'').padStart(2,0);
	return `${formalYear}-${formalMonth}-${formalDate} ${formalHour}:${formalMinute}:${formalSecond}`;
}