import React, {
  useEffect,
  useState
} from 'react';

import axios from 'axios';

export default function Customers() {

  const [customers, setCustomers] =
    useState([]);

  useEffect(() => {

    axios
      .get(
        'http://localhost:5000/api/customers'
      )
      .then((res) => {

        setCustomers(res.data);

      })
      .catch((err) => {

        console.log(err);

      });

  }, []);

  return (
    <div className="admin-card">

      <h2
        style={{
          marginBottom: '20px'
        }}
      >
        Customers
      </h2>

      <table className="admin-table">

        <thead>

          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
          </tr>

        </thead>

        <tbody>

          {customers.map((customer) => (

            <tr key={customer.id}>

              <td>{customer.id}</td>

              <td>
                {customer.fullname}
              </td>

              <td>
                {customer.email}
              </td>

              <td>
                {customer.phone}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}