import React, { PureComponent, Fragment } from 'react';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Menu,
  Icon,
  Button,
  Divider,
  Dropdown,
  Table,
  Modal,
  message,
  Cascader,
  Spin,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { connect } from 'dva';
import { FormattedMessage } from 'umi-plugin-react/locale';

import styles from './DeptList.less';

const FormItem = Form.Item;

@Form.create()
class CreateForm extends PureComponent {
  static defaultProps = {
    modalVisible: false,
    title: '新建规则',
    values: {},
  };

  okHandle = () => {
    const { form, handleAdd } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };

  render() {
    const { modalVisible, form, handleModalVisible, title, residences, loading2 } = this.props;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
    };

    return (
      <Modal
        destroyOnClose
        title={title}
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
      >
        <Spin spinning={loading2}>
          <Form {...formItemLayout}>
            <FormItem label="机构名称">
              {form.getFieldDecorator('orgName', {
                rules: [{ required: true, message: '请输入机构名称！' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem label="上一级机构">
              {form.getFieldDecorator('pid', {})(
                <Cascader options={residences} changeOnSelect placeholder="无" />
              )}
            </FormItem>
            <FormItem label="机构后缀">
              {form.getFieldDecorator('orgName', {
                rules: [{ required: true, message: '请输入机构名称！' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Form>
        </Spin>
      </Modal>
    );
  }
}

/* eslint react/no-multi-comp:0 */
@connect(({ deptList, loading }) => ({
  deptList,
  loading: loading.effects['deptList/listLoad'],
  loading2: loading.effects['deptList/cascadersLoad'],
}))
@Form.create()
class DeptList extends PureComponent {
  state = {
    modalVisible: false,
    title: '',
    selectedRows: [],
    formValues: {},
  };

  columns = [
    {
      title: '部门名称',
      dataIndex: 'deptName',
    },
    {
      title: '部门电话',
      dataIndex: 'telephone',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
    },
    {
      title: '操作',
      render: text => (
        <Fragment>
          <a onClick={() => this.handleModalVisible(true, '编辑')}>编辑</a>
          <Divider type="vertical" />
          <a href="">删除</a>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    return new Promise(resolve => {
      const params = {
        id: 0,
      };

      dispatch({
        type: 'deptList/listLoad',
        payload: params,
      });

      resolve();
    });
  }

  handleModalVisible = (flag, title) => {
    this.setState({
      modalVisible: !!flag,
      title,
    });

    return new Promise(resolve => {
      if (!flag) {
        const { dispatch } = this.props;
        const params = {};

        dispatch({
          type: 'deptList/cascadersLoad',
          payload: params,
        });
      }
      resolve();
    });
  };

  handleAdd = fields => {
    message.success('添加成功');
    this.handleModalVisible();
  };

  render() {
    const {
      deptList: { list, residences },
      loading,
      loading2,
    } = this.props;

    const { title, modalVisible } = this.state;
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      title,
    };

    const bodyHeight = document.body.clientHeight - 170;

    return (
      <PageHeaderWrapper title={<FormattedMessage id="menu.inner.deptment" />}>
        <Card
          bordered={false}
          style={{
            height: bodyHeight,
            overflowY: 'auto',
          }}
        >
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button
                icon="plus"
                type="primary"
                onClick={() => this.handleModalVisible(true, '新增')}
              >
                新建
              </Button>
            </div>
            <Table
              loading={loading}
              columns={this.columns}
              dataSource={list}
              defaultExpandAllRows="true"
              pagination="false"
            />
          </div>
        </Card>

        <CreateForm
          {...parentMethods}
          modalVisible={modalVisible}
          loading2={loading2}
          residences={residences}
        />
      </PageHeaderWrapper>
    );
  }
}

export default DeptList;
