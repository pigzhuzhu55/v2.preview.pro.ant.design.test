import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  InputNumber,
  DatePicker,
  Modal,
  message,
  Badge,
  Divider,
  Steps,
  Radio,
  } from 'antd';
import StandardTable from '@/components/StandardTable';


import styles from './DeptList.less';

/* eslint react/no-multi-comp:0 */
@connect(({ deptList, loading }) => ({
    deptList,
    loading: loading.models.deptList,
  }))
@Form.create()
class DeptTable extends PureComponent {
    state = {
        modalVisible:false,
        updateModalVisible:false,
        deptListData: [],
        selectedRows: [],
    };

    columns = [
        {
          title: 'id',
          dataIndex: 'id',
        },
        {
          title: '机构名称',
          dataIndex: 'orgName',
        },
        {
          title: '机构名称',
          dataIndex: 'orgSuffix',
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
        },
        {
            title: '操作',
            render: (text, record) => (
              <Fragment>
                <a onClick={() => this.handleUpdateModalVisible(true, record)}>查看</a>
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

    handleModalVisible = flag => {
      this.setState({
        modalVisible: !!flag,
      });
    };

    handleUpdateModalVisible = (flag, record) => {
        this.setState({
          updateModalVisible: !!flag,
        });
    };

    render() {
        const {
            deptList: { listData },
            loading,
          } = this.props;

        const { selectedRows, modalVisible, updateModalVisible } = this.state;

        return (
          <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}></div>
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