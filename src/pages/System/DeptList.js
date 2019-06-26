import React from 'react';
import { Card, Layout } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import TreeMenu from '@/components/TreeMenu';
import { connect } from 'dva';
import { FormattedMessage } from 'umi-plugin-react/locale';

const { Sider, Content } = Layout;

@connect(({ deptList, loading }) => ({
  deptList,
  loading: loading.models.treeData,
}))
class DeptTree extends React.Component {
  state = {
    deptTreeData: [{ title: '部门列表', key: '0', isLeaf: false }],
  };

  componentDidMount() {}

  onSelect = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
  };

  onLoadData = treeNode => {
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
          this.setState({ treeData });
        },
      });
      resolve();
    });
  };

  render() {
    return (
      <PageHeaderWrapper title={<FormattedMessage id="menu.system.deptment" />}>
        <Card bordered={false}>
          <Layout>
            <Sider
              width={200}
              style={{
                background: '#fff',
                padding: 0,
                height: '100vh',
              }}
            >
              <TreeMenu
                defaultExpandedKeys={['0']}
                onLoadData={this.onLoadData}
                treeData={this.state.deptTreeData}
              />
            </Sider>
            <Content>Content</Content>
          </Layout>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default DeptTree;
