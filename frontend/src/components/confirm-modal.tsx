import { ExclamationCircleFilled } from "@ant-design/icons";
import { Button, Modal, Space } from "antd";

const { confirm } = Modal;

const ConfirmModal = (
  titleText: string,
  contentText: string,
  onOkayFunc: any,
) => {
  confirm({
    title: titleText,
    icon: <ExclamationCircleFilled />,
    content: contentText,
    okText: "Yes",
    okType: "danger",
    cancelText: "Cancel",
    onOk() {
      console.log("OK");
      onOkayFunc();
    },
    onCancel() {
      console.log("Cancel");
    },
  });
};

export default ConfirmModal;
