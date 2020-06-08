import React, { useState } from 'react';
import { Table, Space, Popconfirm } from 'antd';
import styles from './index.less';
import { connect } from 'umi';
import { UsersModelState } from './model';
import UserModal from './components/UserModal';

interface IAppProps {
  users: UsersModelState;
  dispatch: Function;
}

const App: React.FunctionComponent<IAppProps> = props => {
  const { users, dispatch } = props;
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [record, setRecord] = useState({});
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      render: (text: any) => <a>{text}</a>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      key: 'create_time',
    },
    {
      title: '操作',
      key: 'action',
      render: (text: any, record: any) => (
        <Space size="middle">
          <a
            onClick={() => {
              setUserModalVisible(true);
              setRecord(record);
            }}
          >
            编辑
          </a>
          <Popconfirm
            title="Are you sure delete this task?"
            onConfirm={() => {
              dispatch({
                type: 'users/deleteItem',
                payload: record.id,
              });
            }}
            okText="Yes"
            cancelText="No"
          >
            <a>删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <Table
        rowKey="id"
        className={`table-box ${styles.tableBox}`}
        columns={columns}
        dataSource={users.items}
        pagination={{ total: users.total }}
      />
      <UserModal
        visible={userModalVisible}
        record={record}
        hideHandler={() => {
          setUserModalVisible(false);
        }}
        editHandler={(values: any, id: any) => {
          dispatch({
            type: 'users/editItem',
            payload: {
              values,
              id,
            },
          });
        }}
      />
    </div>
  );
};

export default connect((state: UsersModelState) => {
  return state;
})(App);
