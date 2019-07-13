import React, { PureComponent, Fragment } from 'react';
import { Table, Alert, Menu, Button, Dropdown, Icon, Checkbox } from 'antd';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './index.less';

function initTotalList(columns) {
  const totalList = [];
  columns.forEach(column => {
    if (column.needTotal) {
      totalList.push({ ...column, total: 0 });
    }
  });
  return totalList;
}

class GeneralTable extends PureComponent {
  static propTypes = {
    filters2: PropTypes.array,
  };

  static defaultProps = {
    filters2: [],
  };

  constructor(props) {
    super(props);
    const { columns, filters2 } = props;
    const needTotalList = initTotalList(columns);

    this.state = {
      selectedRowKeys: [],
      needTotalList,
      filters2,
    };
  }

  static getDerivedStateFromProps(nextProps) {
    // clean state
    if (nextProps.selectedRows.length === 0) {
      const needTotalList = initTotalList(nextProps.columns);
      return {
        selectedRowKeys: [],
        needTotalList,
      };
    }
    return null;
  }

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    let { needTotalList } = this.state;
    needTotalList = needTotalList.map(item => ({
      ...item,
      total: selectedRows.reduce((sum, val) => sum + parseFloat(val[item.dataIndex], 10), 0),
    }));
    const { onSelectRow } = this.props;
    if (onSelectRow) {
      onSelectRow(selectedRows);
    }

    this.setState({ selectedRowKeys, needTotalList });
  };

  handleTableChange = (pagination, filters, sorter) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(pagination, filters, sorter);
    }
  };

  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  };

  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (selectedRows.length === 0) return;
    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'orgList/remove',
          payload: {
            key: selectedRows.map(row => row.key),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  };

  onChangeFilter2 = checkedValue => {
    const { filters2 } = this.state;
    const key = checkedValue.target.value;
    const value = checkedValue.target.checked ? '1' : '0';

    filters2.forEach(item => {
      if (item.key === key) {
        item.value = value;
      }
    });
    this.setState({
      filters2,
    });
  };

  render() {
    const { selectedRowKeys, needTotalList, filters2 } = this.state;
    const { data = {}, rowKey, selectedRows, ...rest } = this.props;
    const { list = [], pagination } = data;

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
    };

    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: record => ({
        disabled: record.disabled,
      }),
    };

    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
      </Menu>
    );

    return (
      <div className={styles.generalTable}>
        <div className={classNames(styles.tableListOperator, 'clearfix')}>
          <div className={styles.tableListBox}>
            <div className="floatL">
              <Button size="small">批量删除</Button>
              {selectedRows.length > 0 && (
                <span>
                  <Dropdown overlay={menu}>
                    <Button size="small">
                      更多操作 <Icon type="down" />
                    </Button>
                  </Dropdown>
                </span>
              )}
            </div>
            <div className="floatR">
              {filters2.map((item, index) => (
                <Checkbox
                  value={item.key}
                  checked={item.value === '1'}
                  onChange={this.onChangeFilter2}
                >
                  {item.text}
                </Checkbox>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.tableAlert}>
          <Fragment>
            已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项&nbsp;&nbsp;
            {needTotalList.map(item => (
              <span style={{ marginLeft: 8 }} key={item.dataIndex}>
                {item.title}
                总计&nbsp;
                <span style={{ fontWeight: 600 }}>
                  {item.render ? item.render(item.total) : item.total}
                </span>
              </span>
            ))}
            <a onClick={this.cleanSelectedKeys} style={{ marginLeft: 24 }}>
              清空
            </a>
          </Fragment>
        </div>
        <Table
          rowKey={rowKey || 'key'}
          rowSelection={rowSelection}
          dataSource={list}
          pagination={paginationProps}
          onChange={this.handleTableChange}
          {...rest}
        />
      </div>
    );
  }
}

export default GeneralTable;
