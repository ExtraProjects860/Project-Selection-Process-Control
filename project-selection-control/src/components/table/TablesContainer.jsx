import  { useState } from 'react';
import CandidatesTable from './CandidatesTable';
import UsersTable from './UsersTable';
import ImageWithText from '../imageWithText/ImageWithText';
import './TablesContainer.css';

function TablesContainer() {
  const [showCandidates, setShowCandidates] = useState(true);

  const toggleTables = () => setShowCandidates(!showCandidates);

  return (
    <>
    <div className="tables-container">
      <ImageWithText 
        text={ 'Bem vindo Fulano'}
      />
      <button onClick={toggleTables}>
        {showCandidates ? 'Mostrar Tabela de Usuários' : 'Mostrar Tabela de Candidatos'}
      </button>
      
      {showCandidates ? <CandidatesTable /> : <UsersTable />}
    </div>
    </>
    
  );
}

export default TablesContainer;
