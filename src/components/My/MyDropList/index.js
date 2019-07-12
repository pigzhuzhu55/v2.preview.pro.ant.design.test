import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Input, Icon, DatePicker } from 'antd';
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
  };

  constructor(props) {
    super(props);

    const { options, value } = this.props;

    this.state = {
      options,
      value,
      showFilterDrop: false,
      activeVals: {},
    };
  }

  componentDidMount() {
    const { options, value, type, loadData, child, parent } = this.props;

    if (type === 'Select') {
      // 说明是第一个下拉，直接加载数据
      if (child !== '' && parent === '') {
        loadData().then(response => {
          if (response.code === 0) {
            this.setState({
              options: response.data,
            });
          }
        });
      }
    }
  }

  hideDropList() {
    const { showFilterDrop } = this.state;
    if (showFilterDrop) {
      this.setState({
        showFilterDrop: false,
      });
    }
  }

  handleFilterClick(e) {
    // this.props.hiddenAllDropList();
    /** 阻止合成事件间的冒泡
     * e.stopPropagation();
     *  阻止原生事件与最外层document上的事件间的冒泡
     */
    e.nativeEvent.stopImmediatePropagation();
    const { showFilterDrop } = this.state;
    this.setState({
      showFilterDrop: !showFilterDrop,
    });
  }

  handleSelectClick(e, value) {
    const { multiple, name, type } = this.props;

    if (type === 'Select') {
      e.nativeEvent.stopImmediatePropagation();
    }

    if (!multiple) {
      this.setState({
        value,
      });
    }

    this.props.onChange(this.props, value);
  }

  render() {
    const { name, text, style, type } = this.props;
    const { showFilterDrop, options, value } = this.state;

    return (
      <div className={styles.filterdropitem} style={style}>
        {type === 'Select' && (
          // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
          <div className={styles.filterdrop} tabIndex="0" onBlur={() => this.hideDropList()}>
            <div>
              {this.props.showItemSeparator && (
                <span style={{ marginRight: 10, color: '#d4dfe5' }}>|</span>
              )}
              <span className={styles.filtertitle} onClick={e => this.handleFilterClick(e)}>
                {text}
                <Icon type={showFilterDrop ? 'up' : 'down'} />
              </span>
            </div>
            <div
              className={styles.poperwraper}
              style={{
                display: showFilterDrop ? '' : 'none',
              }}
            >
              <div className={styles.poper}>
                <div className={styles.filterscrollbox}>
                  {options.map(
                    item =>
                      item && (
                        <li
                          key={item.key}
                          className={
                            item.key === value
                              ? classNames(styles.selected, styles.filteritem)
                              : classNames(styles.filteritem)
                          }
                          value={item.key}
                          onClick={e => this.handleSelectClick(e, item.key)}
                        >
                          {item.title}
                          {item.key === value && <Icon type="check" />}
                        </li>
                      )
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {type === 'DatePicker' && (
          <div className={styles.filterdrop}>
            <div>
              <DatePicker.RangePicker
                onChange={(ment, val, e) => this.handleSelectClick(e, val)}
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
