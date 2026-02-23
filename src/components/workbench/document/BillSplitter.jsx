import React, { useState, useMemo, useEffect } from "react";
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
import { toast } from "react-toastify";
import { useContext } from 'react';
import { AppContext } from "../../../context/AppConetxt";
import axios from "axios";


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
  const {setLoading} = useContext(AppContext);
  const round = (num) => Math.round((num + Number.EPSILON) * 100) / 100;

  const [showSplitModal, setShowSplitModal] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [splitMode, setSplitMode] = useState("amount");
  const [editableRows, setEditableRows] = useState([]);

  const selectedGroup = useMemo(() => {
    return groups.find(g => g.id === selectedGroupId) || null;
  }, [groups, selectedGroupId]);

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

   const thStyle = {
        padding: 12,
        textAlign: "left",
        fontSize: 13,
        borderBottom: "1px solid #e5e7eb",
      };

      const tdStyle = {
        padding: 12,
        fontSize: 14,
        borderBottom: "1px solid #f1f5f9",
      };

      const inputStyle = {
        width: "100%",
        padding: "6px 8px",
        borderRadius: 6,
        border: "1px solid #e5e7eb",
        fontSize: 13
      };

      const cancelBtn = {
        padding: "8px 16px",
        background: "#e5e7eb",
        border: "none",
        borderRadius: 8,
        cursor: "pointer",
      };

      const saveBtn = {
          padding: "10px 20px",
          background: "linear-gradient(135deg,#6366f1,#4f46e5)",
          color: "#fff",
          border: "none",
          borderRadius: 10,
          fontWeight: 600,
          cursor: "pointer",
          boxShadow: "0 6px 16px rgba(99,102,241,0.4)",
          transition: "0.2s"
      };


  const getAvatarColor = (text) => {
    const colors = [
      "#6366f1", "#8b5cf6", "#ec4899",
      "#f43f5e", "#f59e0b", "#10b981",
      "#06b6d4"
    ];

    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = text.charCodeAt(i) + ((hash << 5) - hash);
    }

    return colors[Math.abs(hash) % colors.length];
  };

  const Avatar = ({ name, size = 34 }) => {return( 
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: `linear-gradient(135deg, ${getAvatarColor(name)}, #00000022)`,
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 600,
        fontSize: size / 2.4,
        boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
        border: "2px solid #fff",
      }}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  )};

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

  const handleExtract = async () => {
   
    //We will set dummy JSON data as our Model Training is in Progreess
    setBillData(dummyExtractedJSON);
    setAvailableItems(dummyExtractedJSON.data);
    
    /*
    if (!file) return;

    toast.success("Processing started!");

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
        const res = await axios.post(
        "http://localhost/doc/bill/upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
        );

        console.log(res.data);
        setLoading(false);
    } catch (err) {
        console.error(err);
        toast.error("Upload failed");
        setLoading(false);
    }
    */
    
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

    setGroups(prev =>
      prev.map(g => {
        if (g.id !== over.id) return g;

        // 🟣 PARTITION GROUP
        if (g.partitions) {

          const memberCount = g.partitions.length;

          const baseAmount = round(item.total / memberCount);
          const baseQty = round(item.qty / memberCount);

          let remainingAmount = item.total;
          let remainingQty = item.qty;

          const updatedPartitions = g.partitions.map((p, index) => {

            // Last member gets remainder
            const amount =
              index === memberCount - 1
                ? round(remainingAmount)
                : baseAmount;

            const qty =
              index === memberCount - 1
                ? round(remainingQty)
                : baseQty;

            remainingAmount = round(remainingAmount - amount);
            remainingQty = round(remainingQty - qty);

            return {
              ...p,
              items: [
                ...p.items,
                {
                  ...item,
                  qty: qty,
                  total: amount,
                  originalTotal: item.total,
                  originalQty: item.qty,
                  id: `${item.id}_${index}`
                }
              ]
            };
          });

          return { ...g, partitions: updatedPartitions };
        }

        // 🟢 NORMAL GROUP
        return { ...g, items: [...g.items, item] };
      })
    );

    setAvailableItems(prev => prev.filter(i => i.id !== item.id));
  };
  
  const removeFromGroup = (groupId, item) => {
    setGroups(prev =>
      prev.map(g => {
        if (g.id !== groupId) return g;

        // 🔥 PARTITION GROUP
        if (g.partitions) {
          const originalItem = {
            ...item,
            id: item.id.split("_")[0],
            qty: item.originalQty,
            total: item.originalTotal
          };

          return {
            ...g,
            partitions: g.partitions.map(p => ({
              ...p,
              items: p.items.filter(i => !i.id.startsWith(originalItem.id))
            }))
          };
        }

        // NORMAL GROUP
        return {
          ...g,
          items: g.items.filter(i => i.id !== item.id)
        };
      })
    );

    // return back to available list
    if (item.originalTotal) {
      setAvailableItems(prev => [
        ...prev,
        {
          ...item,
          id: item.id.split("_")[0],
          qty: item.originalQty,
          total: item.originalTotal
        }
      ]);
    } else {
      setAvailableItems(prev => [...prev, item]);
    }
  };

  /* ---------------- GROUPS ---------------- */

  const createGroup = () => {
      const trimmedName = newGroupName.trim();

      if (!trimmedName) {
        setGroupError("Group name cannot be empty.");
        return;
      }

      const isDuplicate = groups.some(
        g => g.name.toLowerCase() === trimmedName.toLowerCase()
      );

      if (isDuplicate) {
        setGroupError("Group already exists.");
        return;
      }

      // detect comma separated names
        const parts = trimmedName
        .split(",")
        .map(p => p.trim())
        .filter(Boolean);

      const groupObject = {
        id: Date.now().toString(),
        name: trimmedName,
        partitions: parts.length > 1
          ? parts.map(p => ({ name: p, items: [] }))
          : null,
        items: [] // for normal single group
      };  


      setGroups(prev => [...prev, groupObject]);

      setNewGroupName("");
      setGroupError("");
    };

  const totalColumn = billData?.headers.find((h) => h.isTotal);

  const calculateTotal = group => {
    if (group.partitions) {
      return round(group.partitions.reduce(
        (sum, p) =>
          sum +
          p.items.reduce((s, i) => s + i.total, 0),
        0
      ));
    }

    return round(group.items.reduce(
      (sum, i) => sum + i.total,
      0
    ));
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
          {/* <h4 style={{ marginBottom: 10 }}>{group.name}</h4> */}

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>

            {/* AVATAR SECTION */}
            <div style={{ display: "flex" }}>
              {group.partitions ? (
                group.partitions.map((p, i) => (
                  <div key={p.name} style={{ marginLeft: i === 0 ? 0 : -10 }}>
                    <Avatar name={p.name} />
                  </div>
                ))
              ) : (
                <Avatar name={group.name} size={42} />
              )}
            </div>

            {/* TEXT SECTION */}
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>

                <span style={{ fontWeight: 600, fontSize: 16 }}>
                  {group.name}
                </span>

                {/* TYPE BADGE */}
                <span
                  style={{
                    fontSize: 11,
                    padding: "3px 8px",
                    borderRadius: 999,
                    background: group.partitions ? "#ede9fe" : "#dcfce7",
                    color: group.partitions ? "#6d28d9" : "#166534",
                    fontWeight: 600
                  }}
                >
                  {group.partitions ? "SPLIT" : "SINGLE"}
                </span>
              </div>

              {/* SUB TEXT */}
              <div style={{ fontSize: 12, color: "#6b7280" }}>
                {group.partitions
                  ?
                  /*  Depending upon requirement we wii use
                  `${group.partitions.reduce(
                      (count, p) => count + p.items.length,
                      0
                    )} items`*/
                     
                    `${group.partitions[0].items.length}  items`
                  : `${group.items.length} items`}
              </div>

            </div>

                  <button
                   onClick={() => openSplitModal(group.id)}
                    style={{
                      background: "#f3f4f6",
                      border: "none",
                      borderRadius: 8,
                      padding: "6px 8px",
                      cursor: "pointer",
                    }}
                  >
                    ⚙
                  </button>
          </div>

          {group.partitions ? (

            // 🟣 PARTITION LAYOUT
            <div style={{ display: "grid", gap: 10 , gridTemplateColumns: "repeat(4, 1fr)",}}>
              {group.partitions.map(part => (
                <div
                  key={part.name}
                  style={{
                    background: "#f9fafb",
                    padding: 10,
                    borderRadius: 10
                  }}
                >
                  {/* <h5 style={{ marginBottom: 6 }}>{part.name}</h5> */}

                  <Avatar name={part.name} size={40} />

                  {part.items.map(item =>{
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
              ))}
            </div>
          ) : 

          group.items.map((item) => {
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

const openSplitModal = (groupId) => {
  setSplitMode("amount");
  setSelectedGroupId(groupId);
  setShowSplitModal(true);
};

    const editableTotal = useMemo(
      () => editableRows.reduce((sum, r) => sum + r.amount, 0),
      [editableRows]
    );

const handleAmountChange = (id, value) => {
  if (splitMode !== "amount") return;

  const val = parseFloat(value) || 0;

  setEditableRows(prev => {
    const currentRow = prev.find(r => r.id === id);
    if (!currentRow) return prev;

    const itemKey = id.split("_")[0];

    const relatedRows = prev.filter(r =>
      r.id.startsWith(itemKey)
    );

    const totalAllocated = relatedRows.reduce((sum, r) => {
      if (r.id === id) return sum + val;
      return sum + r.amount;
    }, 0);

    if (round(totalAllocated) > round(currentRow.originalTotal)) {
      toast.error("Allocated amount exceeds item total!");
      return prev;
    }

    return prev.map(row => {
      if (row.id !== id) return row;

      const amount = round(val);
      const percent = round(
        (amount / row.originalTotal) * 100
      );
      const qty = round(amount / row.price);

      return { ...row, amount, percent, qty };
    });
  });
};

const handlePercentChange = (id, value) => {
  if (splitMode !== "percent") return;

  const val = parseFloat(value) || 0;

  setEditableRows(prev => {
    const currentRow = prev.find(r => r.id === id);
    if (!currentRow) return prev;

    const amountFromPercent = round(
      (val / 100) * currentRow.originalTotal
    );

    const itemKey = id.split("_")[0];

    const relatedRows = prev.filter(r =>
      r.id.startsWith(itemKey)
    );

    const totalAllocated = relatedRows.reduce((sum, r) => {
      if (r.id === id) return sum + amountFromPercent;
      return sum + r.amount;
    }, 0);

    if (round(totalAllocated) > round(currentRow.originalTotal)) {
      toast.error("Allocated percentage exceeds item total!");
      return prev;
    }

    return prev.map(row => {
      if (row.id !== id) return row;

      const qty = round(amountFromPercent / row.price);

      return {
        ...row,
        percent: val,
        amount: amountFromPercent,
        qty
      };
    });
  });
};

const validateItemAllocation = (rows, itemKey, newAmount, editingRowId) => {
  const relatedRows = rows.filter(r => r.id.startsWith(itemKey));

  const totalAllocated = relatedRows.reduce((sum, r) => {
    if (r.id === editingRowId) return sum + newAmount;
    return sum + r.amount;
  }, 0);

  return round(totalAllocated) <= round(relatedRows[0].originalTotal);
};

  const saveSplitChanges = () => {
  if (!selectedGroup) return;

  setGroups((prev) =>
    prev.map((g) => {
      if (g.id !== selectedGroup.id) return g;

      if (g.partitions) {
        const updatedPartitions = g.partitions.map((p) => {
          const updatedItems = p.items.map((item) => {
            const row = editableRows.find((r) => r.id === item.id);
            if (!row) return item;

            return {
              ...item,
              total: round(row.amount),
              qty: round(row.amount / row.price) // ✅ FIX
            };
          });

          return { ...p, items: updatedItems };
        });

        return { ...g, partitions: updatedPartitions };
      } else {
        const updatedItems = g.items.map((item) => {
          const row = editableRows.find((r) => r.id === item.id);
          if (!row) return item;

          return {
            ...item,
            total: round(row.amount),
            qty: round(row.amount / row.price) // ✅ FIX
          };
        });

        return { ...g, items: updatedItems };
      }
    })
  );

  setShowSplitModal(false);
  setSelectedGroupId(null);
};
  
const groupedByItem = useMemo(() => {
  const map = {};

    editableRows.forEach(row => {
      const itemKey = row.id.split("_")[0];

      if (!map[itemKey]) {
        map[itemKey] = {
          itemKey,
          name: row.item,
          price: row.price,
          originalTotal: row.originalTotal,
          rows: []
        };
      }

      map[itemKey].rows.push(row);
    });

    return Object.values(map);
  }, [editableRows]);


  useEffect(() => {
  if (!showSplitModal || !selectedGroup) return;

  const rows = [];

  if (selectedGroup.partitions) {
    selectedGroup.partitions.forEach((p) => {
      p.items.forEach((item) => {
        rows.push({
          id: item.id,
          item: item.item,
          member: p.name,
          price: item.price,
          qty: item.qty,
          amount: item.total,
          originalTotal: item.originalTotal || item.total,
          originalQty: item.originalQty || item.qty,
          percent: round(
            (item.total / (item.originalTotal || item.total)) * 100
          ),
        });
      });
    });
  }

  setEditableRows(rows);

}, [showSplitModal, selectedGroup]);
    

  /* ---------------- UI ---------------- */

  return (
    <>
    <style>
      {
        `@keyframes fadeInScale {
          from { transform: translate(-50%, -48%) scale(0.96); opacity: 0; }
          to { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }`
      }
    </style>

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

      {showSplitModal && selectedGroup && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setShowSplitModal(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.4)",
              backdropFilter: "blur(3px)",
              zIndex: 999,
            }}
          />

          {/* Modal */}
          <div
           style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 900,
            maxHeight: "90vh",
            background: "#ffffff",
            borderRadius: 20,
            boxShadow: "0 30px 80px rgba(0,0,0,0.25)",
            padding: 28,
            zIndex: 1000,
            overflowY: "auto",
            animation: "fadeInScale 0.2s ease"
          }}
          >
            {/* Header */}
           <div style={{
              marginBottom: 24,
              paddingBottom: 16,
              borderBottom: "1px solid #f1f5f9"
            }}>
              <h2 style={{
                margin: 0,
                fontSize: 20,
                fontWeight: 700,
                color: "#111827"
              }}>
                Split Configuration
              </h2>

              <div style={{
                fontSize: 13,
                color: "#6b7280",
                marginTop: 6
              }}>
                Adjust allocation for <strong>{selectedGroup.name}</strong>
              </div>
            </div>

            {/* Split Mode Tabs */}
            <div
              style={{
                display: "flex",
                background: "#f3f4f6",
                padding: 6,
                borderRadius: 12,
                marginBottom: 24,
                width: "fit-content"
              }}
            >
              {["amount", "percent"].map(mode => (
                <button
                  key={mode}
                  onClick={() => setSplitMode(mode)}
                  style={{
                    padding: "8px 18px",
                    borderRadius: 8,
                    border: "none",
                    cursor: "pointer",
                    fontWeight: 600,
                    background:
                      splitMode === mode ? "#6366f1" : "transparent",
                    color:
                      splitMode === mode ? "#fff" : "#6b7280",
                    transition: "0.2s"
                  }}
                >
                  {mode === "amount" ? "Split by Amount" : "Split by Percent"}
                </button>
              ))}
            </div>

            {/* Table */}
             <div style={{ maxHeight: 450, overflowY: "auto", paddingRight: 6 }}>
                {groupedByItem.map((itemBlock, index) => {
                  const allocated = itemBlock.rows.reduce(
                    (sum, r) => sum + r.amount,
                    0
                  );

                  const isValid =
                    round(allocated) === round(itemBlock.originalTotal);

                  return (
                    <div
                      key={itemBlock.itemKey}
                      style={{
                        marginBottom: 24,
                        borderRadius: 14,
                        border: "1px solid #e5e7eb",
                        background: "#ffffff",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                        overflow: "hidden"
                      }}
                    >
                      {/* ---------- ITEM HEADER ---------- */}
                      <div
                        style={{
                          padding: "14px 18px",
                          background: "linear-gradient(135deg,#f9fafb,#ffffff)",
                          borderBottom: "1px solid #e5e7eb",
                          display: "flex",
                          color: isValid ? "#16a34a" : "#dc2626",
                          justifyContent: "space-between",
                          alignItems: "center",
                          background: isValid ? "#dcfce7" : "#fee2e2",
                          padding: "4px 8px",
                          borderRadius: 6,
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 15 }}>
                            {itemBlock.name}
                          </div>
                          <div style={{ fontSize: 12, color: "#6b7280" }}>
                            Qty: {itemBlock.originalQty} × Price (₹{itemBlock.price})
                          </div>
                        </div>

                        <div style={{ textAlign: "right" }}>
                          <div
                            style={{
                              background: "#ede9fe",
                              color: "#6d28d9",
                              padding: "6px 12px",
                              borderRadius: 999,
                              fontWeight: 600,
                              fontSize: 13,
                              marginBottom: 6
                            }}
                          >
                            ₹ {itemBlock.originalTotal}
                          </div>

                          <div
                            style={{
                              fontSize: 12,
                              fontWeight: 500,
                              color: isValid ? "#16a34a" : "#dc2626"
                            }}
                          >
                            Allocated: ₹{round(allocated)} / ₹
                            {itemBlock.originalTotal}
                          </div>
                        </div>
                      </div>

                      {/* ---------- MEMBER TABLE ---------- */}
                      <table
                        style={{
                          width: "100%",
                          borderCollapse: "collapse"
                        }}
                      >
                        <thead>
                          <tr
                            style={{
                              background: "#f9fafb",
                              fontSize: 12,
                              textAlign: "left"
                            }}
                          >
                            <th style={{ padding: 10 }}>Member</th>
                            <th style={{ padding: 10 }}>Amount (₹)</th>
                            <th style={{ padding: 10 }}>Percent (%)</th>
                            <th style={{ padding: 10 }}>Qty</th>
                          </tr>
                        </thead>

                        <tbody>
                          {itemBlock.rows.map(row => (
                            <tr key={row.id} style={{ borderTop: "1px solid #f1f5f9" }}>
                              <td style={{ padding: 10, fontWeight: 500 }}>
                                {row.member}
                              </td>

                              {/* AMOUNT */}
                              <td style={{ padding: 10 }}>
                               <input
                                  type="number"
                                  disabled={splitMode !== "amount"}
                                  value={row.amount}
                                  onChange={e =>
                                    handleAmountChange(row.id, e.target.value)
                                  }
                                  style={{
                                    ...inputStyle,
                                    background:
                                      splitMode !== "amount" ? "#f3f4f6" : "#fff"
                                  }}
                                />
                              </td>

                              {/* PERCENT */}
                              <td style={{ padding: 10 }}>
                                  <input
                                    type="number"
                                    disabled={splitMode !== "percent"}
                                    value={row.percent}
                                    onChange={e =>
                                      handlePercentChange(row.id, e.target.value)
                                    }
                                    style={{
                                      ...inputStyle,
                                      background:
                                        splitMode !== "percent" ? "#f3f4f6" : "#fff"
                                    }}
                                  />
                              </td>

                              {/* QTY (readonly auto) */}
                              <td style={{ padding: 10 }}>
                                {row.qty}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                })}
              </div>

            {/* Footer */}
            <div
              style={{
                marginTop: 20,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                Total: ₹{selectedGroup.partitions
                  ? selectedGroup.partitions.reduce(
                      (sum, p) => sum + p.items.reduce((s, i) => s + i.total, 0),
                      0
                    )
                  : selectedGroup.items.reduce((sum, i) => sum + i.total, 0)}
                {" | "}Allocated: ₹{round(editableRows.reduce((sum, r) => sum + r.amount, 0))}
              </div>

              <div style={{ display: "flex", gap: 12 }}>
                <button
                  onClick={() => setShowSplitModal(false)}
                  style={cancelBtn}
                >
                  Cancel
                </button>

                <button
                  style={saveBtn}
                  disabled={
                    round(editableRows.reduce((sum, r) => sum + r.amount, 0)) !==
                    (selectedGroup.partitions
                      ? selectedGroup.partitions.reduce(
                          (sum, p) => sum + p.items.reduce((s, i) => s + i.total, 0),
                          0
                        )
                      : selectedGroup.items.reduce((sum, i) => sum + i.total, 0))
                  }
                  onClick={saveSplitChanges}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </>
      )}

    </div>
    </>
  );
};

export default BillSplitter;
