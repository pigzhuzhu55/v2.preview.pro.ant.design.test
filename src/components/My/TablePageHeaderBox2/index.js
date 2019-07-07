import React, { Component } from 'react';
import { Input, Button, Icon } from 'antd';

import MyDropList from '@/components/My/MyDropList';
import MySelectBox from '@/components/My/MySelectBox';

import classNames from 'classnames';

import styles from './index.less';

export default class TablePageHeaderBox2 extends Component {
    constructor(props) {
      super(props);
      this.state = { count: 0 };
    }

    render() {
        const { buttons } = this.props;

        return (
          <div className={styles.box}>
            <div style={{width:'100%'}}>
                <a className={classNames(styles.filterlabel, 'floatR')} >
                    更多筛选 <Icon type="down" />
                </a>
                <div className={styles.droplistbox}>
                    <MyDropList />
                </div>
                <div >
                  <a className='floatR' >
                      清空筛选 
                  </a>
                  <div className={styles.selectedbox}> 
                    <MySelectBox />
                    <MySelectBox />
                  </div>
                </div>
            </div>
          </div>
        );
      }
    }
    