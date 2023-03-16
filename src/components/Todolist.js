import React, { useState, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import Snackbar from "@mui/material/Snackbar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import format from "date-fns/format";
import fiLocale from "date-fns/locale/fi";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";

function Todolist() {
  const [todo, setTodo] = useState({
    description: "",
    date: "",
    priority: "",
  });
  const [todos, setTodos] = useState([]);
  const [open, setOpen] = useState(false);
  const gridRef = useRef();

  const [columnDefs] = useState([
    { field: "description", sortable: true, filter: true },
    {
      field: "date",
      sortable: true,
      filter: true,
      valueFormatter: (params) => format(new Date(params.value), "dd.MM.yyyy"),
    },
    {
      field: "priority",
      sortable: true,
      filter: true,
      cellStyle: (params) =>
        params.value === "High" ? { color: "red" } : { color: "black" },
    },
  ]);

  const addTodo = () => {
    setTodos([todo, ...todos]);
  };

  const deleteTodo = () => {
    if (gridRef.current.getSelectedNodes().length > 0) {
      setTodos(
        todos.filter(
          (todo, index) =>
            index !== gridRef.current.getSelectedNodes()[0].childIndex
        )
      );
      setOpen(true);
    } else {
      alert("Select row first");
    }
  };

  return (
    <div>
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        justifyContent="center"
      >
        <TextField
          label="Description"
          variant="standard"
          value={todo.description}
          onChange={(e) => setTodo({ ...todo, description: e.target.value })}
        />
        <LocalizationProvider
          dateAdapter={AdapterDateFns}
          adapterLocale={fiLocale}
        >
          <DatePicker
            label="Date"
            inputFormat="dd.MM.yyyy"
            value={todo.date}
            onChange={(value) => setTodo({ ...todo, date: value })}
            renderInput={(params) => (
              <TextField variant="standard" {...params} />
            )}
          />
        </LocalizationProvider>

        <TextField
          label="Priority"
          variant="standard"
          value={todo.priority}
          onChange={(e) => setTodo({ ...todo, priority: e.target.value })}
        />
        <Button startIcon={<AddIcon />} onClick={addTodo} variant="contained">
          Add
        </Button>
        <Button
          startIcon={<DeleteIcon />}
          onClick={deleteTodo}
          variant="contained"
          color="error"
        >
          Delete
        </Button>
      </Stack>
      <div
        className="ag-theme-material"
        style={{ margin: "auto", width: "45%", height: 600 }}
      >
        <AgGridReact
          ref={gridRef}
          onGridReady={(params) => (gridRef.current = params.api)}
          rowSelection="single"
          rowData={todos}
          columnDefs={columnDefs}
        />
      </div>
      <Snackbar
        open={open}
        message="Todo deleted succesfully"
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
      />
    </div>
  );
}

export default Todolist;
