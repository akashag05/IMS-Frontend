import React, { useState, useEffect } from "react";
import {
  InputBase,
  IconButton,
  Menu,
  MenuItem,
  Checkbox,
  TableSortLabel,
  Tooltip,
  Button,
} from "@mui/material";
import Zoom from "@mui/material/Zoom";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import SlowMotionVideoIcon from "@mui/icons-material/SlowMotionVideo";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ClearIcon from "@mui/icons-material/Clear";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
// import VisibilityIcon from "@mui/icons-material/ViewColumn";
import { Bounce, toast } from "react-toastify";
import {
  bulkActionDeviceDelete,
  getAllDeviceManager,
} from "@/pages/api/api/DeviceManagementAPI";
import { getAllGropus } from "@/pages/api/api/GroupsAPI";
import { getAllDiscoverySch } from "@/pages/api/api/DiscoveryScheduleAPI";
import {
  bulkActionCredsProfileDelete,
  getAllCredsProfile,
} from "@/pages/api/api/CredentialProfileAPI";
import {
  convertEpochToDateMonthYear,
  replacePeriodsWithUnderscores,
} from "@/functions/genericFunctions";

import Link from "next/link";
import { useAppContext } from "../../../Components/AppContext";
import DeleteModal from "../../../Components/Modals/DeleteModal";
import { StatusChips } from "../../../Components/Chips";
import CustomPagination from "../../../Components/CustomePagination";

const Profiling = () => {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("");
  const [search, setSearch] = useState("");
  const { toggleDeviceTableState } = useAppContext();
  const [page, setPage] = React.useState(0);
  const [visibleColumns, setVisibleColumns] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState(1) as any;
  const [rowsPerPage, setRowsPerPage] = useState(10) as any;
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedButtons, setSelectedButtons] = useState([]) as any;
  const [allCredsPrfile, setAllCredsProfil] = React.useState([]);
  const [selectedRows, setSelectedRows] = useState<any>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [allDevices, setAllDevices] = React.useState([]);
  const [allGroups, setAllGroups] = React.useState([]);
  const [selected, setSelected] = useState(false);
  const [anchorE3, setAnchorE3] = useState(null);
  const [anchorE2, setAnchorE2] = useState<null | HTMLElement>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCSVDrawerOpen, setICSVDrawerOpen] = useState(false);
  const [isModalopen, setIsModalOpen] = React.useState(false);
  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => setIsModalOpen(false);
  const [data, setData] = useState<any>();
  const [columns, setColumns] = useState<any>();

  const groupValues =
    allGroups &&
    allGroups.map((item: any) => ({
      name: item.name,
      id: item._id,
    }));
  const deviceValues =
    allDevices &&
    allDevices.map((item: any) => ({
      name: item.hostname,
      id: item._id,
    }));

  React.useEffect(() => {
    const getCredsProfile = async () => {
      let response = await getAllCredsProfile();
      setAllCredsProfil(response.result);
    };
    // const getCredsProfile = async () => {
    //   let response = await getAllDevice();
    //   setAllDevices(response.result);
    // };
    getCredsProfile();
    const getGroups = async () => {
      let response = await getAllGropus();
      setAllGroups(response.result);
    };
    getGroups();
    const getDiscoveryScheduler = async () => {
      let response = await getAllDiscoverySch();
      // setAllDiscoverySch(response.result);
    };
    getDiscoveryScheduler();
  }, []);

  useEffect(() => {
    try {
      const getData = async () => {
        let cols: any = [];
        let response = await getAllDeviceManager();
        const modifiedData = replacePeriodsWithUnderscores(response.result);
        console.log("profiling data", modifiedData);
        const col = Object.keys(modifiedData[0]);
        // const indexOfObjectWithAvailabilityContext = modifiedData.findIndex(
        //   (obj: any) => obj.availability_context !== undefined
        // );
        // console.log("modifidData", indexOfObjectWithAvailabilityContext);
        // const col = Object.keys(
        //   modifiedData[indexOfObjectWithAvailabilityContext]
        // );
        const filteredCols = col.filter((key: any) => !key.startsWith("_"));
        // console.log(filteredCols);
        filteredCols.filter((key: any) => {
          if (!key.startsWith("_")) {
            if (key == "availability_context") {
              cols.unshift({
                field: "icmp_availability",
                headerName: "icmp_Avl.",
                minWidth: 120,
              });
              cols.unshift({
                field: "plugin_availability",
                headerName: "plugin_Avl.",
                minWidth: 120,
              });
              cols.push({
                field: "timestamp",
                headerName: "timestamp",
                minWidth: 120,
              });
            } else if (key == "port") {
              cols.push({
                field: key.replace(/\./g, "_"),
                headerName: key.replace(/\./g, " "),
                minWidth: 80,
              });
            } else if (key == "credential_profiles") {
              cols.push({
                field: key.replace(/\./g, "_"),
                headerName: key.replace(/\./g, " "),
                minWidth: 200,
              });
            } else if (key == "hostname") {
              cols.push({
                field: key.replace(/\./g, "_"),
                headerName: "Host Name",
                minWidth: 150,
              });
            } else {
              cols.push({
                field: key.replace(/\./g, "_"),
                headerName: key.replace(/\./g, " "),
                minWidth: 150,
              });
            }
          }
        });
        const x = filteredCols.includes("availabilty_context");
        if (x) {
          cols.unshift({
            field: "icmp_availability",
            headerName: "icmp_Avl.",
            minWidth: 120,
          });
          cols.unshift({
            field: "plugin_availability",
            headerName: "plugin_Avl.",
            minWidth: 120,
          });
          cols.push({
            field: "timestamp",
            headerName: "timestamp",
            minWidth: 120,
          });
        }
        cols.push({
          field: "last_availability_on",
          headerName: "Last Avaiable On",
          minWidth: 120,
        });
        console.log("cols", cols);
        setColumns(cols);
        console.log("rows", modifiedData);
        const hiddenColumnsValues = [
          // "alias",
          "discovery_schedulers",
          "country",
          // "groups",
          "profile_type",
          "port",
          "credential_profiles",
          "availability_interval",
          // "flow_enabled",
          "auto_provision",
          "location",
          "site",
          // "oem",
          "os",
          "alias",
          "os_version",
          "vendor",
          "check_without_save",
          "device_list",
          "site_code",
          "device_name",
          "service",
          "latitude",
          "longitude",
          "created_by",
          "created_on",
          "updated_by",
          "updated_on",
          "timestamp",
          "timezone",
          "valid_credential_profile",
          // "last_discovered_on",
        ];

        setVisibleColumns(
          cols
            .map((column: any) => column.field)
            .filter((field: any) => !hiddenColumnsValues.includes(field))
        );

        setData(modifiedData);
      };
      getData();
    } catch (error) {
      console.log(error);
    }
  }, []);
  const totalCount = data && data.length;
  const handleRequestSort = (property: any) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSearchChange = (event: any) => {
    setSearch(event.target.value);
  };

  const handleColumnToggle = (columnField: any) => {
    setVisibleColumns((prevVisibleColumns: any) => {
      if (prevVisibleColumns.includes(columnField)) {
        return prevVisibleColumns.filter((field: any) => field !== columnField);
      } else {
        return [...prevVisibleColumns, columnField];
      }
    });
  };

  const handleRowCheckboxToggle = (rowId: any) => {
    setSelectedRows((prevSelectedRows: any) => {
      if (prevSelectedRows.includes(rowId)) {
        return prevSelectedRows.filter((id: any) => id !== rowId);
      } else {
        return [...prevSelectedRows, rowId];
      }
    });
  };

  const handleSelectAllCheckboxToggle = () => {
    if (selectAll) {
      setSelectedRows([]);
    } else {
      const allRowIds = data.map((row: any) => row._id);
      setSelectedRows(allRowIds);
    }
    setSelectAll(!selectAll);
  };

  useEffect(() => {
    if (selectedRows.length != 0) {
      setSelected(true);
    } else {
      setSelected(false);
    }
  }, [selectedRows]);

  const downloadCSV = () => {
    const selectedRowsData = data.filter((row: any) =>
      selectedRows.includes(row._id)
    );

    const csvData = [Object.keys(selectedRowsData[0])]; // Header

    selectedRowsData.forEach((row: any) => {
      const rowData: any = Object.values(row);
      csvData.push(rowData);
    });

    const csvContent = csvData.map((row) => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "data.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const filteredData =
    data &&
    data.filter((row: any) => {
      const matchesSearch = visibleColumns.some(
        (columnField: any) =>
          typeof row[columnField] === "string" &&
          row[columnField].toLowerCase().includes(search.toLowerCase())
      );

      const matchesButtons =
        selectedButtons.length === 0 ||
        selectedButtons.some((button: any) => row["plugin_type"] === button);
      console.log("matched button", row["plugin_type"]);
      return matchesSearch && matchesButtons;
    });

  const handleButtonClick = (title: any) => {
    setSelectedButtons((prevSelectedButtons: any) => {
      if (prevSelectedButtons.includes(title)) {
        return prevSelectedButtons.filter((button: any) => button !== title);
      } else {
        return [...prevSelectedButtons, title];
      }
    });
  };

  const handleResetButtonClick = () => {
    setSelectedButtons([]);
  };

  const stableSort = (array: any, comparator: any) => {
    const stabilizedThis = array.map((el: any, index: any) => [el, index]);
    stabilizedThis.sort((a: any, b: any) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el: any) => el[0]);
  };

  const getComparator = (order: any, orderBy: any) => {
    return order === "desc"
      ? (a: any, b: any) => descendingComparator(a, b, orderBy)
      : (a: any, b: any) => -descendingComparator(a, b, orderBy);
  };

  const descendingComparator = (
    a: { [x: string]: number },
    b: { [x: string]: number },
    orderBy: string | number
  ) => {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  };

  const handleMenuOpen = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (columnField: any) => {
    console.log("clicked");
    handleColumnToggle(columnField);
    // handleMenuClose();
  };

  const handleDrawerOpen = () => {
    setIsDrawerOpen(true);
  };
  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };
  const handleCSVDrawerOpen = () => {
    setICSVDrawerOpen(true);
  };
  const handleCSVDrawerClose = () => {
    setICSVDrawerOpen(false);
  };

  const isMenuOpen = Boolean(anchorEl);

  const processColumnData = (column: any, row: any) => {
    // Perform operations based on the column and row data
    if (column.field === "groups") {
      const groupId = row[column.field] && row[column.field];
      // Find the corresponding object in groupValues array
      const matchingGroup: any = groupValues.find(
        (group: any) => group.id === groupId[0]
      );

      // If a matching group is found, return its name, otherwise return null or a default value
      return matchingGroup ? matchingGroup.name : "-";
    } else if (column.field === "credential_profiles") {
      const credProfileId = row[column.field] && row[column.field];
      const numericCredProfileId = parseInt(credProfileId[0], 10);

      const matchingCredsProfile: any = allCredsPrfile.find(
        (creds: any) => creds._id === numericCredProfileId
      );
      // console.log("----", matchingCredsProfile);
      // If a matching group is found, return its name, otherwise return null or a default value
      return matchingCredsProfile ? matchingCredsProfile.name : "-";
      // : row[column.field];
    } else if (column.field === "icmp_availability") {
      if (
        row.availability_context &&
        row.availability_context["icmp.availability"]
      ) {
        return (
          <>
            <Tooltip title="OnLine" placement="top-end">
              <div className="flex items-center">
                {/* <div className="bg-success rounded-xl w-3 h-3  mr-2"></div> */}
                <ArrowDropUpIcon
                  className="text-success"
                  fontSize="large"
                  style={{ fontSize: "2.5rem" }}
                />
              </div>
            </Tooltip>
            {/* <ArrowDropUpIcon style={{fontSize : "28px"}} color="success" fontSize="small" /> */}
          </>
        );
      } else if (
        row.availability_context &&
        !row.availability_context["icmp.availability"]
      ) {
        return (
          <>
            <Tooltip title="Offline" placement="top-end">
              <div className=" flex items-center">
                {/* <div className="bg-danger rounded-xl w-3 h-3 mr-2"></div> */}
                <ArrowDropDownIcon
                  className="text-danger"
                  fontSize="large"
                  style={{ fontSize: "2.5rem" }}
                />
              </div>
            </Tooltip>

            {/* <ArrowDropDownIcon color="error" fontSize="small" /> */}
          </>
        );
      }
    } else if (column.field === "plugin_availability") {
      if (
        row.availability_context &&
        row.availability_context["plugin.availability"]
      ) {
        return (
          <>
            <Tooltip title="OnLine" placement="top-end">
              <div className="flex items-center">
                {/* <div className="bg-success rounded-xl w-3 h-3  mr-2"></div> */}
                <ArrowDropUpIcon
                  className="text-success"
                  fontSize="large"
                  // sx={{ height: "4rem" }}
                  style={{ fontSize: "2.5rem" }}
                />
              </div>
            </Tooltip>
          </>
        );
      } else if (
        row.availability_context &&
        !row.availability_context["plugin.availability"]
      ) {
        return (
          <>
            <Tooltip title="OffLine" placement="top-end">
              <div className=" flex items-center">
                {/* <div className="bg-danger rounded-xl w-3 h-3 mr-2"></div> */}
                <ArrowDropDownIcon
                  className="text-danger"
                  fontSize="large"
                  style={{ fontSize: "2.5rem" }}
                />
              </div>
            </Tooltip>
            {/* <ArrowDropDownIcon color="error" fontSize="small" /> */}
          </>
        );
      }
    } else if (column.field === "flow_enabled") {
      if (row[column.field] == "yes") {
        return (
          <>
            <Tooltip title="OnLine" placement="top-end">
              <div className="flex items-center">
                {/* <div className="bg-success rounded-xl w-3 h-3  mr-2"></div> */}
                <ArrowDropUpIcon
                  fontSize="large"
                  className="text-success"
                  style={{ fontSize: "2.5rem" }}
                />
              </div>
            </Tooltip>
            {/* <ArrowDropUpIcon style={{fontSize : "28px"}} color="success" fontSize="small" /> */}
          </>
        );
      } else if (row[column.field] == "no") {
        return (
          <>
            <Tooltip title="Offline" placement="top-end">
              <div className=" flex items-center">
                {/* <div className="bg-danger rounded-xl w-3 h-3 mr-2"></div> */}
                <ArrowDropDownIcon
                  className="text-danger"
                  fontSize="large"
                  style={{ fontSize: "2.5rem" }}
                />
              </div>
            </Tooltip>

            {/* <ArrowDropDownIcon color="error" fontSize="small" /> */}
          </>
        );
      }
    } else if (
      column.field === "timestamp" ||
      column.field == "last_discovered_on"
    ) {
      const timestamp =
        row.availability_context &&
        (row.availability_context["timestamp"] ||
          row.availability_context["last_discovered_on"]);

      if (
        row.availability_context &&
        (row.availability_context["timestamp"] ||
          row.availability_context["last_discovered_on"])
      ) {
        const formattedDateMonthYear = convertEpochToDateMonthYear(timestamp);
        return formattedDateMonthYear ? formattedDateMonthYear : "-";
      }
    } else if (column.field == "device_status") {
      const device_status = row[column.field] && row[column.field];
      return <StatusChips value={device_status} />;
    }

    // If no specific processing needed, return the original value
    return row[column.field];
  };
  const deleteDevice = async () => {
    console.log("delete array", selectedRows);
    try {
      let response = await bulkActionDeviceDelete(selectedRows);

      if (response.status == "success") {
        handleModalClose();

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
  };
  const handleAddMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorE2(event.currentTarget);
  };
  const handleAddMenuClose = () => {
    setAnchorE2(null);
  };

  const handleActionClick = (event: any) => {
    setAnchorE3(event.currentTarget);
  };

  const handleActionClose = () => {
    setAnchorE3(null);
  };

  return (
    <>
      {data && (
        <>
          <div className="flex justify-between">
            <div className="flex justify-between dark:text-white">
              {/* Global Search for table */}
              <div className="flex">
                <div className="border items-center rounded-lg h-[2.3rem] dark:border-dark-border border-textColor flex justify-end w-fit m-2 mt-3 dark:text-white">
                  <IconButton>
                    <SearchIcon
                      className="dark:text-dark-border text-textColor "
                      fontSize="small"
                    />
                  </IconButton>
                  <InputBase
                    className="dark:text-textColor"
                    placeholder="Search"
                    value={search}
                    onChange={handleSearchChange}
                  />
                  {/* {search != "" && ( */}
                  <ClearIcon
                    onClick={() => {
                      setSearch("");
                    }}
                    className="cursor-pointer rounded-2xl"
                    fontSize="small"
                    color={search == "" ? "disabled" : "warning"}
                    sx={{ fontSize: "13px", marginRight: "8px" }}
                  />
                  {/* )} */}
                </div>
              </div>
            </div>
            <div className="flex">
              <div className="flex items-center m-4 mr-0">
                {/* {selected ? (
                    <>
                      <Tooltip
                        TransitionComponent={Zoom}
                        title="Delete selected credentials"
                        placement="top"
                      >
                        <DeleteForeverIcon
                          onClick={handleModalOpen}
                          className="cursor-pointer dark:text-textColor"
                          style={{
                            margin: "0 5px",
                          }}
                        />
                      </Tooltip>
                      <DeleteModal
                        open={isModalopen}
                        handleModalClose={handleModalClose}
                        deleteRow={deleteDevice}
                      />
                      <Tooltip
                        TransitionComponent={Zoom}
                        title="Download selected credentials"
                        placement="top"
                      >
                        <FileDownloadIcon
                          onClick={downloadCSV}
                          className="cursor-pointer dark:text-textColor"
                          style={{
                            margin: "0 5px",
                          }}
                        />
                      </Tooltip>
                    </>
                  ) : (
                    <>
                      <Tooltip
                        TransitionComponent={Zoom}
                        title="Delete selected credentials (Disabled)"
                        placement="top"
                      >
                        <DeleteForeverIcon
                          //   onClick={deleteDevice}
                          color="disabled"
                          className="cursor-pointer dark:text-gray-700"
                          style={{
                            margin: "0 5px",
                          }}
                        />
                      </Tooltip>
                      <Tooltip
                        TransitionComponent={Zoom}
                        title="Download selected credentials (Disabled)"
                        placement="top"
                      >
                        <FileDownloadIcon
                          // onClick={downloadCSV}
                          className="cursor-pointer dark:text-gray-700"
                          color="disabled"
                          style={{
                            margin: "0 5px",
                          }}
                        />
                      </Tooltip>
                    </>
                  )} */}
                {/* Hide and Show column */}
                <Tooltip
                  TransitionComponent={Zoom}
                  title="Hide/UnHide Columns"
                  placement="top"
                >
                  <ViewColumnIcon
                    className="text-dark-border dark:text-light-menu-color"
                    style={{ margin: "0 10px 0 5px" }}
                    onClick={handleMenuOpen}
                  />
                </Tooltip>
                <Menu
                  anchorEl={anchorEl}
                  open={isMenuOpen}
                  onClose={handleMenuClose}
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
                  {columns.map((column: any) => (
                    <MenuItem
                      className="bg-light-container dark:bg-dark-container dark:text-textColor hover:dark:bg-tabel-header"
                      style={{
                        fontFamily: `"Poppins", sans-serif`,
                      }}
                      key={column.field}
                      onClick={() => handleMenuItemClick(column.field)}
                    >
                      <Checkbox
                        className=" dark:text-textColor"
                        style={{
                          padding: "0 .5rem",
                        }}
                        size="small"
                        checked={visibleColumns.includes(column.field)}
                        // onChange={() => handleMenuItemClick(column.field)}
                      />
                      {column.headerName
                        .split(" ")
                        .map((word: any) =>
                          word
                            .split("_")
                            .map(
                              (subWord: any) =>
                                subWord.charAt(0).toUpperCase() +
                                subWord.slice(1)
                            )
                            .join(" ")
                        )
                        .join(" ")}
                    </MenuItem>
                  ))}
                </Menu>
                <div>
                  <Link href="/Assets/">
                    <Button
                      // onClick={handleDrawerOpen}
                      variant="contained"
                      className="bg-primary3 capitalize items-center ml-3"
                      size="small"
                    >
                      {/* <AddIcon fontSize="small" className="mr-2" />  */}
                      Assets
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Add Device Menu and Model */}

              {/* <div className="flex m-4 mr-0 ml-2 h-fit">
                  <Button
                    onClick={handleCSVDrawerOpen}
                    variant="contained"
                    className="bg-primary3 capitalize items-center"
                    size="small"
                    style={{ margin: "0 10px" }}
                  >
                    <FileUploadIcon fontSize="small" className="mr-2" /> Upload
                    CSV
                  </Button>
                  <Button
                    onClick={handleDrawerOpen}
                    variant="contained"
                    className="bg-primary3 capitalize items-center"
                    size="small"
                  >
                    <AddIcon fontSize="small" className="mr-2" /> Asset
                  </Button>

                  <AddSingleDeviceDrawer
                    open={isDrawerOpen}
                    handleDrawerClose={handleDrawerClose}
                  />
                  <UploadCSVDrawer
                    open={isCSVDrawerOpen}
                    handleDrawerClose={handleCSVDrawerClose}
                  />
                </div> */}
            </div>
            {/* Global Downlad and delete button for table */}
          </div>

          <div
            className=""
            style={{
              width: "100%",
              overflowX: "scroll",
              borderRadius: "0",
              marginTop: ".5rem",
            }}
          >
            <div className="">
              <table className="absolite w-fit border-collapse overflow-x-hidden">
                <thead>
                  <tr>
                    <th
                      className="bg-textColor  dark:bg-tabel-header dark:text-textColor"
                      style={{
                        padding: "8px",
                        fontSize: "11px",
                        textAlign: "center",
                        borderBottom: "0",
                        fontWeight: "bolder",
                        // backgroundColor:"#D8D8D8"
                      }}
                    >
                      <Checkbox
                        className=" dark:text-textColor"
                        size="small"
                        style={{ padding: "0" }}
                        checked={selectAll}
                        onChange={handleSelectAllCheckboxToggle}
                      />
                    </th>
                    {columns
                      .filter((column: any) =>
                        visibleColumns.includes(column.field)
                      )
                      .map((column: any, colIndex: any) => {
                        const iconDirection = column.field ? order : "asc";
                        return (
                          <th
                            className="bg-textColor text-start text-tabel-header dark:text-textColor dark:bg-tabel-header "
                            key={column.id}
                            align={column.align}
                            style={{
                              padding: "0px 8px",
                              minWidth: column.minWidth,
                              fontSize: "14px",
                              fontWeight: "600",
                              borderBottom: "0",
                              letterSpacing: ".7px",
                              fontStyle: "normal",
                              fontFamily: `"Poppins", sans-serif`,
                              // backgroundColor:"#D8D8D8"
                            }}
                          >
                            <TableSortLabel
                              className={`flex  ${
                                colIndex == 0 || colIndex == 1
                                  ? "justify-start  "
                                  : "justify-start"
                              }`}
                              //   style={{
                              //     display: "flex",
                              //     justifyContent: "center",
                              //     paddingLeft: "2rem",
                              //   }}
                              active={orderBy === column.field}
                              direction={
                                iconDirection as "asc" | "desc" | undefined
                              }
                              onClick={() => handleRequestSort(column.field)}
                              style={{
                                color: "inherit",
                                textDecoration: "none",
                              }}
                            >
                              {column.headerName
                                .split(" ")
                                .map((word: any) =>
                                  word
                                    .split("_")
                                    .map(
                                      (subWord: any) =>
                                        subWord.charAt(0).toUpperCase() +
                                        subWord.slice(1)
                                    )
                                    .join(" ")
                                )
                                .join(" ")}
                            </TableSortLabel>
                          </th>
                        );
                      })}
                    {/* <th
                      className="bg-textColor text-tabel-header dark:text-textColor dark:bg-tabel-header "
                      style={{
                        padding: "0px 8px",
                        fontSize: "14px",
                        fontWeight: "600",
                        borderBottom: "0",
                        letterSpacing: ".7px",
                        textAlign: "start",
                        fontStyle: "normal",
                        fontFamily: `"Poppins", sans-serif`,
                        // backgroundColor:"#D8D8D8"
                      }}
                    >
                      Actions
                    </th> */}
                  </tr>
                </thead>
                <tbody>
                  {stableSort(filteredData, getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row: any, rowIndex: any) => {
                      const isLastRow = rowIndex === data.length - 1;
                      return (
                        <tr
                          className="bg-white dark:bg-dark-container dark:text-textColor"
                          role="checkbox"
                          tabIndex={-1}
                          key={row._id}
                        >
                          <td
                            style={{
                              //   padding: "8px",
                              textAlign: "center",
                            }}
                            className={`bg-white dark:bg-dark-container dark:text-textColor dark:border-dark-border ${
                              isLastRow ? "border-b" : "border-b"
                            }`}
                          >
                            <Checkbox
                              className=" dark:text-textColor"
                              style={{
                                padding: "0",
                                textAlign: "center",
                              }}
                              color="primary"
                              size="small"
                              checked={selectedRows.includes(row._id)}
                              onChange={() => handleRowCheckboxToggle(row._id)}
                            />
                          </td>
                          {columns
                            .filter((column: any) =>
                              visibleColumns.includes(column.field)
                            )
                            .map((column: any, colIndex: any) => {
                              const value = row[column.field];
                              const processedValue = processColumnData(
                                column,
                                row
                              );

                              return (
                                <td
                                  className={`dark:bg-dark-container dark:text-textColor dark:border-dark-border ${
                                    isLastRow ? "border-b " : "border-b "
                                  }`}
                                  key={column.id}
                                  align={column.align}
                                  style={{
                                    fontSize: "13px",
                                    fontWeight: "normal",
                                    padding: "8px",
                                    textAlign: "center",
                                    fontFamily: `"Poppins", sans-serif`,
                                  }}
                                >
                                  <span
                                    className={`flex ${
                                      colIndex == 0 || colIndex == 1
                                        ? "justify-start"
                                        : "justify-start "
                                    }`}
                                  >
                                    {column.format &&
                                    typeof processedValue === "number"
                                      ? column.format(processedValue)
                                      : processedValue}
                                  </span>
                                </td>
                              );
                            })}
                          <td
                            className={` bg-white items-center dark:bg-dark-container dark:text-textColor dark:border-dark-border ${
                              isLastRow ? "border-b" : "border-b "
                            }`}
                            style={{
                              // fontSize: "11px",
                              fontWeight: "normal",
                              padding: "0",
                              textAlign: "start",
                              fontFamily: `"Poppins", sans-serif`,
                            }}
                          >
                            {/* <div className="flex items-center">
                              <Tooltip
                                TransitionComponent={Zoom}
                                title="Run Discovery Now"
                                placement="top"
                              >
                                <SlowMotionVideoIcon />
                               
                              </Tooltip>
                              <AssetsActionMenu rowData={row} />
                            </div> */}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
          {/* <CustomPagination
            totalCount={totalCount}
            rowsPerPage={rowsPerPage}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
          /> */}
        </>
      )}
    </>
  );
};

export default Profiling;
