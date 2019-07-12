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

  handleChangeSelect(childPros) {
    const { filters } = this.state;

    filters.forEach(item => {
      if (item.key === childPros.name) {
        item.value = childPros.value;
        item.options = childPros.options;
      }
    });

    this.setState({
      filters,
    });
  }

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
    });
    this.setState({
      filters,
    });
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
              {showMore ? '收齐更多' : '更多筛选'} <Icon type={showMore ? 'up' : 'down'} />
            </a>
          )}
          <div className={styles.droplistbox}>
            {filters.map((item, index) => (
              <MyDropList
                name={item.key}
                {...item}
                showItemSeparator={index !== 0}
                onChange={childPros => this.handleChangeSelect(childPros)}
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
