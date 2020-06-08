import React, { ReactElement, useEffect } from 'react';
import { Modal, Form, Input } from 'antd';

interface Record {
  id: number;
  name: string;
}
interface Props {
  visible: boolean;
  record: Record | {};
  hideHandler: Function;
  editHandler: Function;
}

export default function UserModal({
  visible,
  record,
  hideHandler,
  editHandler,
}: Props): ReactElement {
  const onFinish = (values: any, id: number) => {
    editHandler(values, id);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const [form] = Form.useForm();
  useEffect(() => {
    form.setFieldsValue(record);
  }, [visible]);
  return (
    <Modal
      forceRender
      title="Basic Modal"
      visible={visible}
      onOk={() => {
        form.submit();
      }}
      onCancel={() => {
        hideHandler();
      }}
    >
      <Form
        form={form}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        name="basic"
        initialValues={record}
        onFinish={values => {
          onFinish(values, (record as Record).id);
        }}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="姓名"
          name="name"
          rules={[{ required: true, message: '请输入姓名!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Email" name="email">
          <Input />
        </Form.Item>
        <Form.Item label="创建时间" name="create_time">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}
