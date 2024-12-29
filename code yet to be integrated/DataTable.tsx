import React, { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { ColDef } from "ag-grid-community";

interface RowData {
    id: number;
    name: string;
    age: number;
    email: string;
}

const DataTable: React.FC = () => {
    const [rowData] = useState<RowData[]>([
        { id: 1, name: "John Doe", age: 25, email: "john.doe@gmail.com" },
        { id: 2, name: "Jane Smith", age: 30, email: "jane.smith@gmail.com" },
        { id: 3, name: "Mike Johnson", age: 35, email: "mike.johnson@gmail.com" },
    ]);

    const [columnDefs] = useState<ColDef<RowData>[]>([
        { headerName: "ID", field: "id" },
        { headerName: "Name", field: "name" },
        { headerName: "Age", field: "age" },
        { headerName: "Email", field: "email" },
    ]);

    return (
        <div className="ag-theme-alpine" style={{ height: 400, width: 600 }}>
            <AgGridReact rowData={rowData} columnDefs={columnDefs} />
        </div>
    );
};

export default DataTable;
