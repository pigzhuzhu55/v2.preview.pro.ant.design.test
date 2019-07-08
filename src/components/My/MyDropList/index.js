import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input, Icon } from 'antd';

import classNames from 'classnames';

import styles from './index.less';

export default class MyDropList extends Component {
  static propTypes = {
    showSearch: PropTypes.bool,
    multiple: PropTypes.bool,
    name: PropTypes.string,
    text: PropTypes.string,
    options: PropTypes.any,
  };

  static defaultProps = {
    showSearch: false,
    multiple: false,
    name: '',
    text: '',
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

    this.handleFilterClick = this.handleFilterClick.bind(this);
  }

  componentDidMount() {
    document.addEventListener('click', () => {
      this.setState({
        showFilterDrop: false,
      });
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

  handleFilterClick(e) {
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
    item.checked = !item.checked;
    this.setState({
      options,
    });
  }

  render() {
    const { name, text } = this.props;
    const {
      showFilterDrop,
      options: { options },
    } = this.state;

    return (
      <div className={styles.filterdropitem}>
        <div className={styles.filterdrop}>
          <div>
            <span className={styles.filtertitle} onClick={this.handleFilterClick}>
              {text} <Icon type="down" />
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
            </div>
          </div>
        </div>
      </div>
    );
  }
}
