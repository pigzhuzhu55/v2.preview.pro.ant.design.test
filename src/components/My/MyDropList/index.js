import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Input, Icon, DatePicker } from 'antd';
import classNames from 'classnames';
import EVENT from './../EventEmit';

import styles from './index.less';

const dateFormat = 'YYYY-MM-DD';

export default class MyDropList extends Component {
  static propTypes = {
    showSearch: PropTypes.bool,
    multiple: PropTypes.bool,
    name: PropTypes.string,
    text: PropTypes.string,
    type: PropTypes.string,
    showItemSeparator: PropTypes.bool,
    options: PropTypes.any,
  };

  static defaultProps = {
    showSearch: false,
    multiple: false,
    name: '',
    text: '',
    showItemSeparator: false,
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

  handleSelectClick(item, value, e) {
    const { options } = this.state;
    const { multiple, name, type } = this.props;

    if (type === 'Select') {
      e.nativeEvent.stopImmediatePropagation();
      const { checked } = item;

      if (!multiple) {
        options.options.forEach(a => {
          a.checked = false;
        });
      }

      item.checked = !checked;
    } else {
      options.options = value.join(' ~ ');
    }
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
        {type === 'Select' && (
          <div className={styles.filterdrop}>
            <div>
              <span className={styles.filtertitle} onClick={this.handleFilterClick}>
                {text}&nbsp;
                <Icon type={showFilterDrop ? 'up' : 'down'} />
                {this.props.showItemSeparator && (
                  <span style={{ marginLeft: 5, color: '#d4dfe5' }}>|</span>
                )}
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
                            item.checked
                              ? classNames(styles.selected, styles.filteritem)
                              : classNames(styles.filteritem)
                          }
                          value={item.value}
                          onClick={this.handleSelectClick.bind(this, item, null)}
                        >
                          {item.title}
                          {item.checked && <Icon type="check" />}
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
                onChange={this.handleSelectClick.bind(this)}
                value={
                  options === ''
                    ? null
                    : [
                        moment(options.split(' ~ ')[0], dateFormat),
                        moment(options.split(' ~ ')[1], dateFormat),
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
