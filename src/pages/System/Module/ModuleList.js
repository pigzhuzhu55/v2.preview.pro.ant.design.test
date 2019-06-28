import React from 'react';
import { Spin, Card, Layout } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import TreeMenu from '@/components/TreeMenu';
import { connect } from 'dva';
import { FormattedMessage } from 'umi-plugin-react/locale';
import ModuleTable from './ModuleTable';

const { Sider, Content } = Layout;

@connect(({ moduleList, loading }) => ({
  moduleList,
  loading: loading.effects['moduleList/treeLoad'],
}))
class ModuleList extends React.Component {
  state = {
    moduleTreeData: [{ title: '模块列表', key: '0', isLeaf: false }],
    selectModuleId: 0,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    return new Promise(resolve => {
      const params = {
        id: 0,
      };

      dispatch({
        type: 'moduleList/listLoad',
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
        type: 'moduleList/listLoad',
        payload: params,
      });

      this.setState({ selectModuleId: params.id });

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
        type: 'moduleList/treeLoad',
        payload: params,
        callback: () => {
          const {
            moduleList: { treeData },
          } = this.props;
          treeNode.props.dataRef.children = treeData;
        },
      });

      resolve();
    });
  };

  render() {
    const { moduleTreeData, selectModuleId } = this.state;
    const { loading } = this.props;

    const bodyHeight = document.body.clientHeight - 170;

    return (
      <PageHeaderWrapper title={<FormattedMessage id="menu.system.module" />}>
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
                  treeData={moduleTreeData}
                />
              </Spin>
            </Sider>
            <Content
              style={{
                background: '#fff',
                padding: 0,
              }}
            >
              <ModuleTable moduleId={selectModuleId} />
            </Content>
          </Layout>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default ModuleList;
