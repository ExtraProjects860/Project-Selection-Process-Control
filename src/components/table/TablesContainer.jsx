import React, { useState } from "react";
import { FaSearch } from "react-icons/fa"; // Ícone de lupa
import CandidatesTable from "./CandidatesTable";
import UsersTable from "./UsersTable";
import "./TablesContainer.css";

function TablesContainer() {
  const [showCandidates, setShowCandidates] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // Estado da busca

  const toggleTables = () => setShowCandidates(!showCandidates);

  // Função de busca
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  // Função para resetar os filtros
  const handleResetFilters = () => {
    setSearchTerm("");
  };

  return (
    <div className="tables-container">
      <div className="controls">
        {/* Campo de busca com o ícone de lupa */}
        <div className="search-container">
          <input
            type="text"
            placeholder={`Buscar...`}
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
          <button className="search-button">
            <FaSearch />
          </button>
        </div>

        {/* Botão para resetar filtros */}
        <button onClick={handleResetFilters} className="reset-button">
          Resetar Filtros
        </button>

        <button onClick={toggleTables}>
          {showCandidates
            ? "Mostrar Tabela de Usuários"
            : "Mostrar Tabela de Candidatos"}
        </button>
      </div>

      {/* Tabela que é exibida conforme o toggle */}
      {showCandidates ? (
        <CandidatesTable searchTerm={searchTerm} />
      ) : (
        <UsersTable searchTerm={searchTerm} />
      )}
    </div>
  );
}

export default TablesContainer;
