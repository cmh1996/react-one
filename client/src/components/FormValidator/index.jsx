import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';


/*
表单验证组件
props:{
    val（要检验的value）
    rules（检验规则，从左到右是检验email,必需,长度限制）:{{type: 'email', required:true,maxLen:12}}
    delayValidate（非即时校验）{{hasErr:是否出错,tips:'出错时的tips'}}
}
*/

const styles={
    errTips:{
        color:'#d94a38',
        fontSize:'0.6rem',
        marginTop:'0.3rem',
    }
}


class FormValidator extends React.Component{
    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state={
            hasError:false,
            errTips:''
        };
    }

    componentWillReceiveProps(nextProps){
        if(this.props.val!==nextProps.val){
            this.testVal(nextProps);
        }
        if(this.props.delayValidate && this.props.delayValidate!==nextProps.delayValidate){
            this.testDelay(nextProps);
        }
    }

    testVal(nextProps){
        const val = nextProps.val;
        
        const maxLen = this.props.rules.maxLen?this.props.rules.maxLen:'';
        const required = this.props.rules.required?true:false;
        const testType = this.props.rules.type?this.props.rules.type:'';

        //必填
        if(required){
            if(val==='' || val.trim().length===0){
                this.setState({
                    hasError:true,
                    errTips:'输入框不能为空~'
                })
                return;
            }else{
                this.setState({
                    hasError:false,
                })
            }
        }

        //电子邮箱
        if(testType==='email'){
            const reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/; 
            if(!reg.test(val)){
                this.setState({
                    hasError:true,
                    errTips:'请填写正确的邮箱格式~'
                })
                return;
            }else{
                this.setState({
                    hasError:false,
                })
            }
        }

        //长度限制
        if(maxLen!==''){
            if(val.length>maxLen){
                this.setState({
                    hasError:true,
                    errTips:'请不要超过'+maxLen+'个字符~'
                })
                return;
            }else{
                this.setState({
                    hasError:false,
                })
            }
        }
    }

    testDelay(nextProps){
        const delayValidate = nextProps.delayValidate?nextProps.delayValidate:'';

        //延时验证
        if(delayValidate!==''){
            this.setState({
                hasError:delayValidate.hasErr,
                errTips:delayValidate.tips
            })
        }
    }

    render(){
        return(
           <div className="validator">
                {
                    this.props.children    
                }
                {
                    this.state.hasError?
                    <p className="FormValidatorErrTips" style={styles.errTips}>{this.state.errTips}</p>:''
                }
           </div>
        )
    }

}

export default FormValidator;