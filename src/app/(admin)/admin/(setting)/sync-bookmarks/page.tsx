'use client';
import { useState } from 'react';

import { Icon } from '@iconify/react';
import { Modal, UploadProps } from 'antd';
import Dragger from 'antd/es/upload/Dragger';

import { ToolBar } from '@/components/sync-bookmarks/too-bar';
import { useNotification } from '@/hooks/use-notification';
import { Bookmark } from '@/types/bookmark';

const onAddHandler = () => {};
const onEditHandler = () => {};
const onDeleteHandler = () => {};
export default function SyncBookmarks() {
  const { setError, setInfo, contextHolder } = useNotification();

  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const properties: UploadProps = {
    name: 'file',
    multiple: false,
    action: '/api/bookmark/upload',
    onChange(info) {
      const { status } = info.file;
      if (status === 'done') {
        setInfo(`${info.file.name} 文件上传成功.`);
      } else if (status === 'error') {
        setError(new Error(`${info.file.name} 文件上传失败.`));
      }
    },
  };
  return (
    <div className="flex flex-col gap-4">
      {contextHolder}
      <ToolBar<Bookmark>
        selectedItems={[]}
        onAddHandler={onAddHandler}
        onEditHandler={onEditHandler}
        onDeleteHandler={onDeleteHandler}
        onUploadHandler={() => {
          setUploadModalVisible(true);
        }}
      />
      <Modal
        title="上传书签"
        open={uploadModalVisible}
        // eslint-disable-next-line unicorn/no-null
        footer={null}
        onCancel={() => setUploadModalVisible(false)}
      >
        <Dragger {...properties}>
          <p className="items-center justify-center flex">
            <Icon icon="ant-design:inbox-outlined" width={40} />
          </p>
          <p className="ant-upload-text">
            Click or drag file to this area to upload
          </p>
          <p className="ant-upload-hint">
            Support for a single or bulk upload. Strictly prohibited from
            uploading company data or other banned files.
          </p>
        </Dragger>
      </Modal>
    </div>
  );
}
