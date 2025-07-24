import React, { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, MailCheck } from "lucide-react";
import { DELETE_EMAILS, GET_EMAILS } from "../utils/apis";

function FailedEmailsAdmin() {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEmails = async () => {
    setLoading(true);
    try {
      const res = await axios.get(GET_EMAILS, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("AuthToken")}`,
      },
    });
      setEmails(res.data);
      console.log("data"+res.data);
    } catch (error) {
      console.error("Failed to fetch emails:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
  const confirmDelete = window.confirm(
    "✅ Mark this as sent?\n\nThis will delete the record permanently."
  );
  if (!confirmDelete) return;

  try {
    const res = await axios.delete(`${DELETE_EMAILS}/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("AuthToken")}`,
      },
    });
    setEmails(emails.filter((email) => email.id !== id));
  } catch (error) {
    console.error("Delete failed:", error);
  }
};


  useEffect(() => {
    fetchEmails();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">📩 Failed Emails</h1>
      {loading ? (
        <p>Loading failed emails...</p>
      ) : emails.length === 0 ? (
        <p className="text-gray-500">No failed emails found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {Array.isArray(emails) && emails.length > 0 ? (
    emails.map((email) => (
      <div key={email.id} className="bg-white shadow rounded-xl p-4 mb-4">
        <h3 className="text-lg font-semibold">{email.subject}</h3>
        <p className="text-sm text-gray-500 mb-2">To: {email.email}</p>
        <p className="text-gray-700 mb-2">{email.body}</p>
        <p className="text-xs text-gray-400">Reason: {email.reason}</p>
        <p className="text-xs text-gray-400 mb-2">
          Time: {new Date(email.timestamp).toLocaleString()}
        </p>
        <div className="flex gap-2">
          <button
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded flex items-center gap-1 text-sm"
            onClick={() => handleDelete(email.id)}
          >
            <MailCheck size={16} /> Mark Sent
          </button>
        </div>
      </div>
    ))
  ) : (
    <p className="text-gray-500">No failed emails to display.</p>
  )}
</div>

      )}
    </div>
  );
}

export default FailedEmailsAdmin;
