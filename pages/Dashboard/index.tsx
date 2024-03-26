import React, { useState, useRef, useEffect } from "react";
import CloseSharpIcon from "@mui/icons-material/CloseSharp";
import { Button, Drawer, InputBase } from "@mui/material";
import IconButton from "@mui/material/IconButton";

import ClearIcon from "@mui/icons-material/Clear";

import SearchIcon from "@mui/icons-material/Search";
import SsidChartIcon from "@mui/icons-material/SsidChart";
import SpeedIcon from "@mui/icons-material/Speed";
import TableChartOutlinedIcon from "@mui/icons-material/TableChartOutlined";
import Tooltip from "@mui/material/Tooltip";
import AddIcon from "@mui/icons-material/Add";
import AddWidgetDrawer from "../Components/SideDrawers/AddWidgetDrawer";

import { useAppContext } from "../Components/AppContext";
import { useWebSocketContext } from "../Components/WebSocketContext";
import {
  GetDashboardWidgetsData,
  UpdateWidgetsData,
  getAllWidget,
} from "../api/api/DashboardWidgetsAPI";
import { replacePeriodsWithUnderscores } from "@/functions/genericFunctions";
import { ToastContainer } from "react-toastify";
import { WidthProvider, Responsive } from "react-grid-layout";
import DashboardGaugeWidget from "./DashboardWidgets/GaugeWidget";
import DashboardGridWidget from "./DashboardWidgets/GridWidget";
import LineChartDashboardComponent from "./DashboardWidgets/LineChart";
import PieChartDashboardComponent from "./DashboardWidgets/PieChart";
import "../../node_modules/react-resizable/css/styles.css";
import "../../node_modules/react-grid-layout/css/styles.css";
import "react-toastify/dist/ReactToastify.css";
import WidgetMenu from "../Components/ActionMenu/WIdgetsMenu";
import CustomPagination from "../Components/CustomePagination";
import TimeRangePicker from "../Components/TimeRnangePicker";
const ResponsiveReactGridLayout = WidthProvider(Responsive);

interface Widget {
  widget_name: string;
  widget_type: string;
}
const ITEMS_PER_PAGE = 10;
const index = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentPage, setCurrentPage] = useState(1) as any;
  const [rowsPerPage, setRowsPerPage] = useState(10) as any;
  const [page, setPage] = React.useState(0);
  const { Subscribe, emit, unsubscribe, connection } = useWebSocketContext();
  const { getWidgetApiState } = useAppContext();
  const [widgets, setWidgets] = useState<any>();
  const [data, setData] = useState({});
  const [editable, setEditable] = useState(false);
  const [layouts, setLayouts] = useState<any>([]);
  const [layoutsCurrent, setLayoutsCurrent] = useState<any>([]);
  const [layoutsWholeData, setLayoutsWholeData] = useState<any>({});
  const [addToDashboard, setAddToDashboard] = useState<any>(0);

  useEffect(() => {
    try {
      const getData = async () => {
        let response = await getAllWidget();
        const modifiedData =
          response &&
          replacePeriodsWithUnderscores(response && response.result);
        setWidgets(modifiedData);
      };
      getData();
    } catch (error) {
      console.log(error);
    }
  }, [getWidgetApiState]);

  useEffect(() => {
    async function getWidgetData() {
      let id = "1000000000001";
      return await GetDashboardWidgetsData(id);
    }
    getWidgetData().then((res: any) => {
      setLayouts(res.result?.widgets ?? []);
      setLayoutsCurrent(res.result?.widgets ?? []);
      setLayoutsWholeData(res.result);
    });
  }, [addToDashboard]);

  // console.log("layout dummy", layoutsDummy);
  const handleButtonClick = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleSearchChange = (event: any) => {
    setSearch(event.target.value);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  const handlePageChange = (newPage: any) => {
    setPage(newPage - 1);
    setCurrentPage(newPage);
    setPage(newPage - 1);
    // Fetch data for the new page if needed
  };
  // console.log("current page", currentPage);
  const handleRowsPerPageChange = (newRowsPerPage: any) => {
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1); // Reset to the first page when changing rows per page
    setPage(0);
    // Fetch data for the new rowsPerPage if needed
  };

  const handleAddDrawerOpen = () => {
    setIsAddDrawerOpen(true);
    // handleDrawerClose();
  };

  const handleAddDrawerClose = () => {
    setIsAddDrawerOpen(false);
    //  setIsDrawerOpen(false);
  };

  function onLayoutChange(layout: any, currentLayout: any) {
    console.log("current layout event", currentLayout);
    setLayouts(currentLayout);
  }

  function deleteReport(index: any) {
    let currentLayout = layouts;
    delete currentLayout[index];
    currentLayout = currentLayout.filter(Boolean);
    setLayouts(currentLayout);
  }
  function saveLayout() {
    setLayoutsCurrent(layouts);
    async function updateWidgetData() {
      let id = "1000000000001";
      let body = { ...layoutsWholeData, widgets: layouts };
      body = { ...layoutsWholeData, widgets: data };
      console.log("body data", body);
      // await UpdateWidgetsData(id, body);
    }
    updateWidgetData();
  }
  useEffect(() => {
    saveLayout();
  }, [layouts, data]);

  function discardLayout() {
    setLayouts(layoutsCurrent);
  }

  const handleDate = (event: any) => {
    // console.log("date event", event);
    let updatedPayload: any = { ...data };

    if (event.label !== "custom") {
      delete updatedPayload.start_timestamp;
      delete updatedPayload.end_timestamp;
      updatedPayload = {
        ...updatedPayload,
        time_range: event.text,
      };
    } else {
      const startdate = new Date(event.value[0]);
      const startepochTime = startdate.getTime() / 1000;
      const enddate = new Date(event.value[1]);
      const endepochTime = enddate.getTime() / 1000;
      updatedPayload = {
        ...updatedPayload,
        time_range: event.text,
        start_timestamp: startepochTime,
        end_timestamp: endepochTime,
      };
    }
    // console.log("updated payload", updatedPayload);
    setData(updatedPayload);
  };
  const totalCount = widgets && widgets.length;

  return (
    <div>
      <ToastContainer />
      <div>
        <div className="text-xl border-b-2 border-slate-400 pb-2 px-4 mb-2 flex justify-between w-full items-end">
          <div>Dashboards</div>
          <div>
            <div className="flex">
              <div className="mx-8">
                <TimeRangePicker onTimeRangeChange={handleDate} />
              </div>

              {!editable && (
                <button
                  className="bg-blue-500 rounded p-2 ml-2 text-sm text-white"
                  onClick={() => setEditable(!editable)}
                >
                  Unlock Dashboard
                </button>
              )}
              {editable && (
                <button
                  className="bg-blue-500 rounded p-2 ml-2 text-sm text-white"
                  onClick={() => {
                    saveLayout();
                    setEditable(!editable);
                  }}
                >
                  Lock Dasboaard
                </button>
              )}
            </div>

            {/* {editable && (
              <button
                className="bg-red-500 rounded p-2 ml-2 text-sm text-white"
                onClick={() => {
                  discardLayout();
                  setEditable(!editable);
                }}
              >
                Discard Layout
              </button>
            )} */}
          </div>
        </div>
        <div>
          <ResponsiveReactGridLayout
            className="layout"
            cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
            rowHeight={30}
            isDraggable={editable}
            isResizable={editable}
            layouts={{ layouts }}
            onLayoutChange={(currentLayout, currentLayoutResponsive) =>
              onLayoutChange(currentLayout, currentLayout)
            }
          >
            {/* <div className="w-auto h-auto relative"> */}
            {layouts &&
              layouts?.map((data: any, index: any) => {
                return (
                  <div
                    key={layouts[index]?.i}
                    className=" bg-white rounded h-auto p-2 shadow-lg relative"
                    data-grid={{
                      w: data?.w,
                      h: data?.h,
                      x: data?.x,
                      y: data?.y,
                      minW: 4,
                      minH: 10,
                    }}
                  >
                    {editable && (
                      <span
                        onClick={() => deleteReport(index)}
                        className="bg-slate-900 z-[1000] text-xs cursor-pointer rounded-full absolute -right-2 -top-2 text-white flex justify-center items-center w-5 h-5"
                      >
                        X
                      </span>
                    )}
                    <div className="h-full overflow-auto">
                      {data?.i.split("/")[2] == "chart" && (
                        <LineChartDashboardComponent
                          id={data?.i.split("/")[3]}
                          keys={data?.i}
                        />
                      )}
                      {data?.i.split("/")[2] == "topN" && (
                        <PieChartDashboardComponent
                          id={data?.i.split("/")[3]}
                          keys={data?.i}
                        />
                      )}
                      {data?.i.split("/")[2] == "grid" && (
                        <DashboardGridWidget
                          id={data?.i.split("/")[3]}
                          keys={data?.i}
                        />
                      )}
                      {data?.i.split("/")[2] == "gauge" && (
                        <DashboardGaugeWidget
                          id={data?.i.split("/")[3]}
                          keys={data?.i}
                        />
                      )}
                    </div>
                  </div>
                  // </>
                );
              })}
          </ResponsiveReactGridLayout>
        </div>
        <div
          onClick={handleButtonClick}
          className="rounded-[50%] shadow-sm border-2 border-primary2 bg-primary2 p-1 bottom-2 right-4 fixed cursor-pointer "
        >
          <AddIcon fontSize="large" className="text-textColor" />
        </div>

        <Drawer
          anchor="right"
          open={isDrawerOpen}
          variant="persistent"
          className="dark:border-l-0"
        >
          <div className="container h-full bg-white dark:bg-dark-container">
            <div className="flex border-b  justify-between py-3">
              <span className="px-4 font-bold  text-primary2"> Add Widget</span>

              <CloseSharpIcon
                className="cursor-pointer mr-3 dark:text-textColor"
                onClick={handleDrawerClose}
              />
            </div>
            <div className="px-4">
              <div className="flex  my-6 mr-2 justify-between items-center ">
                <div className="border items-center rounded-lg h-[2.3rem] dark:border-[#3C3C3C] border-[#CCCFD9] flex justify-end w-fit m-2 mt-3 dark:text-white">
                  <IconButton>
                    <SearchIcon
                      className="dark:text-[#3C3C3C] text-[#CCCFD9] "
                      fontSize="small"
                    />
                  </IconButton>
                  <InputBase
                    className="dark:text-textColor"
                    placeholder="Search"
                    value={search}
                    onChange={handleSearchChange}
                  />
                  {search != "" && (
                    <ClearIcon
                      className="dark:text-white border rounded-2xl"
                      fontSize="small"
                      sx={{ fontSize: "13px", marginRight: "3px" }}
                    />
                  )}
                </div>

                <Tooltip
                  className="text-lg font-bold"
                  title="Create Widget"
                  placement="top"
                >
                  <Button
                    onClick={handleAddDrawerOpen}
                    variant="contained"
                    className="bg-primary3 capitalize h-fit items-center"
                    size="small"
                  >
                    <AddIcon fontSize="small" className="mr-2" /> Widget
                  </Button>
                </Tooltip>
              </div>
              <AddWidgetDrawer
                open={isAddDrawerOpen}
                handleAddDrawerClose={handleAddDrawerClose}
              />
              <div className="relative  px-4 py-1 overflow-x-auto ">
                <div className="min-h-[450px] ">
                  <table className="w-full border-collapse overflow-x-scroll">
                    <thead>
                      <tr className="bg-textColor  dark:bg-tabel-header dark:text-textColor">
                        <th scope="col" className="px-2 py-2 ">
                          Widget Name
                        </th>

                        <th scope="col" className="px-2 py-2 0">
                          Widget Description
                        </th>
                        <th scope="col" className="px-2 py-2 0">
                          Widget Type
                        </th>

                        <th scope="col" className="px-2 py-2 ">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {widgets &&
                        widgets
                          .slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                          .map((row: any, index: any) => (
                            <tr
                              key={index}
                              className="bg-white dark:bg-dark-container dark:text-textColor"
                            >
                              <td
                                scope="row"
                                className="bg-white text-center dark:bg-dark-container dark:text-textColor dark:border-dark-border "
                              >
                                {row.name}
                              </td>

                              <td className="bg-white text-center dark:bg-dark-container dark:text-textColor dark:border-dark-border ">
                                {row.description ? row.description : "-"}
                              </td>
                              <td className="bg-white text-center dark:bg-dark-container dark:text-textColor dark:border-dark-border ">
                                {row.widget_type == "chart" ? (
                                  <SsidChartIcon />
                                ) : row.widget_type == "topN" ||
                                  row.widget_type == "grid" ? (
                                  <TableChartOutlinedIcon />
                                ) : (
                                  <SpeedIcon />
                                )}
                              </td>

                              <td className="px-6 py-1 text-gray-900 whitespace-nowrap">
                                <WidgetMenu
                                  setAddToDashboard={setAddToDashboard}
                                  id={row._id && row._id}
                                  widget_type={
                                    row.widget_type && row.widget_type
                                  }
                                />
                              </td>
                            </tr>
                          ))}
                    </tbody>
                  </table>
                </div>
                <div className="fixed bottom-0 ">
                  <CustomPagination
                    totalCount={totalCount}
                    rowsPerPage={rowsPerPage}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleRowsPerPageChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </Drawer>
      </div>
    </div>
  );
};
export default index;
