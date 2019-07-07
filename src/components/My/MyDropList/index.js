import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input, Icon } from 'antd';

import classNames from 'classnames';

import styles from './index.less';


export default class MyDropList extends Component {

    
    static propTypes = {
        showSearch:PropTypes.bool,
        multiple:PropTypes.bool,
        options:PropTypes.array,
    }

    
    static defaultProps = {
        showSearch:false,
        multiple:false,
    }

    constructor(props) {
      super(props);
      this.state = { 

          options:[
              {title:'报名',key:'1',checked:true},
              {title:'账户余额变动',key:'2',checked:true},
              {title:'账户余额变动222222',key:'3'},
            ],
          showFilterDrop: false,
          activeVals: {},
        };

      this.handleFilterClick = this.handleFilterClick.bind(this);

    }

    componentDidMount() {
       document.addEventListener('click', ()=>{
        this.setState({
            showFilterDrop:false
          });
       });
    }    

    handleFilterClick(e){
        // 阻止合成事件间的冒泡
        //e.stopPropagation();
        // 阻止原生事件与最外层document上的事件间的冒泡
        e.nativeEvent.stopImmediatePropagation();
        const {showFilterDrop}=this.state;
        this.setState({
            showFilterDrop:!showFilterDrop
          });
    }
    handleSelectClick(item,e){
        // 阻止原生事件与最外层document上的事件间的冒泡
        e.nativeEvent.stopImmediatePropagation();
        const {options}=this.state;
        item.checked = !item.checked;
        this.setState({
            options
        });
    }

    render() {

        const {showFilterDrop,options}=this.state;

        return (
            <div className={styles.filterdropitem} >
                <div className={styles.filterdrop}>
                    <div>
                    <span className={styles.filtertitle}  
                     onClick={this.handleFilterClick}
                     >
                        是否欠费 <Icon type="down" />
                    <span className={styles.splitdash}>|</span>
                    </span>
                    </div>
                    <div className={styles.poperwraper}
                     style={{
                         display:showFilterDrop?'':'none'
                         }}
                         >
                        <div className={styles.poper}>
                            <div className={styles.filterscrollbox}>
                            {options.map(
                                item =>
                                item && (
                                    <li className={item.checked?classNames(styles.selected,styles.filteritem):classNames(styles.filteritem)} 
                                    value={item.value}
                                    onClick={this.handleSelectClick.bind(this,item)}
                                    >
                                    {item.title}
                                    {item.checked&&<Icon type="check" />}
                                    </li>
                                )
                            )}
                            </div>  
                        </div>
                    </div>
                </div>
            </div> 
        );
      }
    }
    