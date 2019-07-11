import React, { Component } from 'react';
import { Input, Button, Icon } from 'antd';
import PropTypes from 'prop-types';
import md5 from 'js-md5';

import MyDropList from '@/components/My/MyDropList';
import MySelectBox from '@/components/My/MySelectBox';

import classNames from 'classnames';
import EVENT from './../EventEmit';

import styles from './index.less';

export default class TablePageHeaderBox2 extends Component {
  static propTypes = {
    filters: PropTypes.any,
    maxFilterNum: PropTypes.number,
  };

  static defaultProps = {
    filters: {},
    maxFilterNum: 5,
  };

  constructor(props) {
    super(props);
    const { filters } = this.props;
    this.state = {
      filters,
      showMore: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    const {
      filters: { version: version2, filters },
    } = nextProps;
    const {
      filters: { version },
    } = this.props;
    if (version !== version2) {
      this.setState({
        filters: {
          version: version2,
          filters,
        },
      });
    }
  }

  hiddenAllDropList = () => {
    EVENT.emit('HideDropList');
  };

  handleChangeSelect = (ops, key) => {
    const {
      filters: { filters },
    } = this.state;

    filters.forEach(item => {
      if (item.key === key) {
        item.options = ops;
      }
    });

    this.setState({
      filters: {
        filters,
      },
    });
  };

  handleToggleFilter = () => {
    const { showMore } = this.state;
    this.setState({
      showMore: !showMore,
    });
  };

  handleClearSelect = () => {
    const {
      filters: { filters },
      showMore,
    } = this.state;

    filters.forEach(item => {
      if (Array.isArray(item.options.options)) {
        item.options.options.forEach(a => {
          a.checked = false;
        });
      } else if (typeof item.options.options === 'string') {
        item.options.options = '';
      }
    });
    this.setState({
      filters: {
        filters,
      },
    });
  };

  render() {
    const { maxFilterNum } = this.props;
    const {
      filters: { filters },
      showMore,
    } = this.state;

    return (
      <div className={styles.box}>
        <div style={{ width: '100%' }}>
          {filters.length > maxFilterNum && (
            <a
              className={classNames(styles.filterlabel, 'floatR')}
              onClick={this.handleToggleFilter}
            >
              {showMore ? '收齐更多' : '更多筛选'} <Icon type={showMore ? 'up' : 'down'} />
            </a>
          )}
          <div className={styles.droplistbox}>
            {filters.map((item, index) => (
              <MyDropList
                key={item.key}
                name={item.key}
                text={item.text}
                type={item.type}
                showItemSeparator={index < filters.length - 1}
                options={item.options}
                hiddenAllDropList={this.hiddenAllDropList}
                onChange={this.handleChangeSelect}
                style={{
                  display: index < maxFilterNum || showMore ? '' : 'none',
                }}
              />
            ))}
          </div>
          <div>
            {filters.some(
              item =>
                (Array.isArray(item.options.options) &&
                  item.options.options.some(a => a.checked)) ||
                (typeof item.options.options === 'string' && item.options.options !== '')
            ) && (
              <a className="floatR" onClick={this.handleClearSelect}>
                清空筛选
              </a>
            )}
            <div className={styles.selectedbox}>
              {filters.map(
                item =>
                  ((Array.isArray(item.options.options) &&
                    item.options.options.some(a => a.checked)) ||
                    (typeof item.options.options === 'string' && item.options.options !== '')) && (
                    <MySelectBox
                      name={item.key}
                      text={item.text}
                      key={item.key}
                      options={item.options}
                      onChange={this.handleChangeSelect}
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
