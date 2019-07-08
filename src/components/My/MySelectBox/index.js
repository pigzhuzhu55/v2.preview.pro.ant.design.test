import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input, Icon, Tag } from 'antd';

import classNames from 'classnames';

import styles from './index.less';

export default class MySelectBox extends Component {
  handleCloseTag() {}

  render() {
    return (
      <div className={styles.selecteditem}>
        <span>性质：</span>
        <Tag closable onClose={this.handleCloseTag.bind(this)}>
          直营
        </Tag>
      </div>
    );
  }
}
