import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Menu, Icon, Button, Divider, Dropdown } from 'antd';
import StandardTable from '@/components/StandardTable';

import styles from './DeptList.less';

const FormItem = Form.Item;

/* eslint react/no-multi-comp:0 */
@connect(({ deptList, loading }) => ({
  deptList,
  loading: loading.models.deptList,
}))
@Form.create()
class DeptTable extends PureComponent {
  state = {
    deptListData: [],
    selectedRows: [],
    formValues: {},
    selectDeptId: 0,
  };

  columns = [
    {
      title: '编号',
      dataIndex: 'key',
    },
    {
      title: '机构名称',
      dataIndex: 'orgName',
    },
    {
      title: '机构后缀',
      dataIndex: 'orgSuffix',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
    },
    {
      title: '操作',
      render: text => (
        <Fragment>
          <a onClick={() => this.handleUpdateModalVisible(true)}>查看</a>
          <Divider type="vertical" />
          <a href="">删除</a>
        </Fragment>
      ),
    },
  ];

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'deptList/listLoad',
        payload: values,
      });
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleUpdateModalVisible = flag => {
    this.setState({
      updateModalVisible: !!flag,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'deptList/listLoad',
      payload: {},
    });
  };

  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (selectedRows.length === 0) return;
    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'deptList/remove',
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

  renderForm() {
    const {
      deptId: id,
      form: { getFieldDecorator },
    } = this.props;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        {getFieldDecorator('id', { initialValue: id })(<Input hidden />)}
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="机构名称">
              {getFieldDecorator('orgName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="机构后缀">
              {getFieldDecorator('orgSuffix')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      deptList: { listData },
      loading,
    } = this.props;

    const { selectedRows } = this.state;

    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
      </Menu>
    );

    return (
      <Card bordered={false}>
        <div className={styles.tableList}>
          <div className={styles.tableListForm}>{this.renderForm()}</div>
          <div className={styles.tableListOperator}>
            <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
              新建
            </Button>
            {selectedRows.length > 0 && (
              <span>
                <Button>批量操作</Button>
                <Dropdown overlay={menu}>
                  <Button>
                    更多操作 <Icon type="down" />
                  </Button>
                </Dropdown>
              </span>
            )}
          </div>
          <StandardTable
            selectedRows={selectedRows}
            loading={loading}
            data={listData}
            columns={this.columns}
            onSelectRow={this.handleSelectRows}
          />
        </div>
      </Card>
    );
  }
}

export default DeptTable;
