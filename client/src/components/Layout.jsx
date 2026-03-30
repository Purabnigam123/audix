import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col bg-black text-slate-100">
      <div className="pointer-events-none fixed inset-0 opacity-90">
        <div className="absolute -top-20 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-indigo-500/12 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-blue-500/12 blur-3xl" />
        <div className="absolute bottom-16 left-10 h-52 w-52 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="subtle-grid absolute inset-0 opacity-15" />
      </div>
      <Navbar />
      <div className="h-[88px]" />
      <main className="relative z-10 mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
