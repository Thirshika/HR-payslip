function TopNav({ title, tag, userName, onSignOut }) {
  return (
    <div className="topnav">
      <div className="tn-logo">
        <div className="tn-icon">T</div>
        <div>
          <div className="tn-name">{title}</div>
          <div className="tn-org">TATTI / RM Educational Trust</div>
        </div>
      </div>
      <div className="tn-right">
        <span className={tag === 'hr' ? 'tn-badge hr' : 'tn-badge emp'}>{tag === 'hr' ? 'HR Admin' : 'Employee'}</span>
        <div className="tn-av">{userName?.slice(0, 2).toUpperCase()}</div>
        <button className="signout" onClick={onSignOut}>Sign Out</button>
      </div>
    </div>
  );
}

export default TopNav;
