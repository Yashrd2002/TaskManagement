"use client"
import { useState, useEffect } from "react";

import { FaEdit, FaFilter, FaSort } from "react-icons/fa";

import { Task } from "@/types/task";
import TaskModal from "@/components/task/TaskModal";
import TaskCard from "@/components/task/TaskCard";
import { toast } from "react-toastify";

const Tasks = () => {
  const [isUpdate, setIsUpdate] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filters, setFilters] = useState({ priority: "", status: "" });
  const [sortBy, setSortBy] = useState("startTime");
  const [sortOrder, setSortOrder] = useState("asc");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    ID: "",
    _id: "",
    Title: "",
    StartTime: "",
    EndTime: "",
    Priority: 1,
    Status: "pending" as "pending" | "finished",
  });
  // const [loading, setLoading] = useState(true);
  const url = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetchTasks();
  }, [filters]);
  const fetchTasks = async () => {
    setTasks([]);
    try {
      const response = await fetch(
        `${url}/gettask?priority=${filters.priority}&status=${filters.status}`,
        {
          credentials: "include",
        }
      );
      const data = await response.json();
      if (data) {
        setTasks(data);
      }
    } catch (error) {
      toast.error("Failed to fetch tasks");
    }
  };
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [field, order] = e.target.value.split(":");
    setSortBy(field);
    setSortOrder(order);
  };

  const handleTaskCreation = async () => {
    if (!newTask.EndTime || !newTask.StartTime || !newTask.Title) {
      toast.error("All Fields are required");
      return;
    }

    // Convert Date to ISO format (YYYY-MM-DDTHH:MM:SSZ)
    const formatDate = (dateString: any) => new Date(dateString).toISOString();

    const formattedTask = {
      status: newTask.Status,
      title: newTask.Title,
      priority: newTask.Priority,
      startTime: formatDate(newTask.StartTime),
      endTime: formatDate(newTask.EndTime),
    };

    try {
      const response = await fetch(`${url}/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedTask), // Send formatted task
        credentials: "include",
      });

      const data = await response.json();

      await fetchTasks();
      setIsModalOpen(false);
      setNewTask({
        ID: "",
        _id: "",
        Title: "",
        StartTime: "",
        EndTime: "",
        Priority: 1,
        Status: "pending",
      });
    } catch (error) {
      toast.error("Failed to create task");
    }
  };

  const handleDeleteTask = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );
    if (!confirmed) return;

    try {
      const response = await fetch(`${url}/delete/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        await fetchTasks();
      }
    } catch (error) {
      toast.error("Failed to delete task");
    }
  };

  const filteredTasks = tasks
    .filter(
      (task) =>
        (!filters.priority || task.Priority === Number(filters.priority)) &&
        (!filters.status || task.Status === filters.status)
    )
    .sort((a: any, b: any) => {
      const orderFactor = sortOrder === "asc" ? 1 : -1;

      return (
        (new Date(a.StartTime).getTime() - new Date(b.StartTime).getTime()) *
        orderFactor
      );
    });

  const handleTaskUpdate = async () => {
    try {
      const formatDate = (dateString: any) =>
        new Date(dateString).toISOString();
      const response = await fetch(`${url}/update/${newTask.ID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          endTime: formatDate(newTask.EndTime),
          startTime: formatDate(newTask.StartTime),
          status: newTask.Status,
          title: newTask.Title,
          priority: newTask.Priority,
        }),
        credentials: "include",
      });
      const data = await response.json();
      await fetchTasks();
      // setTasks(updatedTasks);
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Failed to update task");
    }
  };

  const openModalForUpdate = (task: Task) => {
    setNewTask(task);
    setIsModalOpen(true);
    setIsUpdate(true);
  };

  return (
    <div className="p-6 min-h-screen bg-black text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-[#B0EB0A]">Tasks</h1>
        <button
          className="bg-[#B0EB0A] hover:bg-[#cefd4c] text-black urbanist-700 md:px-6 px-2 md:py-3 py-2 rounded flex items-center gap-2"
          onClick={() => {
            setIsUpdate(false);
            setIsModalOpen(true);
            setNewTask({
              ID: "",
              _id: "",
              Title: "",
              StartTime: "",
              EndTime: "",
              Priority: 1,
              Status: "pending" as "pending" | "finished",
            });
          }}
        >
          <FaEdit />
          Create Task
        </button>
      </div>

      <div className="flex flex-wrap gap-6 mb-6 items-center">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative">
            <select
              id="priority"
              name="priority"
              className="bg-black p-2 rounded text-white focus:ring-2 focus:ring-[#B0EB0A] border border-gray-600 focus:border-[#B0EB0A] w-full sm:w-40 pl-8"
              onChange={handleFilterChange}
            >
              <option value="">All Priorities</option>
              {[1, 2, 3, 4, 5].map((p) => (
                <option key={p} value={p}>
                  Priority {p}
                </option>
              ))}
            </select>
            <div className="absolute top-0 left-0 flex items-center pl-2 h-full pointer-events-none">
              <FaFilter className="text-[#B0EB0A]" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative">
            <select
              id="status"
              name="status"
              className="bg-black p-2 rounded text-white focus:ring-2 focus:ring-[#B0EB0A] border border-gray-600 focus:border-[#B0EB0A] w-full sm:w-40 pl-8"
              onChange={handleFilterChange}
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="finished">Finished</option>
            </select>
            <div className="absolute top-0 left-0 flex items-center pl-2 h-full pointer-events-none">
              <FaFilter className="text-[#B0EB0A]" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative">
            <select
              id="sortBy"
              className="bg-black p-2 rounded text-white focus:ring-2 focus:ring-[#B0EB0A] border border-gray-600 focus:border-[#B0EB0A] w-full sm:w-40 pl-8"
              onChange={handleSortChange}
            >
              <option value="startTime:asc">Start Time (Asc)</option>
              <option value="startTime:desc">Start Time (Desc)</option>
              <option value="endTime:asc">End Time (Asc)</option>
              <option value="endTime:desc">End Time (Desc)</option>
            </select>
            <div className="absolute top-0 left-0 flex items-center pl-2 h-full pointer-events-none">
              <FaSort className="text-[#B0EB0A]" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTasks.map((task, i) => (
          <TaskCard
            key={i}
            task={task}
            handleDeleteTask={handleDeleteTask}
            openModalForUpdate={openModalForUpdate}
          />
        ))}
      </div>

      {isModalOpen && (
        <TaskModal
          newTask={newTask}
          isUpdate={isUpdate}
          setIsModalOpen={setIsModalOpen}
          setNewTask={setNewTask}
          handleTaskUpdate={handleTaskUpdate}
          handleTaskCreation={handleTaskCreation}
          isModalOpen
        />
      )}
    </div>
  );
};

export default Tasks;
