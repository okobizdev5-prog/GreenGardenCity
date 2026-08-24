export type PlotObject = {
  name: string;
  isSoldOut: boolean;
};

export function normalizePlotObject(item: any): PlotObject {
  if (typeof item === "object" && item !== null && "name" in item) {
    return {
      name: String(item.name).trim(),
      isSoldOut: !!item.isSoldOut,
    };
  }
  const str = String(item || "").trim();
  if (str.toLowerCase().includes("(sold out)") || str.toLowerCase().includes("[sold out]")) {
    const cleanName = str.replace(/\s*[\(\[]sold out[\)\]]/gi, "").trim();
    return { name: cleanName || str, isSoldOut: true };
  }
  return { name: str, isSoldOut: false };
}

export function formatDescriptionWithPlots(description: string, plots?: (string | PlotObject)[]): string {
  const cleanDescription = (description || "").replace(/<!--PLOTS:[\s\S]*?-->/g, "").trim();
  if (!plots || plots.length === 0) {
    return cleanDescription;
  }
  const normalizedPlots = plots.map(normalizePlotObject);
  const plotsTag = `<!--PLOTS:${JSON.stringify(normalizedPlots)}-->`;
  return `${cleanDescription}\n${plotsTag}`;
}

export function parsePlotsFromProject(project: any): PlotObject[] {
  if (project && Array.isArray(project.availablePlots) && project.availablePlots.length > 0) {
    return project.availablePlots.map(normalizePlotObject);
  }
  if (project && project.description) {
    const match = project.description.match(/<!--PLOTS:([\s\S]*?)-->/);
    if (match && match[1]) {
      try {
        const parsed = JSON.parse(match[1]);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(normalizePlotObject);
        }
      } catch (e) {
        // ignore parse error
      }
    }
  }
  return [
    { name: "3 Katha", isSoldOut: false },
    { name: "5 Katha", isSoldOut: false },
    { name: "10 Katha", isSoldOut: false },
  ];
}
