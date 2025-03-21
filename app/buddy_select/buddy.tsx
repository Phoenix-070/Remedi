import React, { useState, useEffect } from "react";

type User = {
  id: string;
  username: string;
  email?: string;
};

type BuddySelectorProps = {
  userId: string;
  setBuddyId: (id: string) => void;
};

const BuddySelector: React.FC<BuddySelectorProps> = ({ userId, setBuddyId }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedBuddy, setSelectedBuddy] = useState<string>("");

  useEffect(() => {
    // Fetch all users (mock API call)
    fetch("/api/users")
      .then((res) => res.json())
      .then((data: User[]) => setUsers(data))
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  const handleBuddySelect = () => {
    setBuddyId(selectedBuddy);
    alert(`Buddy set to: ${selectedBuddy}`);
    
    // Update buddy in backend (mock API call)
    fetch(`/api/users/${userId}/set-buddy`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ buddyId: selectedBuddy }),
    }).catch((error) => console.error("Error updating buddy:", error));
  };

  return (
    <div>
      <h3>Select a Buddy (Caregiver)</h3>
      <select
        value={selectedBuddy}
        onChange={(e) => setSelectedBuddy(e.target.value)}
      >
        <option value="">-- Select Buddy --</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.username}
          </option>
        ))}
      </select>
      <button onClick={handleBuddySelect}>Save Buddy</button>
    </div>
  );
};

export default BuddySelector;

type DisplayBuddyProps = {
    buddyId: string | null;
  };
  
  const DisplayBuddy: React.FC<DisplayBuddyProps> = ({ buddyId }) => {
    const [buddy, setBuddy] = useState<User | null>(null);
  
    useEffect(() => {
      if (!buddyId) {
        setBuddy(null); // ✅ Reset buddy state if no buddy is assigned
        return;
      }
  
      const fetchBuddyInfo = async () => {
        try {
          const res = await fetch(`/api/users/${buddyId}`);
          if (!res.ok) throw new Error("Failed to fetch buddy data");
          const data: User = await res.json();
          setBuddy(data);
        } catch (error) {
          console.error("Error fetching buddy info:", error);
          setBuddy(null);
        }
      };
  
      fetchBuddyInfo();
    }, [buddyId]);
  
    return buddy ? (
      <div>
        <h4>Assigned Buddy:</h4>
        <p>
          {buddy.username} ({buddy.email || "No email provided"})
        </p>
      </div>
    ) : (
      <p>No buddy assigned yet.</p>
    );
  };
  
  //export default DisplayBuddy;

// Trigger Notification
type TriggerNotificationFunction = (buddyId: string , medicationName: string) => void;

const triggerBuddyNotification: TriggerNotificationFunction = (buddyId, medicationName) => {
  fetch("/api/notify-buddy", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      buddyId,
      message: `Alert! The primary user missed their ${medicationName} dose.`,
    }),
  }).catch((error) => console.error("Error triggering buddy notification:", error));
};

// Example usage after a timeout
const buddyId = "some-buddy-id"; // Replace with actual buddy ID
setTimeout(() => {
  triggerBuddyNotification(buddyId, "Heart Medicine");
}, 60000); // Wait 60 seconds before triggering