import React from 'react';
import {inject,observer} from 'mobx-react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import {setLocalItem} from '../../../../../util/util';
import {getCitiesData,setCity} from '../../../../../fetch/home/cities';
import {getWeatherData} from '../../../../../fetch/home/weather';

import SmallTitleBar from '../../../../../components/SmallTitleBar';
import Popup from '../../../../../components/Popup';
import SubHeader from '../../../../../components/SubHeader';

import styles from './style.less';

@inject ('userStore','stateStore')
@observer class City extends React.Component{
    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state={
            cityData:[],
            curProvinceIndex:'',
            popupShow:false,
            selectedCity:'',
            hotCity:['北京市','上海市','天津市','杭州市','西安市','成都市','郑州市','厦门市','青岛市','深圳市','太原市','重庆市','武汉市','广州市','南京市','沈阳市','济南市','哈尔滨市'],
        }
    }
    
    componentWillMount(){
        const result = getCitiesData();
        result
        .then((json)=>{
            this.setState({
                cityData:this.state.cityData.concat(json)
            })
        })
        .catch((e)=>{
            this.props.stateStore.setTips('fail','获取城市出错')
        });
    }

    //点击省份更换城市列表
    changeProvince(index){
        this.setState({
            curProvinceIndex:index,
            popupShow:true
        })
    }

    //选择城市
    chooseCity(e){
        let city = e.target.innerText;
        this.setState({
            selectedCity:city
        })
    }

    //选择热门城市
    chooseHotCity(e){
        let city = e.target.innerText;

        const res = setCity({
            id:this.props.userStore.user.id,
            city:city
        });
        res
        .then((city)=>{
            this.setState({
                selectedCity:city
            });
            this.props.userStore.setUser({city:city});
            this.props.stateStore.setTips('success','更新成功','2rem');
            this.props.history.goBack();
            this.updateWeather(city);
        })
        .catch((e)=>{
            this.props.stateStore.setTips('fail',e);
        })
    }

    //取消选择
    cancel(e){
        const curSelectedCity = this.state.selectedCity;
        this.setState({
            popupShow:false,
            selectedCity:curSelectedCity
        })
    }

    //确认选择
    confirm(){
        const city = this.state.selectedCity;
        if(city===""){
            this.props.stateStore.setTips('fail','请选择城市');
            return;
        }
        
        const res = setCity({
            id:this.props.userStore.user.id,
            city:city
        });
        res
        .then((city)=>{
            this.props.userStore.setUser({city:city});
            this.props.stateStore.setTips('success','更新成功','2rem');
            this.setState({
                popupShow:false
            },()=>{
                this.props.history.goBack();
                this.updateWeather(city);
            });
        })
        .catch((e)=>{
            this.props.stateStore.setTips('fail',e);
        })
    }

    //更新mobx天气
    updateWeather(city){
        getWeatherData(city)
        .then((data)=>{
            this.props.stateStore.setTips('success','更新成功','2rem');
            this.props.stateStore.setWeather({
                temperature:data.temperature,
                weatherIcon:data.weatherIcon,
                pm25:data.pm25 || '0',
                quality:'',
                type:data.type,
                lowTem:data.lowTem,
                highTem:data.highTem,
                wind:data.wind,
                dayData:data.forecast
            })
        })
        .catch((e)=>{
            this.props.stateStore.setTips('fail','暂时无法获得该城市的天气数据');
        })
    }

    render(){
        return(
            <div className="cityPage">
                <SubHeader title="修改城市" bgColor={this.props.stateStore.themeColor[this.props.stateStore.curThemeIndex].mainColor}/>
                <SmallTitleBar title="定位城市"/>
                <div className="gpsCity">
                    <span>暂时无法定位，请手动选择城市</span>
                </div>
                <SmallTitleBar title="热门城市" />
                <div className="hotCity" onClick={this.chooseHotCity.bind(this)}>
                    {
                        this.state.hotCity.map((item,index)=>{
                            return(
                                <span key={index}>{item}</span>
                            )
                        })
                    }
                </div>
                <SmallTitleBar title="全部城市" />
                <div className="wholeCity">
                    <p>请选择所在省份：</p>
                    <div className="provinces">
                        {
                            this.state.cityData.map((item,index)=>{
                                return(
                                    <span className="province" 
                                          key={index} 
                                          onClick={this.changeProvince.bind(this,index)}>
                                    {item.provinceName}
                                    </span>
                                )
                            })
                        }
                    </div>
                    {
                        this.state.curProvinceIndex===''?'':
                        <Popup 
                           show={this.state.popupShow}
                           selected={this.state.selectedCity}
                           items={this.state.cityData[this.state.curProvinceIndex].citys}
                           contentHandle={this.chooseCity.bind(this)}
                           cancelHandle={this.cancel.bind(this)}
                           confirmHandle={this.confirm.bind(this)}/>
                    }
                </div>
            </div>
        )
    }

}

export default City;