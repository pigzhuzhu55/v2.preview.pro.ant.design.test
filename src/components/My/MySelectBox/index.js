import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input, Icon, Tag } from 'antd';

import classNames from 'classnames';

import styles from './index.less';

export default class MySelectBox extends Component {
  static propTypes = {
    name: PropTypes.string,
    text: PropTypes.string,
    value: PropTypes.string,
    options: PropTypes.array,
    type: PropTypes.string,
  };

  static defaultProps = {
    name: '',
    text: '',
    options: [],
    value: '',
    type: 'Select',
  };

  constructor(props) {
    super(props);

    const { value, options } = this.props;

    this.state = {
      value,
      options,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { value, options } = nextProps;

    this.setState({
      value,
      options,
    });
  }

  handleCloseTag = value => {
    const values = this.props.value.split('|').filter(val => val !== '' && val !== value);

    const nextProps = {
      ...this.props,
      value: values.join('|'),
    };

    this.props.onChange(nextProps);
  };

  render() {
    const { name, text, type } = this.props;
    const { value, options } = this.state;

    const keyTitles = [];
    if (value !== '') {
      const keys = value.split('|');

      if (type === 'Select') {
        keys.forEach(key => {
          const x = options.filter(opt => opt.key.toString() === key);
          if (x.length > 0) {
            keyTitles.push(x[0]);
          }
        });
      } else {
        keys.forEach(key => {
          keyTitles.push({ key, title: key });
        });
      }
    }

    return (
      <div key={name} className={styles.selecteditem}>
        <span className={styles.selectedlabel}>{text}：</span>
        {keyTitles.map(item => (
          <Tag key={item.key} closable onClose={() => this.handleCloseTag(item.key.toString())}>
            {item.title}
          </Tag>
        ))}
      </div>
    );
  }
}
