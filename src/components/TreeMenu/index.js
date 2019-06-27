import React, { PureComponent } from 'react';
import { Tree } from 'antd';

const { TreeNode } = Tree;

export default class TreeMenu extends PureComponent {
  renderTreeNodes = data => {
    return data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} dataRef={item} />;
    });
  };

  render() {
    const { onLoadData, treeData, defaultExpandedKeys, onSelect } = this.props;

    return (
      <Tree
        showLine
        loadData={onLoadData}
        onSelect={onSelect}
        defaultExpandedKeys={defaultExpandedKeys}
        defaultSelectedKeys={defaultExpandedKeys}
      >
        {this.renderTreeNodes(treeData)}
      </Tree>
    );
  }
}
