// npm
import { Routes, Route } from "react-router"

// pages
import AppLanding from "../pages/AppLanding/AppLanding"
import NewModule from "../pages/module/new/NewModule"
import EditModuleOutline from "../pages/module/outline/edit/EditModuleOutline"
import ShowModule from "../pages/module/show/ShowModule"
import PageNotFound from "../pages/PageNotFound/PageNotFound"

// component
const AppRouter = () => {
  return (
    <Routes>
      <Route path="/*" element={<PageNotFound />} />
      <Route path="/" element={<AppLanding />} />
      <Route path="/module/new" element={<NewModule />} />
      <Route path="/module/outline/edit" element={<EditModuleOutline />} />
      <Route path="/module/show" element={<ShowModule />} />
    </Routes>
  )
}

export default AppRouter
