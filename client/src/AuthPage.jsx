import { useState } from "react";
import axios from "axios";
import { HiUser, HiLockClosed, HiMail, HiUserGroup } from "react-icons/hi";

const AuthPage = (props) => {
  const [username, setUsername] = useState();
  const [secret, setSecret] = useState();
  const [email, setEmail] = useState();
  const [first_name, setFirstName] = useState();
  const [last_name, setLastName] = useState();

  const onLogin = (e) => {
    e.preventDefault();
    console.log("Login data:", { username, secret });

    axios
      .post("http://localhost:3001/login", { username, secret })
      .then((r) => {
        console.log("Login response:", r.data);
        props.onAuth({ ...r.data, secret }); // NOTE: over-ride secret
      })
      .catch((e) => {
        console.log("Login error:", e.response.data);
        console.log(JSON.stringify(e.response.data));
      });
  };

  const onSignup = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3001/signup", {
        username,
        secret,
        email,
        first_name,
        last_name,
      })
      .then((r) => props.onAuth({ ...r.data, secret })) // NOTE: over-ride secret
      .catch((e) => console.log(JSON.stringify(e.response.data)));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-600 via-indigo-500 to-blue-500">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <form onSubmit={onLogin}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                <HiUser className="inline-block mr-2" />
                Username
              </label>
              <input
                type="text"
                name="username"
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                <HiLockClosed className="inline-block mr-2" />
                Password
              </label>
              <input
                type="password"
                name="secret"
                placeholder="Password"
                onChange={(e) => setSecret(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-indigo-500 text-white font-semibold rounded-lg"
            >
              LOG IN
            </button>
          </form>
          <div className="text-xl font-bold text-center my-6">or Sign Up</div>
          <form onSubmit={onSignup}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                <HiUser className="inline-block mr-2" />
                Username
              </label>
              <input
                type="text"
                name="username"
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                <HiLockClosed className="inline-block mr-2" />
                Password
              </label>
              <input
                type="password"
                name="secret"
                placeholder="Password"
                onChange={(e) => setSecret(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                <HiMail className="inline-block mr-2" />
                Email
              </label>
              <input
                type="text"
                name="email"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                <HiUserGroup className="inline-block mr-2" />
                First Name
              </label>
              <input
                type="text"
                name="first_name"
                placeholder="First name"
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                <HiUserGroup className="inline-block mr-2" />
                Last Name
              </label>
              <input
                type="text"
                name="last_name"
                placeholder="Last name"
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 font-semibold text-white bg-indigo-500 rounded-lg focus:outline-none focus:bg-indigo-600 hover:bg-indigo-600"
            >
              SIGN UP
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
