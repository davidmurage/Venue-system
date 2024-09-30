import React from 'react'
import { NavLink } from 'react-router-dom'

const UserMenu = () => {
  return (
    <div>
       <div className="text-center dashboard-menu">
        <div className="list-group">
          <h4>Dashboard</h4>
          <NavLink
            to="/dashboard/user/profile"
            className="list-group-item list-group-item-action"
          >
            Profile
          </NavLink>
          <NavLink
            to="/dashboard/user/myBookings"
            className="list-group-item list-group-item-action"
          >
            MyBookings
          </NavLink>
        </div>
      </div>
    </div>
  )
}

export default UserMenu
