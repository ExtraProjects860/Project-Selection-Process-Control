import './HeaderCandidate.css';

function HeaderCandidate() {
const data = localStorage.getItem("userData");
const userData = JSON.parse(data);
const userName = userData.dados.nome;
  return (
    <div className="header-container">
      <h1>BEM VINDO, {userName}</h1>
    </div>
  );
}
export default HeaderCandidate;
