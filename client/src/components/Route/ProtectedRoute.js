import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";

// const ProtectedRoute = ({component: Component, ...rest}) => {
//     const {loading , isAuthenticated, user } = useSelector(state => state.user);
//   return (
//       <Fragment>
//             {!loading ? (
//                 <Route
//                 {...rest}
//                 render={props => {
//                     if (isAuthenticated === false) {
//                        return <
//                     }
//                     return <Component {...props} />
//                 }
//       </Fragment>
//   )
// }
const ProtectedRoute = () => {
  const { loading, isAuthenticated } = useSelector((state) => state.user);
  return (
    <Fragment>
      {!loading &&
        (isAuthenticated === false ? (
          <Navigate replace to="/login" />
        ) : (
          <Fragment>
            <Outlet />
            {console.log("isAuthenticated++++++++++++++", isAuthenticated)}
          </Fragment>
        ))}
    </Fragment>
  );
};

export default ProtectedRoute;
