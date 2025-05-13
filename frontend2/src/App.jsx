import { useEffect } from 'react';
import './App.css';

// let menuicn = document.querySelector(".menuicn");
// let nav = document.querySelector(".navcontainer");

// menuicn.addEventListener("click", () => {
//   nav.classList.toggle("navclose");
// })


function App() {

  useEffect(() => {
    const menuicn = document.querySelector(".menuicn");
    const nav = document.querySelector(".navcontainer");

    if (menuicn && nav) {
      const handleClick = () => {
        nav.classList.toggle("navclose");
      };
      menuicn.addEventListener("click", handleClick);

      return () => {
        menuicn.removeEventListener("click", handleClick);
      };
    }
  }, []);


  return (
    // <div className="App">
    //   <header className="App-header">
    //     {/* <h1>Power BI Secure Embed Dashboard</h1> */}
    //     <div style={{ width: '1140px', height: '541.25px', border: '1px solid #ccc' }}>
    //       {/* <iframe
    //         title="DashboardHTTTQL"
    //         width="1140"
    //         height="541.25"
    //         src="https://app.powerbi.com/reportEmbed?reportId=7255cc0d-6cb5-485f-839d-c007cb42351d&autoAuth=true&ctid=e7572e92-7aee-4713-a3c4-ba64888ad45f&actionBarEnabled=true"
    //         frameBorder="0"
    //         allowFullScreen="true"
    //       ></iframe> */}
    //       {/* <iframe title="DashboardHTTTQL" 
    //         width="1140" 
    //         height="541.25" 
    //         src="https://app.powerbi.com/reportEmbed?reportId=7255cc0d-6cb5-485f-839d-c007cb42351d&autoAuth=true&ctid=e7572e92-7aee-4713-a3c4-ba64888ad45f" 
    //         frameborder="0" 
    //         allowFullScreen="true">
    //       </iframe> */}

    //       <iframe
    //         title="DashboardHTTTQL"
    //         width="1140"
    //         height="675"
    //          src="https://app.powerbi.com/reportEmbed?reportId=7255cc0d-6cb5-485f-839d-c007cb42351d&autoAuth=true&ctid=e7572e92-7aee-4713-a3c4-ba64888ad45f"
    //         allowFullScreen="true">
    //       </iframe>
    //       {/* <iframe title="DashboardHTTTQL" width="1140" height="541.25" src="https://app.powerbi.com/reportEmbed?reportId=7255cc0d-6cb5-485f-839d-c007cb42351d&autoAuth=true&ctid=e7572e92-7aee-4713-a3c4-ba64888ad45f" frameborder="0" allowFullScreen="true"></iframe> */}
    //       {/* <iframe title="DashboardHTTTQL" width="1140" height="541.25" src="https://app.powerbi.com/reportEmbed?reportId=7255cc0d-6cb5-485f-839d-c007cb42351d&autoAuth=true&ctid=e7572e92-7aee-4713-a3c4-ba64888ad45f" frameborder="0" allowFullScreen="true"></iframe> */}
    //       {/* <iframe title="DashboardHTTTQL" width="1140" height="541.25" src="https://app.powerbi.com/reportEmbed?reportId=7255cc0d-6cb5-485f-839d-c007cb42351d&autoAuth=true&ctid=e7572e92-7aee-4713-a3c4-ba64888ad45f" frameborder="0" allowFullScreen="true"></iframe> */}
    //     </div>
    //   </header>
    // </div>

    <>
      <title>Dashboard</title>
      <link rel="stylesheet" href="App.css" />
      <link rel="stylesheet" href="responsive.css" />
      <header>
        <div className="logosec">
          <div className="logo">Dashboard</div>
          <img
            src="https://media.geeksforgeeks.org/wp-content/uploads/20221210182541/Untitled-design-(30).png"
            className="icn menuicn"
            id="menuicn"
            alt="menu-icon"
          />
        </div>
        <div className="searchbar">
          <input type="text" placeholder="Search" />
          <div className="searchbtn">
            <img
              src="https://media.geeksforgeeks.org/wp-content/uploads/20221210180758/Untitled-design-(28).png"
              className="icn srchicn"
              alt="search-icon"
            />
          </div>
        </div>
        <div className="message">
          <div className="circle" />
          <img
            src="https://media.geeksforgeeks.org/wp-content/uploads/20221210183322/8.png"
            className="icn"
            alt=""
          />
          <div className="dp">
            <img
              src="https://media.geeksforgeeks.org/wp-content/uploads/20221210180014/profile-removebg-preview.png"
              className="dpicn"
              alt="dp"
            />
          </div>
        </div>
      </header>
      <div className="main-container">
        <div className="navcontainer">
          <nav className="nav">
            <div className="nav-upper-options">
              <div className="nav-option option1">
                <img
                  src="https://media.geeksforgeeks.org/wp-content/uploads/20221210182148/Untitled-design-(29).png"
                  className="nav-img"
                  alt="dashboard"
                />
                <h3>Dashboard</h3>
              </div>
              <div className="option2 nav-option">
                <img
                  src="https://media.geeksforgeeks.org/wp-content/uploads/20221210183322/9.png"
                  className="nav-img"
                  alt="articles"
                />
                <h3>Articles</h3>
              </div>
              <div className="nav-option option3">
                <img
                  src="https://media.geeksforgeeks.org/wp-content/uploads/20221210183320/5.png"
                  className="nav-img"
                  alt="report"
                />
                <h3>Report</h3>
              </div>

              <div className="nav-option logout">
                <img
                  src="https://media.geeksforgeeks.org/wp-content/uploads/20221210183321/7.png"
                  className="nav-img"
                  alt="logout"
                />
                <h3>Logout</h3>
              </div>
            </div>
          </nav>
        </div>
        <div className="main">
          <iframe title="DashboardHTTTQL"
              width="100%"
              height="100%"
              src="https://app.powerbi.com/reportEmbed?reportId=7255cc0d-6cb5-485f-839d-c007cb42351d&autoAuth=true&ctid=e7572e92-7aee-4713-a3c4-ba64888ad45f"
              frameborder="0"
              allowFullScreen="true">
            </iframe>
        </div>
      </div>
    </>

  );
}

export default App;