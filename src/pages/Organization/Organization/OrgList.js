import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Form, Input, Menu, Icon, Button, Divider, Dropdown, Badge } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import GeneralTable from '@/components/My/GeneralTable';
import TablePageHeaderBox1 from '@/components/My/TablePageHeaderBox1';
import TablePageHeaderBox2 from '@/components/My/TablePageHeaderBox2';

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

    version: 0,
    proviceOption: {
      version: 0,
      options: [],
    },
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

    dispatch({
      type: 'orgList/listProvince',
      payload: {},
      callback: response => {
        const { version, proviceOption } = this.state;
        const version2 = version + 1;
        const version3 = proviceOption.version + 1;
        const options = response.data;
        this.setState({
          version: version2,
          proviceOption: {
            version: version3,
            options,
          },
        });
      },
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

    const values = {};

    this.setState({
      formValues: values,
    });

    dispatch({
      type: 'orgList/listLoad',
      payload: values,
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

  render() {
    const buttons = [{ text: '新增', type: 'primary' }, { text: '移除' }];
    const options = [
      { text: '机构名称', value: 'orgName', placeholder: '请输入机构名称', default: true },
      { text: '电话号码', value: 'telephone', placeholder: '请输入电话号码' },
    ];

    const { proviceOption, expandForm, selectedRows, version } = this.state;

    const filters = {
      version,
      filters: [
        {
          text: '性质',
          key: 'orgType',
          options: {
            version: 0,
            options: [{ title: '直营', key: '0' }, { title: '加盟', key: '1' }],
          },
        },
        {
          text: '是否删除',
          key: 'deleteFlag',
          options: {
            version: 0,
            options: [{ title: '否', key: '0' }, { title: '是', key: '1' }],
          },
        },
        {
          text: '合同过期时间',
          key: 'expireTime',
          type: 'DatePicker',
          options: {
            version: 0,
            options: '',
          },
        },
        { text: '省份', key: 'province', parent: '', children: '', options: proviceOption },
      ],
    };

    const {
      orgList: { listData },
      loading,
    } = this.props;

    return (
      <PageHeaderWrapper>
        <div className={styles.tableHead}>
          <TablePageHeaderBox1
            buttons={buttons}
            options={options}
            handleSearch={this.handleSearch}
          />
          <TablePageHeaderBox2 filters={filters} maxFilterNum={5} />
        </div>
        <div className={styles.tableContent}>
          <GeneralTable
            size="small"
            selectedRows={selectedRows}
            loading={loading}
            data={listData}
            columns={this.columns}
            onSelectRow={this.handleSelectRows}
          />
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default OrgList;
