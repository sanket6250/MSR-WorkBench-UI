import React, { useState, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  DndContext,
  useDraggable,
  useDroppable,
  DragOverlay,
  closestCenter,
} from "@dnd-kit/core";

const BillSplitter = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [billData, setBillData] = useState(null);
  const [availableItems, setAvailableItems] = useState([]);
  const [groups, setGroups] = useState([]);
  const [newGroupName, setNewGroupName] = useState("");
  const [activeItem, setActiveItem] = useState(null);
  const [openItemId, setOpenItemId] = useState(null);
  const [groupError, setGroupError] = useState("");
  const [showPreviewZoom, setShowPreviewZoom] = useState(false);

  const dummyExtractedJSON = {
    headers: [
      { key: "item", label: "Item" },
      { key: "qty", label: "Qty" },
      { key: "price", label: "Price" },
      { key: "total", label: "Total", isTotal: true },
    ],
    data: [
      { id: "1", item: "Pizza", qty: 2, price: 300, total: 600 },
      { id: "2", item: "Burger", qty: 1, price: 200, total: 200 },
      { id: "3", item: "Coke", qty: 3, price: 50, total: 150 },
      { id: "4", item: "Pasta", qty: 1, price: 250, total: 250 },
    ],
  };

  /* ---------------- UPLOAD ---------------- */

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      const uploaded = acceptedFiles[0];
      setFile(uploaded);
      setPreview(URL.createObjectURL(uploaded));
    },
  });

  const handleExtract = () => {
    setBillData(dummyExtractedJSON);
    setAvailableItems(dummyExtractedJSON.data);
  };

  const handleClear = () => {
    setFile(null);
    setPreview(null);
    setBillData(null);
    setAvailableItems([]);
    setGroups([]);
  };

  /* ---------------- TABLE ---------------- */

  const columns = useMemo(() => {
    if (!billData) return [];
    return billData.headers.map((h) => ({
      accessorKey: h.key,
      header: h.label,
    }));
  }, [billData]);

  const table = useReactTable({
    data: availableItems,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  /* ---------------- DRAG ---------------- */

  const handleDragStart = (event) => {
    const item = availableItems.find((i) => i.id === event.active.id);
    setActiveItem(item);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveItem(null);
    if (!over) return;

    const item = availableItems.find((i) => i.id === active.id);
    if (!item) return;

    setGroups((prev) =>
      prev.map((g) =>
        g.id === over.id ? { ...g, items: [...g.items, item] } : g
      )
    );

    setAvailableItems((prev) => prev.filter((i) => i.id !== item.id));
  };

  const removeFromGroup = (groupId, item) => {
    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? { ...g, items: g.items.filter((i) => i.id !== item.id) }
          : g
      )
    );
    setAvailableItems((prev) => [...prev, item]);
  };

  /* ---------------- GROUPS ---------------- */

  const createGroup = () => {
    const trimmedName = newGroupName.trim();

    if (!trimmedName) {
      setGroupError("Group name cannot be empty.");
      return;
    }

    const isDuplicate = groups.some(
      (g) => g.name.toLowerCase() === trimmedName.toLowerCase()
    );

    if (isDuplicate) {
      setGroupError(
        "Group with this name already exists. Please choose another name."
      );
      return;
    }

    setGroups((prev) => [
      ...prev,
      { id: Date.now().toString(), name: trimmedName, items: [] },
    ]);

    setNewGroupName("");
    setGroupError("");
  };

  const totalColumn = billData?.headers.find((h) => h.isTotal);

  const calculateTotal = (group) => {
    if (!totalColumn) return 0;
    return group.items.reduce(
      (sum, item) => sum + Number(item[totalColumn.key] || 0),
      0
    );
  };

  /* ---------------- DRAGGABLE ROW ---------------- */

  const DraggableRow = ({ row, index }) => {
      const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: row.original.id,
      });

      return (
        <tr
          ref={setNodeRef}
          {...listeners}
          {...attributes}
          style={{
            cursor: "grab",
            background:
              index % 2 === 0 ? "#ffffff" : "#f9fafb", // zebra striping
            transition: "all 0.2s ease",
            opacity: isDragging ? 0.5 : 1,
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "#eef2ff")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background =
              index % 2 === 0 ? "#ffffff" : "#f9fafb")
          }
        >
          {row.getVisibleCells().map((cell) => (
            <td
              key={cell.id}
              style={{
                padding: "14px 16px",
                fontSize: 14,
                color: "#374151",
                borderBottom: "1px solid #f1f5f9",
              }}
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
          ))}
        </tr>
      );
    };


  /* ---------------- DROPPABLE GROUP ---------------- */

  const DroppableGroup = ({ group }) => {
    const { setNodeRef, isOver } = useDroppable({ id: group.id });

    return (
      <div
        ref={setNodeRef}
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: 18,
          minHeight: 230,
          boxShadow: isOver
            ? "0 0 0 3px #6366f1"
            : "0 6px 20px rgba(0,0,0,0.08)",
          transition: "0.2s",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h4 style={{ marginBottom: 10 }}>{group.name}</h4>

          {group.items.map((item) => {
            const isOpen = openItemId === item.id;

            return (
              <div
                key={item.id}
                style={{
                  background: "#f3f4f6",
                  padding: "8px 10px",
                  borderRadius: 8,
                  marginBottom: 8,
                }}
              >
                {/* Top Row */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontWeight: 500 }}>{item.item}</span>

                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span>₹{item.total}</span>

                    {/* MENU BUTTON */}
                    <button
                      onClick={() =>
                        setOpenItemId(isOpen ? null : item.id)
                      }
                      style={{
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        fontSize: 16,
                      }}
                    >
                      ⋮
                    </button>

                    {/* REMOVE BUTTON */}
                    <button
                      onClick={() => removeFromGroup(group.id, item)}
                      style={{
                        background: "#ef4444",
                        border: "none",
                        color: "#fff",
                        borderRadius: "50%",
                        width: 20,
                        height: 20,
                        cursor: "pointer",
                      }}
                    >
                      ×
                    </button>
                  </div>
                </div>

                {/* DETAILS PANEL */}
                {isOpen && (
                  <div
                    style={{
                      marginTop: 8,
                      paddingTop: 8,
                      borderTop: "1px solid #e5e7eb",
                      fontSize: 13,
                      color: "#374151",
                    }}
                  >
                    {billData.headers.map((h) => (
                      <div
                        key={h.key}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: 4,
                        }}
                      >
                        <span>{h.label}</span>
                        <span>{item[h.key]}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

        </div>

        <div
          style={{
            borderTop: "1px solid #e5e7eb",
            paddingTop: 10,
            textAlign: "right",
            fontWeight: "bold",
          }}
        >
          Total: ₹ {calculateTotal(group)}
        </div>
      </div>
    );
  };

  /* ---------------- UI ---------------- */

  return (
    <div style={{ padding: 40, background: "#f4f6f9", minHeight: "100vh" }}>
      {/* Upload Section */}
      <div
        style={{
          marginBottom: 30,
          padding: 10,
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
        }}
      >
        {!file ? (
          <div
            {...getRootProps()}
            style={{
              padding: 60,
              border: "2px dashed #6366f1",
              borderRadius: 16,
              background: "#eef2ff",
              cursor: "pointer",
              textAlign: "center",
            }}
          >
            <input {...getInputProps()} />
            <h2>Upload Your Bill</h2>
            <p>Drag & Drop or Click to Browse</p>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 30,
            }}
          >
            {/* Upload Image Section */}
            <div
              style={{
                position: "relative",
                display: "inline-block",
              }}
              onMouseEnter={() => setShowPreviewZoom(true)}
              onMouseLeave={() => setShowPreviewZoom(false)}
            >
              <img
                src={preview}
                alt="Uploaded"
                style={{
                  maxHeight: 100,
                  borderRadius: 12,
                  cursor: "zoom-in",
                  transition: "0.2s",
                   width: '-webkit-fill-available',
                }}
              />

              {/* Hover Zoom Preview */}
              {showPreviewZoom && (
                <div
                  style={{
                      position: 'absolute',
                      top: '0px',
                      left: '110%',
                      zIndex: '999',
                      background: 'rgb(68 255 21)',
                      padding: '1px',
                      borderRadius: '12px',
                      boxShadow : "rgba(0, 0, 0, 0.2) 0px 10px 30px",
                      animation: '0.2s ease-in-out 0s 1 normal none running fadeIn',
                  }}
                >
                  <img
                    src={preview}
                    alt="Zoomed"
                    style={{
                      maxHeight: 500,
                      maxWidth: 400,
                      borderRadius: 10,
                    }}
                  />
                </div>
              )}
            </div>


            <div style={{ display: "flex", gap: 15 }}>
              <button
                onClick={handleClear}
                style={{
                  padding: "10px 20px",
                  background: "#ef4444",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  cursor: "pointer",
                }}
              >
                Clear
              </button>

              {!billData && (
                <button
                  onClick={handleExtract}
                  style={{
                    padding: "10px 20px",
                    background: "#6366f1",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    cursor: "pointer",
                  }}
                >
                  Extract Data
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {billData && (
        <DndContext
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {/* Scrollable Table */}
          {/* Beautiful Table */}
          <div
            style={{
              height: 400,
              overflowY: "auto",
              background: "#ffffff",
              borderRadius: 16,
              boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
              border: "1px solid #e5e7eb",
              marginBottom: 30,
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "separate",
                borderSpacing: 0,
                fontFamily: "Inter, sans-serif",
              }}
            >
              {/* HEADER */}
              <thead
                style={{
                  position: "sticky",
                  top: 0,
                  background: "#d8cc5f",
                  zIndex: 2,
                  boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                }}
              >
                {table.getHeaderGroups().map((hg) => (
                  <tr key={hg.id}>
                    {hg.headers.map((header) => (
                      <th
                        key={header.id}
                        style={{
                          padding: "14px 16px",
                          textAlign: "left",
                          fontSize: 13,
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          color: "#000000",
                          borderBottom: "1px solid #e5e7eb",
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>

              {/* BODY */}
              <tbody>
                {table.getRowModel().rows.map((row, index) => (
                  <DraggableRow
                    key={row.id}
                    row={row}
                    index={index}
                  />
                ))}
              </tbody>
            </table>
          </div>


          {/* Create Group */}
            <div
              style={{
                background: "#fff",
                padding: 20,
                borderRadius: 16,
                boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
                marginBottom: 30,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  flexWrap: "wrap",
                }}
              >
                <input
                  value={newGroupName}
                  onChange={(e) => {
                    setNewGroupName(e.target.value);
                    setGroupError("");
                  }}
                  placeholder="Enter Bill Split group name"
                  style={{
                    flex: 1,
                    minWidth: 220,
                    padding: "10px 12px",
                    borderRadius: 8,
                    border: groupError ? "1px solid #ef4444" : "1px solid #d1d5db",
                    outline: "none",
                    fontSize: 14,
                  }}
                />

                <button
                  onClick={createGroup}
                  style={{
                    padding: "10px 18px",
                    background: "#6366f1",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "0.2s",
                  }}
                  onMouseOver={(e) =>
                    (e.target.style.background = "#4f46e5")
                  }
                  onMouseOut={(e) =>
                    (e.target.style.background = "#6366f1")
                  }
                >
                  + Create Split Group
                </button>
              </div>

              {groupError && (
                <div
                  style={{
                    marginTop: 8,
                    color: "#ef4444",
                    fontSize: 13,
                    fontWeight: 500,
                  }}
                >
                  {groupError}
                </div>
              )}
            </div>

          {/* Groups */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 20,
            }}
          >
            {groups.map((group) => (
              <DroppableGroup key={group.id} group={group} />
            ))}
          </div>

          {/* Small Drag Overlay */}
         <DragOverlay
            dropAnimation={null}
          >
            {activeItem ? (
              <div
                style={{
                  padding: "4px 8px",              // smaller padding
                  background: "#6366f1",
                  color: "#fff",
                  borderRadius: 6,
                  fontSize: 12,                    // smaller text
                  fontWeight: 500,
                  boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                  width: "fit-content",
                  maxWidth: 140,                   // prevent stretching
                  whiteSpace: "nowrap",
                  pointerEvents: "none",
                  transform: "scale(0.9)",         // 🔥 slightly smaller
                }}
              >
                {activeItem.item} • ₹{activeItem.total}
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}
    </div>
  );
};

export default BillSplitter;
