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
    searchTexts: PropTypes.array,
  };

  static defaultProps = {
    searchTexts: [],
    buttons: [],
  };

  constructor(props) {
    super(props);
    const { searchTexts } = this.props;

    this.state = {
      searchText: {
        key: searchTexts[0].key,
        value: '',
        placeholder: searchTexts[0].placeholder,
      },
    };
  }

  handleChange = value => {
    const { searchTexts } = this.props;
    const newSearchText = searchTexts.filter(x => x.key === value)[0];

    const { searchText } = this.state;

    this.setState({
      searchText: {
        key: newSearchText.key,
        value: searchText.value,
        placeholder: newSearchText.placeholder,
      },
    });
  };

  handleChangeText = e => {
    const { searchText } = this.state;
    this.setState({
      searchText: {
        key: searchText.key,
        value: e.target.value,
        placeholder: searchText.placeholder,
      },
    });
  };

  handleSearch = () => {
    this.props.handleSearch();
  };

  render() {
    const { buttons, searchTexts } = this.props;
    const { searchText } = this.state;
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
            <Select defaultValue={searchText.key} onChange={value => this.handleChange(value)}>
              {searchTexts.map(item => (
                <Option key={item.key} value={item.key}>
                  {item.text}
                </Option>
              ))}
            </Select>
            <Search
              value={searchText.value}
              onChange={e => this.handleChangeText(e)}
              placeholder={searchText.placeholder}
              onSearch={() => this.handleSearch()}
              style={{ width: 200 }}
            />
          </InputGroup>
        </div>
      </div>
    );
  }
}
