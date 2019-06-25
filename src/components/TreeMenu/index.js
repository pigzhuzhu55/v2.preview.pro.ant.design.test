import React, { PureComponent } from 'react';
import { Tree } from 'antd';

const { TreeNode } = Tree;

export default class TreeMenu extends PureComponent {
  //   state = {
  //     treeData: [{ title: '部门列表', key: '0' }],
  //   };

  // onLoadData = treeNode => {};

  render() {
    return (
      <Tree showLine defaultExpandedKeys={['0-0-0']} onSelect={this.onSelect}>
        <TreeNode title="parent 1" key="0-0">
          <TreeNode title="parent 1-0" key="0-0-0">
            <TreeNode title="leaf" key="0-0-0-0" />
            <TreeNode title="leaf" key="0-0-0-1" />
            <TreeNode title="leaf" key="0-0-0-2" />
          </TreeNode>
          <TreeNode title="parent 1-1" key="0-0-1">
            <TreeNode title="leaf" key="0-0-1-0" />
          </TreeNode>
          <TreeNode title="parent 1-2" key="0-0-2">
            <TreeNode title="leaf" key="0-0-2-0" />
            <TreeNode title="leaf" key="0-0-2-1" />
          </TreeNode>
        </TreeNode>
      </Tree>
    );
  }
}
