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
    filters: PropTypes.any,
  };

  static defaultProps = {
    filters: {},
  };

  constructor(props) {
    super(props);
    const { filters } = this.props;
    this.state = {
      filters,
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

  render() {
    const {
      filters: { filters },
    } = this.state;

    return (
      <div className={styles.box}>
        <div style={{ width: '100%' }}>
          <a className={classNames(styles.filterlabel, 'floatR')}>
            更多筛选 <Icon type="down" />
          </a>
          <div className={styles.droplistbox}>
            {filters.map(
              item =>
                item && (
                  <MyDropList
                    key={item.key}
                    id={item.key}
                    text={item.text}
                    options={item.options}
                  />
                )
            )}
          </div>
          <div>
            <a className="floatR">清空筛选</a>
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
