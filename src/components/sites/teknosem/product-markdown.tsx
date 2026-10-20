// Renders the product tab markdown exported from the old WordPress site.
// The export only uses headings, paragraphs, "- " lists, line-per-item lists, pipe tables and a FAQ block.

export type Block =
  | { type: "heading"; level: number; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "table"; rows: [string, string][] };

export type Faq = { question: string; answer: string[] };

const clean = (text: string) => text.replace(/﻿/g, "").trim();
const isFaqHeading = (text: string) => /sorulan sorular/i.test(text);

function tableRows(lines: string[]): [string, string][] {
  return lines.flatMap((line) => {
    const cells = line.split("|").slice(1, -1).map(clean);
    // A few rows were flattened by the export: a merged first cell followed by key/value pairs.
    const pairs = cells.length > 2 && cells.length % 2 === 1 ? cells.slice(1) : cells;
    const rows: [string, string][] = [];
    for (let i = 0; i < pairs.length; i += 2) rows.push([pairs[i], pairs[i + 1] ?? ""]);
    return rows;
  });
}

/** Splits a tab into content blocks and its FAQ entries. The tab's own title heading is dropped. */
export function parseTab(markdown: string, tabTitle: string): { blocks: Block[]; faq: Faq[]; faqTitle: string } {
  const blocks: Block[] = [];
  const faq: Faq[] = [];
  let faqTitle = "";
  let inFaq = false;

  for (const raw of markdown.split(/\n\s*\n/)) {
    const lines = raw.split("\n").map(clean).filter(Boolean);
    if (lines.length === 0) continue;
    const first = lines[0];

    // Some pages lost their heading markers in the export ("Kullanım Alanları", "Sıkça Sorulan Sorular:"
    // as plain lines). A short single line without sentence punctuation is treated as a level-3 heading.
    const plain = lines.length === 1 && !first.startsWith("|") && !first.startsWith("- ") && first.length <= 60;
    const bareHeading = !inFaq && plain && (!/[.,:;!?]$/.test(first) || isFaqHeading(first));
    const heading = first.match(/^(#{1,6})\s*(.*)$/) ?? (bareHeading ? [first, "###", first] : null);
    if (heading && lines.length === 1) {
      const text = clean(heading[2]).replace(/:$/, "");
      if (!text || text === tabTitle) continue;
      // Inside the FAQ some pages mark each question as a heading.
      if (inFaq && text.endsWith("?")) {
        faq.push({ question: text, answer: [] });
        continue;
      }
      inFaq = isFaqHeading(text);
      if (inFaq) faqTitle = text;
      else blocks.push({ type: "heading", level: heading[1].length, text });
      continue;
    }

    if (inFaq) {
      // Questions come as "Soru?", "- Soru?" or "1. Soru?", optionally followed by the answer in the same block.
      const question = first.replace(/^(-|\d+\.)\s+/, "");
      if (question.endsWith("?")) faq.push({ question, answer: lines.slice(1) });
      else if (faq.length > 0) faq[faq.length - 1].answer.push(lines.join(" "));
      else blocks.push({ type: "paragraph", text: lines.join(" ") });
      continue;
    }

    if (lines.every((line) => line.startsWith("|"))) {
      const rows = tableRows(lines);
      if (rows.length > 0) blocks.push({ type: "table", rows });
    } else if (lines.every((line) => line.startsWith("- "))) {
      blocks.push({ type: "list", items: lines.map((line) => line.slice(2)) });
    } else if (lines.length > 1) {
      blocks.push({ type: "list", items: lines });
    } else {
      blocks.push({ type: "paragraph", text: first });
    }
  }

  return { blocks, faq, faqTitle };
}

export function MarkdownBlocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="product-prose">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "heading":
            return block.level <= 2 ? <h2 key={index}>{block.text}</h2> : <h3 key={index}>{block.text}</h3>;
          case "paragraph":
            return <p key={index}>{block.text}</p>;
          case "list":
            return (
              <ul key={index}>
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            );
          case "table":
            return (
              <table key={index} className="spec-table">
                <tbody>
                  {block.rows.map(([label, value], rowIndex) =>
                    value ? (
                      <tr key={rowIndex}>
                        <th scope="row">{label}</th>
                        <td>{value}</td>
                      </tr>
                    ) : (
                      <tr key={rowIndex} className="group-row">
                        <th scope="rowgroup" colSpan={2}>
                          {label}
                        </th>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            );
        }
      })}
    </div>
  );
}
