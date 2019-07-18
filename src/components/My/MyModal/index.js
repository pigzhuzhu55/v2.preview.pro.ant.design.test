import React, { PureComponent } from 'react';
import { Input, Icon, DatePicker, Spin, Modal, Form, Select, Cascader, message } from 'antd';
import PropTypes from 'prop-types';
import moment from 'moment';

const { Option } = Select;
const dateFormat = 'YYYY-MM-DD';

@Form.create()
class MyModal extends PureComponent {
  static propTypes = {
    title: PropTypes.string,
    width: PropTypes.number,
    bodyStyle: PropTypes.object,
    visible: PropTypes.bool,
    formVals: PropTypes.array,
    formItemLayout: PropTypes.object,
    id: PropTypes.number,
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
    id: 0,
  };

  constructor(props) {
    super(props);
    const { formVals, title, visible } = this.props;

    this.state = {
      title,
      formVals,
      loading: true,
      visible,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { title, visible, formVals, id, init } = nextProps;
    const { id: oldId } = this.state;

    this.setState({
      visible,
      title,
    });

    if (visible && (id !== oldId || oldId === undefined) && id > 0) {
      // 说明是编辑操作，要加载远程数据
      // 先加载编辑的数据
      this.setState({
        loading: true,
      });
      init(id).then(response => {
        // 先赋值
        formVals.forEach(f => {
          const value = response.data[f.key];
          f.value = value;
        });

        this.initPageData(formVals, id);
      });
    } else if (id === 0) {
      formVals.forEach(item => {
        if (item.type === 'DatePicker') {
          item.initialValue = null;
          item.value = null;
        } else if (item.type === 'Select') {
          item.initialValue = undefined;
          item.value = undefined;
        } else {
          item.initialValue = '';
          item.value = '';
        }
      });

      if (visible) {
        this.initPageData(formVals, id);
      }
    }
  }

  initPageData = (formVals, id) => {
    // 这里只有级联的才需要再次异步去取下拉值，优化下一次性去取
    const allPromise = [];
    // 表单的配置信息 formVals的每一项
    const formSyncVals = [];
    // 额外的信息，多级的时候会用到
    const formSyncExtends = [];
    formVals.forEach(f => {
      const { value } = f;
      if (f.type === 'DatePicker') {
        f.initialValue = value ? moment(value, dateFormat) : value;
      } else if (f.type === 'Select') {
        // eslint-disable-next-line no-nested-ternary
        f.initialValue = Array.isArray(value)
          ? value
          : Number.isFinite(value)
          ? value.toString()
          : value;
        if (!f.inited && f.init) {
          allPromise.push(f.init());
          formSyncVals.push(f);
          formSyncExtends.push(null);
        }
      } else if (f.type === 'Cascader') {
        f.initialValue = value;
        if (value) {
          value.forEach((v, i) => {
            if (i === 0) {
              if (!f.inited) {
                allPromise.push(f.init());
                formSyncExtends.push({ level: i, value });
                formSyncVals.push(f);
              }
            } else {
              allPromise.push(f.loadData(i - 1)(value[i - 1]));
              formSyncExtends.push({ level: i, value });
              formSyncVals.push(f);
            }
          });
        } else if (!f.inited) {
          allPromise.push(f.init());
          formSyncExtends.push({ level: 0, value });
          formSyncVals.push(f);
        }
      } else {
        f.initialValue = value;
      }
    });

    if (allPromise.length > 0) {
      Promise.all(allPromise).then(arry => {
        arry.forEach((response2, index) => {
          if (response2.code === 1) {
            return;
          }
          const dd = [];

          if (formSyncVals[index].type === 'Cascader') {
            const { level, value } = formSyncExtends[index];

            response2.data.forEach(d => {
              const item = {
                value: d.key.toString(),
                label: d.title,
                isLeaf: level === formSyncVals[index].maxLevel - 1,
                level,
              };
              dd.push(item);
            });

            // 一般只有3级，这里我也只做了3级判断
            if (level === 0) {
              formSyncVals[index].options = dd;
            } else if (level === 1) {
              const opts = formSyncVals[index].options.filter(opt => opt.value === value[0]);

              if (opts.length > 0) {
                opts[0].children = dd;
              }
            } else if (level === 2) {
              const opts1 = formSyncVals[index].options.filter(opt => opt.value === value[0]);
              if (opts1.length > 0) {
                const opts = opts1[0].children.filter(opt => opt.value === value[1]);
                if (opts.length > 0) {
                  opts[0].children = dd;
                }
              }
            }
          }
          // 目前这里不是级联，就是下拉
          else {
            response2.data.forEach(d => {
              const item = {
                key: d.key.toString(),
                title: d.title,
              };
              dd.push(item);
            });
            formSyncVals[index].options = dd;
          }
          formSyncVals[index].inited = true;
        });

        this.setState({
          loading: false,
          formVals,
          id,
        });
      });
    } else {
      this.setState({
        loading: false,
        formVals,
        id,
      });
    }
  };

  handleClose = () => {
    const { id, title } = this.state;
    this.props.onClose(id, title);
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      const { id, title } = this.state;
      if (!err) {
        this.props.onOk({ ...values, id }, id, title, msg => this.alertError(msg));
      }
    });
  };

  alertError = msg => {
    this.setState({
      id: 0,
      loading: false,
    });
    if (msg) {
      message.error(msg);
    } else {
      message.success('保存成功');
    }
  };

  loadCascaderData = (selectedOptions, loadData, maxLevel) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;

    loadData(targetOption.level)(targetOption.value).then(response => {
      if (response.code === 0) {
        const { formVals, title } = this.state;
        targetOption.loading = false;
        const dd = [];
        response.data.forEach(d => {
          const item = {
            value: d.key.toString(),
            label: d.title,
            isLeaf: targetOption.level === maxLevel - 2,
            level: targetOption.level + 1,
          };
          dd.push(item);
        });

        targetOption.children = dd;

        this.setState({
          title,
          formVals: [...formVals],
        });
      }
    });
  };

  render() {
    const { title, visible, loading, formVals } = this.state;
    const { width, bodyStyle, formItemLayout, form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        width={width}
        destroyOnClose
        title={title}
        visible={visible}
        onCancel={this.handleClose}
        onOk={this.handleSubmit}
      >
        {loading ? (
          <div className="loading">
            <Spin />
          </div>
        ) : (
          <Form>
            {formVals.map(item => (
              <Form.Item key={item.key} label={item.title} {...formItemLayout}>
                {(item.type === 'Select' &&
                  getFieldDecorator(item.key, {
                    initialValue: item.initialValue,
                    rules: item.rules,
                  })(
                    <Select
                      style={{ width: '99%' }}
                      mode={item.mode}
                      placeholder={item.placeholder}
                    >
                      {item.options.map(op => (
                        <Option key={op.key} value={op.key}>
                          {op.title}
                        </Option>
                      ))}
                    </Select>
                  )) ||
                  (item.type === 'DatePicker' &&
                    getFieldDecorator(item.key, {
                      initialValue: item.initialValue,
                      rules: item.rules,
                    })(<DatePicker />)) ||
                  (item.type === 'Cascader' &&
                    getFieldDecorator(item.key, {
                      initialValue: item.initialValue,
                      rules: item.rules,
                    })(
                      <Cascader
                        style={{ width: '99%' }}
                        placeholder={item.placeholder}
                        loadData={selectedOptions =>
                          this.loadCascaderData(selectedOptions, item.loadData, item.maxLevel)
                        }
                        options={item.options}
                      />
                    )) ||
                  getFieldDecorator(item.key, {
                    initialValue: item.initialValue,
                    rules: item.rules,
                  })(<Input style={{ width: '99%' }} placeholder={item.placeholder} />)}
              </Form.Item>
            ))}
          </Form>
        )}
      </Modal>
    );
  }
}

export default MyModal;
