import { Icon } from '@iconify/react';
import { Modal, UploadProps } from 'antd';
import Dragger from 'antd/es/upload/Dragger';

export const BookmarkUploadModal = ({
  uploadModalVisible,
  setUploadModalVisible,
  setError,
  setInfo,
}: {
  uploadModalVisible: boolean;
  setUploadModalVisible: (visible: boolean) => void;
  setError: (error: Error | undefined) => void;
  setInfo: (info: string) => void;
}) => {
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
    <>
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
          <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
        </Dragger>
      </Modal>
    </>
  );
};
