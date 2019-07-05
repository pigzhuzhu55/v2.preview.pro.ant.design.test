import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Menu, Icon, Button, Divider, Dropdown, Badge } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import TablePageHeaderBox1 from '@/components/My/TablePageHeaderBox1';

import { FormattedMessage } from 'umi-plugin-react/locale';

import styles from './OrgList.less';

const FormItem = Form.Item;

const orgTypeMap = ['red', 'orange'];
const orgType = ['直营', '加盟'];

/* eslint react/no-multi-comp:0 */
@connect(({ orgList, loading }) => ({
  orgList,
  loading: loading.models.orgList,
}))
@Form.create()
class OrgList extends PureComponent {
  state = {
    orgListData: [],
    selectedRows: [],
    expandForm: false,
    formValues: {},
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
      title: '性质',
      dataIndex: 'orgType',
      render(val) {
        return <Badge color={orgTypeMap[val]} text={orgType[val]} />;
      },
    },
    {
      title: '电话号码',
      dataIndex: 'telephone',
    },
    {
      title: '合同过期时间',
      dataIndex: 'expireTime',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
    },
    {
      title: '操作',
      render: text => (
        <Fragment>
          <a onClick={() => this.handleUpdateModalVisible(true)}>修改</a>
          <Divider type="vertical" />
          <a href="">合同</a>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'orgList/listLoad',
    });
  }

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
        type: 'orgList/listLoad',
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
      type: 'orgList/listLoad',
      payload: {},
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
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

  render() {
    const buttons = [{ text: '新增', type: 'primary' }, { text: '移除' }];

    const {
      orgList: { listData },
      loading,
    } = this.props;

    const { selectedRows } = this.state;

    const bodyHeight = document.body.clientHeight - 170;

    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
      </Menu>
    );

    return (
      <PageHeaderWrapper>
        <Card
          bordered={false}
          style={{
            height: bodyHeight,
            overflowY: 'auto',
          }}
        >
          <div className={styles.tableList}>
            <TablePageHeaderBox1 buttons={buttons} />
            <div className={styles.tableListOperator}>
              <Button icon="plus" size="small" onClick={() => this.handleModalVisible(true)}>
                新建
              </Button>
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
            <StandardTable
              size="small"
              selectedRows={selectedRows}
              loading={loading}
              data={listData}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default OrgList;
