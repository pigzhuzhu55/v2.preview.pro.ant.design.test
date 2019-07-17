import React, { Component } from 'react';
import { Input, Button, Icon } from 'antd';
import PropTypes from 'prop-types';
import md5 from 'js-md5';

import MyDropList from '@/components/My/MyDropList';
import MySelectBox from '@/components/My/MySelectBox';

import classNames from 'classnames';

import styles from './index.less';

export default class TablePageHeaderBox2 extends Component {
  static propTypes = {
    filters: PropTypes.array,
    maxFilterNum: PropTypes.number,
    hasChildren: PropTypes.bool,
    parent: PropTypes.string,
  };

  static defaultProps = {
    filters: [],
    maxFilterNum: 5,
    hasChildren: false,
    parent: '',
  };

  constructor(props) {
    super(props);
    const { filters } = this.props;
    this.state = {
      filters,
      showMore: false,
    };
  }

  // componentWillReceiveProps(nextProps) {
  //   const {
  //     filters: { version: version2, filters },
  //   } = nextProps;
  //   const {
  //     filters: { version },
  //   } = this.props;
  //   if (version !== version2) {
  //     this.setState({
  //       filters: {
  //         version: version2,
  //         filters,
  //       },
  //     });
  //   }
  // }

  handleLoadSelect = myProps => {
    const { filters } = this.state;

    filters.forEach(item => {
      if (item.key === myProps.name) {
        item.value = myProps.value;
        item.options = myProps.options;
      }
    });

    this.setState({
      filters,
    });
  };

  handleChangeSelect = myProps => {
    const { filters } = this.state;

    /**
     * 遍历并重新赋值、级联赋值
     */
    let childKey = myProps.child;
    let thisVal = myProps.value;

    filters.forEach(item => {
      if (item.key === myProps.name) {
        item.value = myProps.value;
        item.options = myProps.options;
      }
      // 子节点清空
      else if (item.key === childKey) {
        item.value = '';
        item.options = [];
        item.parentValue = thisVal;

        // 当前节点有子节点，需要递归
        if (myProps.child !== '') {
          childKey = item.child;
          thisVal = item.value;
        }
      }
    });

    this.setState({
      filters,
    });

    this.props.handleSearch();
  };

  handleToggleFilter() {
    const { showMore } = this.state;
    this.setState({
      showMore: !showMore,
    });
  }

  handleClearSelect() {
    const { filters } = this.state;

    filters.forEach(item => {
      item.value = '';
      item.parentValue = '';
    });
    this.setState({
      filters,
    });
    this.props.handleSearch();
  }

  render() {
    const { maxFilterNum } = this.props;
    const { filters, showMore } = this.state;

    return (
      <div className={styles.box}>
        <div style={{ width: '100%' }}>
          {filters.length > maxFilterNum && (
            <a
              className={classNames(styles.filterlabel, 'floatR')}
              onClick={() => this.handleToggleFilter()}
            >
              {showMore ? '收起更多' : '更多筛选'} <Icon type={showMore ? 'up' : 'down'} />
            </a>
          )}
          <div className={styles.droplistbox}>
            {filters.map((item, index) => (
              <MyDropList
                name={item.key}
                {...item}
                showItemSeparator={index !== 0}
                onChange={myProps => this.handleChangeSelect(myProps)}
                onLoad={myProps => this.handleLoadSelect(myProps)}
                style={{
                  display: index < maxFilterNum || showMore ? '' : 'none',
                }}
              />
            ))}
          </div>
          <div>
            {filters.some(item => item.value !== '') && (
              <a className="floatR" onClick={() => this.handleClearSelect()}>
                清空筛选
              </a>
            )}
            <div className={styles.selectedbox}>
              {filters.map(
                item =>
                  item.value !== '' && (
                    <MySelectBox
                      name={item.key}
                      {...item}
                      onChange={childPros => this.handleChangeSelect(childPros)}
                    />
                  )
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
