import React, { PureComponent } from 'react';
import { Input, Icon, DatePicker, Spin, Modal, Form, Select, Cascader } from 'antd';
import PropTypes from 'prop-types';

const { Option } = Select;

export default class MyModal extends PureComponent {
  static propTypes = {
    title: PropTypes.string,
    width: PropTypes.number,
    bodyStyle: PropTypes.object,
    visible: PropTypes.bool,
    formVals: PropTypes.array,
    formItemLayout: PropTypes.object,
  };

  static defaultProps = {
    title: '',
    width: 640,
    bodyStyle: { padding: '32px 40px 48px' },
    visible: false,
    formVals: [],
    formItemLayout: {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    },
  };

  constructor(props) {
    super(props);

    const { formVals } = this.props;

    this.state = {
      formVals,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { title, visible } = nextProps;

    this.setState({
      title,
      visible,
    });
  }

  handleSubmit = e => {
    e.preventDefault();

    this.props.onOk();
  };

  render() {
    const { title, visible, formVals } = this.state;
    const { width, bodyStyle, formItemLayout } = this.props;

    return (
      <Modal
        width={width}
        destroyOnClose
        title={title}
        visible={visible}
        onCancel={() => this.props.onClose(false)}
        onOk={this.handleSubmit}
      >
        {formVals.map(item => (
          <Form.Item key={item.key} label={item.title} {...formItemLayout}>
            {(item.type === 'Select' && (
              <Select style={{ width: '99%' }}>
                <Option value="lucy">Lucy</Option>
              </Select>
            )) ||
              (item.type === 'DatePicker' && <DatePicker />) ||
              (item.type === 'Cascader' && <Cascader style={{ width: '99%' }} />) || (
                <Input style={{ width: '99%' }} placeholder="Basic usage" />
              )}
          </Form.Item>
        ))}
      </Modal>
    );
  }
}
