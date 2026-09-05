


// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Mail, Phone, User, Calendar } from "lucide-react";

// const Messages = () => {
//   const [messages, setMessages] = useState([]);

//   useEffect(() => {
//     fetchMessages();
//   }, []);

//   const fetchMessages = async () => {
//     try {
//       const res = await axios.get(
//         "http://localhost:5000/api/contact"
//       );
//       setMessages(res.data);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <div style={{ padding: "30px" }}>
//       {/* Header */}
//       <div
//         style={{
//           marginBottom: "25px",
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//         }}
//       >
//         <div>
//           <h1
//             style={{
//               fontSize: "28px",
//               fontWeight: "700",
//               margin: 0,
//               color: "#1a1a1a",
//             }}
//           >
//             Contact Messages
//           </h1>

//           <p
//             style={{
//               color: "#666",
//               marginTop: "8px",
//             }}
//           >
//             Manage customer inquiries and contact requests
//           </p>
//         </div>

//         <div
//           style={{
//             background: "#2BB7A6",
//             color: "#fff",
//             padding: "10px 18px",
//             borderRadius: "10px",
//             fontWeight: "600",
//           }}
//         >
//           Total Messages: {messages.length}
//         </div>
//       </div>

//       {/* Table Card */}
//       <div
//         style={{
//           background: "#fff",
//           borderRadius: "16px",
//           overflow: "hidden",
//           boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
//         }}
//       >
//         <table
//           style={{
//             width: "100%",
//             borderCollapse: "collapse",
//           }}
//         >
//           <thead>
//             <tr
//               style={{
//                 background:
//                   "linear-gradient(90deg,#1c3d6e,#2BB7A6)",
//                 color: "#fff",
//               }}
//             >
//               <th style={thStyle}>Customer</th>
//               <th style={thStyle}>Email</th>
//               <th style={thStyle}>Phone</th>
//               <th style={thStyle}>Subject</th>
//               <th style={thStyle}>Message</th>
//               <th style={thStyle}>Date</th>
//             </tr>
//           </thead>

//           <tbody>
//             {messages.length > 0 ? (
//               messages.map((msg) => (
//                 <tr
//                   key={msg.id}
//                   style={{
//                     borderBottom: "1px solid #eee",
//                   }}
//                 >
//                   <td style={tdStyle}>
//                     <div
//                       style={{
//                         display: "flex",
//                         alignItems: "center",
//                         gap: "10px",
//                       }}
//                     >
//                       <div
//                         style={{
//                           width: "38px",
//                           height: "38px",
//                           borderRadius: "50%",
//                           background: "#2BB7A6",
//                           color: "#fff",
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "center",
//                         }}
//                       >
//                         <User size={18} />
//                       </div>

//                       <strong>{msg.name}</strong>
//                     </div>
//                   </td>

//                   <td style={tdStyle}>
//                     <div
//                       style={{
//                         display: "flex",
//                         alignItems: "center",
//                         gap: "8px",
//                       }}
//                     >
//                       <Mail size={16} color="#2BB7A6" />
//                       {msg.email}
//                     </div>
//                   </td>

//                   <td style={tdStyle}>
//                     <div
//                       style={{
//                         display: "flex",
//                         alignItems: "center",
//                         gap: "8px",
//                       }}
//                     >
//                       <Phone size={16} color="#2BB7A6" />
//                       {msg.phone}
//                     </div>
//                   </td>

//                   <td style={tdStyle}>
//                     <span
//                       style={{
//                         background: "#f1f5f9",
//                         padding: "6px 12px",
//                         borderRadius: "20px",
//                         fontSize: "13px",
//                         fontWeight: "600",
//                       }}
//                     >
//                       {msg.subject}
//                     </span>
//                   </td>

//                   <td style={tdStyle}>
//                     <div
//                       style={{
//                         maxWidth: "280px",
//                         whiteSpace: "nowrap",
//                         overflow: "hidden",
//                         textOverflow: "ellipsis",
//                       }}
//                     >
//                       {msg.message}
//                     </div>
//                   </td>

//                   <td style={tdStyle}>
//                     <div
//                       style={{
//                         display: "flex",
//                         alignItems: "center",
//                         gap: "6px",
//                       }}
//                     >
//                       <Calendar size={15} color="#2BB7A6" />
//                       {new Date(
//                         msg.created_at
//                       ).toLocaleDateString()}
//                     </div>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td
//                   colSpan="6"
//                   style={{
//                     textAlign: "center",
//                     padding: "40px",
//                     color: "#777",
//                   }}
//                 >
//                   No messages found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// const thStyle = {
//   padding: "16px",
//   textAlign: "left",
//   fontSize: "14px",
//   fontWeight: "600",
// };

// const tdStyle = {
//   padding: "16px",
//   fontSize: "14px",
//   color: "#333",
// };

// export default Messages;




import React, { useEffect, useState } from "react";
import axios from "axios";
import { Search, Mail, Phone } from "lucide-react";

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/contact"
      );

      setMessages(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const filteredMessages = messages.filter(
    (msg) =>
      msg.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      msg.email
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      msg.subject
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-animate-fade-in">

      {/* Header */}
      <div className="admin-page-header">
        <div className="admin-page-title-group">
          <h1 className="admin-page-title">
            Messages
          </h1>

          <span className="admin-page-subtitle">
            Customer contact inquiries
          </span>
        </div>
      </div>

      {/* Search */}
      <div
        className="admin-card"
        style={{
          padding: "16px",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            position: "relative",
          }}
        >
          <Search
            size={18}
            style={{
              position: "absolute",
              left: "12px",
              top: "12px",
              color: "#888",
            }}
          />

          <input
            type="text"
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
            className="admin-form-input"
            style={{
              paddingLeft: "40px",
            }}
          />
        </div>
      </div>

      {/* Messages Table */}
      <div className="admin-card">
        <div className="admin-table-container">
          <table className="admin-table">

            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Subject</th>
                <th>Message</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {filteredMessages.length > 0 ? (
                filteredMessages.map((msg) => (
                  <tr key={msg.id}>

                    <td>
                      {msg.name}
                    </td>

                    <td>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        <Mail size={14} />
                        {msg.email}
                      </div>
                    </td>

                    <td>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        <Phone size={14} />
                        {msg.phone}
                      </div>
                    </td>

                    <td>
                      {msg.subject}
                    </td>

                    <td
                      style={{
                        maxWidth: "350px",
                      }}
                    >
                      {msg.message}
                    </td>

                    <td>
                      {new Date(
                        msg.created_at
                      ).toLocaleDateString()}
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    style={{
                      textAlign: "center",
                      padding: "30px",
                    }}
                  >
                    No Messages Found
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>
      </div>

    </div>
  );
}