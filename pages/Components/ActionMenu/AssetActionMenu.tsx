import * as React from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { deleteCredsProfile } from "@/pages/api/api/CredentialProfileAPI";
import { Bounce, toast } from "react-toastify";
import EditCredentialProfileDrawer from "../SideDrawers/EditCredentialProfileDrawer";
import { useState } from "react";
import { useAppContext } from "../AppContext";
import { Modal } from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import {
  deleteSingleDevice,
  disableDeviceSingle,
  disableFlowSingle,
  disableMonitoring,
  enableDeviceSingle,
  enableFlowSingle,
  enableMonitoring,
  runDiscovery,
} from "@/pages/api/api/DeviceManagementAPI";
import EditDeviceDrawer from "../SideDrawers/EditDeviceDrawer";
import MonitoringSettingsDrawer from "../SideDrawers/MonitoringSettingsDrawer";

const ITEM_HEIGHT = 48;

const AssetsActionMenu = (props: any) => {
  const [isModalopen, setIsModalOpen] = React.useState(false);
  const handleModalOpen = () => {
    setIsModalOpen(true);
    // handleClose();
  };
  const handleModalClose = () => setIsModalOpen(false);
  const { rowData } = props;
  //   console.log("asset menu props", rowData);
  const { toggleDeviceTableState } = useAppContext();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = React.useState(false);
  const [isMOnitoringOpen, setIsMonitoringOpen] = React.useState(false);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEditDrawerClose = () => {
    setIsEditDrawerOpen(false);
  };
  const handleEditDrawerOpen = () => {
    setIsEditDrawerOpen(true);
    handleClose();
  };

  const handleMonitoringDrawerClose = () => {
    setIsMonitoringOpen(false);
  };
  const handleMonitoringDrawerOpen = () => {
    setIsMonitoringOpen(true);
    handleClose();
  };

  const handleDeleteClick = async (rowId: number) => {
    // console.log("DeleteRowId", rowId);

    try {
      const response = await deleteSingleDevice(rowId);

      if (response.status == "success") {
        toggleDeviceTableState();
        toast.success(response.message, {
          position: "bottom-right",
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });
      } else if (response.status == "fail" && response.code == 400) {
        toast.error(
          "Bad Request: The request could not be understood or was missing required parameters.",
          {
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Bounce,
          }
        );
      } else {
        toast.error(response.message, {
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });
      }

      // setIsPopupOpen(false);
    } catch (error) {
      console.log(error);
    }
    handleClose();
  };

  const runDeviceDiscovery = async () => {
    try {
      const bodyData = [rowData._id];
      let response = await runDiscovery(bodyData);
      // console.log(response);
      if (response.status == "success") {
        toggleDeviceTableState();
        toast.success(response.status, {
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });
      } else {
        toast.error(response.message, {
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const enableDevice = async () => {
    try {
      const bodyData = [rowData._id];
      let response = await enableDeviceSingle(bodyData);
      // console.log(response);
      if (response.status == "success") {
        toggleDeviceTableState();
        toast.success(response.status, {
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });
      } else {
        toast.error(response.message, {
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  const disableDevice = async () => {
    try {
      const bodyData = [rowData._id];
      let response = await disableDeviceSingle(bodyData);
      // console.log(response);
      if (response.status == "success") {
        toggleDeviceTableState();
        toast.success(response.status, {
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });
      } else {
        toast.error(response.message, {
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const enableFlow = async () => {
    try {
      const bodyData = [rowData._id];
      let response = await enableFlowSingle(bodyData);
      // console.log(response);
      if (response.status == "success") {
        toggleDeviceTableState();
        toast.success(response.status, {
          position: "bottom-right",
          autoClose: 1000,
        });
      } else {
        toast.error(response.message, {
          position: "bottom-right",
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  const disableFlow = async () => {
    try {
      const bodyData = [rowData._id];
      let response = await disableFlowSingle(bodyData);
      // console.log(response);
      if (response.status == "success") {
        toggleDeviceTableState();
        toast.success(response.status, {
          position: "bottom-right",
          autoClose: 1000,
        });
      } else {
        toast.error(response.message, {
          position: "bottom-right",
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const enableMonitoringSingleDevice = async () => {
    try {
      const bodyData = [rowData._id];
      let response = await enableMonitoring(bodyData);
      // console.log(response);
      if (response.status == "success") {
        toggleDeviceTableState();
        toast.success(response.status, {
          position: "bottom-right",
          autoClose: 1000,
        });
      } else {
        toast.error(response.message, {
          position: "bottom-right",
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const disableMonitoringSingleDevice = async () => {
    try {
      const bodyData = [rowData._id];
      let response = await disableMonitoring(bodyData);
      // console.log(response);
      if (response.status == "success") {
        toggleDeviceTableState();
        toast.success(response.status, {
          position: "bottom-right",
          autoClose: 1000,
        });
      } else {
        toast.error(response.message, {
          position: "bottom-right",
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="ml-4">
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? "long-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon className="dark:text-textColor" />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            backgroundColor: "transparent",
          },
        }}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        style={{ padding: "0" }}
      >
        <MenuItem
          className="bg-textColor dark:bg-tabel-header dark:text-textColor hover:dark:bg-tabel-header hover:bg-textColor"
          onClick={() => handleEditDrawerOpen()}
        >
          Edit
        </MenuItem>

        <MenuItem
          className="bg-textColor dark:bg-tabel-header dark:text-textColor hover:dark:bg-tabel-header hover:bg-textColor"
          //  onClick={() => handleDeleteClick(id)}
          onClick={handleModalOpen}
        >
          Delete
        </MenuItem>
        {rowData && rowData.flow_enabled == "no" ? (
          <MenuItem
            className="bg-textColor dark:bg-tabel-header dark:text-textColor hover:dark:bg-tabel-header hover:bg-textColor"
            onClick={enableFlow}
          >
            Enable Flow
          </MenuItem>
        ) : (
          <MenuItem
            className="bg-textColor dark:bg-tabel-header dark:text-textColor hover:dark:bg-tabel-header hover:bg-textColor"
            onClick={disableFlow}
          >
            Disable Flow
          </MenuItem>
        )}
        {/* {rowData.device_status == "new" && (
          <MenuItem
            className="bg-textColor dark:bg-tabel-header dark:text-textColor hover:dark:bg-tabel-header"
            onClick={runDeviceDiscovery}
          >
            Run Discovery Now
          </MenuItem>
        )} */}
        {rowData && rowData.device_status == "discovered" && (
          <MenuItem
            className="bg-textColor dark:bg-tabel-header dark:text-textColor hover:dark:bg-tabel-header"
            onClick={enableMonitoringSingleDevice}
          >
            Enable Monitoring
          </MenuItem>
        )}
        {rowData && rowData.device_status == "monitoring" && (
          <>
            <MenuItem
              className="bg-textColor dark:bg-tabel-header dark:text-textColor hover:dark:bg-tabel-header"
              onClick={disableMonitoringSingleDevice}
            >
              Disable Monitoring
            </MenuItem>
            <MenuItem
              className="bg-textColor dark:bg-tabel-header dark:text-textColor hover:dark:bg-tabel-header"
              onClick={() => handleMonitoringDrawerOpen()}
            >
              Monitoring Settings
            </MenuItem>
          </>
        )}
        {rowData && rowData.device_status == "disabled" ? (
          <MenuItem
            className="bg-textColor dark:bg-tabel-header dark:text-textColor hover:dark:bg-tabel-header"
            onClick={enableDevice}
          >
            Enable Device
          </MenuItem>
        ) : (
          <MenuItem
            className="bg-textColor dark:bg-tabel-header dark:text-textColor hover:dark:bg-tabel-header"
            onClick={disableDevice}
          >
            Disable Device
          </MenuItem>
        )}
        {/* <MenuItem onClick={handleOpenEditDialog}>Enable Device</MenuItem> */}
      </Menu>

      <Modal open={isModalopen} onClose={handleModalClose}>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white shadow-2xl p-4 max-w-md text-center rounded-md dark:bg-tabel-row">
          <DeleteForeverIcon className="text-red-400 h-[3.5rem] w-[3.5rem] " />
          <div className="mb-5  border-b-2 py-4    dark:border-dark-border ">
            <p className="text-xl font-semibold mb-2 dark:text-textColor">
              Are you sure ?{" "}
            </p>
            <p className="text-gray-400 text-sm">
              Do you really want to delete these records? This process cannot be
              undone.
            </p>
          </div>

          <button
            onClick={() => handleDeleteClick(rowData && rowData._id)}
            className="bg-red-400 hover:bg-red-400 text-white font-normal py-1 px-4 rounded mr-4 dark:text-textColor"
          >
            Delete
          </button>
          <button
            onClick={handleModalClose}
            className=" border border-light3 font-normal py-1 px-4 rounded mb-2  dark:text-textColor"
          >
            Cancel
          </button>
        </div>
      </Modal>

      <EditDeviceDrawer
        rowId={rowData && rowData._id}
        open={isEditDrawerOpen}
        handleDrawerClose={handleEditDrawerClose}
      />
      <MonitoringSettingsDrawer
        rowId={rowData && rowData._id}
        open={isMOnitoringOpen}
        handleDrawerClose={handleMonitoringDrawerClose}
      />
    </div>
  );
};
export default AssetsActionMenu;
