import { Link } from "react-router"

function AppLanding() {
  return (
    <main className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Welcome to the App</h1>
      <Link to="/module/new" className="text-blue-500">
        Generate Module Content
      </Link>
    </main>
  );
}

export default AppLanding
