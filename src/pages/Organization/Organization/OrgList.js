import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Form, Input, Menu, Icon, Button, Divider, Dropdown, Badge } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import GeneralTable from '@/components/My/GeneralTable';
import TablePageHeaderBox1 from '@/components/My/TablePageHeaderBox1';
import TablePageHeaderBox2 from '@/components/My/TablePageHeaderBox2';

import { FormattedMessage } from 'umi-plugin-react/locale';

import { getProvinceList, getCityList, getCountyList } from '@/services/api';
import { strMapToObj } from '@/utils/utils';

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
      title: '省',
      dataIndex: 'privince',
    },
    {
      title: '市',
      dataIndex: 'city',
    },
    {
      title: '县',
      dataIndex: 'county',
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

  handleSearch = () => {
    const { dispatch } = this.props;

    // 获取模糊查询条件
    const { searchText } = this.searchBox.state;

    // 获取筛选查询条件
    const { filters } = this.filterBox.state;

    // 获取列表特殊过滤条件
    const { filters2 } = this.resultBox.state;

    const values = new Map();

    if (searchText.value !== '') {
      values.set(searchText.key, searchText.value);
    }

    filters.forEach(item => {
      if (item.value !== '') {
        values.set(item.key, item.value);
      }
    });

    filters2.forEach(item => {
      if (item.value !== '') {
        values.set(item.key, item.value);
      }
    });

    dispatch({
      type: 'orgList/listLoad',
      payload: strMapToObj(values),
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

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  queryProvinceData = () => {
    return getProvinceList();
  };

  queryCityData = provinceId => {
    return getCityList({ provinceId });
  };

  queryCountyData = cityId => {
    return getCountyList({ cityId });
  };

  render() {
    const { expandForm, selectedRows } = this.state;

    const buttons = [{ text: '新增', type: 'primary' }, { text: '移除' }];
    const searchTexts = [
      { text: '机构名称', key: 'orgName', placeholder: '请输入机构名称' },
      { text: '电话号码', key: 'telephone', placeholder: '请输入电话号码' },
    ];
    const filters = [
      {
        text: '性质',
        key: 'orgType',
        value: '',
        options: [{ title: '直营', key: '0' }, { title: '加盟', key: '1' }],
      },
      {
        text: '合同过期时间',
        key: 'expireTime',
        value: '',
        type: 'DatePicker',
      },
      {
        text: '省',
        key: 'province',
        value: '',
        child: 'city',
        multiple: true,
        loadData: this.queryProvinceData,
      },
      {
        text: '市',
        key: 'city',
        value: '',
        parent: 'province',
        child: 'county',
        multiple: true,
        loadData: provinceId => this.queryCityData(provinceId),
      },
      {
        text: '县',
        key: 'county',
        value: '',
        parent: 'city',
        multiple: true,
        loadData: cityId => this.queryCountyData(cityId),
      },
    ];
    const filters2 = [{ text: '显示已删除', key: 'deleteFlag', value: '0' }];

    const {
      orgList: { listData },
      loading,
    } = this.props;

    return (
      <PageHeaderWrapper
        style={{
          paddingBottom: 10,
        }}
      >
        <div className={styles.tableHead}>
          <TablePageHeaderBox1
            ref={c => {
              this.searchBox = c;
            }}
            buttons={buttons}
            searchTexts={searchTexts}
            handleSearch={this.handleSearch}
          />
          <TablePageHeaderBox2
            ref={c => {
              this.filterBox = c;
            }}
            filters={filters}
            maxFilterNum={5}
            handleSearch={this.handleSearch}
          />
        </div>
        <div className={styles.tableContent}>
          <GeneralTable
            ref={c => {
              this.resultBox = c;
            }}
            size="small"
            filters2={filters2}
            selectedRows={selectedRows}
            loading={loading}
            data={listData}
            columns={this.columns}
            onSelectRow={this.handleSelectRows}
            handleSearch={this.handleSearch}
          />
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default OrgList;
