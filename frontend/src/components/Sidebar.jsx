function Sidebar({ pages, page, onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">HR Payslip</div>
      <nav>
        {pages.map((item) => (
          <button
            key={item.id}
            className={item.id === page ? 'sidebar-link active' : 'sidebar-link'}
            onClick={() => onNavigate(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
