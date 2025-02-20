import React, { useEffect } from "react";
import { FaTimes } from "react-icons/fa";

interface TaskModalProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  newTask: {
    ID: string;
    _id: string;
    Title: string;
    StartTime: string;
    EndTime: string;
    Priority: number;
    Status: "pending" | "finished";
  };
  setNewTask: React.Dispatch<
    React.SetStateAction<{
      _id: string;
      ID: string;
      Title: string;
      StartTime: string;
      EndTime: string;
      Priority: number;
      Status: "pending" | "finished";
    }>
  >;
  handleTaskCreation: () => void;
  handleTaskUpdate: () => void;
  isUpdate: boolean;
}

// Function to format date for input fields (YYYY-MM-DDTHH:MM format)
const formatDateForInput = (date: string) => {
  if (!date) return "";
  const formattedDate = new Date(date);
  return formattedDate.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:MM"
};

const TaskModal: React.FC<TaskModalProps> = ({
  setIsModalOpen,
  newTask,
  setNewTask,
  handleTaskCreation,
  handleTaskUpdate,
  isUpdate,
}) => {
  useEffect(() => {
    if (isUpdate && newTask.StartTime && newTask.EndTime) {
      setNewTask({
        ...newTask,
        StartTime: formatDateForInput(newTask.StartTime),
        EndTime: formatDateForInput(newTask.EndTime),
      });
    }
  }, [isUpdate]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center">
      <div className="bg-black p-6 rounded-lg shadow-lg w-full max-w-md border border-[#444]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-[#B0EB0A]">
            {isUpdate ? "Update Task" : "Create Task"}
          </h2>
          <button
            onClick={() => {
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
            }}
            className="text-white text-xl p-2 hover:bg-[#444] rounded-full"
          >
            <FaTimes />
          </button>
        </div>
        <div className="flex flex-col gap-2 text-gray-400">
          Task Title:
          <input
            type="text"
            placeholder="Title"
            value={newTask.Title} // Fixed incorrect case
            onChange={(e) => setNewTask({ ...newTask, Title: e.target.value })}
            className="w-full p-2 mb-4 bg-black border text-white rounded"
          />
        </div>

        {isUpdate || (
          <div className="flex flex-col gap-2 text-gray-400">
            Start Time:
            <input
              type="datetime-local"
              value={formatDateForInput(newTask.StartTime)}
              onChange={(e) =>
                setNewTask({ ...newTask, StartTime: e.target.value })
              }
              className="w-full p-2 mb-4 bg-black border text-white rounded"
            />
          </div>
        )}

        <div className="flex flex-col gap-2 text-gray-400">
          End Time:
          <input
            type="datetime-local"
            value={formatDateForInput(newTask.EndTime)} // Fixed incorrect formatting
            onChange={(e) =>
              setNewTask({ ...newTask, EndTime: e.target.value })
            }
            className="w-full p-2 mb-4 bg-black border text-white rounded"
          />
        </div>

        <div className="flex flex-col gap-2 text-gray-400">
          Priority:
          <select
            value={newTask.Priority} // Fixed incorrect case
            onChange={(e) =>
              setNewTask({ ...newTask, Priority: Number(e.target.value) })
            }
            className="w-full p-2 mb-4 bg-black border text-white rounded"
          >
            {[1, 2, 3, 4, 5].map((p) => (
              <option key={p} value={p}>
                Priority {p}
              </option>
            ))}
          </select>
        </div>

        {isUpdate && (
          <div className="flex flex-col items-center mb-4">
            <div className="flex items-center">
              <span className="text-white mr-2">Pending</span>
              <div
                className={`w-14 h-7 flex items-center rounded-full p-1 cursor-pointer ${
                  newTask.Status === "pending" ? "bg-gray-600" : "bg-green-600"
                }`}
                onClick={() =>
                  setNewTask({
                    ...newTask,
                    Status:
                      newTask.Status === "pending" ? "finished" : "pending",
                  })
                }
              >
                <div
                  className={`w-6 h-6 bg-white rounded-full shadow-md transform duration-300 ${
                    newTask.Status === "finished" ? "translate-x-7" : ""
                  }`}
                ></div>
              </div>
              <span className="text-white ml-2">Finished</span>
            </div>
          </div>
        )}

        <button
          onClick={isUpdate ? handleTaskUpdate : handleTaskCreation}
          className="w-full p-3 bg-[#B0EB0A] text-black rounded urbanist-700"
        >
          {isUpdate ? "Update Task" : "Create Task"}
        </button>
      </div>
    </div>
  );
};

export default TaskModal;
