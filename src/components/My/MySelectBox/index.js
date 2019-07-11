import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input, Icon, Tag } from 'antd';

import classNames from 'classnames';

import styles from './index.less';

export default class MySelectBox extends Component {
  static propTypes = {
    name: PropTypes.string,
    text: PropTypes.string,
    options: PropTypes.any,
  };

  static defaultProps = {
    name: '',
    text: '',
    options: {},
  };

  constructor(props) {
    super(props);

    const { options } = this.props;

    this.state = {
      options,
    };
  }

  handleCloseTag(item, e) {
    const { options } = this.state;
    const { name } = this.props;

    if (Array.isArray(options.options)) {
      item.checked = false;
    } else {
      options.options = '';
    }

    this.props.onChange(options, name);
  }

  render() {
    const { name, text } = this.props;
    const {
      options: { options },
    } = this.state;

    return (
      <div key={name} className={styles.selecteditem}>
        <span className={styles.selectedlabel}>{text}：</span>
        {Array.isArray(options)
          ? options.map(
              item =>
                item &&
                item.checked && (
                  <Tag key={item.key} closable onClose={this.handleCloseTag.bind(this, item)}>
                    {item.title}
                  </Tag>
                )
            )
          : options !== '' && (
              <Tag closable onClose={this.handleCloseTag.bind(this, options)}>
                {options}
              </Tag>
            )}
      </div>
    );
  }
}
