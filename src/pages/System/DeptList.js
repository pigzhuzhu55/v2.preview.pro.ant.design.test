import React from 'react';
import { Card, Layout } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import TreeMenu from '@/components/TreeMenu';

import { FormattedMessage } from 'umi-plugin-react/locale';
import styles from './DeptList.less';

const { Sider, Content } = Layout;

class DeptTree extends React.Component {
  onSelect = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
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
              <TreeMenu className={styles.treeTable} />
            </Sider>
            <Content>Content</Content>
          </Layout>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default DeptTree;
