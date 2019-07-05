import React, { PureComponent } from 'react';

import TablePageHeaderBox1 from './../../components/My/TablePageHeaderBox1';
import styles from './Workplace.less';

class Workplace extends PureComponent {
  render() {
    const buttons = [{ text: '新增', type: 'primary' }, { text: '移除' }];

    return <TablePageHeaderBox1 buttons={buttons} />;
  }
}

export default Workplace;
