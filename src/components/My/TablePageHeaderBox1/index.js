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
    buttons:PropTypes.array,
    options:PropTypes.array,
  }

  static defaultProps = {
    options:[],
    buttons:[],
  }

  constructor(props) {
    super(props);
    const { options } = this.props;

    const searchOption = options.filter(x => x.default)[0]

    this.state = { 
      searchOption: {
        value:'',
        name:searchOption.value,
        placeholder:searchOption.placeholder
      },
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(value){
    const { options } = this.props;
    const searchOption = options.filter(x => x.value===value)[0]

    this.setState({
      searchOption
    });
  }

  handleSearch(item,e){

    console.log(item);
  }

  render() {
    const { buttons,options,defaultOption } = this.props;
    const { searchOption} =this.state;
    return (
      <div className={classNames(styles.box, 'clearfix')}>
        <div className={classNames(styles.boxL, 'floatL')}>
          {buttons.map(
            item =>
              item && (
                <Button type={item.type} style={{ width: 100, marginRight: 10 }}>
                  {item.text}
                </Button>
              )
          )}
        </div>
        <div className={classNames(styles.boxR, 'floatR')}>
          <InputGroup compact>
            <Select defaultValue={searchOption.name} onChange={this.handleChange}>
                {options.map(
                item =>
                  item && (
                    <Option value={item.value}>{item.text}</Option>
                  )
              )}
            </Select>
            <Search
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
