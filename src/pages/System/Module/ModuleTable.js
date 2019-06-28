import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Menu, Icon, Button, Divider, Dropdown, Badge } from 'antd';
import StandardTable from '@/components/StandardTable';

import styles from './ModuleList.less';

const FormItem = Form.Item;
const permTypeMap = ['default', 'processing', 'success'];
const permType = ['模块', '菜单', '按钮'];

/* eslint react/no-multi-comp:0 */
@connect(({ moduleList, loading }) => ({
  moduleList,
  loading: loading.effects['moduleList/listLoad'],
}))
@Form.create()
class ModuleTable extends PureComponent {
  state = {
    moduleListData: [],
    selectedRows: [],
    formValues: {},
    selectModuleId: 0,
  };

  columns = [
    {
      title: '编号',
      dataIndex: 'key',
    },
    {
      title: '名称',
      dataIndex: 'permName',
    },
    {
      title: '类型',
      dataIndex: 'permType',
      filters: [
        {
          text: permType[0],
          value: 0,
        },
        {
          text: permType[1],
          value: 1,
        },
        {
          text: permType[2],
          value: 2,
        },
      ],
      render(val) {
        return <Badge status={permTypeMap[val]} text={permType[val]} />;
      },
    },
    {
      title: '路径',
      dataIndex: 'url',
    },
    {
      title: '排序号',
      dataIndex: 'sort',
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
        type: 'moduleList/listLoad',
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
      type: 'moduleList/listLoad',
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
          type: 'moduleList/remove',
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
      moduleId: id,
      form: { getFieldDecorator },
    } = this.props;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        {getFieldDecorator('id', { initialValue: id })(<Input hidden />)}
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="模块名称">
              {getFieldDecorator('permName')(<Input placeholder="请输入" />)}
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
      moduleList: { listData },
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

export default ModuleTable;
