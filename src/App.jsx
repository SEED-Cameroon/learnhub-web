import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import Home from "./pages/Home";
import Tutors from "./pages/Tutors";
import ProtectedRoute from "../learnhub-web/src/components/protectedRoute";
import Login from "../learnhub-web/src/pages/auth/Login";
import Signup from "../learnhub-web/src/pages/auth/Signup";
import { useAuth } from "../learnhub-web/src/context/AuthContext";

function Dashboard({ title }) {
	const { user, logout } = useAuth();

	return (
		<section className="flex min-h-screen flex-col items-center justify-center px-6 py-24 text-center">
			<h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">{title}</h1>
			<p className="mt-4 text-slate-600 dark:text-slate-400">
				Welcome{user?.name ? `, ${user.name}` : ""}.
			</p>
			<button
				type="button"
				className="mt-8 rounded-md bg-slate-900 px-4 py-2 text-white"
				onClick={logout}
			>
				Log out
			</button>
		</section>
	);
}

export default function App() {
	return (
		<Routes>
			<Route element={<Layout />}>
				<Route path="/" element={<Home />} />
				<Route path="/tutors" element={<Tutors />} />
			</Route>

			<Route path="/login" element={<Login />} />
			<Route path="/signup" element={<Signup />} />
			<Route path="/register" element={<Signup />} />

			<Route element={<ProtectedRoute allowedRoles={["student"]} />}>
				<Route path="/student/*" element={<Dashboard title="Student dashboard" />} />
			</Route>
			<Route element={<ProtectedRoute allowedRoles={["tutor"]} />}>
				<Route path="/tutor/*" element={<Dashboard title="Tutor dashboard" />} />
			</Route>

			<Route path="/unauthorized" element={<Login />} />
			<Route path="*" element={<Home />} />
		</Routes>
	);
}
