import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Form, Input, Menu, Icon, Button, Divider, Dropdown, Badge } from 'antd';
import PropTypes from 'prop-types';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import GeneralTable from '@/components/My/GeneralTable';
import TablePageHeaderBox1 from '@/components/My/TablePageHeaderBox1';
import TablePageHeaderBox2 from '@/components/My/TablePageHeaderBox2';
import MyModal from '@/components/My/MyModal';

import { FormattedMessage } from 'umi-plugin-react/locale';

import { getProvinceList, getCityList, getCountyList } from '@/services/api';
import { strMapToObj } from '@/utils/utils';

import styles from './OrgList.less';

const orgTypeMap = ['red', 'orange'];
const orgType = ['直营', '加盟'];

/* eslint react/no-multi-comp:0 */
@connect(({ orgList, loading }) => ({
  orgList,
  loading: loading.models.orgList,
}))
@Form.create()
class OrgList extends PureComponent {
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

  constructor(props) {
    super(props);

    this.state = {
      orgListData: [],
      selectedRows: [],
      modal: {
        title: '',
        visible: false,
        onClose: this.handleModalVisible,
        onOk: this.handleSubmit,
        formVals: [
          { title: '机构名称', key: 'orgName', value: '' },
          { title: '性质', key: 'orgType', value: '', type: 'Select' },
          { title: '所属地', key: 'area', value: '', type: 'Cascader' },
          { title: '电话号码', key: 'telephone', value: '' },
          { title: '合同过期时间', key: 'expireTime', value: '', type: 'DatePicker' },
        ],
      },
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'orgList/listLoad',
    });
  }

  // #region 获取查询参数
  getSearchVaules(pagination) {
    // 获取模糊查询条件
    const { searchText } = this.searchBox.state;

    // 获取筛选查询条件
    const { filters } = this.filterBox.state;

    // 获取列表特殊过滤条件
    const { filters2 } = this.resultBox.state;

    const values = new Map();

    // 如果有翻页
    if (pagination) {
      const { current, pageSize } = pagination;
      values.set('current', current);
      values.set('pageSize', pageSize);
    }

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

    return values;
  }
  // #endregion

  // #region 页面事件
  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = pagination => {
    const { dispatch } = this.props;

    const values = this.getSearchVaules(pagination);

    dispatch({
      type: 'orgList/listLoad',
      payload: strMapToObj(values),
    });
  };

  onChange = (pagination, filters, sorter, extra) => {
    this.handleSearch(pagination);
  };
  // #endregion

  // #region 绑定省市县下拉数据
  queryProvinceData = () => {
    return getProvinceList();
  };

  queryCityData = provinceId => {
    return getCityList({ provinceId });
  };

  queryCountyData = cityId => {
    return getCountyList({ cityId });
  };
  // #endregion

  // #region 页头按钮绑定事件

  // #endregion 窗口事件

  handleModalVisible = flag => {
    const { ...modal } = this.state.modal;

    this.setState({
      modal: {
        ...modal,
        title: '新增机构',
        visible: !!flag,
      },
    });
  };

  handleSubmit = () => {
    console.log('ffff');
  };

  // #region render
  render() {
    const { selectedRows, modal } = this.state;

    const buttons = [
      { text: '新增机构', type: 'primary', onClick: () => this.handleModalVisible(true) },
      { text: '导入机构' },
    ];
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
            scroll={{ y: `calc(100vh - 438px)` }}
            onSelectRow={this.handleSelectRows}
            handleSearch={this.handleSearch}
            onChange={this.onChange}
          />
        </div>
        <MyModal {...modal} />
      </PageHeaderWrapper>
    );
  }
  // #endregion
}

export default OrgList;
