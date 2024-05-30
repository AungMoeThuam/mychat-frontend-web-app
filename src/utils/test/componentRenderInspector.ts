import { useEffect } from "react";

export default function componentRenderInspector(componentName: string) {
  useEffect(() =>
    console.log("----", componentName, " component is rendered!---")
  );
}
