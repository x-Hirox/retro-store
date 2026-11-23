export type ProductSpec = { label: string; value: string };

export function splitProductCopy(description: string) {
  const lines = String(description || "")
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
  const intro: string[] = [];
  const specs: ProductSpec[] = [];
  for (const line of lines) {
    const bullet = line.replace(/^[•\-–▪]\s*/, "");
    const match = bullet.match(/^([^:]{2,42}):\s*(.+)$/);
    if (match) {
      specs.push({ label: match[1].trim(), value: match[2].trim() });
    } else if (!specs.length) {
      intro.push(line);
    }
  }
  return { intro: intro.join(" "), specs };
}

export function specGroups(specs: ProductSpec[]) {
  const groups: { title: string; items: ProductSpec[] }[] = [
    { title: "ძირითადი", items: [] },
    { title: "ეკრანი", items: [] },
    { title: "მეხსიერება", items: [] },
    { title: "კომპლექტი", items: [] },
  ];
  for (const spec of specs) {
    const key = spec.label.toLowerCase();
    if (/ეკრან|screen|ips|რეზოლ/.test(key)) groups[1].items.push(spec);
    else if (/მეხსიერ|memory|storage|gb|sd/.test(key)) groups[2].items.push(spec);
    else if (/კომპლექტ|შედის|box|კაბელ/.test(key)) groups[3].items.push(spec);
    else groups[0].items.push(spec);
  }
  return groups.filter((group) => group.items.length > 0);
}
