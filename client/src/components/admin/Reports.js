import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styleUsers from "../../styles/Users.module.css";

const Reports = () => {
  let userObj;
  const [reports, setReports] = useState([]);

  if (localStorage.getItem("user")) {
    userObj = JSON.parse(localStorage.getItem("user"));
  }

  useEffect(() => {
    // const res = await axios.get("/reports", {
    //   headers: {
    //     "x-auth-token": userObj.token,
    //   },
    // });
    getReports();
    document.body.style.background = "white";
    document.getElementsByClassName("App")[0].style.display = "flex";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getReports = async () => {
    const res = await axios.get("/reports", {
      headers: {
        "x-auth-token": userObj.token,
      },
    });
    setReports(res.data)
  }

  return (
    <div className={styleUsers.containerUsers}>
      <div className={styleUsers.background}>
        <div className={styleUsers.containerLogo}>
          <h1>Donation Ads</h1>
        </div>
        <div className={styleUsers.fullHeight}>
          <table className={styleUsers.adminTable}>
            <thead className={styleUsers.tableHead}>
              <tr>
                <th>Reported Post ID</th>
                <th>Content</th>
                <th>User Firstname</th>
                <th>User Lastname</th>
                <th>Reply</th>
              </tr>
            </thead>
            <tbody className={styleUsers.tableBody}>
              {reports.map(
                (report, index) =>
                  report.user[0] && (
                    <tr key={index}>
                      <td>{report.post_id}</td>
                      <td>
                        <Link to={`/admin/dashboard/reports/${report._id}`}>
                          {report.content}
                        </Link>
                      </td>
                      <td>{report.user[0].firstname}</td>
                      <td>{report.user[0].lastname}</td>{" "}
                      <td>
                        <button>
                          <a
                            href={`mailto:${report.user[0].email}`}
                          >
                            Send Email Reply
                          </a>
                        </button>
                      </td>
                    </tr>
                  ),
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
