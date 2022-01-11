import React from "react";
import TableBody from "./tableBody";
import TableHeader from "./tableHeader";

const Table = ({ users, columns }) => {
  return (
    <table className="table table-hover table-borderless align-middle">
      <TableHeader columns={columns} />
      <TableBody data={users} columns={columns} />
    </table>
  );
};

export default Table;
