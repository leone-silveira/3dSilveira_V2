  // return <FoodTable initialLeft={sample} initialRight={[]} />;


  import React, { useState } from "react";

type Food = {
    id: number | string;
    name: string;
    calories?: number;
    [key: string]: string | number | undefined;
};

type Props = {
    initialLeft?: Food[];
    initialRight?: Food[];
};

const containerStyle: React.CSSProperties = {
    display: "flex",
    gap: 16,
    alignItems: "stretch",
    width: "100%",
};

const panelStyle: React.CSSProperties = {
    flex: 1,
    minWidth: 0, // allow child to shrink
    border: "1px solid #e0e0e0",
    borderRadius: 6,
    padding: 8,
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    background: "#fff",
    height: 420, // fixed height so both tables match; change as needed
    overflow: "hidden",
};

const tableWrapperStyle: React.CSSProperties = {
    overflow: "auto",
    flex: 1,
    marginTop: 8,
};

const tableStyle: React.CSSProperties = {
    width: "100%",
    borderCollapse: "collapse",
    tableLayout: "fixed",
};

const thTdStyle: React.CSSProperties = {
    padding: "8px 10px",
    borderBottom: "1px solid #f0f0f0",
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap",
};

export const FoodTable2: React.FC = ({ initialLeft = [], initialRight = [] }: Props) => 
    {
    const [left, setLeft] = useState<Food[]>(initialLeft);
    const [right, setRight] = useState<Food[]>(initialRight);
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

    function renderRow(food: Food, fromRight = false) {
        const moved = fromRight ? moveToLeft : moveToRight;
        return (
            <tr
                key={food.id}
                onClick={() => setSelectedId(food.id)}
                style={{
                    background: selectedId === food.id ? "#f5fbff" : undefined,
                    cursor: "pointer",
                }}
            >
                <td style={{ ...thTdStyle, width: "60%" }}>{food.name}</td>
                <td style={{ ...thTdStyle, width: "25%" }}>{food.calories ?? "—"}</td>
                <td style={{ ...thTdStyle, width: "15%", textAlign: "right" }}>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            moved(food.id);
                        }}
                        style={{
                            padding: "4px 8px",
                            fontSize: 13,
                            borderRadius: 4,
                            border: "1px solid #d0d7de",
                            background: fromRight ? "#fff" : "#0070f3",
                            color: fromRight ? "#000" : "#fff",
                            cursor: "pointer",
                        }}
                        aria-label={fromRight ? "Move to left" : "Move to right"}
                    >
                        {fromRight ? "←" : "→"}
                    </button>
                </td>
            </tr>
        );
    }

    return (
        <div style={containerStyle}>
            <div style={panelStyle}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <strong>Available Foods</strong>
                    <span style={{ color: "#666", fontSize: 13 }}>{left.length}</span>
                </div>

                <div style={tableWrapperStyle}>
                    <table style={tableStyle}>
                        <thead>
                            <tr>
                                <th style={thTdStyle}>Name</th>
                                <th style={thTdStyle}>Calories</th>
                                <th style={thTdStyle}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {left.length === 0 ? (
                                <tr>
                                    <td colSpan={3} style={{ ...thTdStyle, textAlign: "center", color: "#888" }}>
                                        No items
                                    </td>
                                </tr>
                            ) : (
                                left.map((f) => renderRow(f, false))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div style={panelStyle}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <strong>Selected Foods</strong>
                    <span style={{ color: "#666", fontSize: 13 }}>{right.length}</span>
                </div>

                <div style={tableWrapperStyle}>
                    <table style={tableStyle}>
                        <thead>
                            <tr>
                                <th style={thTdStyle}>Name</th>
                                <th style={thTdStyle}>Calories</th>
                                <th style={thTdStyle}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {right.length === 0 ? (
                                <tr>
                                    <td colSpan={3} style={{ ...thTdStyle, textAlign: "center", color: "#888" }}>
                                        No items
                                    </td>
                                </tr>
                            ) : (
                                right.map((f) => renderRow(f, true))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}