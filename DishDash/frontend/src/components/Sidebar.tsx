import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { status } from "../api";

const SidebarContainer = styled.aside`
  padding: 16px;
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.panel};
  display: flex;
  flex-direction: column;
`;

const Brand = styled.div`
  font-weight: 700;
  font-size: 18px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const BrandText = styled.h1`
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.title};
`;

const BrandIcon = styled.img`
  width: 32px;
  height: 32px;
  flex-shrink: 0;
`;

const Nav = styled.nav`
  display: grid;
  gap: 8px;
`;

const NavItem = styled(NavLink)`
  text-decoration: none;
  padding: 10px 12px;
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ theme }) => theme.colors.muted};
  display: flex;
  align-items: center;
  gap: 10px;

  &.active {
	color: ${({ theme }) => theme.colors.title};
	background: rgba(31, 169, 228, 0.1);
	border: 1px solid rgba(31, 169, 228, 0.3);
  }

  &:hover {
	background: rgba(255, 255, 255, 0.04);
  }
`;

const NavIcon = styled.img`
  width: 20px;
  height: 20px;
  flex-shrink: 0;
`;

const Text = styled.p`
  font-size: 14px;
  margin: 0;
`;

const StatusIndicator = styled.div<{ $ok: boolean }>`
  font-size: 14px;
  color: ${({ $ok }) => ($ok ? "#16a34a" : "#dc2626")};
  padding-top: 16px;
  margin-top: auto;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;

  &::before {
	content: "";
	width: 8px;
	height: 8px;
	border-radius: 50%;
	background: ${({ $ok }) => ($ok ? "#16a34a" : "#dc2626")};
  }
`;

export function Sidebar() {
  const [statusState, setStatusState] = useState<{ text: string; ok: boolean } | null>(null);

  useEffect(() => {
	let cancelled = false;

	const fetchStatus = async () => {
	  try {
		const data = await status();
		if (!cancelled) {
		  setStatusState({ text: data.status ?? "ok", ok: true });
		}
	  } catch {
		if (!cancelled) {
		  setStatusState({ text: "offline", ok: false });
		}
	  }
	};

	fetchStatus();
	return () => {
	  cancelled = true;
	};
  }, []);

  return (
	<SidebarContainer>
	  <Brand>
		<BrandIcon src={`${import.meta.env.BASE_URL}dishdash.svg`} alt="DishDash" />
		<BrandText>DishDash</BrandText>
	  </Brand>
	  <Nav>
		<NavItem to="/ingredients">
		  {({ isActive }) => (
			<>
			  <NavIcon src={`${import.meta.env.BASE_URL}icons/${isActive ? "ingredients_active" : "ingredients"}.svg`} alt="Ingredients" />
			  <Text>Ingredients</Text>
			</>
		  )}
		</NavItem>
		<NavItem to="/recipes">
		  {({ isActive }) => (
			<>
			  <NavIcon src={`${import.meta.env.BASE_URL}icons/${isActive ? "hat_active" : "hat"}.svg`} alt="Recipes" />
			  <Text>Recipes</Text>
			</>
		  )}
		</NavItem>
		<NavItem to="/favorites">
		  {({ isActive }) => (
			<>
			  <NavIcon src={`${import.meta.env.BASE_URL}icons/${isActive ? "like_active" : "like"}.svg`} alt="Favorites" />
			  <Text>Favorites</Text>
			</>
		  )}
		</NavItem>
		<NavItem to="/shopping-list">
		  {({ isActive }) => (
			<>
			  <NavIcon src={`${import.meta.env.BASE_URL}icons/${isActive ? "cart_active" : "cart"}.svg`} alt="Shopping List" />
			  <Text>Shopping List</Text>
			</>
		  )}
		</NavItem>
	  </Nav>
	  <StatusIndicator $ok={statusState?.ok ?? false}>
		Backend: {statusState ? statusState.text : "checking..."}
	  </StatusIndicator>
	</SidebarContainer>
  );
}
