import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import DateQuest from "../app/date-quest-client";
import "../app/globals.css";

function cleanName(value: string | null) {
  const trimmed = (value ?? "").trim();
  return trimmed.length ? trimmed.slice(0, 40) : "";
}

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element not found.");
}

const initialName = cleanName(new URLSearchParams(window.location.search).get("name"));

createRoot(root).render(
  <StrictMode>
    <DateQuest initialName={initialName} />
  </StrictMode>,
);
