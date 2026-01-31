import { NavLink, Outlet } from "react-router-dom";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { status } from "../api";

const Shell = styled.div`
  height: 100vh;
  display: grid;
  grid-template-columns: 260px 1fr;
`;

const Sidebar = styled.aside`
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
`;

const Nav = styled.nav`
  display: grid;
  gap: 8px;

`;

const Item = styled(NavLink)`
  text-decoration: none;
  padding: 10px 12px;
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ theme }) => theme.colors.muted};

  &.active {
    color: ${({ theme }) => theme.colors.text};
    background: rgba(57, 228, 19, 0.18);
    border: 1px solid rgba(59, 130, 246, 0.35);
  }

  &:hover {
    background: rgba(255,255,255,0.04);
  }
`;

const StatusIndicator = styled.div<{ ok: boolean }>`
  font-size: 14px;
  color: ${({ ok }) => (ok ? "#16a34a" : "#dc2626")};
  padding-top: 16px;
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
     background: ${({ ok }) => (ok ? "#16a34a" : "#dc2626")};
  }
`;

const Main = styled.main`
  padding: 20px 24px;
`;

export function AppLayout() {
   const [statusState, setStatusState] = useState<{ text: string; ok: boolean } | null>(null);

  useEffect(() => {
       let cancelled = false;

    const fetchStatus = async () => {
      try {
        const data = await status();
        if (!cancelled) {
          setStatusState({ text: data.status ?? "ok", ok: true });
        }
      } catch (err) {
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
    <Shell>
      <Sidebar>
        <Brand>DishDash</Brand>
        <Nav>
          <Item to="/ingredients">Ingredients</Item>
          <Item to="/recipes">Recipes</Item>
          <Item to="/favorites">Favorites</Item>
          <Item to="/shopping-list">Shopping List</Item>
        </Nav>
        {/* {statusMsg && <StatusIndicator>Backend: {statusMsg}</StatusIndicator>} */}
		 <StatusIndicator ok={statusState?.ok ?? false}>
          Backend: {statusState ? statusState.text : "checking..."}
        </StatusIndicator>
      </Sidebar>
      <Main>
        <Outlet />
      </Main>
    </Shell>
  );
}
