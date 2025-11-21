import { useEffect } from "react";

import PositionClient from "./PositionClient";

export default function CreateNewPosition() {
  useEffect(() => {
    document.title = "Create New Position";
  }, []);

  return <PositionClient />;
}
