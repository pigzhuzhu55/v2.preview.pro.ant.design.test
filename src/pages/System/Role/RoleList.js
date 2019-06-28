import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Button, Icon, List } from 'antd';
import { FormattedMessage } from 'umi-plugin-react/locale';

import Ellipsis from '@/components/Ellipsis';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './RoleList.less';

const roleTypeMap = [
  'https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png',
  'https://gw.alipayobjects.com/zos/rmsportal/siCrBXXhmvTQGWPNLBow.png',
  'https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png',
];

@connect(({ roleList, loading }) => ({
  roleList,
  loading: loading.models.roleList,
}))
class RoleList extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'roleList/listLoad',
      payload: {},
    });
  }

  render() {
    const {
      roleList: { listData },
      loading,
    } = this.props;

    const bodyHeight = document.body.clientHeight - 170;

    return (
      <PageHeaderWrapper title={<FormattedMessage id="menu.system.role" />}>
        <div
          className={styles.cardList}
          style={{
            height: bodyHeight,
            padding: 12,
            overflowY: 'auto',
          }}
        >
          <List
            rowKey="key"
            loading={loading}
            grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
            dataSource={['', ...listData]}
            renderItem={item =>
              item ? (
                <List.Item key={item.key}>
                  <Card
                    hoverable
                    className={styles.card}
                    actions={[<a>编辑</a>, <a>配置权限</a>, <a>配置用户</a>]}
                  >
                    <Card.Meta
                      avatar={
                        <img
                          alt=""
                          className={styles.cardAvatar}
                          src={roleTypeMap[item.roleType]}
                        />
                      }
                      title={<a>{item.roleName}</a>}
                      description={
                        <Ellipsis className={styles.item} lines={3}>
                          {item.roleDescribe}
                        </Ellipsis>
                      }
                    />
                  </Card>
                </List.Item>
              ) : (
                <List.Item>
                  <Button type="dashed" className={styles.newButton}>
                    <Icon type="plus" /> 新建角色
                  </Button>
                </List.Item>
              )
            }
          />
        </div>
      </PageHeaderWrapper>
    );
  }
}
export default RoleList;
