import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Input, Icon, DatePicker, Spin } from 'antd';
import request from '@/utils/request';
import classNames from 'classnames';

import styles from './index.less';

const dateFormat = 'YYYY-MM-DD';

export default class MyDropList extends Component {
  static propTypes = {
    showSearch: PropTypes.bool,
    multiple: PropTypes.bool,
    name: PropTypes.string,
    text: PropTypes.string,
    type: PropTypes.string,
    value: PropTypes.string,
    showItemSeparator: PropTypes.bool,
    options: PropTypes.array,
    loadData: PropTypes.func,
    child: PropTypes.string,
    parent: PropTypes.string,
    getParentValue: PropTypes.func,
  };

  static defaultProps = {
    showSearch: false,
    multiple: false,
    name: '',
    text: '',
    value: '',
    showItemSeparator: false,
    type: 'Select',
    options: [],
    loadData: null,
    child: '',
    parent: '',
    getParentValue: null,
  };

  constructor(props) {
    super(props);

    const { options, value } = this.props;

    this.state = {
      options,
      value,
      showFilterDrop: false,
      activeVals: {},
      loading: false,
    };
  }

  componentDidMount() {
    const { options, value, type, loadData, child, parent } = this.props;

    if (type === 'Select') {
      // 说明是第一个下拉，直接加载数据
      if (child !== '' && parent === '') {
        this.setState({
          loading: true,
        });
        loadData().then(response => {
          if (response.code === 0) {
            this.setState({
              loading: false,
              options: response.data,
            });

            // 这里主要是为了更新MySelectBox里面的选项,所以需要传出去
            const nextProps = {
              ...this.props,
              options: response.data,
            };

            this.props.onChange(nextProps);
          }
        });
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const { value, options } = nextProps;

    this.setState({
      value,
      options,
    });
  }

  hideDropList = () => {
    const { showFilterDrop } = this.state;
    if (showFilterDrop) {
      this.setState({
        showFilterDrop: false,
      });
    }
  };

  handleFilterClick = () => {
    const { type, loadData, child, parent, getParentValue } = this.props;
    const { showFilterDrop, value, options, loading } = this.state;

    if (type === 'Select') {
      let parentValue = '';
      if (parent !== '' && getParentValue !== null) {
        parentValue = getParentValue(parent);
      }

      // 父节点有值，且不是双值，且当前节点未加载数据，则从服务的拉取数据
      if (
        parentValue !== '' &&
        !parentValue.includes('|') &&
        value === '' &&
        options.length === 0
      ) {
        this.setState({
          loading: true,
        });
        loadData(parentValue).then(response => {
          if (response.code === 0) {
            this.setState({
              loading: false,
              options: response.data,
            });

            // 这里主要是为了更新MySelectBox里面的选项,所以需要传出去
            const nextProps = {
              ...this.props,
              options: response.data,
            };

            this.props.onChange(nextProps);
          }
        });
      }
    }

    this.setState({
      showFilterDrop: !showFilterDrop,
    });
  };

  handleSelectClick = value => {
    const { type, multiple, child } = this.props;
    let newValues = [];
    if (type === 'Select') {
      if (multiple) {
        newValues = this.props.value.split('|').filter(val => val !== '');
        if (newValues.some(val => val === value)) {
          newValues = newValues.filter(val => val !== value);
        } else {
          newValues.push(value);
        }
      } else {
        newValues.push(value);
      }
    } else {
      newValues.push(`${value.split(',')[0]} ~ ${value.split(',')[1]}`);
    }
    this.setState({
      value: newValues.join('|'),
    });

    const nextProps = {
      ...this.props,
      value: newValues.join('|'),
    };

    this.props.onChange(nextProps);
  };

  render() {
    const { name, text, style, type } = this.props;
    const { showFilterDrop, options, value, loading } = this.state;
    const values = this.props.value.split('|').filter(val => val !== '');
    return (
      <div className={styles.filterdropitem} style={style}>
        {type === 'Select' && (
          // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
          <div className={styles.filterdrop} tabIndex="0" onBlur={() => this.hideDropList()}>
            <div>
              {this.props.showItemSeparator && this.props.parent === '' && (
                <span style={{ marginRight: 10, color: '#d4dfe5' }}>|</span>
              )}
              <span className={styles.filtertitle} onClick={() => this.handleFilterClick()}>
                {text}
                <Icon type={showFilterDrop ? 'up' : 'down'} />
                {this.props.child !== '' && <Icon type="link" />}
              </span>
            </div>
            <div
              className={styles.poperwraper}
              style={{
                display: showFilterDrop ? '' : 'none',
              }}
            >
              <div className={styles.poper}>
                {loading ? (
                  <div className={styles.loading}>
                    <Spin />
                  </div>
                ) : (
                  <div className={styles.filterscrollbox}>
                    {options.map(
                      item =>
                        item && (
                          <li
                            key={item.key}
                            className={
                              values.some(x => x === item.key.toString())
                                ? classNames(styles.selected, styles.filteritem)
                                : classNames(styles.filteritem)
                            }
                            value={item.key}
                            onClick={() => this.handleSelectClick(item.key.toString())}
                          >
                            {item.title}
                            {values.some(x => x === item.key.toString()) && <Icon type="check" />}
                          </li>
                        )
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {type === 'DatePicker' && (
          <div className={styles.filterdrop}>
            <div>
              <DatePicker.RangePicker
                onChange={(ment, val) => this.handleSelectClick(val.toString())}
                value={
                  value === ''
                    ? null
                    : [
                        moment(value.split(' ~ ')[0], dateFormat),
                        moment(value.split(' ~ ')[1], dateFormat),
                      ]
                }
                title={text}
                showItemSeparator={this.props.showItemSeparator}
                className={styles.filtertitle}
                align={{ offset: [0, 27] }}
                type="Select"
              />
            </div>
          </div>
        )}
      </div>
    );
  }
}
