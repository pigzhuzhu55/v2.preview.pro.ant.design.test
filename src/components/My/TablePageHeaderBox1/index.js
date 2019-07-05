import React, { Component } from 'react';
import { Input, Button, Select } from 'antd';

import classNames from 'classnames';

import styles from './index.less';

const InputGroup = Input.Group;
const { Search } = Input;
const { Option } = Select;

export default class TablePageHeaderBox1 extends Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }

  render() {
    const { buttons } = this.props;

    return (
      <div className={classNames(styles.box1, 'clearfix')}>
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
            <Select defaultValue="机构名称">
              <Option value="机构名称">机构名称</Option>
              <Option value="电话号码">电话号码</Option>
            </Select>
            <Search
              placeholder="请输入机构名称"
              onSearch={value => console.log(value)}
              style={{ width: 200 }}
            />
          </InputGroup>
        </div>
      </div>
    );
  }
}
