import React, { useState } from "react";
import CheckIcon from "@mui/icons-material/Check";

const CustomeButton = (props: any) => {
  return (
    <div className=" mx-2 inline-flex items-center justify-center rounded-md py-1 px-6 text-center font-medium text-white bg-primary2 hover:bg-opacity-90 lg:px-6 xl:px-6 cursor-pointer">
      {props.title}
    </div>
  );
};

export default CustomeButton;

export const SubmitButton = (props: any) => {
  return (
    <button
      type="submit"
      className=" mx-2 inline-flex items-center justify-center rounded-md py-1 px-6 text-center font-medium text-white bg-primary2 hover:bg-opacity-90 lg:px-6 xl:px-6 cursor-pointer"
    >
      {props.title}
    </button>
  );
};

export const CustomeCancelButton = (props: any) => {
  return (
    <div className=" mx-2 inline-flex items-center justify-center rounded-md py-1 px-6 text-center font-medium text-black dark:text-textColor border border-light3 dark:border-light3 hover:bg-opacity-90 lg:px-6 xl:px-6 cursor-pointer">
      {props.title}
    </div>
  );
};

// export const CustomeButtonGroupButton = (props: any) => {
//   const [isActive, setIsActive] = useState(false);

//   const handleButtonClick = () => {
//     setIsActive(!isActive);
//   };

//   return (
//     <div
//       className={`mx-[2px] inline-flex items-center justify-center text-sm rounded-md py-1 px-3 text-center font-medium dark:text-textColor border border-primary2 hover:bg-primary2 cursor-pointer ${
//         isActive ? "bg-primary2" : ""
//       }`}
//       onClick={handleButtonClick}
//     >
//       {props.title} {isActive && <CheckIcon fontSize="inherit" className="ml-1" />}
//     </div>
//   );
// };
// CustomeButtonGroupButton component
export const CustomeButtonGroupButton = (props: any) => {
  const { title, selectedButtons, setSelectedButtons } = props;

  const isActive = selectedButtons.includes(title);

  const handleButtonClick = () => {
    setSelectedButtons((prevSelectedButtons: any) => {
      if (isActive) {
        return prevSelectedButtons.filter((button: any) => button !== title);
      } else {
        return [...prevSelectedButtons, title];
      }
    });
  };

  return (
    <div
      className={`mx-[2px] h-[2.2rem] w-20 inline-flex items-center justify-center text-[12px] rounded-md py-2 px-3 text-center font-medium dark:text-textColor border border-primary2 hover:bg-primary2 cursor-pointer ${
        isActive ? "bg-primary2" : ""
      }`}
      onClick={handleButtonClick}
    >
      {title}
      {/* {isActive && <CheckIcon fontSize="inherit" className="ml-1" />} */}
    </div>
  );
};
