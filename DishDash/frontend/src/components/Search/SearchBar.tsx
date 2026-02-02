import styled from "styled-components";

const SearchContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;

  &:focus {
    outline: none;
    border-color: #4caf50;
  }
`;

const SearchButton = styled.button`
  padding: 8px 24px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #45a049;
  }
`;

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch?: () => void;
  placeholder?: string;
  showButton?: boolean;
}

export function SearchBar({
  value,
  onChange,
  onSearch,
  placeholder = "Search...",
  showButton = true,
}: SearchBarProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && onSearch) {
      onSearch();
    }
  };

  return (
    <SearchContainer>
      <SearchInput
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      {showButton && (
        <SearchButton onClick={onSearch}>
          Search
        </SearchButton>
      )}
    </SearchContainer>
  );
}
