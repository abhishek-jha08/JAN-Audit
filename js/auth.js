(function () {
  const SESSION_KEY = "jan-audit:session";
  const DEMO_PASSWORD = "Admin@123";
  const demoUsers = [
    { id: "usr-admin", name: "Ananya Sharma", email: "admin@janaudit.in", role: "Administrator", title: "District Programme Administrator", department: "Rural Development Department" },
    { id: "usr-auditor", name: "Ravi Kumar", email: "auditor@janaudit.in", role: "Auditor", title: "Social Audit Officer", department: "Social Audit Unit" },
    { id: "usr-official", name: "Meera Devi", email: "official@janaudit.in", role: "Official", title: "Block Development Officer", department: "Block Administration" }
  ];
  const auth = {
    users: demoUsers,
    currentUser() {
      try {
        const session = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
        return session && demoUsers.find((user) => user.id === session.userId) || null;
      } catch (error) {
        console.error("Could not read the demo session.", error);
        return null;
      }
    },
    login(email, password, remember) {
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Enter a valid email address.");
      const user = demoUsers.find((entry) => entry.email.toLowerCase() === email.trim().toLowerCase());
      if (!user || password !== DEMO_PASSWORD) throw new Error("The email or password you entered is incorrect.");
      localStorage.setItem(SESSION_KEY, JSON.stringify({ userId: user.id, remember: Boolean(remember), createdAt: new Date().toISOString() }));
      return user;
    },
    switchUser(userId) {
      const user = demoUsers.find((entry) => entry.id === userId);
      if (!user) throw new Error("Select a valid demo account.");
      localStorage.setItem(SESSION_KEY, JSON.stringify({ userId: user.id, remember: true, createdAt: new Date().toISOString() }));
      return user;
    },
    logout() {
      localStorage.removeItem(SESSION_KEY);
      location.replace("login.html");
    },
    requireAuth() {
      const user = this.currentUser();
      if (!user) {
        location.replace("login.html");
        return null;
      }
      return user;
    },
    canManageProjects(user) { return user && user.role === "Administrator"; },
    canManageFindings(user) { return user && (user.role === "Administrator" || user.role === "Auditor"); }
  };
  window.JanAuditAuth = auth;
})();
