import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input, Icon, DatePicker } from 'antd';
import classNames from 'classnames';
import EVENT from './../EventEmit';

import styles from './index.less';

export default class MyDropList extends Component {
  static propTypes = {
    showSearch: PropTypes.bool,
    multiple: PropTypes.bool,
    name: PropTypes.string,
    text: PropTypes.string,
    type: PropTypes.string,
    options: PropTypes.any,
  };

  static defaultProps = {
    showSearch: false,
    multiple: false,
    name: '',
    text: '',
    type: 'Select',
    options: {},
  };

  constructor(props) {
    super(props);

    const { options } = this.props;

    this.state = {
      options,
      showFilterDrop: false,
      activeVals: {},
    };
  }

  componentDidMount() {
    this.handleFilterClick = this.handleFilterClick.bind(this);
    document.addEventListener('click', this.hideDropList);
    EVENT.on('HideDropList', () => {
      this.hideDropList();
    });
  }

  componentWillReceiveProps(nextProps) {
    const {
      options: { version: version2, options },
    } = nextProps;
    const {
      options: { version },
    } = this.props;
    if (version !== version2) {
      this.setState({
        options: {
          version: version2,
          options,
        },
      });
    }
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.hideDropList);
  }

  hideDropList = () => {
    const { showFilterDrop } = this.state;
    if (showFilterDrop) {
      this.setState({
        showFilterDrop: false,
      });
    }
  };

  handleFilterClick(e) {
    this.props.hiddenAllDropList();
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

  handleSelectClick(item, e) {
    e.nativeEvent.stopImmediatePropagation();
    const { options } = this.state;
    const { multiple, name } = this.props;

    const { checked } = item;

    if (!multiple) {
      options.options.forEach(a => {
        a.checked = false;
      });
    }

    item.checked = !checked;

    this.props.onChange(options, name);
  }

  render() {
    const { name, text, style, type } = this.props;
    const {
      showFilterDrop,
      options: { options },
    } = this.state;

    return (
      <div className={styles.filterdropitem} style={style}>
        <div className={styles.filterdrop}>
          <div>
            <span className={styles.filtertitle} onClick={this.handleFilterClick}>
              {text}
              <Icon type={showFilterDrop ? 'up' : 'down'} />
              <span className={styles.splitdash}>|</span>
            </span>
          </div>
          <div
            className={styles.poperwraper}
            style={{
              display: showFilterDrop ? '' : 'none',
            }}
          >
            <div className={styles.poper}>
              {type === 'Select' && (
                <div className={styles.filterscrollbox}>
                  {options.map(
                    item =>
                      item && (
                        <li
                          key={item.key}
                          className={
                            item.checked
                              ? classNames(styles.selected, styles.filteritem)
                              : classNames(styles.filteritem)
                          }
                          value={item.value}
                          onClick={this.handleSelectClick.bind(this, item)}
                        >
                          {item.title}
                          {item.checked && <Icon type="check" />}
                        </li>
                      )
                  )}
                </div>
              )}
              {type === 'DatePicker' && (
                <DatePicker.RangePicker className={styles.filterscrollbox} size="small" />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
