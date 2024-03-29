import React, { useState, useEffect } from "react";
import {
  replaceDotsWithUnderscores,
  replacePeriodsWithUnderscores,
  replacePeriodsWithUnderscoresnested,
  replaceUnderscoresWithDotsNested,
} from "@/functions/genericFunctions";
import CustomPagination from "@/pages/Components/CustomePagination";
import { useAppContext } from "@/pages/Components/AppContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserTable from "@/pages/Components/Tabels/UserTable";
import { getAllUser } from "@/pages/api/api/UserManagementAPI";
const User = () => {
  const [data, setData] = useState<any>();
  const [columns, setColumns] = useState<any>();
  const [page, setPage] = React.useState(0);
  // const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [visibleColumns, setVisibleColumns] = useState<any>([]);

  const [currentPage, setCurrentPage] = useState(1) as any;
  const [rowsPerPage, setRowsPerPage] = useState(10) as any;
  const { themeSwitch, getUserApiState } = useAppContext();




  useEffect(() => {
    try {
      const getData = async () => {
        let cols: any = [];
        let response = await getAllUser();
        console.log("discover Scheduler data response ", response.result);
        const modifiedData = replaceDotsWithUnderscores(response.result);
        console.log("modifified data", modifiedData);
          
        const col = Object.keys(modifiedData[0]);
        const filteredCols = col.filter((key: any) => !key.startsWith("_"));
        console.log("filtered cols----------------", filteredCols);

        filteredCols.filter((key: any) => {
          if (!key.startsWith("_")) {
            if (key == "last_name") {
              cols.push({
                field: "last_name",
                headerName: "last name",
                minWidth: 150,
              });
            }
            else if (key == "email_address") {
              cols.push({
                field: "email_address",
                headerName: "Email",
                minWidth: 80,
              });
            } else if (key == "first_name") {
              cols.unshift({
                field: "first_name",
                headerName: "First Name",
                minWidth: 80,
              });
            } else {
              cols.push({
                field: key.replace(/\./g, "_"),
                headerName: key.replace(/\./g, " "),
                minWidth: 110,
              });
            }
          }
        });
        console.log("cols", cols);
        setColumns(cols);

        const hiddenColumnsValues = [
          "username",
          "password",
          "role",
          "enable",
          "created_on",
          "groups",
          "updated_on",
          "updated_by",
          "role",
          "user_preferences"
        ];

        setVisibleColumns(
          cols
            .map((column: any) => column.field)
            .filter((field: any) => !hiddenColumnsValues.includes(field))
        );

        setData(modifiedData);
        //setData(newData);
        // console.log("newData-----", data);
      };
      getData();
    } catch (error) {
      console.log(error);
    }
  }, [getUserApiState]);


  const totalCount = data && data.length;
  const handleChangePage = (
    event: any,
    newPage: React.SetStateAction<number>
  ) => {
    setPage(newPage);
  };

  const handlePageChange = (newPage: any) => {
    setPage(newPage - 1);
    setCurrentPage(newPage);
    setPage(newPage - 1);
    // Fetch data for the new page if needed
  };

  const handleRowsPerPageChange = (newRowsPerPage: any) => {
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1);
    setPage(0); // Reset to the first page when changing rows per page
    // Fetch data for the new rowsPerPage if needed
  };
  const handleChangeRowsPerPage = (event: { target: { value: string } }) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  return (
    <>
    <ToastContainer />
    <div className="w-full">
      {/* <PageHeading heading="Credential Profile" /> */}
      <UserTable
        data={data}
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns}
        columns={columns}
        page={page}
        rowsPerPage={rowsPerPage}
      />
      <div
        style={{
          // width: "100%",
          position: "fixed",
          bottom: 0,
          // left: 0,
          // right: 0,
          // marginRight : "17rem",
          // borderTop: "1px solid",
          backgroundColor: "#fff", // Set your desired background color
          zIndex: 0, // Adjust the z-index as needed
        }}
      >
        <CustomPagination
          totalCount={totalCount}
          rowsPerPage={rowsPerPage}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
        {/* <TablePagination
          className="bg-light-container dark:bg-dark-container dark:text-textColor pt-12"
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={data && data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        /> */}
      </div>
    </div>
  </>
  )
}

export default User;