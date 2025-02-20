import React from "react";
import {
  FaEdit,
  FaTrash,
  FaCheckCircle,
  FaHourglassHalf,
} from "react-icons/fa";
import { Task } from "@/types/task";

interface TaskCardProps {
  task: Task;
  handleDeleteTask: (id: string) => void;
  openModalForUpdate: (task: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  handleDeleteTask,
  openModalForUpdate,
}) => {
  const { ID, Title, StartTime, EndTime, Priority, Status } = task;

  return (
    <div className="bg-black text-white border border-gray-700 rounded-lg p-6 shadow-lg hover:shadow-lg transition-shadow relative">
      <div className="absolute top-2 right-2 flex gap-2">
        <button
          onClick={() => openModalForUpdate(task)}
          className="text-yellow-400 p-2 hover:text-yellow-300 transition-colors"
        >
          <FaEdit />
        </button>
        <button
          onClick={() => handleDeleteTask(ID)}
          className="text-red-600 p-2 hover:text-red-500 transition-colors"
        >
          <FaTrash />
        </button>
      </div>

      <h3 className="text-xl font-semibold mb-2">{Title}</h3>
      <p className="text-sm mb-2">
        <strong>Start Time:</strong> {new Date(StartTime).toLocaleString()}
      </p>
      <p className="text-sm mb-2">
        <strong>End Time:</strong> {new Date(EndTime).toLocaleString()}
      </p>
      <p className="text-sm mb-2">
        <strong>Priority:</strong> {Priority}
      </p>
      <div className="text-sm mb-2">
        <strong>Status:</strong>
        <span
          className={`ml-2 inline-flex items-center ${
            Status === "pending" ? "text-yellow-400" : "text-green-500"
          }`}
        >
          {Status === "pending" ? (
            <div className="mr-2">
              <FaHourglassHalf />
            </div>
          ) : (
            <div className="mr-2">
              <FaCheckCircle />
            </div>
          )}
          {Status}
        </span>
      </div>
    </div>
  );
};

export default TaskCard;
