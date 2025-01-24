import { useState } from 'react';

const UserSelectionModal = ({ users = [], addedUsers = [], handleAddUser, setIsModalOpen }) => {
  const [selectedUserIds, setSelectedUserIds] = useState([]);

  console.log("Added Users:", addedUsers);

  const handleUserSelect = (userId) => {
    setSelectedUserIds((prevSelectedUserIds) => {
      if (prevSelectedUserIds.includes(userId)) {
        return prevSelectedUserIds.filter((id) => id !== userId); // Remove if already selected
      } else {
        return [...prevSelectedUserIds, userId]; // Add if not selected
      }
    });
  };

  const handleConfirmSelection = () => {
    if (selectedUserIds.length > 0) {
      console.log("Selected User IDs:", selectedUserIds);
      handleAddUser(selectedUserIds); // Pass only user IDs to the parent
      alert(`Selected user IDs: ${selectedUserIds.join(', ')} added!`);
      setIsModalOpen(false);
    } else {
      alert('No users selected');
      setIsModalOpen(false);
    }
  };

  const isUserAlreadyAdded = (userId) => {
    // Check if the user's `_id` exists in `addedUsers`
    return addedUsers.some((addedUser) => addedUser._id === userId);
  };

  return (
    <div className="w-full fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50">
      <div className="bg-white w-[30%] h-[40%] rounded-lg p-4">
        <h3 className="text-xl mb-4">Select Users</h3>
        <div className="space-y-2 overflow-y-auto max-h-[60%]">
          {Array.isArray(users) &&
            users
              .filter((user) => !isUserAlreadyAdded(user._id)) // Exclude already added users
              .map((user) => (
                <button
                  key={user._id}
                  className={`w-full py-2 px-4 rounded-md border transition-all ${
                    selectedUserIds.includes(user._id)
                      ? 'bg-blue-500 text-white shadow-md scale-105' // Highlight selected user
                      : 'bg-gray-200 hover:bg-gray-300' // Default styling
                  }`}
                  onClick={() => handleUserSelect(user._id)}
                >
                  {user.email}
                </button>
              ))}
        </div>
        <div className="mt-4 flex justify-between">
          <button
            className="py-2 px-4 bg-green-500 text-white rounded-md"
            onClick={handleConfirmSelection}
          >
            Confirm
          </button>
          <button
            className="py-2 px-4 bg-red-500 text-white rounded-md"
            onClick={() => {
              setSelectedUserIds([]);
              setIsModalOpen(false);
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserSelectionModal;
