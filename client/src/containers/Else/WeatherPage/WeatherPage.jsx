import React from 'react';
import {inject,observer} from 'mobx-react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import {getClientSize,reverseChangeByRatio} from '../../../util/util';

import SubHeader from '../../../components/SubHeader';

import styles from './style.less';

const clientSize = getClientSize();

@inject('stateStore','userStore')
@observer class WeatherPage extends React.Component{
    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.refreshEnd=false;
    }

    switchIcon(weatherType){
        let weatherIcon;
        switch (weatherType){
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
        return weatherIcon;
    }

    getDay(day){
        const weekDay = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'];
        return weekDay[day];
    }

    drawWeatherLine(){
        const canvas = this.refs.weatherLine;
        const ctx = canvas.getContext('2d');
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const firstLeft = canvasWidth/12;
        const pointGap = canvasWidth/6;
        const pointLeft = [];
        const lowest = 0;
        const highest = 35;

        //六个点的left值
        pointLeft.push(firstLeft);
        for(let i=1;i<6;i++){
            pointLeft.push(firstLeft+pointGap*i);
        }
        
        const highPointTop = []; //上六个点的top值
        const lowPointTop = []; //下六个点的top值
        const highTem = []; //高温数组
        const lowTem = [];  //低温数组
        //填充高温数组
        for(let i=0;i<6;i++){
            let high = Number(this.props.stateStore.weather.dayData[i].tmp_max);
            if(high>highest){
                high=highest;
            }else if(high<lowest){
                high=lowest;
            }
            highTem.push(high);
        }
        //填充低温数组
        for(let i=0;i<6;i++){
            let low = Number(this.props.stateStore.weather.dayData[i].tmp_min);
            if(low>highest){
                low=highest;
            }else if(low<lowest){
                low=lowest;
            }
            lowTem.push(low)
        }

        const halfCanvasHeight = canvasHeight/2;//把canvas分成两半
        //填充上六个点的top值
        for(let i=0;i<6;i++){
            highPointTop.push(reverseChangeByRatio(highest,lowest,halfCanvasHeight,0,highTem[i]))
        }

        //填充下六个点的top值
        for(let i=0;i<6;i++){
            lowPointTop.push(reverseChangeByRatio(highest,lowest,canvasHeight,halfCanvasHeight,lowTem[i]))
        }


        ctx.lineWidth = 1;
        ctx.strokeStyle = 'white';
        ctx.fillStyle = 'white';
        //画高温折线
        ctx.beginPath();
        ctx.moveTo(pointLeft[0],highPointTop[0]);
        ctx.lineTo(pointLeft[1],highPointTop[1]);
        ctx.lineTo(pointLeft[2],highPointTop[2]);
        ctx.lineTo(pointLeft[3],highPointTop[3]);
        ctx.lineTo(pointLeft[4],highPointTop[4]);
        ctx.lineTo(pointLeft[5],highPointTop[5]);
        ctx.stroke();
        ctx.closePath();
        //画低温折线
        ctx.beginPath();
        ctx.moveTo(pointLeft[0],lowPointTop[0]);
        ctx.lineTo(pointLeft[1],lowPointTop[1]);
        ctx.lineTo(pointLeft[2],lowPointTop[2]);
        ctx.lineTo(pointLeft[3],lowPointTop[3]);
        ctx.lineTo(pointLeft[4],lowPointTop[4]);
        ctx.lineTo(pointLeft[5],lowPointTop[5]);
        ctx.stroke();
        ctx.closePath();
        //画今天的高温圆点
        ctx.beginPath();
        ctx.moveTo(pointLeft[1],highPointTop[1]);
        ctx.arc(pointLeft[1],highPointTop[1],3,0,Math.PI*2,false);
        ctx.fill();
        ctx.closePath();
        //画今天的低温圆点
        ctx.beginPath();
        ctx.moveTo(pointLeft[1],lowPointTop[1]);
        ctx.arc(pointLeft[1],lowPointTop[1],3,0,Math.PI*2,false);
        ctx.fill();
        ctx.closePath();
        //画两点之间的线
        ctx.beginPath();
        ctx.setLineDash([8, 9]);
        ctx.moveTo(pointLeft[1],highPointTop[1]);
        ctx.lineTo(pointLeft[1],lowPointTop[1]);
        ctx.stroke();
        ctx.closePath();
    }

    componentDidUpdate(){
        if(this.refreshEnd){
            this.drawWeatherLine()
        }
    }

    componentDidMount(){
        if(this.refreshEnd){
            this.drawWeatherLine()
        }
    }

    render(){
        const now = new Date();
        const hours = Number(now.getHours());
        const showHour = (now.getHours()+'').padStart(2,0);
        const showMin = (now.getMinutes()+'').padStart(2,0);
        const dayOrNight = hours>6 && hours<19?'dayBg':'nightBg';
        const width = clientSize.width+'px';
        const height = clientSize.height+'px';
        
        if(this.props.stateStore.weather.highTem){
           this.refreshEnd=true;
        }
        return(
            <div className="weatherPage">
                <SubHeader/>
                <div className={'weatherBox '+ dayOrNight} style={{width:width,minHeight:height}}>
                    <header>
                        <div className="air">
                            <span>实时空气质量</span>
                            <span className="air-btn">{'pm2.5: '+this.props.stateStore.weather.pm25+' 良'}</span>
                        </div>
                        <div className="time">
                            <div className="timeTop">
                                <span>{"更新于"+showHour+':'+showMin}</span>
                                <span>{this.props.userStore.user.city}</span>
                            </div>
                            <div className="timeBottom">
                                <span>{(now.getMonth()+1)+'月'+now.getDate()+'日 '+this.getDay(now.getDay())}</span>
                            </div>
                        </div>
                    </header>
                    <div className="curTemp">
                        <p>{this.props.stateStore.weather.temperature+'°'}</p>
                        <span>{this.props.stateStore.weather.type}</span>
                    </div>
                    <div className="todayTemp">
                        {"今天：  "+this.props.stateStore.weather.lowTem+'~'+this.props.stateStore.weather.highTem+'   '+this.props.stateStore.weather.type +'   '+ this.props.stateStore.weather.wind}
                    </div>
                    <div className="everyDay">
                       {
                        this.props.stateStore.weather.dayData.map((item,index)=>{
                            return(
                                <div className="day" key={index}>
                                    <span className="perDay">{item.date.substr(5)}</span>
                                    <i className={"iconfont "+this.switchIcon(item.cond_txt_d)}></i>
                                    <span className="high">{item.tmp_max+'℃'}</span>
                                    <span className="low">{item.tmp_min+'℃'}</span>
                                    <span className="wind">{item.wind_dir}</span>
                                    <span className="windl">{item.wind_sc+'级'}</span>
                                </div>
                            )
                        })  
                       }
                   </div>
                   <canvas id="weatherLine" ref="weatherLine"></canvas>
                </div>
            </div>
        )
    }

}


export default WeatherPage;