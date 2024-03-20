import { Drawer } from "@mui/material";
import React, { useEffect, useState } from "react";
import CloseSharpIcon from "@mui/icons-material/CloseSharp";
import CustomeInput from "../Inputs";
import { useAppContext } from "../AppContext";
import { Bounce, toast } from "react-toastify";
import {
    getAllKeys,
    replaceDotsWithUnderscores,
    replaceUnderscoresWithDots,
    replaceUnderscoresWithDotsNested,
  } from "@/functions/genericFunctions";
  import CustomeButton, { CustomeCancelButton } from "../Buttons";

  import { makeStyles } from "@material-ui/core/styles";
import { addRole } from "@/pages/api/api/RoleManagementAPI";
import { Checkbox } from "@mui/material"; 
  const useStyles = makeStyles(() => ({
    drawer: {
      // width: drawerWidth,
      flexShrink: 100,
    },
    drawerPaper: {
      // width: drawerWidth,
      backdropFilter: "brightness(80%)", // Adjust the brightness for opacity
    },
  }));

const AddRoleDrawer = (props: any) => {
    const { open, handleDrawerClose } = props;
    const classes = useStyles();
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
    const { toggleGetRoleApiState} = useAppContext();
    const [data, setData] = React.useState({
        name: "",
        description: "",
        rbac_context: [],
      });
      const permissionsData = [
        { name: "Dashboard", key: "DASHBOARD" },
        { name: "Widget", key: "WIDGET" },
        { name: "Device Management", key: "DEVICE_MANAGEMENT" },
        { name: "User Settings", key: "USER_SETTINGS" },
        { name: "System Settings", key: "SYSTEM_SETTINGS" },
        { name: "Alert", key: "ALERT" },
      ];

      React.useEffect(() => {
        if (open == false) {
          setData({
            name: "",
        description: "",
        rbac_context: [],
          });
        //  setIsSubmitDisabled(true);
        }
      }, [open]);
     
      const handleInputChange = (event: any) => {
        const { name, value } = event.target;
        setData({ ...data, [name]: value });
      };
      // const handleCheckboxChange = (permission: any) => {
      //   setData((prevData: any) => ({
      //     ...prevData,
      //     rbac_context: [...prevData.rbac_context, permission],
      //   }));
      //   // setIsSubmitDisabled(false);
      // };
      const handleCheckboxChange = (permission: any) => {
        setData((prevData: any) => {
            let updatedContext: string[] = [...prevData.rbac_context];
    
            // Check if the permission key already exists in the array
            const index = updatedContext.indexOf(permission);
    
            // If the permission is checked, add it to the array
            // If it's unchecked, remove it from the array
            if (index === -1) {
                updatedContext.push(permission);
            } else {
                updatedContext.splice(index, 1);
            }
    
            return {
                ...prevData,
                rbac_context: updatedContext
            };
        });
    };
    const handleSave = (event: any) => {
        event.preventDefault();
        if (data.rbac_context.length === 0) {
          // If no checkboxes are selected, show an error message or handle it as needed
          toast.error("Please select at least one permission", {
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
          return; // Prevent form submission
      }
        const modifiedData = replaceUnderscoresWithDots(data);
        console.log("===", modifiedData);
        const createRole= async () => {
          let response = await addRole(modifiedData);
          console.log("role added=",response);
          if (response.status == "success") {
            toggleGetRoleApiState();
            
            toast.success(response.status, {
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
        };
        createRole(); 
       handleDrawerClose();
      };
  return (
    <Drawer
      // hideBackdrop = {false}temporary
      anchor="right"
      open={props.open}
      variant="temporary"
      classes={{
        paper: classes.drawerPaper,
      }}
      className={`shadow-sm shadow-dark-container dark:border-l-0 ${classes.drawer}`}
    >
      <div className="h-full bg-white dark:bg-dark-menu-color  ">
        <div className="flex justify-between py-3 px-5 border-b border-b-textColor dark:border-b-dark-border">
          <p className="text-primary2 font-semibold">Add Role</p>
          <CloseSharpIcon
            className="cursor-pointer mr-3 dark:text-textColor"
            onClick={handleDrawerClose}
          />
        </div>
        <form onSubmit={handleSave} method="POST">
          <div className="flex my-4 mx-4">
            <CustomeInput
              label="Enter Role"
              type="text"
              name="name"
              value={data.name}
              onChange={handleInputChange}
              require={true}
            />
            <CustomeInput
              type="text"
              label="Role Description"
              name="description"
              value={data.description}
              onChange={handleInputChange}
              require={true}
            />
          </div>
          {/* <AddUserRoleTabel onChange={handleCheckboxChange} /> */}
          <div className="px-4 py-1 overflow-x-auto">
            <table className="min-w-full border-collapse table-fixed">
              <thead>
                <tr className="bg-textColor text-center dark:bg-tabel-header dark:text-textColor">
                  <th className="px-6 py-3 text-center text-base font-semibold dark:bg-tabel-header dark:text-textColor">
                    Module
                  </th>
                  <th className="px-6 py-3 text-right text-base font-semibold dark:bg-tabel-header dark:text-textColor">
                    Read
                  </th>
                  <th className="px-6 py-3 text-right text-base font-semibold dark:bg-tabel-header dark:text-textColor">
                    Write
                  </th>
                  <th className="px-6 py-3 text-right text-base font-semibold dark:bg-tabel-header dark:text-textColor">
                    Delete
                  </th>
                </tr>
              </thead>
              <tbody>
                {permissionsData.map(permission => (
                  <tr key={permission.key} className="text-center border-b dark:bg-dark-container dark:text-textColor">
                    <td className="bg-white dark:bg-dark-container text-sm dark:text-textColor dark:border-dark-border">
                      {permission.name}
                    </td>
                    <td className="px-6 text-right">
                      <Checkbox  className=" dark:text-textColor"  onChange={() => handleCheckboxChange(`read:${permission.key}`)} />
                    </td>
                    <td className="px-6 text-right">
                      <Checkbox className=" dark:text-textColor"  onChange={() => handleCheckboxChange(`write:${permission.key}`)} />
                    </td>
                    <td className="px-6 text-right">
                      <Checkbox  className=" dark:text-textColor" onChange={() => handleCheckboxChange(`delete:${permission.key}`)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="fixed bottom-0 right-0 p-2 flex justify-end mt-6">
            <div>
              {/* <SubmitButton title="Save" /> */}
              <button
              // disabled={isSubmitDisabled}
                className=" mx-2 inline-flex items-center justify-center rounded-md py-1 px-6 text-center font-medium text-white bg-primary2 hover:bg-opacity-90 lg:px-6 xl:px-6 cursor-pointer"
                type="submit"
              >
                Save
              </button>
            </div>
            <div onClick={handleDrawerClose}>
              <CustomeCancelButton title="Cancel" />
            </div>
          </div>
        </form>
      </div>
    </Drawer>
  );
}

export default AddRoleDrawer