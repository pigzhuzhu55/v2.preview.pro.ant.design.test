import React from 'react';
import { Spin, Card, Layout } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import TreeMenu from '@/components/TreeMenu';
import { connect } from 'dva';
import { FormattedMessage } from 'umi-plugin-react/locale';
import DeptTable from './DeptTable';

const { Sider, Content } = Layout;

@connect(({ deptList, loading }) => ({
  deptList,
  loading: loading.effects['deptList/treeLoad'],
}))
class DeptList extends React.Component {
  state = {
    deptTreeData: [{ title: '机构列表', key: '0', isLeaf: false }],
    selectDeptId: 0,
  };

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

  onSelect = selectedKeys => {
    const { dispatch } = this.props;
    return new Promise(resolve => {
      const params = {
        // 点击的节点Id
        id: selectedKeys[0],
      };

      dispatch({
        type: 'deptList/listLoad',
        payload: params,
      });

      this.setState({ selectDeptId: params.id });

      resolve();
    });
  };

  onLoadTreeData = treeNode => {
    const { dispatch } = this.props;
    return new Promise(resolve => {
      if (treeNode.props.children) {
        resolve();
        return;
      }

      const params = {
        // 点击的节点Id
        id: treeNode.props.dataRef.key,
      };

      dispatch({
        type: 'deptList/treeLoad',
        payload: params,
        callback: () => {
          const {
            deptList: { treeData },
          } = this.props;
          treeNode.props.dataRef.children = treeData;
        },
      });

      resolve();
    });
  };

  render() {
    const { deptTreeData, selectDeptId } = this.state;
    const { loading } = this.props;

    const bodyHeight = document.body.clientHeight - 170;

    return (
      <PageHeaderWrapper title={<FormattedMessage id="menu.system.deptment" />}>
        <Card
          bordered={false}
          style={{
            height: bodyHeight,
            overflowY: 'auto',
          }}
        >
          <Layout>
            <Sider
              width={200}
              style={{
                background: '#fff',
                padding: 0,
                height: '100vh',
              }}
            >
              <Spin spinning={loading}>
                <TreeMenu
                  defaultExpandedKeys={['0']}
                  onLoadData={this.onLoadTreeData}
                  onSelect={this.onSelect}
                  treeData={deptTreeData}
                />
              </Spin>
            </Sider>
            <Content
              style={{
                background: '#fff',
                padding: 0,
              }}
            >
              <DeptTable deptId={selectDeptId} />
            </Content>
          </Layout>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default DeptList;
