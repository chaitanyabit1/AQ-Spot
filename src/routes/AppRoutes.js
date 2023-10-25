import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { RoutePaths, collapseSidebar } from "../config/RoutePathConfig";
import PageNotFoundComponent from "../components/PageNotFoundComponent";
import Homepage from "../views/home/Homepage";
import DashboardView from "../views/dashboard/DashboardView";
import UsersView from "../views/users/UsersView";
import HospitalsView from "../views/hospitals/HospitalView";
import HospitalCreateView from "../views/hospitals/HospitalCreateView";
import PatientsView from "../views/patients/PatientsView";
import PatientCreateView from "../views/patients/PatientCreateView";
import PatientDataView from "../views/patients/PatientDataView";
import FollowupsView from "../views/followups/FollowupsView";
import ProfileView from "../views/profile/ProfileView";
import LogoutView from "../views/profile/LogoutView";
import UserPolicyView from "../views/user-policy/UserPolicyView";
import AdmissionInfoView from "../views/admission/AdmissionInfoView";
import UserCreateView from "../views/users/UserCreateView";
import UserEditView from "../views/users/UserEditView";
import HospitalEditView from "../views/hospitals/HospitalEditView";
import MasterPagesView from "../views/masters/MasterPagesView";
import { USER_RESTRICT_ROUTE } from "../config/AppConfig";
import { getUserAccesses } from "../session/UserSession";

const AppRoutes = (props) => {
  const { isLoggedIn, updateLoggedIn } = props;

  return (
    <Switch>
      <Route path="/" component={Homepage} />
    </Switch>
  );
};

export default AppRoutes;
