import * as React from 'react';
import { Table, Tag, Space } from 'antd';
import styles from './index.less';
import { connect } from 'umi';
import { UsersModelState } from './model';

interface IAppProps {
  users: UsersModelState;
}

const App: React.FunctionComponent<IAppProps> = props => {
  const { users } = props;
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
      title: '创建时间',
      dataIndex: 'create_time',
      key: 'create_time',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text: any, record: any) => (
        <Space size="middle">
          <a>Edit</a>
          <a>Delete</a>
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
      />
    </div>
  );
};

export default connect((state: UsersModelState) => {
  return state;
})(App);
