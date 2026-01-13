import React, { useState } from "react";
import { DataGrid, type GridColDef, type GridRenderCellParams } from "@mui/x-data-grid";

type Food = {
    id: number | string;
    name: string;
    calories?: number;
    [key: string]: unknown;
};

const sampleFoods: Food[] = [
    { id: 1, name: "Apple", calories: 52 },
    { id: 2, name: "Banana", calories: 89 },
    { id: 3, name: "Carrot", calories: 41 },
    { id: 4, name: "Donut", calories: 452 },
];

export const FoodTable: React.FC = () => {
    const [left, setLeft] = useState<Food[]>(sampleFoods);
    const [right, setRight] = useState<Food[]>([]);
    const [selectedId, setSelectedId] = useState<number | string | null>(null);

    function moveToRight(id: number | string) {
        const item = left.find((f) => f.id === id);
        if (!item) return;
        setLeft((s) => s.filter((f) => f.id !== id));
        setRight((s) => [item, ...s]);
    }

    function moveToLeft(id: number | string) {
        const item = right.find((f) => f.id === id);
        if (!item) return;
        setRight((s) => s.filter((f) => f.id !== id));
        setLeft((s) => [item, ...s]);
    }

    const leftColumns: GridColDef[] = [
        { field: "name", headerName: "Name", flex: 1 },
        { field: "calories", headerName: "Calories", flex: 1, valueGetter: (value) => value ?? "—" },
        {
            field: "move",
            headerName: "",
            width: 80,
            sortable: false,
            filterable: false,
            renderCell: (params: GridRenderCellParams) => (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        moveToRight(params.row.id);
                    }}
                    aria-label="Move to right"
                >
                    →
                </button>
            ),
        },
    ];

    const rightColumns: GridColDef[] = [
        { field: "name", headerName: "Name", flex: 1 },
        { field: "calories", headerName: "Calories", flex: 1, valueGetter: (params) => params.row.calories ?? "—" },
        {
            field: "move",
            headerName: "",
            width: 80,
            sortable: false,
            filterable: false,
            renderCell: (params: GridRenderCellParams) => (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        moveToLeft(params.row.id);
                    }}
                    aria-label="Move to left"
                >
                    ←
                </button>
            ),
        },
    ];

    return (
        <div style={{ display: "flex", gap: 16, width: "100%" }}>
            <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <strong>Available Foods</strong>
                    <span style={{ color: "#666", fontSize: 13 }}>{left.length}</span>
                </div>
                <div style={{ height: 420, marginTop: 8 }}>
                    <DataGrid
                        rows={left}
                        columns={leftColumns}
                        hideFooter
                        onRowClick={(params) => setSelectedId(params.id)}
                        getRowClassName={(params) =>
                            params.id === selectedId ? "Mui-selected" : ""
                        }
                    />
                </div>
            </div>
            <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <strong>Selected Foods</strong>
                    <span style={{ color: "#666", fontSize: 13 }}>{right.length}</span>
                </div>
                <div style={{ height: 420, marginTop: 8 }}>
                    <DataGrid
                        rows={right}
                        columns={rightColumns}
                        hideFooter
                        onRowClick={(params) => setSelectedId(params.id)}
                        getRowClassName={(params) =>
                            params.id === selectedId ? "Mui-selected" : ""
                        }
                    />
                </div>
            </div>
        </div>
    );
};
