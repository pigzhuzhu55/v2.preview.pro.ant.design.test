import React, { Component } from 'react';
import { Input, Button, Select } from 'antd';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import styles from './index.less';

const InputGroup = Input.Group;
const { Search } = Input;
const { Option } = Select;

export default class TablePageHeaderBox1 extends Component {
  static propTypes = {
    buttons: PropTypes.array,
    options: PropTypes.array,
  };

  static defaultProps = {
    options: [],
    buttons: [],
  };

  constructor(props) {
    super(props);
    const { options } = this.props;

    const searchOption = options.filter(x => x.default)[0];

    this.state = {
      searchOption: {
        name: searchOption.value,
        value: '',
        placeholder: searchOption.placeholder,
      },
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(value) {
    const { options } = this.props;
    const searchOption = options.filter(x => x.value === value)[0];

    this.setState({
      searchOption: {
        name: searchOption.value,
        value: '',
        placeholder: searchOption.placeholder,
      },
    });
  }

  handleChange2(e) {
    const { searchOption } = this.state;
    this.setState({
      searchOption: {
        name: searchOption.name,
        value: e.target.value,
        placeholder: searchOption.placeholder,
      },
    });
  }

  handleSearch(item, e) {
    this.props.handleSearch(e);
  }

  render() {
    const { buttons, options, defaultOption } = this.props;
    const { searchOption } = this.state;
    return (
      <div className={classNames(styles.box, 'clearfix')}>
        <div className={classNames(styles.boxL, 'floatL')}>
          {buttons.map(
            item =>
              item && (
                <Button key={item.text} type={item.type} style={{ width: 100, marginRight: 10 }}>
                  {item.text}
                </Button>
              )
          )}
        </div>
        <div className={classNames(styles.boxR, 'floatR')}>
          <InputGroup compact>
            <Select defaultValue={searchOption.name} onChange={this.handleChange.bind(this)}>
              {options.map(
                item =>
                  item && (
                    <Option key={item.value} value={item.value}>
                      {item.text}
                    </Option>
                  )
              )}
            </Select>
            <Search
              value={searchOption.value}
              onChange={this.handleChange2.bind(this)}
              placeholder={searchOption.placeholder}
              onSearch={this.handleSearch.bind(this)}
              style={{ width: 200 }}
            />
          </InputGroup>
        </div>
      </div>
    );
  }
}
